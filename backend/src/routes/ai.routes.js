const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const authMiddleware = require('../middlewares/auth.middleware');


router.post('/trips/:tripId/chat', authMiddleware, aiController.chat);


router.post('/trips/:tripId/itinerary', authMiddleware, aiController.generateItinerary);
router.get('/trips/:tripId/itinerary', authMiddleware, aiController.getItinerary);


router.post('/trips/:tripId/local-guide', authMiddleware, aiController.localGuide);


router.post('/trips/:tripId/vr-explain', authMiddleware, aiController.vrExplain);


router.get('/trips/:tripId/chat-history', authMiddleware, aiController.getChatHistory);
router.delete('/trips/:tripId/chat-history', authMiddleware, aiController.clearChatHistory);


router.post('/ocr', authMiddleware, aiController.extractTextFromImage);

module.exports = router;