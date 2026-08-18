const HealthRecord = require('../models/HealthRecord');
const User = require('../models/User');
const Alert = require('../models/Alert');
const EmergencyRequest = require('../models/EmergencyRequest');
const Ambulance = require('../models/Ambulance');
const Notification = require('../models/Notification');

// AI Health Rules Evaluator Engine
const analyzeVitals = (data) => {
    const { heartRate, bp, oxygen, temperature, bloodSugar, respiratoryRate } = data;
    const recommendations = [];
    const alerts = [];
    let criticalCount = 0;
    let warningCount = 0;

    let sys = 120;
    let dia = 80;
    if (bp && typeof bp === 'string' && bp.includes('/')) {
        const parts = bp.split('/');
        sys = parseInt(parts[0]) || 120;
        dia = parseInt(parts[1]) || 80;
    }

    // 1. Blood Pressure Analysis
    if (sys > 180 || dia > 120) {
        criticalCount++;
        alerts.push({
            type: 'Critical',
            title: '🚨 Hypertensive Crisis',
            parameter: 'Blood Pressure',
            value: `${sys}/${dia} mmHg`,
            message: 'Immediate medical emergency! Hypertensive Crisis detected.',
            autoAmbulance: true,
            recommendations: [
                'Immediate SOS dispatch triggered',
                'Notify emergency contacts immediately',
                'Go to nearest emergency room hospital',
                'Ambulance requested automatically',
                'Continuous vitals monitoring active'
            ]
        });
    } else if (sys > 140 || dia > 90) {
        warningCount++;
        alerts.push({
            type: 'Warning',
            title: '⚠ High Blood Pressure Detected',
            parameter: 'Blood Pressure',
            value: `${sys}/${dia} mmHg`,
            message: 'Elevated blood pressure reading.',
            showDoctorBooking: true,
            recommendations: [
                'Sit calmly for 10 minutes',
                'Drink water',
                'Avoid coffee and caffeine',
                'Avoid salty food',
                'Measure BP again after 15 minutes',
                'If BP remains high consult a doctor immediately'
            ]
        });
    }

    // 2. Heart Rate Analysis
    if (heartRate > 120) {
        warningCount++;
        alerts.push({
            type: 'Warning',
            title: '⚠ High Heart Rate',
            parameter: 'Heart Rate',
            value: `${heartRate} BPM`,
            message: 'Elevated heart rate (tachycardia) detected.',
            recommendations: [
                'Relax and sit comfortably',
                'Drink water',
                'Avoid physical activity',
                'Contact your physician if palpitations persist'
            ]
        });
    } else if (heartRate < 45) {
        criticalCount++;
        alerts.push({
            type: 'Critical',
            title: '🚨 Severe Bradycardia Alert',
            parameter: 'Heart Rate',
            value: `${heartRate} BPM`,
            message: 'Critically low heart rate detected.',
            autoAmbulance: true,
            recommendations: [
                'Emergency ambulance booking initiated',
                'Rest still and do not stand up abruptly',
                'Medical team alerted'
            ]
        });
    }

    // 3. SpO2 Oxygen Level Analysis
    const spo2Val = oxygen !== undefined ? oxygen : data.spO2 || 98;
    if (spo2Val < 90) {
        criticalCount++;
        alerts.push({
            type: 'Critical',
            title: '🚨 Oxygen Level Very Low',
            parameter: 'Oxygen Level (SpO2)',
            value: `${spo2Val}%`,
            message: 'Severe hypoxia condition detected.',
            autoAmbulance: true,
            recommendations: [
                'Visit hospital emergency room immediately',
                'Call/wait for ambulance',
                'Sit upright to assist breathing'
            ]
        });
    }

    // 4. Body Temperature Analysis
    if (temperature > 39 || temperature > 102.2) {
        warningCount++;
        alerts.push({
            type: 'Warning',
            title: '⚠ Possible High Fever',
            parameter: 'Temperature',
            value: `${temperature}°C`,
            message: 'High body temperature recorded.',
            recommendations: [
                'Drink plenty of fluids',
                'Apply cool compress',
                'Meet Doctor for evaluation'
            ]
        });
    }

    // 5. Blood Sugar Analysis
    if (bloodSugar > 250) {
        criticalCount++;
        alerts.push({
            type: 'Critical',
            title: '🚨 High Blood Sugar (Hyperglycemia)',
            parameter: 'Blood Sugar',
            value: `${bloodSugar} mg/dL`,
            message: 'Critically high blood glucose reading.',
            recommendations: [
                'Consult doctor immediately',
                'Check ketone levels if applicable',
                'Seek emergency care if symptoms worsen'
            ]
        });
    }

    // Determine overall status
    let status = 'Normal';
    let riskLevel = 'Healthy';

    if (criticalCount > 0) {
        status = 'Critical';
        riskLevel = 'Critical';
    } else if (warningCount > 0) {
        status = 'Warning';
        riskLevel = 'High Risk';
    }

    if (criticalCount > 1) {
        alerts.push({
            type: 'Critical',
            title: '🚨 Multiple Critical Parameters Detected',
            parameter: 'Multiple Vitals',
            value: `${criticalCount} Critical Readings`,
            message: 'Automated SOS, ambulance booking, admin alert, and family notification triggered.',
            autoAmbulance: true,
            recommendations: [
                'Emergency dispatch in progress',
                'Stay calm and remain seated/reclined',
                'Primary emergency contact notified'
            ]
        });
    }

    return { status, riskLevel, alerts, recommendations };
};

const addHealthRecord = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            heartRate, bp, oxygen, temperature, bloodSugar, ecgStatus, respiratoryRate
        } = req.body;

        const vitalsData = {
            heartRate: heartRate || 72,
            bp: bp || '120/80',
            oxygen: oxygen || 98,
            temperature: temperature || 36.8,
            bloodSugar: bloodSugar || 95,
            ecgStatus: ecgStatus || 'Normal Sinus Rhythm',
            respiratoryRate: respiratoryRate || 16
        };

        const analysis = analyzeVitals(vitalsData);

        // Save health record
        const record = await HealthRecord.create({
            user: userId,
            ...vitalsData,
            status: analysis.status,
            recommendations: analysis.alerts.flatMap(a => a.recommendations)
        });

        // Update User current vitals and riskLevel
        const user = await User.findById(userId);
        if (user) {
            user.heartRate = vitalsData.heartRate;
            user.spO2 = vitalsData.oxygen;
            user.temperature = vitalsData.temperature;
            user.bloodSugar = vitalsData.bloodSugar;
            user.riskLevel = analysis.riskLevel;
            if (bp && bp.includes('/')) {
                const p = bp.split('/');
                user.bloodPressureSystolic = parseInt(p[0]) || 120;
                user.bloodPressureDiastolic = parseInt(p[1]) || 80;
            }
            await user.save();
        }

        // Save Alert objects to DB
        for (const alertData of analysis.alerts) {
            await Alert.create({
                user: userId,
                userName: user?.name || 'User',
                ...alertData
            });

            // Create notification
            await Notification.create({
                userId,
                type: alertData.type === 'Critical' ? 'emergency_alert' : 'vital_warning',
                title: alertData.title,
                message: alertData.message
            });
        }

        // Handle Automatic SOS & Ambulance Booking if Critical
        let ambulanceBooking = null;
        if (analysis.status === 'Critical') {
            // Find available ambulance
            const availableAmbulance = await Ambulance.findOne({ status: 'available' });

            const emergency = await EmergencyRequest.create({
                userId,
                patientName: user?.name || 'Patient',
                patientAge: user?.age || 30,
                patientPhone: user?.phone || '+1 (555) 911-0000',
                severity: 'Critical',
                triggerReason: analysis.alerts[0]?.title || 'Critical Vitals Detected',
                description: `AI Triggered: ${analysis.alerts.map(a => a.title).join(', ')}`,
                status: availableAmbulance ? 'Booked' : 'SOS Activated',
                ambulanceId: availableAmbulance?._id,
                ambulanceReg: availableAmbulance?.registrationNumber || 'AMB-NYC-101',
                driverName: 'John Michael',
                driverPhone: '+1 (555) 321-9988',
                hospitalName: 'Central Medical Station',
                vitalsAtTrigger: {
                    heartRate: vitalsData.heartRate,
                    bloodPressure: vitalsData.bp,
                    spO2: vitalsData.oxygen,
                    temperature: vitalsData.temperature,
                    bloodSugar: vitalsData.bloodSugar,
                    respiratoryRate: vitalsData.respiratoryRate
                }
            });

            if (availableAmbulance) {
                availableAmbulance.status = 'busy';
                await availableAmbulance.save();
            }

            ambulanceBooking = emergency;
        }

        res.status(201).json({
            record,
            analysis,
            ambulanceBooking
        });
    } catch (error) {
        console.error('Error adding health record:', error);
        res.status(500).json({ message: error.message });
    }
};

const getHealthHistory = async (req, res) => {
    try {
        const { timeframe } = req.query; // 'weekly', 'monthly', 'yearly'
        let dateLimit = new Date(0);

        if (timeframe === 'weekly') {
            dateLimit = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        } else if (timeframe === 'monthly') {
            dateLimit = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        } else if (timeframe === 'yearly') {
            dateLimit = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
        }

        const history = await HealthRecord.find({
            user: req.user.id,
            timestamp: { $gte: dateLimit }
        }).sort({ timestamp: -1 });

        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getLatestHealth = async (req, res) => {
    try {
        const latest = await HealthRecord.findOne({ user: req.user.id }).sort({ timestamp: -1 });
        if (latest) {
            res.json(latest);
        } else {
            // Return fallback current user object vitals
            const user = await User.findById(req.user.id);
            res.json({
                heartRate: user?.heartRate || 72,
                bp: `${user?.bloodPressureSystolic || 120}/${user?.bloodPressureDiastolic || 80}`,
                oxygen: user?.spO2 || 98,
                temperature: user?.temperature || 36.8,
                bloodSugar: user?.bloodSugar || 95,
                respiratoryRate: 16,
                ecgStatus: 'Normal Sinus Rhythm',
                timestamp: new Date()
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAIRecommendations = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const latestRecord = await HealthRecord.findOne({ user: req.user.id }).sort({ timestamp: -1 });

        const vitalsData = {
            heartRate: latestRecord?.heartRate || user?.heartRate || 72,
            bp: latestRecord?.bp || `${user?.bloodPressureSystolic || 120}/${user?.bloodPressureDiastolic || 80}`,
            oxygen: latestRecord?.oxygen || user?.spO2 || 98,
            temperature: latestRecord?.temperature || user?.temperature || 36.8,
            bloodSugar: latestRecord?.bloodSugar || user?.bloodSugar || 95,
            respiratoryRate: latestRecord?.respiratoryRate || 16
        };

        const analysis = analyzeVitals(vitalsData);
        res.json({
            vitals: vitalsData,
            riskLevel: user?.riskLevel || analysis.riskLevel,
            analysis
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addHealthRecord,
    getHealthHistory,
    getLatestHealth,
    getAIRecommendations,
    analyzeVitals
};

