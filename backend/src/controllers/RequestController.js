const Request = require('../models/Request');
const Notification = require('../models/Notification');
const GeminiService = require('../services/GeminiService');
const NotificationService = require('../services/NotificationService');
const SLAService = require('../services/SLAService');
const logger = require('../utils/logger');

class RequestController {
  // Create a new service request
  async createRequest(req, res) {
    try {
      const { title, description, category, priority, location, latitude, longitude } = req.body;

      logger.info('📝 Creating new service request');
      logger.debug('Request data:', { title, description: description.substring(0, 100), category, priority, location });

      // Run Agentic AI Analysis
      logger.info('🤖 Running Agentic AI Analysis...');
      const aiAnalysis = await GeminiService.agenticAnalysis({
        title,
        description,
        location
      });

      // Determine final priority and category
      const finalPriority = priority === 'AUTO' ? aiAnalysis.suggestedPriority : priority;
      const finalCategory = category === 'AUTO' ? aiAnalysis.suggestedCategory : category;

      logger.info('✅ AI Analysis completed:', {
        aiPriority: aiAnalysis.suggestedPriority,
        aiCategory: aiAnalysis.suggestedCategory,
        finalPriority,
        finalCategory,
        shouldEscalate: aiAnalysis.shouldEscalate
      });

      // Calculate SLA deadline
      // logger.info('⏰ Calculating SLA deadline...');
      const slaDeadline = SLAService.calculateSLADeadline(finalPriority);
      // logger.info('📅 SLA deadline set:', { priority: finalPriority, deadline: slaDeadline });

      const request = new Request({
        title,
        description,
        category: finalCategory,
        priority: finalPriority,
        status: 'NEW',
        location,
        latitude: latitude || null,
        longitude: longitude || null,
        description_summary: aiAnalysis.summary,
        slaDeadline,
        aiAnalysis: {
          suggestedPriority: aiAnalysis.suggestedPriority,
          suggestedCategory: aiAnalysis.suggestedCategory,
          suggestedResolution: aiAnalysis.suggestedResolution,
          confidence: aiAnalysis.confidence
        }
      });

      // logger.info('💾 Saving request to database...');
      await request.save();
      // logger.info('✅ Request saved successfully:', { id: request._id, title: request.title });

      // Create notification
      // logger.info('📢 Creating notification...');
      await Notification.create({
        requestId: request._id,
        type: finalPriority === 'CRITICAL' ? 'CRITICAL_ALERT' : 'STATUS_UPDATE',
        title: `New ${finalPriority} Service Request`,
        message: `Request "${title}" has been created and categorized as ${finalCategory}`
      });
      // logger.info('✅ Notification created');

      // Send critical alert if needed
      if (aiAnalysis.shouldEscalate) {
        // logger.warn('🚨 Sending critical alert email...');
        await NotificationService.sendCriticalAlert(request);
        // logger.info('✅ Critical alert sent');
      } else {
        // logger.info('ℹ️ No critical alert needed');
      }

      // logger.info('🎉 Request creation completed successfully:', {
      //   id: request._id,
      //   title: request.title,
      //   priority: finalPriority,
      //   category: finalCategory
      // });

      res.status(201).json({
        success: true,
        request,
        aiAnalysis
      });
    } catch (error) {
      // logger.error('❌ Error creating request:', {
      //   error: error.message,
      //   stack: error.stack,
      //   requestData: { title, description: description?.substring(0, 50) }
      // });
      res.status(500).json({ error: 'Failed to create request', message: error.message });
    }
  }

  // Get all requests with filtering
  async getAllRequests(req, res) {
    try {
      const { status, category, priority, search } = req.query;
      
      let query = {};
      if (status) query.status = status;
      if (category) query.category = category;
      if (priority) query.priority = priority;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      const requests = await Request.find(query).sort({ timestamp: -1 });
      res.json({ success: true, total: requests.length, requests });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch requests', message: error.message });
    }
  }

  // Get single request
  async getRequest(req, res) {
    try {
      const request = await Request.findById(req.params.id);
      if (!request) {
        return res.status(404).json({ error: 'Request not found' });
      }
      res.json({ success: true, request });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch request', message: error.message });
    }
  }

  // Update request status
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const request = await Request.findByIdAndUpdate(
        id,
        { 
          status,
          completedAt: status === 'COMPLETED' ? new Date() : null
        },
        { new: true }
      );

      if (!request) {
        return res.status(404).json({ error: 'Request not found' });
      }

      // Create notification
      await Notification.create({
        requestId: id,
        type: 'STATUS_UPDATE',
        title: `Status Updated: ${request.title}`,
        message: `Request status changed to ${status}`
      });

      // Send email notification
      await NotificationService.sendStatusUpdate(request, status);

      res.json({ success: true, request });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update status', message: error.message });
    }
  }

  // Assign request
  async assignRequest(req, res) {
    try {
      const { id } = req.params;
      const { assignedTo } = req.body;

      const request = await Request.findByIdAndUpdate(
        id,
        { 
          assignedTo,
          status: 'ASSIGNED'
        },
        { new: true }
      );

      if (!request) {
        return res.status(404).json({ error: 'Request not found' });
      }

      await Notification.create({
        requestId: id,
        type: 'ASSIGNMENT',
        title: 'Request Assigned',
        message: `Request has been assigned to ${assignedTo}`
      });

      res.json({ success: true, request });
    } catch (error) {
      res.status(500).json({ error: 'Failed to assign request', message: error.message });
    }
  }

  // Add note to request
  async addNote(req, res) {
    try {
      const { id } = req.params;
      const { note } = req.body;

      const request = await Request.findByIdAndUpdate(
        id,
        { $push: { notes: note } },
        { new: true }
      );

      res.json({ success: true, request });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add note', message: error.message });
    }
  }

  // Check and update SLA status
  async checkSLAStatus(req, res) {
    try {
      const requests = await Request.find({ status: { $ne: 'COMPLETED' } });

      const updates = [];
      for (const request of requests) {
        if (SLAService.checkSLABreach(request.slaDeadline) && !request.breached) {
          request.breached = true;
          await request.save();

          await NotificationService.sendSLABreach(request);
          updates.push(request);
        }
      }

      res.json({ success: true, breachedRequests: updates.length, requests: updates });
    } catch (error) {
      res.status(500).json({ error: 'Failed to check SLA', message: error.message });
    }
  }
}

module.exports = new RequestController();
