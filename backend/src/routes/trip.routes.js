const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, tripController.getTrips);
router.post('/create', authMiddleware, tripController.createTrip);
router.get('/:tripId/context', authMiddleware, tripController.getTripContext);
router.get('/:tripId/readiness', authMiddleware, tripController.getTravelReadiness);
router.put('/:tripId/status', authMiddleware, tripController.updateTripStatus);

module.exports = router;