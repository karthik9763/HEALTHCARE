const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// Get appointments (user's own or all if admin)
router.get('/', protect, async (req, res) => {
    try {
        let query = {};
        if (req.user.role !== 'admin') {
            query.userId = req.user.id;
        }
        const appointments = await Appointment.find(query).sort({ createdAt: -1 });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching appointments', error: err.message });
    }
});

// Book appointment
router.post('/', protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        const { doctorId, appointmentDate, appointmentTime, reason } = req.body;

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        const appointment = new Appointment({
            userId,
            userName: user?.name || 'Patient',
            userPhone: user?.phone || '+1 (555) 000-0000',
            doctorId,
            doctorName: doctor.name,
            specialty: doctor.specialty,
            hospitalName: doctor.hospitalName,
            appointmentDate: appointmentDate || new Date().toISOString().split('T')[0],
            appointmentTime: appointmentTime || '10:00 AM',
            reason: reason || 'General Health Consultation',
            status: 'Scheduled'
        });

        await appointment.save();
        res.status(201).json({
            message: 'Appointment booked successfully',
            appointment
        });
    } catch (err) {
        res.status(400).json({ message: 'Error booking appointment', error: err.message });
    }
});

// Update appointment status
router.put('/:id/status', protect, async (req, res) => {
    try {
        const { status } = req.body;
        const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(appointment);
    } catch (err) {
        res.status(400).json({ message: 'Error updating appointment status', error: err.message });
    }
});

// Cancel appointment
router.delete('/:id', protect, async (req, res) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Appointment cancelled' });
    } catch (err) {
        res.status(500).json({ message: 'Error cancelling appointment', error: err.message });
    }
});

module.exports = router;
