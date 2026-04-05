const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/NotificationController');

// Get notifications
router.get('/', NotificationController.getNotifications.bind(NotificationController));

// Mark as read
router.put('/:id/read', NotificationController.markAsRead.bind(NotificationController));

// Mark all as read
router.put('/read/all', NotificationController.markAllAsRead.bind(NotificationController));

module.exports = router;
