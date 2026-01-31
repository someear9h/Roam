const express = require('express');
const router = express.Router();
const destinationController = require('../controllers/destination.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/:name', authMiddleware, destinationController.getDestination);
router.get('/:name/vr-assets', authMiddleware, destinationController.getVrAssets);

module.exports = router;