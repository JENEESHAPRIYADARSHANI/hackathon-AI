const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const requestSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['TECHNICAL', 'FACILITY', 'ADMINISTRATIVE', 'OTHER'],
    default: 'OTHER'
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM'
  },
  status: {
    type: String,
    enum: ['NEW', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'],
    default: 'NEW'
  },
  location: {
    type: String,
    required: true
  },
  latitude: Number,
  longitude: Number,
  description_summary: String,
  assignedTo: {
    type: String,
    default: null
  },
  slaDeadline: Date,
  breached: {
    type: Boolean,
    default: false
  },
  aiAnalysis: {
    suggestedPriority: String,
    suggestedCategory: String,
    suggestedResolution: String,
    confidence: Number
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  notes: [String]
}, { _id: false });

module.exports = mongoose.model('Request', requestSchema);
