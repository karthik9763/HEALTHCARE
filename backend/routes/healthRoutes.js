const express = require('express');
const router = express.Router();
const { addHealthRecord, getHealthHistory, getLatestHealth } = require('../controllers/healthController');
const { protect } = require('../middleware/authMiddleware');

router.post('/add', protect, addHealthRecord);
router.get('/history', protect, getHealthHistory);
router.get('/live', protect, getLatestHealth);

module.exports = router;
