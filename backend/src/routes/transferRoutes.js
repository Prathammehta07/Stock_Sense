const express = require('express');
const router = express.Router();
const TransferController = require('../controllers/transferController');

router.get('/', TransferController.getAll);
router.get('/:id', TransferController.getById);
router.post('/', TransferController.create);
router.post('/:id/validate', TransferController.validate);

module.exports = router;
