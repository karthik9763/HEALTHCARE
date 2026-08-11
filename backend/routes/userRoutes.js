const express = require('express');
const router = express.Router();
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const bcrypt = require('bcryptjs');

// Get all users with search, role, and risk level filtering
router.get('/', async (req, res) => {
    try {
        const { search, role, riskLevel, isActive, isBlocked } = req.query;
        let query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { username: { $regex: search, $options: 'i' } }
            ];
        }
        if (role) query.role = role;
        if (riskLevel) query.riskLevel = riskLevel;
        if (isActive !== undefined) query.isActive = isActive === 'true';
        if (isBlocked !== undefined) query.isBlocked = isBlocked === 'true';

        const users = await User.find(query).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
});

// Admin: Edit ALL 18 Health Metrics & Medical Records for any user
router.put('/:id/health-data', async (req, res) => {
    try {
        const {
            heartRate, bloodPressureSystolic, bloodPressureDiastolic, spO2, temperature,
            bloodSugar, weight, height, bmi, sleepHours, caloriesBurned, dailySteps,
            waterIntake, stressLevel, medicalNotes, allergies, chronicDiseases, currentMedications,
            healthScore, riskLevel
        } = req.body;

        const updateFields = {
            ...(heartRate !== undefined && { heartRate }),
            ...(bloodPressureSystolic !== undefined && { bloodPressureSystolic }),
            ...(bloodPressureDiastolic !== undefined && { bloodPressureDiastolic }),
            ...(spO2 !== undefined && { spO2 }),
            ...(temperature !== undefined && { temperature }),
            ...(bloodSugar !== undefined && { bloodSugar }),
            ...(weight !== undefined && { weight }),
            ...(height !== undefined && { height }),
            ...(bmi !== undefined && { bmi }),
            ...(sleepHours !== undefined && { sleepHours }),
            ...(caloriesBurned !== undefined && { caloriesBurned }),
            ...(dailySteps !== undefined && { dailySteps }),
            ...(waterIntake !== undefined && { waterIntake }),
            ...(stressLevel !== undefined && { stressLevel }),
            ...(medicalNotes !== undefined && { medicalNotes }),
            ...(allergies !== undefined && { allergies }),
            ...(chronicDiseases !== undefined && { chronicDiseases }),
            ...(currentMedications !== undefined && { currentMedications }),
            ...(healthScore !== undefined && { healthScore }),
            ...(riskLevel !== undefined && { riskLevel })
        };

        const updated = await User.findByIdAndUpdate(req.params.id, updateFields, { new: true }).select('-password');
        
        // Log Audit Event
        await new AuditLog({
            userName: 'Admin',
            action: 'Updated 18 Health Metrics',
            details: `Updated health profile for ${updated.name} (Risk Level: ${updated.riskLevel})`
        }).save();

        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: 'Error updating health metrics', error: err.message });
    }
});

// Regular User: Strict Profile Update (ONLY Email, Phone, Password)
router.put('/profile/me', async (req, res) => {
    try {
        const { userId, email, phone, newPassword } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (newPassword) {
            user.password = await bcrypt.hash(newPassword, 10);
        }

        await user.save();
        res.json({ message: 'Profile updated successfully', user });
    } catch (err) {
        res.status(400).json({ message: 'Error updating profile', error: err.message });
    }
});

// Admin: Toggle Active / Inactive Status
router.put('/:id/toggle-active', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.isActive = !user.isActive;
        await user.save();
        res.json({ message: `User status changed to ${user.isActive ? 'Active' : 'Inactive'}`, isActive: user.isActive });
    } catch (err) {
        res.status(500).json({ message: 'Error updating active status', error: err.message });
    }
});

// Admin: Toggle Block / Unblock Status
router.put('/:id/block', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.isBlocked = !user.isBlocked;
        await user.save();
        res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, isBlocked: user.isBlocked });
    } catch (err) {
        res.status(500).json({ message: 'Error updating block status', error: err.message });
    }
});

// Admin: Reset password
router.put('/:id/reset-password', async (req, res) => {
    try {
        const { newPassword } = req.body;
        const hashedPassword = await bcrypt.hash(newPassword || 'reset12345', 10);
        await User.findByIdAndUpdate(req.params.id, { password: hashedPassword });
        res.json({ message: 'Password reset successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error resetting password', error: err.message });
    }
});

// Admin: Delete user
router.delete('/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user', error: err.message });
    }
});

module.exports = router;
