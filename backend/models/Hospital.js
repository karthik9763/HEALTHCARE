const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    latitude: { type: Number, default: 40.7128 },
    longitude: { type: Number, default: -74.0060 },
    city: { type: String, default: 'New York' },
    phone: { type: String, required: true },
    email: { type: String },
    totalBeds: { type: Number, default: 200 },
    availableBeds: { type: Number, default: 45 },
    emergencyBeds: { type: Number, default: 30 },
    availableICUBeds: { type: Number, default: 8 },
    emergencyContactName: { type: String, default: 'Emergency Desk' },
    emergencyContactPhone: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Hospital', hospitalSchema);

