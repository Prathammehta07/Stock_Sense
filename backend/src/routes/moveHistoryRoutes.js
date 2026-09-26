const express = require('express');
const router = express.Router();
const MoveHistoryController = require('../controllers/moveHistoryController');

router.get('/', MoveHistoryController.getAll);

module.exports = router;
