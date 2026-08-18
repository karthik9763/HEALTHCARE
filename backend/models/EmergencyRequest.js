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
            'Booked',
            'Accepted',
            'On the Way',
            'Reached',
            'Completed',
            'Hospital Notified',
            'Family Contacted',
            'Resolved',
            'Auto-Cancelled'
        ],
        default: 'SOS Activated'
    },
    ambulanceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ambulance' },
    ambulanceReg: { type: String },
    driverName: { type: String },
    driverPhone: { type: String },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
    hospitalName: { type: String },
    estimatedArrivalMins: { type: Number, default: 8 },
    inRecoveryPhase: { type: Boolean, default: false },
    recoveryTimerSeconds: { type: Number, default: 300 },
    hospitalNotified: { type: Boolean, default: true },
    familyNotified: { type: Boolean, default: true },
    vitalsAtTrigger: {
        heartRate: Number,
        bloodPressure: String,
        spO2: Number,
        temperature: Number,
        bloodSugar: Number,
        respiratoryRate: Number
    },
    resolvedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('EmergencyRequest', emergencyRequestSchema);

