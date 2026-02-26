const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { userPreferencesSchema } = require('../utils/validation');

const mapOnboardingPayloadToUserPreferences = (body) => {
  if (!body || typeof body !== 'object') return {};

  // Support both snake_case (API) and camelCase (frontend onboarding wizard)
  const pace =
    body.pace === 'relaxed' ? 'slow'
    : body.pace;

  const travelStyleArray = Array.isArray(body.travelStyle) ? body.travelStyle : null;
  const travel_style =
    body.travel_style ||
    (travelStyleArray && travelStyleArray.includes('relaxation') ? 'relaxed'
      : travelStyleArray && travelStyleArray.includes('adventure') ? 'packed'
      : travelStyleArray ? 'balanced'
      : undefined);

  const foodPrefsArray = Array.isArray(body.foodPreferences) ? body.foodPreferences : null;
  const food_preference =
    body.food_preference ||
    (foodPrefsArray && foodPrefsArray.includes('Vegan') ? 'vegan'
      : foodPrefsArray && foodPrefsArray.includes('Vegetarian') ? 'veg'
      : foodPrefsArray ? 'all'
      : undefined);

  const mapped = {
    travel_style,
    food_preference,
    pace,
    interests: Array.isArray(body.interests) ? body.interests : undefined,
    budget_level: body.budget_level,
  };

  // Remove undefined keys
  Object.keys(mapped).forEach((k) => mapped[k] === undefined && delete mapped[k]);
  return mapped;
};

/* =========================================
   Get User Preferences
========================================= */
exports.getPreferences = async (req, res) => {
  try {
    let prefs = await prisma.userPreferences.findUnique({
      where: { user_id: req.user.userId }
    });

    // Create default preferences if not exist
    if (!prefs) {
      prefs = await prisma.userPreferences.create({
        data: { user_id: req.user.userId }
      });
    }

    res.json({ success: true, data: prefs });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch preferences"
    });
  }
};

/* =========================================
   Update Preferences
========================================= */
exports.updatePreferences = async (req, res) => {
  const result = userPreferencesSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: result.error.format()
    });
  }

  try {
    const prefs = await prisma.userPreferences.upsert({
      where: { user_id: req.user.userId },
      update: { ...result.data },
      create: {
        user_id: req.user.userId,
        ...result.data
      }
    });

    res.json({ success: true, data: prefs });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to update preferences"
    });
  }
};

/* =========================================
   Complete Onboarding
========================================= */
exports.completeOnboarding = async (req, res) => {
  try {
    // Mark the user record as onboarded (authoritative flag)
    await prisma.user.update({
      where: { id: req.user.userId },
      data: { onboarding_complete: true }
    });

    // Best-effort: also store preferences if provided
    const mapped = mapOnboardingPayloadToUserPreferences(req.body);
    const parsed = userPreferencesSchema.safeParse({ ...mapped, onboarding_complete: true });
    if (parsed.success) {
      await prisma.userPreferences.upsert({
        where: { user_id: req.user.userId },
        update: {
          ...parsed.data,
          onboarding_complete: true
        },
        create: {
          user_id: req.user.userId,
          ...parsed.data,
          onboarding_complete: true
        }
      });
    }

    res.json({
      success: true,
      message: "Onboarding complete!",
      data: { onboarding_complete: true }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to complete onboarding"
    });
  }
};

/* =========================================
   Check Onboarding Status
========================================= */
exports.checkOnboardingStatus = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { onboarding_complete: true }
    });

    res.json({
      success: true,
      data: {
        onboarding_complete: user?.onboarding_complete || false
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to check onboarding status"
    });
  }
};