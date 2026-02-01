const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const gemini = require('../services/gemini.service');
const { alertSchema } = require('../utils/validation');

// Get alerts for a trip
exports.getAlerts = async (req, res) => {
  const tripId = Number(req.params.tripId);
  if (isNaN(tripId)) {
    return res.status(400).json({ success: false, error: 'Invalid tripId' });
  }

  const alerts = await prisma.alert.findMany({
    where: { trip_id: tripId },
    orderBy: { created_at: 'desc' },
  });

  res.json({ success: true, data: alerts });
};

// Get unread alerts count
exports.getUnreadCount = async (req, res) => {
  const tripId = Number(req.params.tripId);
  if (isNaN(tripId)) {
    return res.status(400).json({ success: false, error: 'Invalid tripId' });
  }

  const count = await prisma.alert.count({
    where: { trip_id: tripId, is_read: false },
  });

  res.json({ success: true, data: { count } });
};

// Mark alert as read
exports.markAsRead = async (req, res) => {
  const alertId = Number(req.params.alertId);
  if (isNaN(alertId)) {
    return res.status(400).json({ success: false, error: 'Invalid alertId' });
  }

  await prisma.alert.update({
    where: { id: alertId },
    data: { is_read: true },
  });

  res.json({ success: true, message: 'Alert marked as read' });
};

// Mark all alerts as read for a trip
exports.markAllAsRead = async (req, res) => {
  const tripId = Number(req.params.tripId);
  if (isNaN(tripId)) {
    return res.status(400).json({ success: false, error: 'Invalid tripId' });
  }

  await prisma.alert.updateMany({
    where: { trip_id: tripId, is_read: false },
    data: { is_read: true },
  });

  res.json({ success: true, message: 'All alerts marked as read' });
};

// Generate smart alerts using AI (called periodically or on-demand)
exports.generateSmartAlerts = async (req, res) => {
  const tripId = Number(req.params.tripId);
  if (isNaN(tripId)) {
    return res.status(400).json({ success: false, error: 'Invalid tripId' });
  }

  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip) {
    return res.status(404).json({ success: false, error: 'Trip not found' });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: { language: true, accessibility_needs: true },
  });

  const destData = await prisma.destination.findUnique({ 
    where: { name: trip.destination } 
  });

  const context = { trip, user, destData, currentDate: new Date().toISOString() };

  const prompt = gemini.buildPrompt(
    `Generate travel alerts for the user's trip. Consider:
    - Weather conditions at destination
    - Flight/travel timing reminders
    - Safety advisories
    - Cultural events or closures
    - Health recommendations
    Return a JSON array of alerts with format: [{"type": "weather|flight|safety|reminder", "title": "...", "message": "...", "priority": "low|medium|high|critical"}]
    Generate 2-4 relevant alerts based on current context. Be realistic and helpful.`,
    context,
    'Generate smart travel alerts for my upcoming trip.'
  );

  const responseText = await gemini.generateContent(prompt);

  let alerts = [];
  try {
    // Try to parse JSON from response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      alerts = JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    // If parsing fails, create a generic alert
    alerts = [{
      type: 'reminder',
      title: 'Trip Preparation',
      message: responseText.slice(0, 500),
      priority: 'medium'
    }];
  }

  // Save alerts to database
  const createdAlerts = [];
  for (const alert of alerts) {
    const created = await prisma.alert.create({
      data: {
        trip_id: tripId,
        type: alert.type || 'reminder',
        title: alert.title,
        message: alert.message,
        priority: alert.priority || 'medium',
      },
    });
    createdAlerts.push(created);
  }

  res.json({ success: true, data: createdAlerts });
};

// Create manual alert
exports.createAlert = async (req, res) => {
  const result = alertSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error.format() });
  }

  const alert = await prisma.alert.create({
    data: result.data,
  });

  res.json({ success: true, data: alert });
};
