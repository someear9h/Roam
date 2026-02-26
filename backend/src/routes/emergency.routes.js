const express = require('express');
const router = express.Router();
const emergencyController = require('../controllers/emergency.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/trips/:tripId', authMiddleware, emergencyController.emergency);

module.exports = router;