const express = require('express');
const router = express.Router();
const EmergencyRequest = require('../models/EmergencyRequest');
const User = require('../models/User');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');

// Get all emergency alerts
router.get('/', async (req, res) => {
    try {
        const emergencies = await EmergencyRequest.find()
            .populate('userId')
            .sort({ createdAt: -1 });
        res.json(emergencies);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching emergencies', error: err.message });
    }
});

// Trigger Smart Recovery Monitoring (Starts 5-minute countdown)
router.post('/start-recovery', async (req, res) => {
    try {
        const { userId, patientName, patientPhone, severity, triggerReason, vitals } = req.body;

        const emergency = new EmergencyRequest({
            userId,
            patientName: patientName || 'Patient',
            patientPhone: patientPhone || '+1 (555) 911-0000',
            severity: severity || 'Critical',
            triggerReason: triggerReason || 'Abnormal Vitals Detected',
            description: 'Automated AI Detection: Critical vitals reading. Initiating 5-minute Smart Recovery Monitoring.',
            status: 'Monitoring Recovery',
            inRecoveryPhase: true,
            recoveryTimerSeconds: 300,
            vitalsAtTrigger: vitals || { heartRate: 118, bloodPressure: '155/98', spO2: 91, temperature: 38.2 }
        });

        await emergency.save();

        await new AuditLog({
            userName: patientName,
            action: 'Critical Health Condition Detected',
            details: `Recovery Timer started (300s). Reason: ${emergency.triggerReason}`
        }).save();

        res.status(201).json(emergency);
    } catch (err) {
        res.status(400).json({ message: 'Error triggering recovery monitoring', error: err.message });
    }
});

// Auto-cancel if vitals return to normal during recovery window
router.put('/:id/cancel-recovery', async (req, res) => {
    try {
        const emergency = await EmergencyRequest.findById(req.params.id);
        if (!emergency) return res.status(404).json({ message: 'Emergency not found' });

        emergency.status = 'Auto-Cancelled';
        emergency.inRecoveryPhase = false;
        emergency.resolvedAt = new Date();
        await emergency.save();

        await new Notification({
            userId: emergency.userId,
            type: 'health_advisory',
            title: 'Recovery Confirmed!',
            message: 'Your vitals have returned to safe normal levels. Emergency countdown auto-cancelled.'
        }).save();

        await new AuditLog({
            userName: emergency.patientName,
            action: 'Emergency Auto-Cancelled',
            details: 'Vitals normalized during 5-minute recovery window.'
        }).save();

        res.json(emergency);
    } catch (err) {
        res.status(400).json({ message: 'Error cancelling recovery', error: err.message });
    }
});

// Escalate to Full SOS (Notifies Hospital & Family)
router.put('/:id/escalate-sos', async (req, res) => {
    try {
        const emergency = await EmergencyRequest.findById(req.params.id);
        if (!emergency) return res.status(404).json({ message: 'Emergency not found' });

        emergency.status = 'SOS Activated';
        emergency.inRecoveryPhase = false;
        emergency.hospitalNotified = true;
        emergency.familyNotified = true;
        await emergency.save();

        await new Notification({
            userId: emergency.userId,
            type: 'emergency_alert',
            title: 'FULL SOS ACTIVATED!',
            message: 'Vitals remained critical. Nearest hospital and primary family contacts alerted.'
        }).save();

        await new AuditLog({
            userName: emergency.patientName,
            action: 'SOS Escalated to Hospital & Family',
            details: 'Recovery timer expired without vital normalization.'
        }).save();

        res.json(emergency);
    } catch (err) {
        res.status(400).json({ message: 'Error escalating SOS', error: err.message });
    }
});

// Mark Resolved by Admin or Hospital
router.put('/:id/resolve', async (req, res) => {
    try {
        const emergency = await EmergencyRequest.findById(req.params.id);
        if (!emergency) return res.status(404).json({ message: 'Emergency not found' });

        emergency.status = 'Resolved';
        emergency.inRecoveryPhase = false;
        emergency.resolvedAt = new Date();
        await emergency.save();

        res.json(emergency);
    } catch (err) {
        res.status(400).json({ message: 'Error resolving emergency', error: err.message });
    }
});

module.exports = router;
