const mongoose = require('mongoose');

const aiConfigSchema = new mongoose.Schema({
    maxHeartRate: { type: Number, default: 120 },
    minHeartRate: { type: Number, default: 50 },
    minSpO2: { type: Number, default: 92 },
    maxBP: { type: Number, default: 140 },
    minWaterIntakeLiters: { type: Number, default: 2.0 },
    minSleepHours: { type: Number, default: 6.0 },
    recoveryWindowSeconds: { type: Number, default: 300 }, // 5 minutes recovery monitoring
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AIConfig', aiConfigSchema);
