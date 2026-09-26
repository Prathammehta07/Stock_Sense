const express = require('express');
const router = express.Router();
const AdjustmentController = require('../controllers/adjustmentController');

router.get('/', AdjustmentController.getAll);
router.get('/:id', AdjustmentController.getById);
router.post('/', AdjustmentController.create);

module.exports = router;
