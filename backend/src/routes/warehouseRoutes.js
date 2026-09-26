const express = require('express');
const router = express.Router();
const WarehouseController = require('../controllers/warehouseController');

router.get('/', WarehouseController.getAll);
router.post('/', WarehouseController.createWarehouse);
router.post('/locations', WarehouseController.createLocation);

module.exports = router;
