const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

class NotificationService {
  constructor() {
    logger.info('📧 Initializing email notification service...');
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD ? 'Configured' : 'Missing'
      }
    });
    logger.info('✅ Email transporter configured');
  }

  async sendCriticalAlert(request) {
    try {
      logger.warn('🚨 Preparing to send CRITICAL alert email...');
      logger.debug('Critical alert details:', {
        requestId: request._id,
        title: request.title,
        priority: request.priority,
        location: request.location
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'admin@smartservice.com',
        subject: `🚨 CRITICAL SERVICE REQUEST: ${request.title}`,
        html: `
          <h2>CRITICAL SERVICE REQUEST ALERT</h2>
          <p><strong>Request ID:</strong> ${request._id}</p>
          <p><strong>Title:</strong> ${request.title}</p>
          <p><strong>Description:</strong> ${request.description}</p>
          <p><strong>Location:</strong> ${request.location}</p>
          <p><strong>Priority:</strong> <span style="color: red;">CRITICAL</span></p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
          <p>Please take immediate action.</p>
        `
      };

      logger.info('📤 Sending critical alert email...');
      const info = await this.transporter.sendMail(mailOptions);
      logger.info('✅ Critical alert email sent successfully:', {
        messageId: info.messageId,
        to: 'admin@smartservice.com',
        subject: mailOptions.subject
      });

      return info;
    } catch (error) {
      logger.error('❌ Failed to send critical alert email:', {
        error: error.message,
        requestId: request._id,
        title: request.title
      });
      throw error;
    }
  }

  async sendSLABreach(request) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'admin@smartservice.com',
      subject: `⚠️ SLA BREACH: ${request.title}`,
      html: `
        <h2>SLA BREACH NOTIFICATION</h2>
        <p><strong>Request ID:</strong> ${request._id}</p>
        <p><strong>Title:</strong> ${request.title}</p>
        <p><strong>SLA Deadline:</strong> ${request.slaDeadline}</p>
        <p><strong>Status:</strong> ${request.status}</p>
        <p>This request has breached its SLA. Immediate escalation required.</p>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('SLA breach email sent');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async sendStatusUpdate(request, newStatus) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'user@smartservice.com',
      subject: `Status Update: ${request.title}`,
      html: `
        <h2>Request Status Update</h2>
        <p><strong>Request:</strong> ${request.title}</p>
        <p><strong>New Status:</strong> ${newStatus}</p>
        <p><strong>Request ID:</strong> ${request._id}</p>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}

module.exports = new NotificationService();
