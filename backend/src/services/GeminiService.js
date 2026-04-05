const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const logger = require('../utils/logger');

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

class GeminiService {
  // AI-Based Priority Prediction
  async predictPriority(description) {
    try {
      logger.info('🤖 Starting priority prediction for request');
      logger.debug('Priority prediction input:', { description: description.substring(0, 100) });

      const prompt = `Analyze the following service request description and predict the priority level.

Description: "${description}"

Based on urgency, impact, and business criticality, predict ONLY ONE of these priorities: LOW, MEDIUM, HIGH, CRITICAL

Respond with ONLY the priority level (e.g., "HIGH") and nothing else.`;

      logger.debug('Sending priority prediction prompt to Gemini API');
      const result = await model.generateContent(prompt);
      const priority = result.response.text().trim().toUpperCase();

      logger.info('✅ Priority prediction completed:', { priority, confidence: 'AI-generated' });

      if (!['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(priority)) {
        logger.warn('⚠️ Invalid priority returned, defaulting to MEDIUM:', { returned: priority });
        return 'MEDIUM';
      }
      return priority;
    } catch (error) {
      logger.error('❌ Error in predictPriority:', {
        error: error.message,
        description: description.substring(0, 50)
      });
      return 'MEDIUM';
    }
  }

  // AI Category Classification
  async classifyCategory(description, title) {
    try {
      logger.info('🏷️ Starting category classification');
      logger.debug('Category classification input:', { title, description: description.substring(0, 100) });

      const prompt = `Classify the following service request into ONE category.

Title: "${title}"
Description: "${description}"

Categories: TECHNICAL, FACILITY, ADMINISTRATIVE, OTHER

Respond with ONLY the category (e.g., "TECHNICAL") and nothing else.`;

      logger.debug('Sending category classification prompt to Gemini API');
      const result = await model.generateContent(prompt);
      const category = result.response.text().trim().toUpperCase();

      logger.info('✅ Category classification completed:', { category });

      if (!['TECHNICAL', 'FACILITY', 'ADMINISTRATIVE', 'OTHER'].includes(category)) {
        logger.warn('⚠️ Invalid category returned, defaulting to OTHER:', { returned: category });
        return 'OTHER';
      }
      return category;
    } catch (error) {
      logger.error('❌ Error in classifyCategory:', {
        error: error.message,
        title,
        description: description.substring(0, 50)
      });
      return 'OTHER';
    }
  }

  // AI Summary Generator
  async generateSummary(description) {
    try {
      logger.info('📝 Starting summary generation');
      logger.debug('Summary generation input:', { description: description.substring(0, 100) });

      const prompt = `Create a concise 1-line summary of the following issue:

"${description}"

Respond with ONLY the summary, no additional text.`;

      logger.debug('Sending summary generation prompt to Gemini API');
      const result = await model.generateContent(prompt);
      const summary = result.response.text().trim();

      logger.info('✅ Summary generation completed:', { summary: summary.substring(0, 50) });
      return summary;
    } catch (error) {
      logger.error('❌ Error in generateSummary:', {
        error: error.message,
        description: description.substring(0, 50)
      });
      return description.substring(0, 100);
    }
  }

  // GenAI Assistant - Suggest Resolution Steps
  async suggestResolution(title, description, category, priority) {
    try {
      logger.info('💡 Starting resolution suggestion generation');
      logger.debug('Resolution suggestion input:', { title, category, priority, description: description.substring(0, 100) });

      const prompt = `You are a professional IT support agent. Analyze this service request and suggest 2-3 action steps.

Title: "${title}"
Description: "${description}"
Category: ${category}
Priority: ${priority}

Provide actionable resolution steps. Be concise (max 150 words).`;

      logger.debug('Sending resolution suggestion prompt to Gemini API');
      const result = await model.generateContent(prompt);
      const suggestion = result.response.text().trim();

      logger.info('✅ Resolution suggestion completed:', { suggestion: suggestion.substring(0, 50) });
      return suggestion;
    } catch (error) {
      logger.error('❌ Error in suggestResolution:', {
        error: error.message,
        title,
        category,
        priority
      });
      return 'Unable to generate suggestion. Please contact support.';
    }
  }

  // Agentic AI Workflow - Intelligent Decision Making
  async agenticAnalysis(request) {
    try {
      const { title, description, location } = request;

      logger.info('🚀 Starting Agentic AI Workflow (5-step process)');
      logger.debug('Agentic analysis input:', { title, description: description.substring(0, 100), location });

      // Step 1: Predict Priority
      logger.info('📊 Step 1: Analyzing priority...');
      const suggestedPriority = await this.predictPriority(description);

      // Step 2: Classify Category
      logger.info('🏷️ Step 2: Classifying category...');
      const suggestedCategory = await this.classifyCategory(description, title);

      // Step 3: Generate Summary
      logger.info('📝 Step 3: Generating summary...');
      const summary = await this.generateSummary(description);

      // Step 4: Suggest Resolution
      logger.info('💡 Step 4: Generating resolution suggestions...');
      const suggestedResolution = await this.suggestResolution(title, description, suggestedCategory, suggestedPriority);

      // Step 5: Decision Making - Should escalate?
      logger.info('⚠️ Step 5: Making escalation decision...');
      let shouldEscalate = false;
      if (suggestedPriority === 'CRITICAL') {
        shouldEscalate = true;
        logger.warn('🚨 CRITICAL priority detected - ESCALATION REQUIRED');
      } else {
        logger.info('✅ Normal priority - No escalation needed');
      }

      const result = {
        suggestedPriority,
        suggestedCategory,
        summary,
        suggestedResolution,
        shouldEscalate,
        confidence: 0.92
      };

      logger.info('🎉 Agentic AI Workflow completed successfully:', {
        priority: suggestedPriority,
        category: suggestedCategory,
        escalate: shouldEscalate,
        summary: summary.substring(0, 50)
      });

      return result;
    } catch (error) {
      logger.error('❌ Error in agenticAnalysis:', {
        error: error.message,
        title,
        description: description.substring(0, 50)
      });
      return {
        suggestedPriority: 'MEDIUM',
        suggestedCategory: 'OTHER',
        summary: request.description.substring(0, 100),
        suggestedResolution: 'Unable to generate analysis',
        shouldEscalate: false,
        confidence: 0
      };
    }
  }

  // AI Chat - Convert natural language to structured request
  async chatToRequest(userMessage) {
    try {
      const prompt = `Convert the user's natural language into a structured service request JSON.

User message: "${userMessage}"

Extract and return ONLY a valid JSON object (no markdown, no extra text) with these fields:
{
  "title": "brief title",
  "description": "detailed description",
  "category": "TECHNICAL|FACILITY|ADMINISTRATIVE|OTHER",
  "priority": "AUTO (will be predicted)",
  "location": "location if mentioned, else 'Not Specified'"
}`;

      const result = await model.generateContent(prompt);
      const jsonStr = result.response.text().trim();
      
      // Try to extract JSON from response
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed;
      }
      
      // Fallback
      return {
        title: userMessage.substring(0, 50),
        description: userMessage,
        category: 'OTHER',
        priority: 'AUTO',
        location: 'Not Specified'
      };
    } catch (error) {
      console.error('Error in chatToRequest:', error);
      return {
        title: userMessage.substring(0, 50),
        description: userMessage,
        category: 'OTHER',
        priority: 'AUTO',
        location: 'Not Specified'
      };
    }
  }
}

module.exports = new GeminiService();
