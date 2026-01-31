const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/chat', authMiddleware, aiController.chat);
router.post('/itinerary', authMiddleware, aiController.generateItinerary);
router.get('/itinerary/:tripId', authMiddleware, aiController.getItinerary);

module.exports = router;