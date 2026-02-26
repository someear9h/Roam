const express = require('express');
const router = express.Router();
const destinationController = require('../controllers/destination.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/trip/:tripId/vr-assets', authMiddleware, destinationController.getVrAssetsByTrip);

router.get('/', authMiddleware, destinationController.listDestinations);
router.get('/:name/vr-assets', authMiddleware, destinationController.getVrAssets);
router.get('/:name', authMiddleware, destinationController.getDestination);

module.exports = router;