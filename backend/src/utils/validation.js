const { z } = require('zod');

// Auth schemas
exports.registerSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email({ message: 'Invalid email format' }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number' }).optional().or(z.literal('')),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  language: z.string().default('en'),
  accessibility_needs: z.string().optional(),
});

exports.loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

exports.updatePreferencesSchema = z.object({
  language: z.string().optional(),
  accessibility_needs: z.string().optional(),
});

// Trip schemas
exports.createTripSchema = z.object({
  destination: z.string().min(1, { message: 'Destination is required' }),
  start_date: z.string().datetime({ message: 'Invalid start date (ISO format)' }).optional(),
  end_date: z.string().datetime({ message: 'Invalid end date (ISO format)' }).optional(),
  booking_id: z.string().optional(),
});

// AI schemas
exports.chatSchema = z.object({
  tripId: z.number({ message: 'tripId must be a number' }),
  message: z.string().min(1, { message: 'Message is required' }),
});

exports.generateItinerarySchema = z.object({
  tripId: z.number({ message: 'tripId must be a number' }),
});

exports.localGuideSchema = z.object({
  tripId: z.number({ message: 'tripId must be a number' }),
  query: z.string().min(1, { message: 'Query is required' }),
  location: z.object({
    lat: z.number().optional(),
    lng: z.number().optional(),
  }).optional(),
});

exports.vrExplainSchema = z.object({
  destination: z.string().min(1, { message: 'Destination is required' }),
  location: z.string().min(1, { message: 'Location is required' }),
  time: z.string().min(1, { message: 'Time is required' }),
  userPreferences: z.object({}).optional(), // Flexible object
});

// Emergency schema
exports.emergencySchema = z.object({
  tripId: z.number({ message: 'tripId must be a number' }),
  issue: z.string().min(1, { message: 'Issue description is required' }),
});

// User Preferences schema
exports.userPreferencesSchema = z.object({
  travel_style: z.enum(['relaxed', 'balanced', 'packed']).optional(),
  food_preference: z.enum(['veg', 'non-veg', 'vegan', 'all']).optional(),
  pace: z.enum(['slow', 'moderate', 'fast']).optional(),
  interests: z.array(z.string()).optional(),
  budget_level: z.enum(['budget', 'moderate', 'luxury']).optional(),
  onboarding_complete: z.boolean().optional(),
});

// Smart Itinerary schema
exports.smartItinerarySchema = z.object({
  tripId: z.number({ message: 'tripId must be a number' }),
  preferences: z.object({
    travel_style: z.string().optional(),
    food_preference: z.string().optional(),
    pace: z.string().optional(),
    interests: z.array(z.string()).optional(),
  }).optional(),
});

// Alert schema
exports.alertSchema = z.object({
  trip_id: z.number({ message: 'trip_id must be a number' }),
  type: z.enum(['weather', 'flight', 'safety', 'reminder']),
  title: z.string().min(1),
  message: z.string().min(1),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
});

// Trip Memory schema
exports.tripMemorySchema = z.object({
  trip_id: z.number({ message: 'trip_id must be a number' }),
  type: z.enum(['place_visited', 'photo', 'note', 'highlight']),
  title: z.string().min(1),
  description: z.string().optional(),
  data: z.object({}).passthrough().optional(),
});

// Trip Feedback schema
exports.tripFeedbackSchema = z.object({
  trip_id: z.number({ message: 'trip_id must be a number' }),
  rating: z.number().min(1).max(5),
  highlights: z.array(z.string()).optional(),
  improvements: z.string().optional(),
  would_recommend: z.boolean().optional(),
});

// Trip Summary AI schema
exports.tripSummarySchema = z.object({
  tripId: z.number({ message: 'tripId must be a number' }),
});

// Travel Readiness schema
exports.travelReadinessSchema = z.object({
  tripId: z.number({ message: 'tripId must be a number' }),
});