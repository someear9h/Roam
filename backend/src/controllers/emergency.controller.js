const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const gemini = require('../services/gemini.service');
const { emergencySchema } = require('../utils/validation');

/* =========================================
   Helper: Validate Trip Ownership
========================================= */
async function validateTripOwnership(tripId, userId) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: { user_id: true, destination: true }
  });

  if (!trip) throw new Error("Trip not found");
  if (trip.user_id !== userId) throw new Error("Unauthorized");

  return trip;
}

/* =========================================
   Detect Urgency Level
========================================= */
function detectUrgency(issue) {
  const criticalKeywords = [
    "accident",
    "hospital",
    "injured",
    "police",
    "assault",
    "harassment",
    "fire",
    "emergency"
  ];

  const highKeywords = [
    "passport lost",
    "stolen",
    "missed flight",
    "medical",
    "urgent"
  ];

  const lowerIssue = issue.toLowerCase();

  if (criticalKeywords.some(word => lowerIssue.includes(word))) {
    return "critical";
  }

  if (highKeywords.some(word => lowerIssue.includes(word))) {
    return "high";
  }

  return "medium";
}

/* =========================================
   Emergency Handler
========================================= */
exports.emergency = async (req, res) => {
  const result = emergencySchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: result.error.format()
    });
  }

  const { tripId, issue } = result.data;

  try {
    const trip = await validateTripOwnership(tripId, req.user.userId);

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { language: true, accessibility_needs: true }
    });

    const destData = await prisma.destination.findUnique({
      where: { name: trip.destination }
    });

    const urgency = detectUrgency(issue);

    // 🔥 Always include static emergency contacts immediately
    const emergencyContacts = destData?.emergency_contacts || {
      emergency_number: "112",
      police: "Local Police",
      ambulance: "Local Ambulance",
      embassy: "Contact your embassy"
    };

    // 🚨 If critical → skip Gemini (save tokens)
    if (urgency === "critical") {
      return res.json({
        success: true,
        data: {
          urgency,
          message: "This seems urgent. Please contact emergency services immediately.",
          emergency_contacts: emergencyContacts
        }
      });
    }

    // 🧠 Use Gemini only for medium/high non-critical issues
    const prompt = gemini.buildPrompt(
      `You are a calm emergency travel assistant.
       Provide step-by-step guidance.
       Keep it concise.
       Do not repeat emergency numbers.
       Urgency level: ${urgency}`,
      { trip, user, destData },
      issue
    );

    let aiResponse = "Please contact local authorities if situation worsens.";

    try {
      aiResponse = await gemini.generateContent(prompt);
    } catch {
      // Fail silently, don't break emergency
    }

    res.json({
      success: true,
      data: {
        urgency,
        response: aiResponse,
        emergency_contacts: emergencyContacts
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};