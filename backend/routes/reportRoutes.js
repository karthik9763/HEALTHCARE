const express = require('express');
const router = express.Router();
const User = require('../models/User');
const EmergencyRequest = require('../models/EmergencyRequest');
const AuditLog = require('../models/AuditLog');
const AIConfig = require('../models/AIConfig');

// Admin Overview Stats for AI Health System
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ isActive: true });
        const inactiveUsers = await User.countDocuments({ isActive: false });
        
        // 5 AI Risk Level Counts
        const criticalUsers = await User.countDocuments({ riskLevel: 'Critical' });
        const highRiskUsers = await User.countDocuments({ riskLevel: 'High Risk' });
        const moderateRiskUsers = await User.countDocuments({ riskLevel: 'Moderate Risk' });
        const lowRiskUsers = await User.countDocuments({ riskLevel: 'Low Risk' });
        const healthyUsers = await User.countDocuments({ riskLevel: 'Healthy' });

        const emergencySOSRequests = await EmergencyRequest.countDocuments({ status: { $ne: 'Resolved' } });
        const hospitalAlerts = await EmergencyRequest.countDocuments({ hospitalNotified: true, status: { $ne: 'Resolved' } });

        res.json({
            totalUsers,
            activeUsers,
            inactiveUsers,
            criticalUsers,
            highRiskUsers,
            moderateRiskUsers,
            lowRiskUsers,
            healthyUsers,
            emergencySOSRequests,
            hospitalAlerts,
            riskDistribution: [
                { name: 'Healthy', value: healthyUsers },
                { name: 'Low Risk', value: lowRiskUsers },
                { name: 'Moderate Risk', value: moderateRiskUsers },
                { name: 'High Risk', value: highRiskUsers },
                { name: 'Critical', value: criticalUsers }
            ]
        });
    } catch (err) {
        res.status(500).json({ message: 'Error generating stats', error: err.message });
    }
});

// Audit Logs
router.get('/audit-logs', async (req, res) => {
    try {
        const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(50);
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching audit logs', error: err.message });
    }
});

// AI Configuration settings
router.get('/ai-config', async (req, res) => {
    try {
        let config = await AIConfig.findOne();
        if (!config) {
            config = await AIConfig.create({});
        }
        res.json(config);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching AI threshold config', error: err.message });
    }
});

router.put('/ai-config', async (req, res) => {
    try {
        let config = await AIConfig.findOne();
        if (!config) {
            config = new AIConfig(req.body);
        } else {
            Object.assign(config, req.body);
            config.updatedAt = new Date();
        }
        await config.save();
        res.json(config);
    } catch (err) {
        res.status(400).json({ message: 'Error updating AI config', error: err.message });
    }
});

module.exports = router;
