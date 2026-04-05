const express = require('express');
const router = express.Router();
const RequestController = require('../controllers/RequestController');

// Create request
router.post('/', RequestController.createRequest.bind(RequestController));

// Get all requests
router.get('/', RequestController.getAllRequests.bind(RequestController));

// Get single request
router.get('/:id', RequestController.getRequest.bind(RequestController));

// Update status
router.put('/:id/status', RequestController.updateStatus.bind(RequestController));

// Assign request
router.put('/:id/assign', RequestController.assignRequest.bind(RequestController));

// Add note
router.post('/:id/note', RequestController.addNote.bind(RequestController));

// Check SLA status
router.get('/check-sla/status', RequestController.checkSLAStatus.bind(RequestController));

module.exports = router;
