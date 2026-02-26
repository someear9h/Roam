const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const gemini = require('../services/gemini.service');
const { tripMemorySchema, tripFeedbackSchema } = require('../utils/validation');

function summaryCacheKey(tripId) {
  return `trip_summary:${tripId}`;
}

/* =========================================
   Helper: Validate Trip Ownership
========================================= */
async function validateTripOwnership(tripId, userId) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: { user_id: true }
  });

  if (!trip) {
    const e = new Error('Trip not found');
    e.status = 404;
    throw e;
  }
  if (trip.user_id !== userId) {
    const e = new Error('Unauthorized');
    e.status = 403;
    throw e;
  }
}

/* =========================================
   Get Trip Memories
========================================= */
exports.getMemories = async (req, res) => {
  const tripId = Number(req.params.tripId);

  if (isNaN(tripId)) {
    return res.status(400).json({ success: false, error: 'Invalid tripId' });
  }

  try {
    await validateTripOwnership(tripId, req.user.userId);

    const memories = await prisma.tripMemory.findMany({
      where: { trip_id: tripId },
      orderBy: { created_at: 'asc' }
    });

    res.json({ success: true, data: memories });

  } catch (err) {
    const status = err.status || (err.message === 'Trip not found' ? 404 : (err.message === 'Unauthorized' ? 403 : 500));
    console.error('getMemories error:', err);
    res.status(status).json({ success: false, error: err.message });
  }
};

/* =========================================
   Add Memory
========================================= */
exports.addMemory = async (req, res) => {
  const tripId = Number(req.params.tripId);
  const result = tripMemorySchema.safeParse({ ...req.body, trip_id: tripId });

  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error.format() });
  }

  try {
    await validateTripOwnership(result.data.trip_id, req.user.userId);

    const memory = await prisma.tripMemory.create({
      data: result.data
    });

    res.json({ success: true, data: memory });

  } catch (err) {
    const status = err.status || (err.message === 'Trip not found' ? 404 : (err.message === 'Unauthorized' ? 403 : 500));
    console.error('addMemory error:', err);
    res.status(status).json({ success: false, error: err.message });
  }
};

/* =========================================
   Submit Feedback
========================================= */
exports.submitFeedback = async (req, res) => {
  const tripId = Number(req.params.tripId);
  const result = tripFeedbackSchema.safeParse({ ...req.body, trip_id: tripId });

  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error.format() });
  }

  try {
    await validateTripOwnership(result.data.trip_id, req.user.userId);

    const feedback = await prisma.tripFeedback.upsert({
      where: { trip_id: result.data.trip_id },
      update: result.data,
      create: result.data
    });

    res.json({ success: true, data: feedback });

  } catch (err) {
    const status = err.status || (err.message === 'Trip not found' ? 404 : (err.message === 'Unauthorized' ? 403 : 500));
    console.error('submitFeedback error:', err);
    res.status(status).json({ success: false, error: err.message });
  }
};

/* =========================================
   Generate AI Summary (Gemini Optimized)
========================================= */
exports.generateSummary = async (req, res) => {
  const tripId = Number(req.params.tripId);
  if (isNaN(tripId)) {
    return res.status(400).json({ success: false, error: 'Invalid tripId' });
  }

  try {
    await validateTripOwnership(tripId, req.user.userId);

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });

    if (!trip) {
      return res.status(404).json({ success: false, error: 'Trip not found' });
    }

    // ✅ Return cached summary if exists (AICache)
    const cached = await prisma.aICache.findUnique({ where: { key: summaryCacheKey(tripId) } });
    if (cached?.response) {
      return res.json({ success: true, data: cached.response });
    }

    const memories = await prisma.tripMemory.findMany({
      where: { trip_id: tripId }
    });

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { language: true, name: true }
    });

    const context = {
      trip,
      itinerary: trip.ai_itinerary || null,
      memories,
      user
    };

    const prompt = gemini.buildPrompt(
      `Generate a warm, personalized trip summary.
       Return ONLY valid JSON.`,
      context,
      "Generate trip summary."
    );

    const responseText = await gemini.generateContent(prompt);

    let summary;
    try {
      const match = responseText.match(/\{[\s\S]*\}/);
      summary = match ? JSON.parse(match[0]) : null;
    } catch {
      summary = {
        summary_title: `Your Trip to ${trip.destination}`,
        personal_message: responseText,
        highlights: [],
        places_visited: [],
        stats: {},
        future_suggestions: []
      };
    }

    // ✅ Store summary (prevents reusing Gemini)
    await prisma.aICache.upsert({
      where: { key: summaryCacheKey(tripId) },
      update: { response: summary },
      create: { key: summaryCacheKey(tripId), response: summary }
    });

    res.json({ success: true, data: summary });

  } catch (err) {
    const status = err.status || (err.message === 'Trip not found' ? 404 : (err.message === 'Unauthorized' ? 403 : 500));
    console.error('generateSummary error:', err);
    res.status(status).json({ success: false, error: err.message });
  }
};

/* =========================================
   Get Full Summary
========================================= */
exports.getFullSummary = async (req, res) => {
  const tripId = Number(req.params.tripId);

  if (isNaN(tripId)) {
    return res.status(400).json({ success: false, error: 'Invalid tripId' });
  }

  try {
    await validateTripOwnership(tripId, req.user.userId);

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });

    const memories = await prisma.tripMemory.findMany({
      where: { trip_id: tripId },
      orderBy: { created_at: 'asc' }
    });

    const feedback = await prisma.tripFeedback.findFirst({
      where: { trip_id: tripId }
    });

    const cached = await prisma.aICache.findUnique({ where: { key: summaryCacheKey(tripId) } });

    res.json({
      success: true,
      data: {
        trip,
        itinerary: trip?.ai_itinerary || null,
        memories,
        feedback,
        summary: cached?.response || null
      }
    });

  } catch (err) {
    const status = err.status || (err.message === 'Trip not found' ? 404 : (err.message === 'Unauthorized' ? 403 : 500));
    console.error('getFullSummary error:', err);
    res.status(status).json({ success: false, error: err.message });
  }
};

/* =========================================
   Get Feedback
========================================= */
exports.getFeedback = async (req, res) => {
  const tripId = Number(req.params.tripId);

  if (isNaN(tripId)) {
    return res.status(400).json({
      success: false,
      error: "Invalid tripId"
    });
  }

  try {
    await validateTripOwnership(tripId, req.user.userId);

    const feedback = await prisma.tripFeedback.findFirst({
      where: { trip_id: tripId }
    });

    res.json({
      success: true,
      data: feedback
    });

  } catch (err) {
    const status = err.status || (err.message === 'Trip not found' ? 404 : (err.message === 'Unauthorized' ? 403 : 500));
    console.error('getFeedback error:', err);
    res.status(status).json({
      success: false,
      error: err.message
    });
  }
};