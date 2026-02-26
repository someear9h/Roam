const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summary.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/trips/:tripId/memories', authMiddleware, summaryController.getMemories);
router.post('/trips/:tripId/memories', authMiddleware, summaryController.addMemory);

router.get('/trips/:tripId/feedback', authMiddleware, summaryController.getFeedback);
router.post('/trips/:tripId/feedback', authMiddleware, summaryController.submitFeedback);

router.post('/trips/:tripId/generate', authMiddleware, summaryController.generateSummary);

router.get('/trips/:tripId', authMiddleware, summaryController.getFullSummary);

module.exports = router;