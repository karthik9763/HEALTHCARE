const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialty: {
        type: String,
        required: true,
        enum: ['Cardiology', 'General Physician', 'Neurologist', 'Pulmonologist', 'Endocrinologist', 'Emergency Specialist', 'Pediatrics']
    },
    qualification: { type: String, default: 'MD, MBBS' },
    experienceYears: { type: Number, default: 10 },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
    hospitalName: { type: String, default: 'Central City Hospital' },
    phone: { type: String, required: true },
    email: { type: String },
    availableDays: [{ type: String }], // e.g. ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    availableHours: { type: String, default: '09:00 AM - 05:00 PM' },
    consultationFee: { type: Number, default: 50 },
    rating: { type: Number, default: 4.8 },
    status: { type: String, enum: ['Available', 'Busy', 'On Leave', 'Offline'], default: 'Available' }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
