const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    heartRate: { type: Number, required: true },
    bp: { type: String, required: true }, // e.g. "120/80"
    bloodPressureSystolic: { type: Number, default: 120 },
    bloodPressureDiastolic: { type: Number, default: 80 },
    oxygen: { type: Number, required: true }, // SpO2 %
    spO2: { type: Number },
    temperature: { type: Number, required: true }, // Celsius or Fahrenheit
    bloodSugar: { type: Number, default: 95 }, // mg/dL
    ecgStatus: { type: String, default: 'Normal Sinus Rhythm' },
    respiratoryRate: { type: Number, default: 16 }, // breaths/min
    status: { type: String, enum: ['Normal', 'Warning', 'Critical'], default: 'Normal' },
    recommendations: [{ type: String }],
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HealthRecord', healthRecordSchema);

