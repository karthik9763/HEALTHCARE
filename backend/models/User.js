const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    isActive: { type: Boolean, default: true },
    isBlocked: { type: Boolean, default: false },
    phone: { type: String, default: '+1 (555) 019-2834' },
    age: { type: Number, default: 34 },
    dob: { type: String, default: '1992-05-14' },
    gender: { type: String, default: 'Male' },
    
    // AI Risk Classification & Score
    healthScore: { type: Number, default: 85 }, // 0 - 100
    riskLevel: {
        type: String,
        enum: ['Healthy', 'Low Risk', 'Moderate Risk', 'High Risk', 'Critical'],
        default: 'Healthy'
    },

    // 18 Health Metrics
    heartRate: { type: Number, default: 72 }, // BPM
    bloodPressureSystolic: { type: Number, default: 120 },
    bloodPressureDiastolic: { type: Number, default: 80 },
    spO2: { type: Number, default: 98 }, // %
    temperature: { type: Number, default: 36.8 }, // Celsius
    bloodSugar: { type: Number, default: 95 }, // mg/dL
    weight: { type: Number, default: 72 }, // kg
    height: { type: Number, default: 175 }, // cm
    bmi: { type: Number, default: 23.5 },
    sleepHours: { type: Number, default: 7.5 },
    caloriesBurned: { type: Number, default: 2100 },
    dailySteps: { type: Number, default: 8400 },
    waterIntake: { type: Number, default: 2.8 }, // Liters
    stressLevel: { type: String, enum: ['Low', 'Moderate', 'High'], default: 'Low' },

    // Medical Details
    medicalNotes: { type: String, default: 'Routine annual checkup completed. No acute distress.' },
    allergies: { type: String, default: 'Dust mites, Penicillin' },
    chronicDiseases: { type: String, default: 'Mild Asthma' },
    currentMedications: { type: String, default: 'Albuterol inhaler (as needed)' },

    emergencyContacts: [{
        name: String,
        phone: String,
        relationship: String,
        isPrimary: Boolean
    }],

    loginHistory: [{
        timestamp: { type: Date, default: Date.now },
        ipAddress: String,
        device: String
    }],

    lastSignedIn: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
