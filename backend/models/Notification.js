const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: {
        type: String,
        enum: ['emergency_alert', 'ambulance_assigned', 'health_advisory', 'system_notification', 'maintenance_reminder'],
        default: 'system_notification'
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    relatedEmergencyId: { type: mongoose.Schema.Types.ObjectId, ref: 'EmergencyRequest' }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
