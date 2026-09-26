const Adjustment = require('../models/Adjustment');
const InventoryService = require('../services/inventoryService');

class AdjustmentController {
  static getAll(req, res, next) {
    try {
      const adjustments = Adjustment.getAll();
      res.json({ success: true, data: adjustments });
    } catch (err) {
      next(err);
    }
  }

  static getById(req, res, next) {
    try {
      const adjustment = Adjustment.findById(req.params.id);
      if (!adjustment) return res.status(404).json({ success: false, message: 'Adjustment not found' });
      res.json({ success: true, data: adjustment });
    } catch (err) {
      next(err);
    }
  }

  static create(req, res, next) {
    try {
      const adj = InventoryService.submitAdjustment(req.body, req.user ? req.user.id : 'u-002');
      res.status(201).json({ success: true, data: adj });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AdjustmentController;
