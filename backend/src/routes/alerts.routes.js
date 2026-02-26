const express = require('express');
const router = express.Router();
const alertsController = require('../controllers/alerts.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/:tripId/unread-count', authMiddleware, alertsController.getUnreadCount);
router.post('/:tripId/generate', authMiddleware, alertsController.generateSmartAlerts);
router.put('/:tripId/read-all', authMiddleware, alertsController.markAllAsRead);
router.get('/:tripId', authMiddleware, alertsController.getAlerts);
router.put('/:alertId/read', authMiddleware, alertsController.markAsRead);
router.post('/', authMiddleware, alertsController.createAlert);

module.exports = router;