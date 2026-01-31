const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const gemini = require('../services/gemini.service');
const { emergencySchema } = require('../utils/validation');

const getFullContext = async (tripId, userId) => {
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { language: true, accessibility_needs: true },
  });
  if (!trip) throw new Error('Trip not found');
  return { trip, user };
};

exports.emergency = async (req, res) => {
  const result = emergencySchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error.format() });
  }
  const { tripId, issue } = result.data;

  const context = await getFullContext(tripId, req.user.userId);
  const destData = await prisma.destination.findUnique({ where: { name: context.trip.destination } });
  context.destData = destData;

  const prompt = gemini.buildPrompt(
    'Understand urgency, suggest immediate steps, provide local embassy info, flag for escalation.',
    context,
    issue
  );
  const responseText = await gemini.generateContent(prompt);

  res.json({ success: true, data: { response: responseText } });
};