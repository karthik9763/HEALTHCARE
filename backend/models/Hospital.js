const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    totalBeds: { type: Number, default: 200 },
    availableBeds: { type: Number, default: 45 },
    icuBeds: { type: Number, default: 30 },
    availableIcuBeds: { type: Number, default: 8 },
    emergencyContactName: { type: String, default: 'Emergency Desk' },
    emergencyContactPhone: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Hospital', hospitalSchema);
