const Delivery = require('../models/Delivery');
const InventoryService = require('../services/inventoryService');

class DeliveryController {
  static getAll(req, res, next) {
    try {
      const deliveries = Delivery.getAll();
      res.json({ success: true, data: deliveries });
    } catch (err) {
      next(err);
    }
  }

  static getById(req, res, next) {
    try {
      const delivery = Delivery.findById(req.params.id);
      if (!delivery) return res.status(404).json({ success: false, message: 'Delivery order not found' });
      res.json({ success: true, data: delivery });
    } catch (err) {
      next(err);
    }
  }

  static create(req, res, next) {
    try {
      const delivery = Delivery.create({
        ...req.body,
        created_by: req.user ? req.user.id : 'u-002'
      });
      res.status(201).json({ success: true, data: delivery });
    } catch (err) {
      next(err);
    }
  }

  static validate(req, res, next) {
    try {
      const validatedDelivery = InventoryService.validateDelivery(req.params.id, req.user ? req.user.id : 'u-002');
      res.json({ success: true, message: 'Delivery validated and stock decreased successfully', data: validatedDelivery });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = DeliveryController;
