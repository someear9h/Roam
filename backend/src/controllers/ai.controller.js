const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const gemini = require('../services/gemini.service');
const { chatSchema, generateItinerarySchema, localGuideSchema, vrExplainSchema, smartItinerarySchema, ocrSchema } = require('../utils/validation');

const getFullContext = async (tripId, userId) => {
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { language: true, accessibility_needs: true, name: true },
  });
  const userPrefs = await prisma.userPreferences.findUnique({
    where: { user_id: userId },
  });
  if (!trip) throw new Error('Trip not found');
  return { trip, user, userPrefs };
};

exports.chat = async (req, res) => {
  const result = chatSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error.format() });
  }
  const { tripId, message } = result.data;

  const context = await getFullContext(tripId, req.user.userId);
  
  // Get chat history for context
  const chatLog = await prisma.chatLog.findUnique({ where: { trip_id: tripId } });
  // Ensure messages is an array (MySQL may return JSON as string)
  let messages = chatLog?.messages || [];
  if (typeof messages === 'string') {
    try { messages = JSON.parse(messages); } catch { messages = []; }
  }
  if (!Array.isArray(messages)) messages = [];
  const recentMessages = messages.slice(-5);
  context.chatHistory = recentMessages;

  const prompt = gemini.buildPrompt(
    `You are Compass, a calm, reliable, and friendly AI travel assistant. 
    You help travelers with:
    - Flight delays and rebooking advice
    - Hotel check-in guidance
    - Local recommendations
    - Safety tips
    - Cultural advice
    - Emergency assistance
    
    Be concise, helpful, and reassuring. If the user seems stressed, acknowledge their feelings first.
    Consider their preferences: ${JSON.stringify(context.userPrefs || {})}
    Recent conversation: ${JSON.stringify(recentMessages)}`,
    context,
    message
  );
  const responseText = await gemini.generateContent(prompt);

  const newMsg = { user: message, ai: responseText, timestamp: new Date().toISOString() };

  await prisma.chatLog.upsert({
    where: { trip_id: tripId },
    update: { messages: { push: newMsg }, updated_at: new Date() },
    create: { trip_id: tripId, messages: [newMsg] },
  });

  res.json({ success: true, data: { response: responseText } });
};

exports.generateItinerary = async (req, res) => {
  const result = smartItinerarySchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error.format() });
  }
  const { tripId, preferences } = result.data;

  const context = await getFullContext(tripId, req.user.userId);
  const destData = await prisma.destination.findUnique({ where: { name: context.trip.destination } });
  context.destData = destData;
  
  // Merge provided preferences with stored preferences
  const finalPrefs = { ...context.userPrefs, ...preferences };

  const tripDays = context.trip.start_date && context.trip.end_date
    ? Math.ceil((new Date(context.trip.end_date) - new Date(context.trip.start_date)) / (1000 * 60 * 60 * 24))
    : 5;

  const prompt = gemini.buildPrompt(
    `Generate a detailed, smart day-wise itinerary for a ${tripDays}-day trip.
    
    User preferences:
    - Travel style: ${finalPrefs?.travel_style || 'balanced'}
    - Food: ${finalPrefs?.food_preference || 'all'}
    - Pace: ${finalPrefs?.pace || 'moderate'}
    - Interests: ${JSON.stringify(finalPrefs?.interests || [])}
    - Budget: ${finalPrefs?.budget_level || 'moderate'}
    - Accessibility: ${context.user?.accessibility_needs || 'none'}
    
    Guidelines:
    - Include buffer time between activities
    - Consider weather and best times to visit
    - Mix popular attractions with hidden gems
    - Include meal recommendations
    - Add practical tips for each activity
    
    Return as JSON:
    {
      "destination": "${context.trip.destination}",
      "total_days": ${tripDays},
      "days": [
        {
          "day": 1,
          "date": "YYYY-MM-DD",
          "theme": "Arrival & Exploration",
          "activities": [
            {
              "time": "09:00",
              "title": "Activity Name",
              "description": "Brief description",
              "duration": "2 hours",
              "type": "sightseeing|food|transport|rest|shopping",
              "tips": "Helpful tip",
              "cost_estimate": "$$$"
            }
          ],
          "meals": {
            "breakfast": "Recommendation",
            "lunch": "Recommendation", 
            "dinner": "Recommendation"
          },
          "notes": "Day-specific tips"
        }
      ],
      "overall_tips": ["tip1", "tip2"],
      "estimated_budget": "$$$ - $$$$"
    }`,
    context,
    'Generate a personalized day-wise itinerary based on my preferences.'
  );
  const planText = await gemini.generateContent(prompt);

  let plan;
  try { 
    const jsonMatch = planText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      plan = JSON.parse(jsonMatch[0]); 
    } else {
      plan = { raw: planText };
    }
  } catch { 
    plan = { raw: planText }; 
  }

  await prisma.itinerary.upsert({
    where: { trip_id: tripId },
    update: { plan, generated_at: new Date() },
    create: { trip_id: tripId, plan },
  });

  res.json({ success: true, data: { plan } });
};

exports.getItinerary = async (req, res) => {
  const tripId = Number(req.params.tripId);
  if (isNaN(tripId)) {
    return res.status(400).json({ success: false, error: 'Invalid tripId (must be number)' });
  }

  const itinerary = await prisma.itinerary.findUnique({ where: { trip_id: tripId } });
  res.json({ success: true, data: itinerary ? itinerary.plan : null });
};

exports.localGuide = async (req, res) => {
  const result = localGuideSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error.format() });
  }
  const { tripId, query, location } = result.data;

  try {
    const context = await getFullContext(tripId, req.user.userId);
    const destData = await prisma.destination.findUnique({ where: { name: context.trip.destination } });
    context.destData = destData;

    const prompt = gemini.buildPrompt(
      'Provide on-ground guidance: nearby essentials, scam warnings, cultural norms, transport.',
      context,
      query + ` Location: ${JSON.stringify(location)}`
    );
    const responseText = await gemini.generateContent(prompt);

    res.json({ success: true, data: { response: responseText } });
  } catch (error) {
    console.error('Local guide error:', error.message);
    res.status(500).json({ success: false, error: error.message || 'Failed to get recommendations' });
  }
};


exports.vrExplain = async (req, res) => {
  const result = vrExplainSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error.format() });
  }
  const { destination, location, time, userPreferences } = result.data;

  const destData = await prisma.destination.findUnique({ where: { name: destination } });
  const context = { destData, userPreferences, time, location };

  const prompt = gemini.buildPrompt(
    'Explain what the user is seeing in VR: contextual info, best visit tips, crowd info.',
    context,
    `Explain ${location} at ${time}.`
  );
  const responseText = await gemini.generateContent(prompt);

  res.json({ success: true, data: { response: responseText } });
};

exports.getChatHistory = async (req, res) => {
  const tripId = Number(req.params.tripId);
  if (isNaN(tripId)) {
    return res.status(400).json({ success: false, error: 'Invalid tripId' });
  }

  try {
    const chatLog = await prisma.chatLog.findUnique({ where: { trip_id: tripId } });
    let messages = chatLog?.messages || [];
    // Ensure messages is an array (MySQL may return JSON as string)
    if (typeof messages === 'string') {
      try { messages = JSON.parse(messages); } catch { messages = []; }
    }
    if (!Array.isArray(messages)) messages = [];
    res.json({ success: true, data: messages });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch chat history' });
  }
};

exports.clearChatHistory = async (req, res) => {
  const tripId = Number(req.params.tripId);
  if (isNaN(tripId)) {
    return res.status(400).json({ success: false, error: 'Invalid tripId' });
  }

  try {
    await prisma.chatLog.upsert({
      where: { trip_id: tripId },
      update: { messages: [], updated_at: new Date() },
      create: { trip_id: tripId, messages: [] },
    });
    res.json({ success: true, message: 'Chat history cleared' });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    res.status(500).json({ success: false, error: 'Failed to clear chat history' });
  }
};

// OCR - Extract text from image
exports.extractTextFromImage = async (req, res) => {
  const result = ocrSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error.format() });
  }
  
  const { image, mimeType } = result.data;
  
  try {
    const extractedText = await gemini.extractTextFromImage(image, mimeType || 'image/jpeg');
    res.json({ success: true, data: { text: extractedText } });
  } catch (error) {
    console.error('OCR error:', error);
    res.status(500).json({ success: false, error: 'Failed to extract text from image' });
  }
};