const express = require('express');
const router = express.Router();

const hotelController = require('../controllers/hotel.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Search available hotels for the trip (POST uses tripId to find trip destination)
router.post('/trips/:tripId', authMiddleware, hotelController.searchHotels);
// Book a hotel for a trip
router.post('/trips/:tripId/book', authMiddleware, hotelController.bookHotel);
// Get booking for a trip
router.get('/trips/:tripId/bookings', authMiddleware, hotelController.getHotelForTrip);
// Cancel booking for a trip
router.delete('/trips/:tripId', authMiddleware, hotelController.cancelHotelBooking);

// Fallback helpers
router.get('/destination/:destination', authMiddleware, hotelController.getHotelsByDestination);
router.get('/:hotelId', authMiddleware, hotelController.getHotel);

module.exports = router;
