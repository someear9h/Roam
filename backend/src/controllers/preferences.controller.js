const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { userPreferencesSchema } = require('../utils/validation');

// Get user preferences
exports.getPreferences = async (req, res) => {
  let prefs = await prisma.userPreferences.findUnique({
    where: { user_id: req.user.userId },
  });

  // Create default preferences if none exist
  if (!prefs) {
    prefs = await prisma.userPreferences.create({
      data: { user_id: req.user.userId },
    });
  }

  res.json({ success: true, data: prefs });
};

// Update user preferences (for onboarding)
exports.updatePreferences = async (req, res) => {
  const result = userPreferencesSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error.format() });
  }

  const prefs = await prisma.userPreferences.upsert({
    where: { user_id: req.user.userId },
    update: { ...result.data, updated_at: new Date() },
    create: { user_id: req.user.userId, ...result.data },
  });

  res.json({ success: true, data: prefs });
};

// Complete onboarding
exports.completeOnboarding = async (req, res) => {
  const result = userPreferencesSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error.format() });
  }

  const prefs = await prisma.userPreferences.upsert({
    where: { user_id: req.user.userId },
    update: { 
      ...result.data, 
      onboarding_complete: true,
      updated_at: new Date() 
    },
    create: { 
      user_id: req.user.userId, 
      ...result.data,
      onboarding_complete: true 
    },
  });

  res.json({ success: true, message: 'Onboarding complete!', data: prefs });
};

// Check onboarding status
exports.checkOnboardingStatus = async (req, res) => {
  const prefs = await prisma.userPreferences.findUnique({
    where: { user_id: req.user.userId },
  });

  res.json({ 
    success: true, 
    data: { 
      onboarding_complete: prefs?.onboarding_complete || false 
    } 
  });
};
