const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const gemini = require('../services/gemini.service');
const { chatSchema, generateItinerarySchema } = require('../utils/validation');

const getFullContext = async (tripId, userId) => {
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { language: true, accessibility_needs: true },
  });
  if (!trip) throw new Error('Trip not found');
  return { trip, user };
};

exports.chat = async (req, res) => {
  const result = chatSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error.format() });
  }
  const { tripId, message } = result.data;

  const context = await getFullContext(tripId, req.user.userId);

  const prompt = gemini.buildPrompt('You are a calm, reliable travel assistant.', context, message);
  const responseText = await gemini.generateContent(prompt);

  const newMsg = { user: message, ai: responseText, timestamp: new Date().toISOString() };

  await prisma.chatLog.upsert({
    where: { trip_id: tripId },
    update: { messages: { push: newMsg } },
    create: { trip_id: tripId, messages: [newMsg] },
  });

  res.json({ success: true, data: { response: responseText } });
};

exports.generateItinerary = async (req, res) => {
  const result = generateItinerarySchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error.format() });
  }
  const { tripId } = result.data;

  const context = await getFullContext(tripId, req.user.userId);

  const prompt = gemini.buildPrompt(
    'Generate a smart, reasoned itinerary with day-wise plans, buffers, weather-aware schedules.',
    context,
    'Generate itinerary based on context.'
  );
  const planText = await gemini.generateContent(prompt);

  let plan;
  try { plan = JSON.parse(planText); } catch { plan = { raw: planText }; }

  await prisma.itinerary.upsert({
    where: { trip_id: tripId },
    update: { plan },
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