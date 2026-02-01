const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const gemini = require('../services/gemini.service');
const { createTripSchema, travelReadinessSchema } = require('../utils/validation');

exports.getTrips = async (req, res) => {
  const trips = await prisma.trip.findMany({
    where: { user_id: req.user.userId },
    orderBy: { start_date: 'asc' },
  });

  res.json({ success: true, data: trips });
};

exports.createTrip = async (req, res) => {
  const result = createTripSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error.format() });
  }
  const { destination, start_date, end_date, booking_id } = result.data;

  const trip = await prisma.trip.create({
    data: {
      user_id: req.user.userId,
      destination,
      start_date: start_date ? new Date(start_date) : null,
      end_date: end_date ? new Date(end_date) : null,
      booking_id,
    },
  });

  res.json({ success: true, data: { tripId: trip.id } });
};

exports.getTripContext = async (req, res) => {
  const tripId = Number(req.params.tripId);
  if (isNaN(tripId)) {
    return res.status(400).json({ success: false, error: 'Invalid tripId (must be number)' });
  }

  const trip = await prisma.trip.findUnique({ 
    where: { id: tripId },
    include: { itinerary: true }
  });
  if (!trip) return res.status(404).json({ success: false, error: 'Trip not found' });

  // Get user preferences
  const userPrefs = await prisma.userPreferences.findUnique({
    where: { user_id: req.user.userId },
  });

  // Get destination data if available
  const destData = await prisma.destination.findUnique({
    where: { name: trip.destination },
  });

  // Calculate days until trip
  const daysUntil = trip.start_date 
    ? Math.ceil((new Date(trip.start_date) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  // Determine trip phase
  let phase = 'planning';
  const now = new Date();
  if (trip.start_date && trip.end_date) {
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    if (now < start) phase = 'pre-trip';
    else if (now >= start && now <= end) phase = 'during-trip';
    else phase = 'post-trip';
  }

  res.json({ 
    success: true, 
    data: {
      trip,
      itinerary: trip.itinerary?.plan || null,
      preferences: userPrefs,
      destination: destData,
      daysUntil,
      phase
    }
  });
};

// Travel Readiness - Packing list, currency, visa, emergency contacts
exports.getTravelReadiness = async (req, res) => {
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

  const userPrefs = await prisma.userPreferences.findUnique({
    where: { user_id: req.user.userId },
  });

  const destData = await prisma.destination.findUnique({
    where: { name: trip.destination },
  });

  const context = { 
    trip, 
    user, 
    userPrefs,
    destData,
    tripDuration: trip.start_date && trip.end_date 
      ? Math.ceil((new Date(trip.end_date) - new Date(trip.start_date)) / (1000 * 60 * 60 * 24))
      : 7
  };

  const prompt = gemini.buildPrompt(
    `Generate a comprehensive travel readiness checklist for the user. Include:
    1. Packing checklist (categorized: essentials, clothing, electronics, toiletries, documents)
    2. Currency information (local currency, exchange rate tips, payment methods)
    3. Visa requirements (if applicable)
    4. Emergency contacts (embassy, emergency services, hospital)
    5. Health recommendations (vaccinations, medications)
    6. Local tips (tipping culture, dress code, customs)
    
    Return as JSON:
    {
      "packing_checklist": {
        "essentials": ["item1", "item2"],
        "clothing": ["item1"],
        "electronics": ["item1"],
        "toiletries": ["item1"],
        "documents": ["item1"]
      },
      "currency": {
        "local_currency": "EUR",
        "symbol": "€",
        "exchange_tip": "...",
        "payment_methods": ["credit cards", "cash"]
      },
      "visa_info": {
        "required": true/false,
        "details": "..."
      },
      "emergency_contacts": {
        "emergency_number": "112",
        "police": "...",
        "ambulance": "...",
        "embassy": "..."
      },
      "health": {
        "vaccinations": ["..."],
        "recommendations": ["..."]
      },
      "local_tips": ["tip1", "tip2"]
    }`,
    context,
    `Generate travel readiness information for a trip to ${trip.destination}.`
  );

  const responseText = await gemini.generateContent(prompt);

  let readiness;
  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      readiness = JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    // Fallback default structure
    readiness = {
      packing_checklist: {
        essentials: ['Passport', 'Tickets', 'Phone charger', 'Wallet'],
        clothing: ['Comfortable walking shoes', 'Weather-appropriate clothing'],
        electronics: ['Phone', 'Camera', 'Power adapter'],
        toiletries: ['Toothbrush', 'Medications'],
        documents: ['Travel insurance', 'Hotel confirmations']
      },
      currency: {
        local_currency: 'Local Currency',
        exchange_tip: 'Check current rates before traveling',
        payment_methods: ['Credit cards accepted in most places']
      },
      visa_info: { required: false, details: 'Check visa requirements' },
      emergency_contacts: {
        emergency_number: '112',
        police: 'Local police',
        ambulance: 'Emergency services'
      },
      health: { vaccinations: [], recommendations: ['Travel insurance recommended'] },
      local_tips: [responseText.slice(0, 300)]
    };
  }

  res.json({ success: true, data: readiness });
};

// Update trip status
exports.updateTripStatus = async (req, res) => {
  const tripId = Number(req.params.tripId);
  const { status } = req.body;

  if (isNaN(tripId)) {
    return res.status(400).json({ success: false, error: 'Invalid tripId' });
  }

  if (!['active', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ success: false, error: 'Invalid status' });
  }

  const trip = await prisma.trip.update({
    where: { id: tripId },
    data: { status },
  });

  res.json({ success: true, data: trip });
};