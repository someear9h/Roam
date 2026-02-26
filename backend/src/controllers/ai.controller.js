const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const gemini = require('../services/gemini.service');
const {
  chatSchema,
  smartItinerarySchema,
  localGuideSchema,
  vrExplainSchema,
  ocrSchema,
} = require('../utils/validation');



async function checkDailyLimit() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const count = await prisma.aICache.count({
    where: {
      created_at: { gte: todayStart },
    },
  });

  if (count >= 20) {
    throw new Error('Daily AI request limit reached');
  }
}


async function buildSafeContext(tripId, userId) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      hotelBooking: true,
    },
  });

  if (!trip) throw new Error('Trip not found');

  const userPrefs = await prisma.userPreferences.findUnique({
    where: { user_id: userId },
  });

  return {
    destination: trip.destination,
    start_date: trip.start_date,
    end_date: trip.end_date,
    preferences: userPrefs || {},
    // Flight information removed — system no longer depends on flights
    hotel: trip.hotelBooking
      ? {
          name: trip.hotelBooking.name,
          area: trip.hotelBooking.area,
        }
      : null,
  };
}



exports.chat = async (req, res) => {
  const result = chatSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error.format() });
  }

  const { tripId, message } = result.data;

  const chatLog = await prisma.chatLog.findUnique({
    where: { trip_id: tripId },
  });

  let messages = chatLog?.messages || [];
  if (typeof messages === 'string') {
    try { messages = JSON.parse(messages); } catch { messages = []; }
  }
  if (!Array.isArray(messages)) messages = [];

  const aiCount = messages.filter(m => m.ai).length;

  if (aiCount >= 3) {
    return res.status(429).json({
      success: false,
      error: 'AI chat limit reached for this trip',
    });
  }

  try {
    await checkDailyLimit();

    const context = await buildSafeContext(tripId, req.user.userId);

    const recentMessages = messages.slice(-2);

    const prompt = gemini.buildPrompt(
      `You are Compass, a calm AI travel assistant. Be concise and reassuring.`,
      context,
      message
    );

    const responseText = await gemini.generateContent(prompt);

    const newMsg = {
      user: message,
      ai: responseText,
      timestamp: new Date().toISOString(),
    };

    await prisma.chatLog.upsert({
      where: { trip_id: tripId },
      update: { messages: { push: newMsg }, updated_at: new Date() },
      create: { trip_id: tripId, messages: [newMsg] },
    });

    await prisma.aICache.create({
      data: { key: `chat-${Date.now()}`, response: {} },
    });

    res.json({ success: true, data: { response: responseText } });

  } catch (err) {
    res.status(429).json({ success: false, error: err.message });
  }
};



exports.generateItinerary = async (req, res) => {
  const result = smartItinerarySchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error.format() });
  }

  const { tripId } = result.data;

  const trip = await prisma.trip.findUnique({ where: { id: tripId } });

  if (!trip) {
    return res.status(404).json({ success: false, error: 'Trip not found' });
  }

  if (trip.ai_itinerary) {
    return res.json({ success: true, data: trip.ai_itinerary });
  }

  try {
    await checkDailyLimit();

    const context = await buildSafeContext(tripId, req.user.userId);

    const prompt = `
      Generate concise day-wise itinerary.
      Adjust first day based on flight arrival.
      Return strict JSON only.
    `;

    const responseText = await gemini.generateContent(
      gemini.buildPrompt(prompt, context)
    );

    let plan;
    try {
      plan = JSON.parse(responseText.match(/\{[\s\S]*\}/)[0]);
    } catch {
      plan = { raw: responseText };
    }

    await prisma.trip.update({
      where: { id: tripId },
      data: { ai_itinerary: plan },
    });

    await prisma.aICache.create({
      data: { key: `itinerary-${tripId}`, response: {} },
    });

    res.json({ success: true, data: plan });

  } catch (err) {
    res.status(429).json({ success: false, error: err.message });
  }
};



exports.localGuide = async (req, res) => {
  const result = localGuideSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error.format() });
  }

  const { tripId, query } = result.data;
  const cacheKey = `local-${tripId}-${query}`;

  const cached = await prisma.aICache.findUnique({
    where: { key: cacheKey },
  });

  if (cached) {
    return res.json({ success: true, data: cached.response });
  }

  try {
    await checkDailyLimit();

    const context = await buildSafeContext(tripId, req.user.userId);

    const prompt = gemini.buildPrompt(
      'Provide concise local travel guidance.',
      context,
      query
    );

    const responseText = await gemini.generateContent(prompt);

    await prisma.aICache.create({
      data: {
        key: cacheKey,
        response: { response: responseText },
      },
    });

    res.json({ success: true, data: { response: responseText } });

  } catch (err) {
    res.status(429).json({ success: false, error: err.message });
  }
};



exports.vrExplain = async (req, res) => {
  const result = vrExplainSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error.format() });
  }

  const { destination, location, time } = result.data;
  const cacheKey = `vr-${destination}-${location}-${time}`;

  const cached = await prisma.aICache.findUnique({
    where: { key: cacheKey },
  });

  if (cached) {
    return res.json({ success: true, data: cached.response });
  }

  try {
    await checkDailyLimit();

    const prompt = `
      Explain ${location} in ${destination}.
      Time: ${time}.
      Be concise.
    `;

    const responseText = await gemini.generateContent(prompt);

    await prisma.aICache.create({
      data: {
        key: cacheKey,
        response: { response: responseText },
      },
    });

    res.json({ success: true, data: { response: responseText } });

  } catch (err) {
    res.status(429).json({ success: false, error: err.message });
  }
};


exports.extractTextFromImage = async (req, res) => {
  const result = ocrSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error.format() });
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const count = await prisma.aICache.count({
    where: {
      key: { startsWith: 'ocr-' },
      created_at: { gte: todayStart },
    },
  });

  if (count >= 2) {
    return res.status(429).json({
      success: false,
      error: 'OCR daily limit reached',
    });
  }

  try {
    const { image, mimeType } = result.data;

    const text = await gemini.extractTextFromImage(image, mimeType);

    await prisma.aICache.create({
      data: { key: `ocr-${Date.now()}`, response: {} },
    });

    res.json({ success: true, data: { text } });

  } catch (err) {
    res.status(500).json({ success: false, error: 'OCR failed' });
  }
};


exports.getItinerary = async (req, res) => {
  const tripId = Number(req.params.tripId);

  if (isNaN(tripId)) {
    return res.status(400).json({
      success: false,
      error: "Invalid tripId",
    });
  }

  try {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      select: {
        ai_itinerary: true,
      },
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        error: "Trip not found",
      });
    }

    res.json({
      success: true,
      data: trip.ai_itinerary,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch itinerary",
    });
  }
};



exports.getChatHistory = async (req, res) => {
  const tripId = Number(req.params.tripId);

  if (isNaN(tripId)) {
    return res.status(400).json({
      success: false,
      error: "Invalid tripId",
    });
  }

  try {
    const chatLog = await prisma.chatLog.findUnique({
      where: { trip_id: tripId },
    });

    let messages = chatLog?.messages || [];

    if (typeof messages === "string") {
      try {
        messages = JSON.parse(messages);
      } catch {
        messages = [];
      }
    }

    res.json({
      success: true,
      data: messages,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch chat history",
    });
  }
};



exports.clearChatHistory = async (req, res) => {
  const tripId = Number(req.params.tripId);

  if (isNaN(tripId)) {
    return res.status(400).json({
      success: false,
      error: "Invalid tripId",
    });
  }

  try {
    await prisma.chatLog.upsert({
      where: { trip_id: tripId },
      update: {
        messages: [],
        updated_at: new Date(),
      },
      create: {
        trip_id: tripId,
        messages: [],
      },
    });

    res.json({
      success: true,
      message: "Chat history cleared",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to clear chat history",
    });
  }
};