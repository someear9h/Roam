const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Get all reviews for a trip
router.get('/:tripId', authMiddleware, reviewController.getTripReviews);

// Create a new review for a trip
router.post('/', authMiddleware, reviewController.createTripReview);

// Update a review
router.put('/:reviewId', authMiddleware, reviewController.updateTripReview);

// Delete a review
router.delete('/:reviewId', authMiddleware, reviewController.deleteTripReview);

module.exports = router;