const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(cors());
app.use(express.json());

// 1. Request logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// 2. Global Database Guard & Settings
mongoose.set('bufferCommands', false);

app.use('/api', (req, res, next) => {
    if (mongoose.connection.readyState !== 1 && req.path !== '/health-check') {
        console.error(`[DB] Guard Block: Database is offline.`);
        return res.status(503).json({
            message: 'Database is OFFLINE. Please run START_DATABASE.bat as Administrator.'
        });
    }
    next();
});

// 3. API Routes
app.get('/', (req, res) => res.json({ message: "Health API is running" }));

app.get('/api/health-check', (req, res) => {
    res.json({
        status: 'ok',
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

// 4. Data Simulation (Real-time)
setInterval(() => {
    if (mongoose.connection.readyState === 1) {
        const data = {
            heartRate: Math.floor(Math.random() * 40) + 60,
            bp: `${Math.floor(Math.random() * 30 + 110)}/${Math.floor(Math.random() * 20 + 70)}`,
            temperature: (Math.random() * 2 + 97).toFixed(1),
            oxygen: Math.floor(Math.random() * 6) + 94,
            timestamp: new Date()
        };
        io.emit('healthUpdate', data);
    }
}, 5000);

// 5. Connection Logic with Retries
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/healthtracker';
const connectDB = () => {
    mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2000 })
        .then(() => console.log(`[DB] Connected to MongoDB.`))
        .catch(() => setTimeout(connectDB, 5000));
};
connectDB();

// 6. Start Server
const PORT = process.env.PORT || 4000;
server.listen(PORT, '127.0.0.1', () => {
    console.log(`\n=================================================`);
    console.log(`[SERVER] API RUNNING: http://127.0.0.1:${PORT}`);
    console.log(`[SERVER] HEALTH PAGE: http://127.0.0.1:${PORT}/`);
    console.log(`=================================================\n`);
});
