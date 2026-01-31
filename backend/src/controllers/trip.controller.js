const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { createTripSchema } = require('../utils/validation');

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

  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip) return res.status(404).json({ success: false, error: 'Trip not found' });

  res.json({ success: true, data: trip });
};