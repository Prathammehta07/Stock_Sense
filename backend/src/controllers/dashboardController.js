const InventoryService = require('../services/inventoryService');
const NotificationService = require('../services/notificationService');

class DashboardController {
  static getStats(req, res, next) {
    try {
      const stats = InventoryService.getDashboardStats();
      const alerts = NotificationService.getAlerts();
      res.json({
        success: true,
        data: {
          ...stats,
          alerts
        }
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = DashboardController;
