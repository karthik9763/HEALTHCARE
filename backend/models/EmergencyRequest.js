const mongoose = require('mongoose');

const emergencyRequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    patientName: { type: String, required: true },
    patientAge: { type: Number },
    patientPhone: { type: String },
    location: {
        latitude: { type: Number, default: 40.7128 },
        longitude: { type: Number, default: -74.0060 },
        address: { type: String, default: 'Broadway & 4th St, NY' }
    },
    severity: {
        type: String,
        enum: ['Low', 'Mild', 'Moderate', 'High', 'Critical'],
        default: 'Critical'
    },
    triggerReason: { type: String, default: 'Abnormal Vitals Detected' },
    description: { type: String },
    status: {
        type: String,
        enum: [
            'Monitoring Recovery',
            'SOS Activated',
            'Hospital Notified',
            'Family Contacted',
            'Resolved',
            'Auto-Cancelled'
        ],
        default: 'Monitoring Recovery'
    },
    inRecoveryPhase: { type: Boolean, default: true },
    recoveryTimerSeconds: { type: Number, default: 300 }, // 5 mins
    hospitalNotified: { type: Boolean, default: false },
    familyNotified: { type: Boolean, default: false },
    vitalsAtTrigger: {
        heartRate: Number,
        bloodPressure: String,
        spO2: Number,
        temperature: Number
    },
    resolvedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('EmergencyRequest', emergencyRequestSchema);
