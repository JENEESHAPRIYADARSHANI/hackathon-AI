const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/DashboardController');

// Get dashboard data
router.get('/', DashboardController.getDashboard.bind(DashboardController));

module.exports = router;
