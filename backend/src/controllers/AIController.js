const GeminiService = require('../services/GeminiService');

class AIController {
  // Analyze request
  async analyzeRequest(req, res) {
    try {
      const { title, description, category, priority, location } = req.body;

      const analysis = await GeminiService.agenticAnalysis({
        title,
        description,
        category,
        priority,
        location
      });

      res.json({ success: true, analysis });
    } catch (error) {
      res.status(500).json({ error: 'Failed to analyze request', message: error.message });
    }
  }

  // Chat to request
  async chat(req, res) {
    try {
      const { message } = req.body;

      const requestData = await GeminiService.chatToRequest(message);
      res.json({ success: true, request: requestData });
    } catch (error) {
      res.status(500).json({ error: 'Failed to process chat', message: error.message });
    }
  }

  // Predict priority
  async predictPriority(req, res) {
    try {
      const { description } = req.body;
      const priority = await GeminiService.predictPriority(description);
      res.json({ success: true, priority });
    } catch (error) {
      res.status(500).json({ error: 'Failed to predict priority', message: error.message });
    }
  }

  // Classify category
  async classifyCategory(req, res) {
    try {
      const { description, title } = req.body;
      const category = await GeminiService.classifyCategory(description, title);
      res.json({ success: true, category });
    } catch (error) {
      res.status(500).json({ error: 'Failed to classify category', message: error.message });
    }
  }
}

module.exports = new AIController();
