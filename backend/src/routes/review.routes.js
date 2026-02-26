const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Get all reviews for a trip
router.get('/:tripId/reviews', authMiddleware, reviewController.getTripReviews);

// Create a new review for a trip
router.post('/reviews', authMiddleware, reviewController.createTripReview);

// Update a review
router.put('/reviews/:reviewId', authMiddleware, reviewController.updateTripReview);

// Delete a review
router.delete('/reviews/:reviewId', authMiddleware, reviewController.deleteTripReview);

module.exports = router;