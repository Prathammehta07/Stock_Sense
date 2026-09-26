const express = require('express');
const router = express.Router();
const StockController = require('../controllers/stockController');

router.get('/', StockController.getAll);

module.exports = router;
