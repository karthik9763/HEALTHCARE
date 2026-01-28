const User = require('../models/User');
const SessionLog = require('../models/SessionLog');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });

const registerUser = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        console.log(`[AUTH] Registration for: ${username}`);

        const exists = await User.findOne({ $or: [{ email }, { username }] });
        if (exists) {
            return res.status(400).json({ message: exists.email === email ? 'Email already registered' : 'Username taken' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        const user = await User.create({ name, username, email, password: hashed });
        const session = await SessionLog.create({ user: user._id });

        res.status(201).json({
            _id: user.id,
            name: user.name,
            token: generateToken(user.id),
            sessionId: session._id
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ $or: [{ username }, { email: username }] });

        if (user && (await bcrypt.compare(password, user.password))) {
            const session = await SessionLog.create({ user: user._id });
            res.json({
                _id: user.id,
                name: user.name,
                token: generateToken(user.id),
                sessionId: session._id
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

const logoutUser = async (req, res) => {
    try {
        const { sessionId } = req.body;
        const session = await SessionLog.findById(sessionId);
        if (session) {
            session.logoutTime = new Date();
            await session.save();
        }
        res.json({ message: 'Logged out' });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (e) { res.status(500).json({ message: e.message }); }
};

const getHistory = async (req, res) => {
    try {
        const logs = await SessionLog.find({ user: req.user.id }).sort({ loginTime: -1 });
        res.json(logs);
    } catch (e) { res.status(500).json({ message: e.message }); }
};

const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.age = req.body.age || user.age;
            user.gender = req.body.gender || user.gender;
            if (req.body.bloodGroup) {
                user.bloodGroup = req.body.bloodGroup;
                user.markModified('bloodGroup');
            }
            console.log("[AUTH] Saving user profile. Data:", req.body);
            const savedUser = await user.save();
            res.json(savedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (e) { res.status(500).json({ message: e.message }); }
};

module.exports = { registerUser, loginUser, logoutUser, getProfile, getHistory, updateProfile };
