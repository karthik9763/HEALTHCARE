const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String },
    type: { type: String, enum: ['Normal', 'Warning', 'Critical'], default: 'Warning' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    parameter: { type: String }, // e.g., 'Blood Pressure', 'Heart Rate', 'Oxygen'
    value: { type: String },
    recommendations: [{ type: String }],
    isRead: { type: Boolean, default: false },
    autoAmbulanceBooked: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', alertSchema);
