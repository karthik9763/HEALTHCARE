const HealthRecord = require('../models/HealthRecord');

const addHealthRecord = async (req, res) => {
    try {
        const { heartRate, bp, temperature, oxygen } = req.body;
        const record = await HealthRecord.create({
            user: req.user.id,
            heartRate,
            bp,
            temperature,
            oxygen
        });
        res.status(201).json(record);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getHealthHistory = async (req, res) => {
    try {
        const history = await HealthRecord.find({ user: req.user.id }).sort({ timestamp: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getLatestHealth = async (req, res) => {
    try {
        const latest = await HealthRecord.findOne({ user: req.user.id }).sort({ timestamp: -1 });
        if (latest) {
            res.json(latest);
        } else {
            res.status(404).json({ message: 'No records found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addHealthRecord,
    getHealthHistory,
    getLatestHealth
};
