const express = require('express');
const router = express.Router();
const preferencesController = require('../controllers/preferences.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/onboarding-status', authMiddleware, preferencesController.checkOnboardingStatus);
router.post('/onboarding', authMiddleware, preferencesController.completeOnboarding);

router.get('/', authMiddleware, preferencesController.getPreferences);
router.put('/', authMiddleware, preferencesController.updatePreferences);

module.exports = router;