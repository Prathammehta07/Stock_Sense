const Transfer = require('../models/Transfer');
const InventoryService = require('../services/inventoryService');

class TransferController {
  static getAll(req, res, next) {
    try {
      const transfers = Transfer.getAll();
      res.json({ success: true, data: transfers });
    } catch (err) {
      next(err);
    }
  }

  static getById(req, res, next) {
    try {
      const transfer = Transfer.findById(req.params.id);
      if (!transfer) return res.status(404).json({ success: false, message: 'Transfer not found' });
      res.json({ success: true, data: transfer });
    } catch (err) {
      next(err);
    }
  }

  static create(req, res, next) {
    try {
      const transfer = Transfer.create({
        ...req.body,
        created_by: req.user ? req.user.id : 'u-003'
      });
      res.status(201).json({ success: true, data: transfer });
    } catch (err) {
      next(err);
    }
  }

  static validate(req, res, next) {
    try {
      const validatedTransfer = InventoryService.validateTransfer(req.params.id, req.user ? req.user.id : 'u-003');
      res.json({ success: true, message: 'Transfer validated and stock relocated successfully', data: validatedTransfer });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = TransferController;
