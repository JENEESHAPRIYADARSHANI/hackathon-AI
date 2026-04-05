const Request = require('../models/Request');
const Notification = require('../models/Notification');
const SLAService = require('../services/SLAService');

class DashboardController {
  async getDashboard(req, res) {
    try {
      const totalRequests = await Request.countDocuments();
      const newRequests = await Request.countDocuments({ status: 'NEW' });
      const assignedRequests = await Request.countDocuments({ status: 'ASSIGNED' });
      const inProgressRequests = await Request.countDocuments({ status: 'IN_PROGRESS' });
      const completedRequests = await Request.countDocuments({ status: 'COMPLETED' });

      const criticalRequests = await Request.countDocuments({ priority: 'CRITICAL' });
      const breachedSLA = await Request.countDocuments({ breached: true });

      const recentRequests = await Request.find().sort({ timestamp: -1 }).limit(10);
      
      const priorityBreakdown = await Request.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ]);

      const categoryBreakdown = await Request.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]);

      const avgResolutionTime = await Request.aggregate([
        {
          $match: { status: 'COMPLETED' }
        },
        {
          $project: {
            resolutionTime: {
              $subtract: ['$completedAt', '$timestamp']
            }
          }
        },
        {
          $group: {
            _id: null,
            avgTime: { $avg: '$resolutionTime' }
          }
        }
      ]);

      const unreadNotifications = await Notification.countDocuments({ read: false });

      res.json({
        success: true,
        stats: {
          totalRequests,
          newRequests,
          assignedRequests,
          inProgressRequests,
          completedRequests,
          criticalRequests,
          breachedSLA,
          unreadNotifications,
          avgResolutionTime: avgResolutionTime[0]?.avgTime || 0
        },
        recentRequests,
        breakdowns: {
          byPriority: priorityBreakdown,
          byCategory: categoryBreakdown
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch dashboard', message: error.message });
    }
  }
}

module.exports = new DashboardController();
