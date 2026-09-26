const express = require('express');
const router = express.Router();
const DeliveryController = require('../controllers/deliveryController');

router.get('/', DeliveryController.getAll);
router.get('/:id', DeliveryController.getById);
router.post('/', DeliveryController.create);
router.post('/:id/validate', DeliveryController.validate);

module.exports = router;
