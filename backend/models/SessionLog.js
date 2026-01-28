const mongoose = require('mongoose');
const sessionLogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    loginTime: { type: Date, default: Date.now },
    logoutTime: { type: Date },
    duration: { type: String }
});
module.exports = mongoose.model('SessionLog', sessionLogSchema);
