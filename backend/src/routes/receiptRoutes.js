const express = require('express');
const router = express.Router();
const ReceiptController = require('../controllers/receiptController');

router.get('/', ReceiptController.getAll);
router.get('/:id', ReceiptController.getById);
router.post('/', ReceiptController.create);
router.post('/:id/validate', ReceiptController.validate);

module.exports = router;
