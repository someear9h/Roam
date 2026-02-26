const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip.controller');
const reviewController = require('../controllers/review.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, tripController.getTrips);
router.post('/', authMiddleware, tripController.createTrip);

// Reviews (compat with frontend `/trips/:tripId/reviews`)
router.get('/:tripId/reviews', authMiddleware, reviewController.getTripReviews);
router.post('/:tripId/reviews', authMiddleware, reviewController.createTripReviewForTrip);

router.get('/:tripId/context', authMiddleware, tripController.getTripContext);
router.get('/:tripId/readiness', authMiddleware, tripController.getTravelReadiness);
router.put('/:tripId/status', authMiddleware, tripController.updateTripStatus);
router.get('/:tripId', authMiddleware, tripController.getTrip);

module.exports = router;