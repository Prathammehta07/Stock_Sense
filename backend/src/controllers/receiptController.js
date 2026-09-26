const Receipt = require('../models/Receipt');
const InventoryService = require('../services/inventoryService');

class ReceiptController {
  static getAll(req, res, next) {
    try {
      const receipts = Receipt.getAll();
      res.json({ success: true, data: receipts });
    } catch (err) {
      next(err);
    }
  }

  static getById(req, res, next) {
    try {
      const receipt = Receipt.findById(req.params.id);
      if (!receipt) return res.status(404).json({ success: false, message: 'Receipt not found' });
      res.json({ success: true, data: receipt });
    } catch (err) {
      next(err);
    }
  }

  static create(req, res, next) {
    try {
      const receipt = Receipt.create({
        ...req.body,
        created_by: req.user ? req.user.id : 'u-002'
      });
      res.status(201).json({ success: true, data: receipt });
    } catch (err) {
      next(err);
    }
  }

  static validate(req, res, next) {
    try {
      const validatedReceipt = InventoryService.validateReceipt(req.params.id, req.user ? req.user.id : 'u-002');
      res.json({ success: true, message: 'Receipt validated and stock updated successfully', data: validatedReceipt });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ReceiptController;
