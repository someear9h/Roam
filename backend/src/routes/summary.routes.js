const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summary.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/:tripId', authMiddleware, summaryController.getFullSummary);
router.get('/:tripId/memories', authMiddleware, summaryController.getMemories);
router.post('/memories', authMiddleware, summaryController.addMemory);
router.get('/:tripId/feedback', authMiddleware, summaryController.getFeedback);
router.post('/feedback', authMiddleware, summaryController.submitFeedback);
router.post('/generate', authMiddleware, summaryController.generateSummary);

module.exports = router;
