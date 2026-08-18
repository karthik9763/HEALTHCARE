const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Get all doctors with optional search and specialty filter
router.get('/', async (req, res) => {
    try {
        const { specialty, search } = req.query;
        let query = {};
        if (specialty) {
            query.specialty = { $regex: specialty, $options: 'i' };
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { hospitalName: { $regex: search, $options: 'i' } },
                { specialty: { $regex: search, $options: 'i' } }
            ];
        }
        const doctors = await Doctor.find(query).sort({ rating: -1 });
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching doctors', error: err.message });
    }
});

// Admin: Add Doctor
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const doctor = new Doctor(req.body);
        await doctor.save();
        res.status(201).json(doctor);
    } catch (err) {
        res.status(400).json({ message: 'Error creating doctor', error: err.message });
    }
});

// Admin: Edit Doctor
router.put('/:id', protect, adminOnly, async (req, res) => {
    try {
        const updated = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: 'Error updating doctor', error: err.message });
    }
});

// Admin: Delete Doctor
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        await Doctor.findByIdAndDelete(req.params.id);
        res.json({ message: 'Doctor deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting doctor', error: err.message });
    }
});

module.exports = router;
