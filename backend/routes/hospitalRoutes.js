const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');

// Get all hospitals
router.get('/', async (req, res) => {
    try {
        const hospitals = await Hospital.find().sort({ availableBeds: -1 });
        res.json(hospitals);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching hospitals', error: err.message });
    }
});

// Create hospital
router.post('/', async (req, res) => {
    try {
        const hospital = new Hospital(req.body);
        await hospital.save();
        res.status(201).json(hospital);
    } catch (err) {
        res.status(400).json({ message: 'Error creating hospital', error: err.message });
    }
});

// Update bed availability
router.put('/:id/beds', async (req, res) => {
    try {
        const { availableBeds, availableIcuBeds } = req.body;
        const hospital = await Hospital.findByIdAndUpdate(
            req.params.id,
            { availableBeds, availableIcuBeds },
            { new: true }
        );
        res.json(hospital);
    } catch (err) {
        res.status(400).json({ message: 'Error updating beds', error: err.message });
    }
});

// Update hospital details
router.put('/:id', async (req, res) => {
    try {
        const updated = await Hospital.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: 'Error updating hospital', error: err.message });
    }
});

// Delete hospital
router.delete('/:id', async (req, res) => {
    try {
        await Hospital.findByIdAndDelete(req.params.id);
        res.json({ message: 'Hospital deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting hospital', error: err.message });
    }
});

module.exports = router;
