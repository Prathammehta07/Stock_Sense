const StockLedgerService = require('../services/stockLedgerService');

class MoveHistoryController {
  static getAll(req, res, next) {
    try {
      const logs = StockLedgerService.getHistory(req.query);
      res.json({ success: true, data: logs });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = MoveHistoryController;
