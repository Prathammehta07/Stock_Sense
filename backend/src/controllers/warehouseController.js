const Warehouse = require('../models/Warehouse');
const Location = require('../models/Location');

class WarehouseController {
  static getAll(req, res, next) {
    try {
      const warehouses = Warehouse.getAll();
      const locations = Location.getAll();
      res.json({ success: true, warehouses, locations });
    } catch (err) {
      next(err);
    }
  }

  static createWarehouse(req, res, next) {
    try {
      const wh = Warehouse.create(req.body);
      res.status(201).json({ success: true, data: wh });
    } catch (err) {
      next(err);
    }
  }

  static createLocation(req, res, next) {
    try {
      const loc = Location.create(req.body);
      res.status(201).json({ success: true, data: loc });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = WarehouseController;
