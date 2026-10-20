require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const EmergencyRequest = require('./models/EmergencyRequest');
const Notification = require('./models/Notification');
const AuditLog = require('./models/AuditLog');
const AIConfig = require('./models/AIConfig');

async function seedData() {
    try {
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGO_URI);
        }
        console.log('Seeding Advanced AI Health System data...');

        await User.deleteMany({});
        await EmergencyRequest.deleteMany({});
        await Notification.deleteMany({});
        await AuditLog.deleteMany({});
        await AIConfig.deleteMany({});

        // 1. AI Threshold Config
        await AIConfig.create({
            maxHeartRate: 120,
            minHeartRate: 50,
            minSpO2: 92,
            maxBP: 140,
            minWaterIntakeLiters: 2.5,
            minSleepHours: 7.0,
            recoveryWindowSeconds: 300
        });

        // 2. Users across 5 Risk Levels
        const hashedAdminPass = await bcrypt.hash('Admin@123', 10);
        const hashedUserPass = await bcrypt.hash('user123', 10);

        // Admin User
        const admin = await User.create({
            name: 'System Admin',
            username: 'admin',
            email: 'admin@health.org',
            password: hashedAdminPass,
            role: 'admin',
            isActive: true,
            phone: '+1 (555) 911-0001',
            bloodGroup: 'O+',
            healthScore: 98,
            riskLevel: 'Healthy'
        });

        const Doctor = require('./models/Doctor');
        const Hospital = require('./models/Hospital');
        const Ambulance = require('./models/Ambulance');
        const HealthRecord = require('./models/HealthRecord');

        await Doctor.deleteMany({});
        await Hospital.deleteMany({});
        await Ambulance.deleteMany({});
        await HealthRecord.deleteMany({});

        // Hospitals
        const hosp1 = await Hospital.create({
            name: 'Central City Hospital',
            address: '100 Medical Center Way, Downtown',
            city: 'New York',
            phone: '+1 (555) 911-4000',
            emergencyBeds: 45,
            availableICUBeds: 12,
            latitude: 40.7128,
            longitude: -74.0060
        });

        const hosp2 = await Hospital.create({
            name: 'St. Jude Heart & Cardiac Institute',
            address: '450 Health Avenue, Midtown',
            city: 'New York',
            phone: '+1 (555) 911-8000',
            emergencyBeds: 30,
            availableICUBeds: 8,
            latitude: 40.7250,
            longitude: -73.9980
        });


        // Doctors across Disease Specialties
        await Doctor.create([
            {
                name: 'Dr. Michael Vance',
                specialty: 'Cardiology',
                qualification: 'MD, FACC',
                experienceYears: 15,
                hospitalId: hosp2._id,
                hospitalName: 'St. Jude Heart & Cardiac Institute',
                phone: '+1 (555) 345-6789',
                email: 'vance@stjude.org',
                availableHours: '09:00 AM - 04:00 PM',
                consultationFee: 75,
                rating: 4.9
            },
            {
                name: 'Dr. Sarah Jenkins',
                specialty: 'General Physician',
                qualification: 'MBBS, MD (Internal Med)',
                experienceYears: 12,
                hospitalId: hosp1._id,
                hospitalName: 'Central City Hospital',
                phone: '+1 (555) 456-7890',
                email: 'jenkins@centralhospital.org',
                availableHours: '08:00 AM - 06:00 PM',
                consultationFee: 50,
                rating: 4.8
            },
            {
                name: 'Dr. Aris Thorne',
                specialty: 'Neurologist',
                qualification: 'DM (Neurology), MD',
                experienceYears: 18,
                hospitalId: hosp1._id,
                hospitalName: 'Central City Hospital',
                phone: '+1 (555) 567-8901',
                email: 'thorne@centralhospital.org',
                availableHours: '10:00 AM - 05:00 PM',
                consultationFee: 90,
                rating: 4.95
            },
            {
                name: 'Dr. Emily Watson',
                specialty: 'Pulmonologist',
                qualification: 'MD (Chest Diseases)',
                experienceYears: 11,
                hospitalId: hosp1._id,
                hospitalName: 'Central City Hospital',
                phone: '+1 (555) 678-9012',
                email: 'watson@centralhospital.org',
                availableHours: '09:00 AM - 03:00 PM',
                consultationFee: 65,
                rating: 4.7
            }
        ]);

        // Ambulances
        await Ambulance.create([
            {
                registrationNumber: 'AMB-101-NYC',
                model: 'Ford Transit Advanced ICU',
                capacity: 2,
                status: 'available',
                hospitalId: hosp1._id,
                currentLocation: { latitude: 40.7145, longitude: -74.0070, address: 'Station 1 - Central' },
                fuelLevel: 92,
                speed: 0
            },
            {
                registrationNumber: 'AMB-202-NYC',
                model: 'Mercedes Sprinter Emergency',
                capacity: 2,
                status: 'available',
                hospitalId: hosp2._id,
                currentLocation: { latitude: 40.7200, longitude: -74.0010, address: 'Station 2 - Midtown' },
                fuelLevel: 85,
                speed: 0
            }
        ]);


        // User 1: Critical Risk Patient
        const john = await User.create({
            name: 'John Doe',
            username: 'john_doe',
            email: 'john@example.com',
            password: hashedUserPass,
            role: 'user',
            isActive: true,
            phone: '+1 (555) 234-5678',
            age: 34,
            dob: '1992-05-14',
            gender: 'Male',
            healthScore: 42,
            riskLevel: 'Critical',
            heartRate: 118,
            bloodPressureSystolic: 155,
            bloodPressureDiastolic: 98,
            spO2: 91,
            temperature: 38.2,
            bloodSugar: 145,
            weight: 84,
            height: 175,
            bmi: 27.4,
            sleepHours: 4.5,
            caloriesBurned: 1800,
            dailySteps: 2400,
            waterIntake: 1.2,
            stressLevel: 'High',
            medicalNotes: 'Severe chest tightness, poor sleep, hypertension episode.',
            allergies: 'Penicillin',
            chronicDiseases: 'Hypertension, Stage 1 Diabetes',
            currentMedications: 'Lisinopril 10mg, Metformin 500mg',
            emergencyContacts: [
                { name: 'Mary Doe', phone: '+1 (555) 987-6543', relationship: 'Spouse', isPrimary: true },
                { name: 'Dr. Robert Vance', phone: '+1 (555) 555-0199', relationship: 'Doctor', isPrimary: false }
            ]
        });

        // User 2: High Risk Patient
        const alice = await User.create({
            name: 'Alice Smith',
            username: 'alice_smith',
            email: 'alice@example.com',
            password: hashedUserPass,
            role: 'user',
            isActive: true,
            phone: '+1 (555) 876-5432',
            age: 28,
            dob: '1998-03-22',
            gender: 'Female',
            healthScore: 62,
            riskLevel: 'High Risk',
            heartRate: 104,
            bloodPressureSystolic: 138,
            bloodPressureDiastolic: 88,
            spO2: 94,
            temperature: 37.4,
            bloodSugar: 110,
            weight: 62,
            height: 165,
            bmi: 22.8,
            sleepHours: 5.5,
            caloriesBurned: 1950,
            dailySteps: 4200,
            waterIntake: 1.8,
            stressLevel: 'High',
            medicalNotes: 'Frequent asthma exacerbations during high stress.',
            allergies: 'Pollen, Dust',
            chronicDiseases: 'Asthma',
            currentMedications: 'Albuterol Inhaler'
        });

        // User 3: Moderate Risk
        const robert = await User.create({
            name: 'Robert Chen',
            username: 'robert_chen',
            email: 'robert@example.com',
            password: hashedUserPass,
            role: 'user',
            isActive: true,
            phone: '+1 (555) 333-8888',
            age: 45,
            dob: '1981-11-09',
            gender: 'Male',
            healthScore: 74,
            riskLevel: 'Moderate Risk',
            heartRate: 82,
            bloodPressureSystolic: 128,
            bloodPressureDiastolic: 84,
            spO2: 97,
            temperature: 36.7,
            bloodSugar: 105,
            weight: 78,
            height: 172,
            bmi: 26.4,
            sleepHours: 6.5,
            caloriesBurned: 2200,
            dailySteps: 6500,
            waterIntake: 2.2,
            stressLevel: 'Moderate',
            medicalNotes: 'Sedentary work schedule, borderline cholesterol.',
            allergies: 'None',
            chronicDiseases: 'Prehypertension',
            currentMedications: 'Multivitamins'
        });

        // User 4: Low Risk
        const emma = await User.create({
            name: 'Emma Watson',
            username: 'emma_w',
            email: 'emma@example.com',
            password: hashedUserPass,
            role: 'user',
            isActive: true,
            phone: '+1 (555) 777-2222',
            age: 31,
            dob: '1995-07-18',
            gender: 'Female',
            healthScore: 88,
            riskLevel: 'Low Risk',
            heartRate: 70,
            bloodPressureSystolic: 118,
            bloodPressureDiastolic: 76,
            spO2: 99,
            temperature: 36.6,
            bloodSugar: 88,
            weight: 58,
            height: 168,
            bmi: 20.5,
            sleepHours: 7.8,
            caloriesBurned: 2400,
            dailySteps: 9800,
            waterIntake: 2.9,
            stressLevel: 'Low',
            medicalNotes: 'Regular marathon runner.',
            allergies: 'Peanuts',
            chronicDiseases: 'None',
            currentMedications: 'None'
        });

        // User 5: Healthy
        const michael = await User.create({
            name: 'Michael Jordan',
            username: 'michael_j',
            email: 'michael@example.com',
            password: hashedUserPass,
            role: 'user',
            isActive: true,
            phone: '+1 (555) 999-1111',
            age: 26,
            dob: '2000-01-15',
            gender: 'Male',
            healthScore: 96,
            riskLevel: 'Healthy',
            heartRate: 64,
            bloodPressureSystolic: 115,
            bloodPressureDiastolic: 74,
            spO2: 100,
            temperature: 36.5,
            bloodSugar: 82,
            weight: 75,
            height: 182,
            bmi: 22.6,
            sleepHours: 8.2,
            caloriesBurned: 2800,
            dailySteps: 12500,
            waterIntake: 3.5,
            stressLevel: 'Low',
            medicalNotes: 'Peak physical condition.',
            allergies: 'None',
            chronicDiseases: 'None',
            currentMedications: 'None'
        });

        // 3. Active Emergency with Smart Recovery Timer
        await EmergencyRequest.create({
            userId: john._id,
            patientName: 'John Doe',
            patientAge: 34,
            patientPhone: '+1 (555) 234-5678',
            severity: 'Critical',
            triggerReason: 'Critical HR (118 BPM) & Low SpO2 (91%)',
            description: 'Automated AI Detection: Extreme HR and hypoxia detected. 5-minute Smart Recovery Monitoring active.',
            status: 'Monitoring Recovery',
            inRecoveryPhase: true,
            recoveryTimerSeconds: 275,
            vitalsAtTrigger: {
                heartRate: 118,
                bloodPressure: '155/98',
                spO2: 91,
                temperature: 38.2
            }
        });

        // 4. Audit Logs
        await AuditLog.create({
            userId: admin._id,
            userName: 'Dr. Sarah Connor',
            action: 'Updated AI Risk Thresholds',
            details: 'Max HR set to 120 BPM, Min SpO2 set to 92%'
        });

        await AuditLog.create({
            userId: john._id,
            userName: 'John Doe',
            action: 'Critical Health Condition Detected',
            details: 'Triggered 5-minute Smart Recovery Monitoring'
        });

        console.log('AI Health System seeded successfully!');
    } catch (err) {
        console.error('Error seeding AI Health data:', err);
    }
}

module.exports = seedData;
