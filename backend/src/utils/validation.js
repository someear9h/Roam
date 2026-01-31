const { z } = require('zod');

// Auth schemas
exports.registerSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email({ message: 'Invalid email format' }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number' }).optional(),
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