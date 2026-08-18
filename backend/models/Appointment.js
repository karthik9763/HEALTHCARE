const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    userPhone: { type: String },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    doctorName: { type: String, required: true },
    specialty: { type: String },
    hospitalName: { type: String },
    appointmentDate: { type: String, required: true }, // YYYY-MM-DD
    appointmentTime: { type: String, required: true }, // HH:MM
    reason: { type: String, default: 'General Consultation' },
    status: { type: String, enum: ['Scheduled', 'Confirmed', 'Completed', 'Cancelled'], default: 'Scheduled' },
    notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
