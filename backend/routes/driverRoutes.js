const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');
const Ambulance = require('../models/Ambulance');

// Get all drivers
router.get('/', async (req, res) => {
    try {
        const drivers = await Driver.find().populate('ambulanceId').sort({ createdAt: -1 });
        res.json(drivers);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching drivers', error: err.message });
    }
});

// Create driver
router.post('/', async (req, res) => {
    try {
        const driver = new Driver(req.body);
        await driver.save();
        res.status(201).json(driver);
    } catch (err) {
        res.status(400).json({ message: 'Error creating driver', error: err.message });
    }
});

// Assign ambulance to driver
router.put('/:id/assign', async (req, res) => {
    try {
        const { ambulanceId } = req.body;
        const driver = await Driver.findByIdAndUpdate(req.params.id, { ambulanceId }, { new: true });
        if (ambulanceId) {
            await Ambulance.findByIdAndUpdate(ambulanceId, { driverId: driver._id });
        }
        res.json(driver);
    } catch (err) {
        res.status(400).json({ message: 'Error assigning ambulance', error: err.message });
    }
});

// Update driver details
router.put('/:id', async (req, res) => {
    try {
        const updated = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: 'Error updating driver', error: err.message });
    }
});

// Delete driver
router.delete('/:id', async (req, res) => {
    try {
        await Driver.findByIdAndDelete(req.params.id);
        res.json({ message: 'Driver deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting driver', error: err.message });
    }
});

module.exports = router;
