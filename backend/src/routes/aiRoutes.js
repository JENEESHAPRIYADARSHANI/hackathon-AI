const express = require('express');
const router = express.Router();
const AIController = require('../controllers/AIController');

// Analyze request
router.post('/analyze', AIController.analyzeRequest.bind(AIController));

// Chat to request conversion
router.post('/chat', AIController.chat.bind(AIController));

// Predict priority
router.post('/priority', AIController.predictPriority.bind(AIController));

// Classify category
router.post('/classify', AIController.classifyCategory.bind(AIController));

module.exports = router;
