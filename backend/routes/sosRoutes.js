const express = require('express');
const router = express.Router();
const EmergencyRequest = require('../models/EmergencyRequest');
const User = require('../models/User');
const Ambulance = require('../models/Ambulance');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const { protect } = require('../middleware/authMiddleware');

// Trigger manual SOS emergency alert
router.post('/trigger', protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        const { severity, description, location } = req.body;

        // Auto-assign available ambulance if critical
        const availableAmbulance = await Ambulance.findOne({ status: 'available' });

        const emergency = new EmergencyRequest({
            userId,
            patientName: user?.name || 'Patient',
            patientAge: user?.age || 30,
            patientPhone: user?.phone || '+1 (555) 911-0000',
            location: location || {
                latitude: 40.7128,
                longitude: -74.0060,
                address: 'Current Patient Location'
            },
            severity: severity || 'Critical',
            triggerReason: 'Manual Emergency SOS Clicked',
            description: description || 'Patient triggered immediate SOS emergency button',
            status: availableAmbulance ? 'Booked' : 'SOS Activated',
            ambulanceId: availableAmbulance?._id,
            ambulanceReg: availableAmbulance?.registrationNumber || 'AMB-101-NYC',
            driverName: 'Officer Michael',
            driverPhone: '+1 (555) 321-9988',
            hospitalName: 'Central General Hospital',
            estimatedArrivalMins: 7,
            vitalsAtTrigger: {
                heartRate: user?.heartRate || 108,
                bloodPressure: `${user?.bloodPressureSystolic || 135}/${user?.bloodPressureDiastolic || 88}`,
                spO2: user?.spO2 || 96,
                temperature: user?.temperature || 37.2,
                bloodSugar: user?.bloodSugar || 110,
                respiratoryRate: 18
            }
        });

        await emergency.save();

        if (availableAmbulance) {
            availableAmbulance.status = 'busy';
            await availableAmbulance.save();
        }

        // Notify User & Admin
        await new Notification({
            userId,
            type: 'emergency_alert',
            title: '🚨 EMERGENCY SOS DISPATCHED',
            message: 'Emergency ticket generated. Nearest hospital and emergency contact notified.'
        }).save();

        await new AuditLog({
            userName: user?.name || 'User',
            action: 'SOS Emergency Ticket Generated',
            details: `Severity: ${emergency.severity} • Ticket ID: ${emergency._id}`
        }).save();

        res.status(201).json({
            message: 'SOS Emergency alert triggered successfully',
            emergency
        });
    } catch (err) {
        console.error('Error triggering SOS:', err);
        res.status(500).json({ message: 'Error triggering SOS', error: err.message });
    }
});

// Get active SOS tickets
router.get('/active', protect, async (req, res) => {
    try {
        let query = { status: { $nin: ['Resolved', 'Auto-Cancelled', 'Completed'] } };
        if (req.user.role !== 'admin') {
            query.userId = req.user.id;
        }
        const activeTickets = await EmergencyRequest.find(query).sort({ createdAt: -1 });
        res.json(activeTickets);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching active SOS tickets', error: err.message });
    }
});

// Admin update SOS status (Booked -> Accepted -> On the Way -> Reached -> Completed / Resolved)
router.put('/:id/status', protect, async (req, res) => {
    try {
        const { status, ambulanceId, hospitalName } = req.body;
        const emergency = await EmergencyRequest.findById(req.params.id);
        if (!emergency) return res.status(404).json({ message: 'Emergency request not found' });

        if (status) emergency.status = status;
        if (ambulanceId) emergency.ambulanceId = ambulanceId;
        if (hospitalName) emergency.hospitalName = hospitalName;

        if (status === 'Completed' || status === 'Resolved') {
            emergency.resolvedAt = new Date();
            if (emergency.ambulanceId) {
                await Ambulance.findByIdAndUpdate(emergency.ambulanceId, { status: 'available' });
            }
        }

        await emergency.save();
        res.json(emergency);
    } catch (err) {
        res.status(400).json({ message: 'Error updating SOS status', error: err.message });
    }
});

module.exports = router;
