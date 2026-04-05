const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const notificationSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  requestId: {
    type: String,
    ref: 'Request',
    required: true
  },
  type: {
    type: String,
    enum: ['CRITICAL_ALERT', 'SLA_BREACH', 'ASSIGNMENT', 'STATUS_UPDATE', 'RESOLUTION'],
    required: true
  },
  title: String,
  message: String,
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

module.exports = mongoose.model('Notification', notificationSchema);
