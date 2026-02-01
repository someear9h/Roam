const express = require('express');
const router = express.Router();
const alertsController = require('../controllers/alerts.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/:tripId', authMiddleware, alertsController.getAlerts);
router.get('/:tripId/unread-count', authMiddleware, alertsController.getUnreadCount);
router.post('/:tripId/generate', authMiddleware, alertsController.generateSmartAlerts);
router.put('/:alertId/read', authMiddleware, alertsController.markAsRead);
router.put('/:tripId/read-all', authMiddleware, alertsController.markAllAsRead);
router.post('/', authMiddleware, alertsController.createAlert);

module.exports = router;
