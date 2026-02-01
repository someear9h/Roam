const express = require('express');
const router = express.Router();
const preferencesController = require('../controllers/preferences.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, preferencesController.getPreferences);
router.put('/', authMiddleware, preferencesController.updatePreferences);
router.post('/onboarding', authMiddleware, preferencesController.completeOnboarding);
router.get('/onboarding-status', authMiddleware, preferencesController.checkOnboardingStatus);

module.exports = router;
