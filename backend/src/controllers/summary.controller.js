const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const gemini = require('../services/gemini.service');
const { tripMemorySchema, tripFeedbackSchema, tripSummarySchema } = require('../utils/validation');

// Get trip memories
exports.getMemories = async (req, res) => {
  const tripId = Number(req.params.tripId);
  if (isNaN(tripId)) {
    return res.status(400).json({ success: false, error: 'Invalid tripId' });
  }

  const memories = await prisma.tripMemory.findMany({
    where: { trip_id: tripId },
    orderBy: { created_at: 'asc' },
  });

  res.json({ success: true, data: memories });
};

// Add a memory
exports.addMemory = async (req, res) => {
  const result = tripMemorySchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error.format() });
  }

  const memory = await prisma.tripMemory.create({
    data: result.data,
  });

  res.json({ success: true, data: memory });
};

// Get trip feedback
exports.getFeedback = async (req, res) => {
  const tripId = Number(req.params.tripId);
  if (isNaN(tripId)) {
    return res.status(400).json({ success: false, error: 'Invalid tripId' });
  }

  const feedback = await prisma.tripFeedback.findUnique({
    where: { trip_id: tripId },
  });

  res.json({ success: true, data: feedback });
};

// Submit trip feedback
exports.submitFeedback = async (req, res) => {
  const result = tripFeedbackSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error.format() });
  }

  const feedback = await prisma.tripFeedback.upsert({
    where: { trip_id: result.data.trip_id },
    update: result.data,
    create: result.data,
  });

  res.json({ success: true, data: feedback });
};

// Generate AI trip summary
exports.generateSummary = async (req, res) => {
  const result = tripSummarySchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error.format() });
  }
  const { tripId } = result.data;

  const trip = await prisma.trip.findUnique({ 
    where: { id: tripId },
    include: { itinerary: true }
  });
  if (!trip) {
    return res.status(404).json({ success: false, error: 'Trip not found' });
  }

  const memories = await prisma.tripMemory.findMany({
    where: { trip_id: tripId },
  });

  const chatLog = await prisma.chatLog.findUnique({
    where: { trip_id: tripId },
  });

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: { language: true, name: true },
  });

  const context = { 
    trip, 
    itinerary: trip.itinerary?.plan,
    memories,
    chatInteractions: chatLog?.messages?.length || 0,
    user
  };

  const prompt = gemini.buildPrompt(
    `Generate a warm, personalized trip summary for the user. Include:
    - Trip highlights and memorable moments
    - Places visited (from itinerary)
    - Key statistics (duration, activities)
    - A heartfelt closing message
    - 2-3 future destination suggestions based on their preferences
    
    Return as JSON:
    {
      "summary_title": "Your Adventure in [Destination]",
      "highlights": ["highlight1", "highlight2"],
      "places_visited": ["place1", "place2"],
      "stats": {"days": X, "activities": Y, "memories": Z},
      "personal_message": "...",
      "future_suggestions": [
        {"destination": "...", "reason": "..."},
      ]
    }`,
    context,
    'Generate a trip summary for my completed trip.'
  );

  const responseText = await gemini.generateContent(prompt);

  let summary;
  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      summary = JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    summary = { 
      summary_title: `Your Trip to ${trip.destination}`,
      personal_message: responseText,
      highlights: [],
      places_visited: [],
      stats: {},
      future_suggestions: []
    };
  }

  res.json({ success: true, data: summary });
};

// Get full trip summary (combined data)
exports.getFullSummary = async (req, res) => {
  const tripId = Number(req.params.tripId);
  if (isNaN(tripId)) {
    return res.status(400).json({ success: false, error: 'Invalid tripId' });
  }

  const trip = await prisma.trip.findUnique({ 
    where: { id: tripId },
    include: { itinerary: true }
  });
  if (!trip) {
    return res.status(404).json({ success: false, error: 'Trip not found' });
  }

  const memories = await prisma.tripMemory.findMany({
    where: { trip_id: tripId },
    orderBy: { created_at: 'asc' },
  });

  const feedback = await prisma.tripFeedback.findUnique({
    where: { trip_id: tripId },
  });

  res.json({ 
    success: true, 
    data: {
      trip,
      itinerary: trip.itinerary?.plan,
      memories,
      feedback
    }
  });
};
