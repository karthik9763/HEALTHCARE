const express = require('express');
const router = express.Router();
const Ambulance = require('../models/Ambulance');

// Get all ambulances
router.get('/', async (req, res) => {
    try {
        const ambulances = await Ambulance.find().populate('driverId').populate('hospitalId').sort({ createdAt: -1 });
        res.json(ambulances);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching ambulances', error: err.message });
    }
});

// Create new ambulance
router.post('/', async (req, res) => {
    try {
        const ambulance = new Ambulance(req.body);
        await ambulance.save();
        res.status(201).json(ambulance);
    } catch (err) {
        res.status(400).json({ message: 'Error creating ambulance', error: err.message });
    }
});

// Update ambulance
router.put('/:id', async (req, res) => {
    try {
        const updated = await Ambulance.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: 'Error updating ambulance', error: err.message });
    }
});

// Update ambulance status
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const ambulance = await Ambulance.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(ambulance);
    } catch (err) {
        res.status(400).json({ message: 'Error updating status', error: err.message });
    }
});

// Update ambulance live location
router.put('/:id/location', async (req, res) => {
    try {
        const { latitude, longitude, address, speed } = req.body;
        const ambulance = await Ambulance.findById(req.params.id);
        if (!ambulance) return res.status(404).json({ message: 'Ambulance not found' });
        ambulance.currentLocation = {
            latitude: latitude || ambulance.currentLocation.latitude,
            longitude: longitude || ambulance.currentLocation.longitude,
            address: address || ambulance.currentLocation.address
        };
        if (speed !== undefined) ambulance.speed = speed;
        await ambulance.save();
        res.json(ambulance);
    } catch (err) {
        res.status(400).json({ message: 'Error updating location', error: err.message });
    }
});

// Record maintenance log
router.post('/:id/maintenance', async (req, res) => {
    try {
        const { details, cost } = req.body;
        const ambulance = await Ambulance.findById(req.params.id);
        if (!ambulance) return res.status(404).json({ message: 'Ambulance not found' });
        ambulance.maintenanceHistory.push({ details, cost, date: new Date() });
        ambulance.lastMaintenanceDate = new Date();
        ambulance.status = 'maintenance';
        await ambulance.save();
        res.json(ambulance);
    } catch (err) {
        res.status(400).json({ message: 'Error logging maintenance', error: err.message });
    }
});

// Delete ambulance
router.delete('/:id', async (req, res) => {
    try {
        await Ambulance.findByIdAndDelete(req.params.id);
        res.json({ message: 'Ambulance deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting ambulance', error: err.message });
    }
});

module.exports = router;
