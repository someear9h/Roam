const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const gemini = require('../services/gemini.service');

/* =========================================
   Helper: Validate Trip Ownership
========================================= */
async function validateTripOwnership(tripId, userId) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: { user_id: true }
  });

  if (!trip) throw new Error("Trip not found");
  if (trip.user_id !== userId) throw new Error("Unauthorized");

  return trip;
}

/* =========================================
   Helper: Calculate Trip Phase
========================================= */
function calculatePhase(trip) {
  const now = new Date();

  if (!trip.start_date || !trip.end_date) return "planning";

  if (now < trip.start_date) return "pre-trip";
  if (now >= trip.start_date && now <= trip.end_date) return "during-trip";
  return "post-trip";
}

/* =========================================
   Get Alerts
========================================= */
exports.getAlerts = async (req, res) => {
  const tripId = Number(req.params.tripId);

  if (isNaN(tripId)) {
    return res.status(400).json({ success: false, error: "Invalid tripId" });
  }

  try {
    await validateTripOwnership(tripId, req.user.userId);

    const alerts = await prisma.alert.findMany({
      where: { trip_id: tripId },
      orderBy: { created_at: "desc" }
    });

    res.json({ success: true, data: alerts });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* =========================================
   Get Unread Count
========================================= */
exports.getUnreadCount = async (req, res) => {
  const tripId = Number(req.params.tripId);

  if (isNaN(tripId)) {
    return res.status(400).json({ success: false, error: "Invalid tripId" });
  }

  try {
    await validateTripOwnership(tripId, req.user.userId);

    const count = await prisma.alert.count({
      where: { trip_id: tripId, is_read: false }
    });

    res.json({ success: true, data: { count } });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* =========================================
   Mark One Alert As Read
========================================= */
exports.markAsRead = async (req, res) => {
  const alertId = Number(req.params.alertId);

  if (isNaN(alertId)) {
    return res.status(400).json({ success: false, error: "Invalid alertId" });
  }

  try {
    await prisma.alert.update({
      where: { id: alertId },
      data: { is_read: true }
    });

    res.json({ success: true, message: "Alert marked as read" });

  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to update alert" });
  }
};

/* =========================================
   Mark All Alerts As Read
========================================= */
exports.markAllAsRead = async (req, res) => {
  const tripId = Number(req.params.tripId);

  if (isNaN(tripId)) {
    return res.status(400).json({ success: false, error: "Invalid tripId" });
  }

  try {
    await validateTripOwnership(tripId, req.user.userId);

    await prisma.alert.updateMany({
      where: { trip_id: tripId, is_read: false },
      data: { is_read: true }
    });

    res.json({ success: true, message: "All alerts marked as read" });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* =========================================
   Generate Smart Alerts (Gemini Optimized)
========================================= */
exports.generateSmartAlerts = async (req, res) => {
  const tripId = Number(req.params.tripId);

  if (isNaN(tripId)) {
    return res.status(400).json({ success: false, error: "Invalid tripId" });
  }

  try {
    await validateTripOwnership(tripId, req.user.userId);

    // 🧠 Prevent overusing Gemini (max once every 6 hours)
    const recentAlert = await prisma.alert.findFirst({
      where: {
        trip_id: tripId,
        created_at: {
          gte: new Date(Date.now() - 6 * 60 * 60 * 1000)
        }
      }
    });

    if (recentAlert) {
      return res.json({
        success: true,
        message: "Recent alerts already generated"
      });
    }

    const trip = await prisma.trip.findUnique({
      where: { id: tripId }
    });

    const destData = await prisma.destination.findUnique({
      where: { name: trip.destination }
    });

    const phase = calculatePhase(trip);

    const prompt = gemini.buildPrompt(
      `Generate 2-3 realistic travel alerts.
       Trip phase: ${phase}.
       Return only a JSON array.
       Format:
       [
         {
           "type": "weather|flight|safety|reminder",
           "title": "...",
           "message": "...",
           "priority": "low|medium|high|critical"
         }
       ]`,
      { trip, destData, phase },
      "Generate smart travel alerts."
    );

    const responseText = await gemini.generateContent(prompt);

    let alerts = [];
    try {
      const match = responseText.match(/\[[\s\S]*\]/);
      if (match) alerts = JSON.parse(match[0]);
    } catch {
      alerts = [];
    }

    const createdAlerts = [];

    for (const alert of alerts) {

      // 🔁 Prevent duplicate alerts
      const exists = await prisma.alert.findFirst({
        where: {
          trip_id: tripId,
          title: alert.title
        }
      });

      if (!exists) {
        const created = await prisma.alert.create({
          data: {
            trip_id: tripId,
            type: alert.type || "reminder",
            title: alert.title,
            message: alert.message,
            priority: alert.priority || "medium"
          }
        });

        createdAlerts.push(created);
      }
    }

    res.json({ success: true, data: createdAlerts });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createAlert = async (req, res) => {
  try {
    const alert = await prisma.alert.create({
      data: req.body
    });

    res.json({ success: true, data: alert });

  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to create alert" });
  }
};