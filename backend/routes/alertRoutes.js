const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Get user alerts
router.get('/', protect, async (req, res) => {
    try {
        let query = {};
        if (req.user.role !== 'admin') {
            query.user = req.user.id;
        }
        const alerts = await Alert.find(query).sort({ timestamp: -1 });
        res.json(alerts);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching alerts', error: err.message });
    }
});

// Mark alert as read
router.put('/:id/read', protect, async (req, res) => {
    try {
        const alert = await Alert.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
        res.json(alert);
    } catch (err) {
        res.status(400).json({ message: 'Error updating alert status', error: err.message });
    }
});

// Delete alert (Admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        await Alert.findByIdAndDelete(req.params.id);
        res.json({ message: 'Alert deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting alert', error: err.message });
    }
});

module.exports = router;
