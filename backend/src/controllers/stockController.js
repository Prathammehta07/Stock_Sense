const Stock = require('../models/Stock');

class StockController {
  static getAll(req, res, next) {
    try {
      const stock = Stock.getAll();
      res.json({ success: true, data: stock });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = StockController;
