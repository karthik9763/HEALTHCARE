require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }
});

app.use(cors());
app.use(express.json());

// 1. Request logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// 2. Database Connection Logic
const seedData = require('./seed');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`[DB] Connected to MongoDB.`);
        // Run seed on boot if database is empty
        await seedData();
    } catch (err) {
        console.log(`[DB] MongoDB connection fallback active or retrying...`);
        setTimeout(connectDB, 10000);
    }
};
connectDB();

// 3. API Routes
app.get('/', (req, res) => res.json({ message: "AI Ambulance Tracking & Emergency System API is running" }));

app.get('/api/health-check', (req, res) => {
    res.json({
        status: 'ok',
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected / Pending'
    });
});

// Seed endpoint for manual trigger
app.post('/api/seed', async (req, res) => {
    try {
        await seedData();
        res.json({ message: 'Seed data generated successfully!' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to seed data', error: err.message });
    }
});

// Mount Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const healthRoutes = require('./routes/healthRoutes');
const alertRoutes = require('./routes/alertRoutes');
const sosRoutes = require('./routes/sosRoutes');
const ambulanceRoutes = require('./routes/ambulanceRoutes');
const driverRoutes = require('./routes/driverRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');
const reportRoutes = require('./routes/reportRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/ambulances', ambulanceRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/emergencies', emergencyRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);

// Legacy fallback routes for compatibility
app.use('/api', authRoutes);


// 4. Real-time Simulation Engine (Socket.IO)
// Simulates live moving ambulance position and live patient vitals every 3 seconds
let simLat = 40.7145;
let simLng = -74.0070;
let step = 0;

setInterval(() => {
    step = (step + 1) % 100;
    simLat += (Math.random() - 0.48) * 0.0004;
    simLng += (Math.random() - 0.48) * 0.0004;

    const liveTelemetry = {
        ambulanceId: "AMB-101-NYC",
        latitude: parseFloat(simLat.toFixed(5)),
        longitude: parseFloat(simLng.toFixed(5)),
        speed: Math.floor(Math.random() * 25) + 35, // km/h
        heartRate: Math.floor(Math.random() * 30) + 70,
        bloodPressure: `${Math.floor(Math.random() * 20 + 115)}/${Math.floor(Math.random() * 15 + 75)}`,
        spO2: Math.floor(Math.random() * 4) + 96,
        temperature: (Math.random() * 1.5 + 36.5).toFixed(1),
        bloodSugar: Math.floor(Math.random() * 25) + 85,
        estimatedArrival: `${Math.max(1, 8 - Math.floor(step / 15))} mins`,
        distanceRemaining: (Math.max(0.2, 3.5 - step * 0.03)).toFixed(1),
        timestamp: new Date()
    };

    io.emit('telemetryUpdate', liveTelemetry);
    io.emit('healthUpdate', liveTelemetry);
}, 3000);

// Socket connection
io.on('connection', (socket) => {
    console.log(`[SOCKET] Client connected: ${socket.id}`);
    socket.on('disconnect', () => {
        console.log(`[SOCKET] Client disconnected: ${socket.id}`);
    });
});

// 5. Start Server
app.listen = (...args) => server.listen(...args);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
