const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    licenseNumber: { type: String, required: true, unique: true },
    licenseExpiry: { type: Date },
    experience: { type: Number, default: 5 }, // years
    rating: { type: Number, default: 4.8 }, // 0-5
    status: { type: String, enum: ['available', 'busy', 'offline'], default: 'available' },
    ambulanceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ambulance' },
    currentLocation: {
        latitude: Number,
        longitude: Number
    },
    completedTrips: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);
