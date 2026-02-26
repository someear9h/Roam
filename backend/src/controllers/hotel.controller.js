const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getHotelsByDestination = async (req, res) => {

  const destination = req.params.destination;

  const hotels = await prisma.hotel.findMany({
    where: { destination }
  });

  res.json({
    success: true,
    data: hotels
  });

};

// Search hotels for a trip (uses tripId to determine destination)
exports.searchHotels = async (req, res) => {
  try {
    const tripId = Number(req.params.tripId);
    if (isNaN(tripId)) return res.status(400).json({ success: false, error: 'Invalid tripId' });

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) return res.status(404).json({ success: false, error: 'Trip not found' });

    const hotels = await prisma.hotel.findMany({ where: { destination: trip.destination } });
    res.json({ success: true, data: hotels });
  } catch (err) {
    console.error('searchHotels error', err);
    res.status(500).json({ success: false, error: 'Failed to search hotels' });
  }
};

// Get hotel booking for a trip
exports.getHotelForTrip = async (req, res) => {
  const tripId = Number(req.params.tripId);
  if (isNaN(tripId)) return res.status(400).json({ success: false, error: 'Invalid tripId' });

  try {
    const booking = await prisma.hotelBooking.findUnique({ where: { trip_id: tripId } });
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch booking' });
  }
};

// Cancel hotel booking for a trip
exports.cancelHotelBooking = async (req, res) => {
  const tripId = Number(req.params.tripId);
  if (isNaN(tripId)) return res.status(400).json({ success: false, error: 'Invalid tripId' });

  try {
    await prisma.hotelBooking.delete({ where: { trip_id: tripId } });
    res.json({ success: true, message: 'Hotel booking removed' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to cancel booking' });
  }
};


exports.getHotel = async (req, res) => {

  const hotelId = Number(req.params.hotelId);

  const hotel = await prisma.hotel.findUnique({
    where: { id: hotelId }
  });

  res.json({
    success: true,
    data: hotel
  });

};


exports.bookHotel = async (req, res) => {

  const tripId = Number(req.params.tripId);
  const { hotelId, checkIn, checkOut } = req.body;

  const hotel = await prisma.hotel.findUnique({
    where: { id: hotelId }
  });

  const booking = await prisma.hotelBooking.upsert({

    where: { trip_id: tripId },

    update: {
      name: hotel.name,
      area: hotel.area,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      vr_assets: hotel.vr_assets
    },

    create: {
      trip_id: tripId,
      name: hotel.name,
      area: hotel.area,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      vr_assets: hotel.vr_assets
    }

  });

  res.json({
    success: true,
    data: booking
  });

};


exports.getBookedHotel = async (req, res) => {

  const tripId = Number(req.params.tripId);

  const booking = await prisma.hotelBooking.findUnique({
    where: { trip_id: tripId }
  });

  res.json({
    success: true,
    data: booking
  });

};