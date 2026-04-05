const Notification = require('../models/Notification');

class NotificationController {
  async getNotifications(req, res) {
    try {
      const notifications = await Notification.find()
        .sort({ createdAt: -1 })
        .limit(50);

      res.json({ success: true, notifications });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch notifications', message: error.message });
    }
  }

  async markAsRead(req, res) {
    try {
      const { id } = req.params;
      const notification = await Notification.findByIdAndUpdate(
        id,
        { read: true },
        { new: true }
      );

      res.json({ success: true, notification });
    } catch (error) {
      res.status(500).json({ error: 'Failed to mark notification', message: error.message });
    }
  }

  async markAllAsRead(req, res) {
    try {
      await Notification.updateMany({ read: false }, { read: true });
      res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to mark all notifications', message: error.message });
    }
  }
}

module.exports = new NotificationController();
