const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { tripReviewSchema } = require('../utils/validation');

exports.getTripReviews = async (req, res) => {
  const tripId = Number(req.params.tripId);
  if (isNaN(tripId)) {
    return res.status(400).json({ success: false, error: 'Invalid tripId (must be number)' });
  }

  // Verify trip ownership
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: { user_id: true }
  });

  if (!trip) {
    return res.status(404).json({ success: false, error: 'Trip not found' });
  }

  if (trip.user_id !== req.user.userId) {
    return res.status(403).json({ success: false, error: 'Not authorized to access this trip' });
  }

  const reviews = await prisma.tripReview.findMany({
    where: { trip_id: tripId },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { created_at: 'desc' }
  });

  res.json({ success: true, data: reviews });
};

exports.createTripReview = async (req, res) => {
  const result = tripReviewSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error.format() });
  }

  const { trip_id, rating, title, comment } = result.data;

  // Verify trip ownership
  const trip = await prisma.trip.findUnique({
    where: { id: trip_id },
    select: { user_id: true }
  });

  if (!trip) {
    return res.status(404).json({ success: false, error: 'Trip not found' });
  }

  if (trip.user_id !== req.user.userId) {
    return res.status(403).json({ success: false, error: 'Not authorized to review this trip' });
  }

  const review = await prisma.tripReview.create({
    data: {
      trip_id,
      user_id: req.user.userId,
      rating,
      title,
      comment
    },
    include: { user: { select: { name: true, email: true } } }
  });

  res.status(201).json({ success: true, data: review });
};

// Compat: create review via `/trips/:tripId/reviews`
exports.createTripReviewForTrip = async (req, res) => {
  const tripId = Number(req.params.tripId);
  if (isNaN(tripId)) {
    return res.status(400).json({ success: false, error: 'Invalid tripId (must be number)' });
  }

  const result = tripReviewSchema.safeParse({ ...req.body, trip_id: tripId });
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error.format() });
  }

  // Delegate to existing logic by reusing parsed body
  req.body = result.data;
  return exports.createTripReview(req, res);
};

exports.updateTripReview = async (req, res) => {
  const reviewId = Number(req.params.reviewId);
  if (isNaN(reviewId)) {
    return res.status(400).json({ success: false, error: 'Invalid reviewId (must be number)' });
  }

  const result = tripReviewSchema.partial().safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error.format() });
  }

  const { rating, title, comment } = result.data;

  // Verify review ownership
  const review = await prisma.tripReview.findUnique({
    where: { id: reviewId },
    select: { user_id: true, trip: { select: { user_id: true } } }
  });

  if (!review) {
    return res.status(404).json({ success: false, error: 'Review not found' });
  }

  if (review.user_id !== req.user.userId) {
    return res.status(403).json({ success: false, error: 'Not authorized to update this review' });
  }

  const updatedReview = await prisma.tripReview.update({
    where: { id: reviewId },
    data: {
      rating,
      title,
      comment,
      updated_at: new Date()
    },
    include: { user: { select: { name: true, email: true } } }
  });

  res.json({ success: true, data: updatedReview });
};

exports.deleteTripReview = async (req, res) => {
  const reviewId = Number(req.params.reviewId);
  if (isNaN(reviewId)) {
    return res.status(400).json({ success: false, error: 'Invalid reviewId (must be number)' });
  }

  // Verify review ownership
  const review = await prisma.tripReview.findUnique({
    where: { id: reviewId },
    select: { user_id: true }
  });

  if (!review) {
    return res.status(404).json({ success: false, error: 'Review not found' });
  }

  if (review.user_id !== req.user.userId) {
    return res.status(403).json({ success: false, error: 'Not authorized to delete this review' });
  }

  await prisma.tripReview.delete({
    where: { id: reviewId }
  });

  res.json({ success: true, message: 'Review deleted successfully' });
};