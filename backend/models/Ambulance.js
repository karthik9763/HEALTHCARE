const mongoose = require('mongoose');

const ambulanceSchema = new mongoose.Schema({
    registrationNumber: { type: String, required: true, unique: true },
    model: { type: String, required: true },
    capacity: { type: Number, default: 2 },
    status: { type: String, enum: ['available', 'busy', 'maintenance', 'offline'], default: 'available' },
    currentLocation: {
        latitude: { type: Number, default: 40.7128 },
        longitude: { type: Number, default: -74.0060 },
        address: { type: String, default: 'Central Medical Station, Downtown' }
    },
    fuelLevel: { type: Number, default: 85 }, // 0 to 100
    lastMaintenanceDate: { type: Date, default: Date.now },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
    gpsStatus: { type: String, enum: ['active', 'inactive'], default: 'active' },
    speed: { type: Number, default: 0 },
    maintenanceHistory: [{
        date: { type: Date, default: Date.now },
        details: String,
        cost: Number
    }]
}, { timestamps: true });

module.exports = mongoose.model('Ambulance', ambulanceSchema);
