const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['email', 'sms', 'in-app'], required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
  retries: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
