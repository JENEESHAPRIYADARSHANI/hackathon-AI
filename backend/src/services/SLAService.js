class SLAService {
  // Calculate SLA deadline based on priority
  calculateSLADeadline(priority) {
    const now = new Date();
    const slaHours = {
      'CRITICAL': 2,
      'HIGH': 4,
      'MEDIUM': 8,
      'LOW': 48
    };

    const hours = slaHours[priority] || 8;
    const deadline = new Date(now.getTime() + hours * 60 * 60 * 1000);
    return deadline;
  }

  // Check if SLA is breached
  checkSLABreach(slaDeadline) {
    return new Date() > new Date(slaDeadline);
  }

  // Get time remaining
  getTimeRemaining(slaDeadline) {
    const now = new Date();
    const deadline = new Date(slaDeadline);
    const diffMs = deadline - now;
    
    if (diffMs < 0) return 'BREACHED';
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  }

  // Get SLA status
  getSLAStatus(slaDeadline) {
    const now = new Date();
    const deadline = new Date(slaDeadline);
    const diffMs = deadline - now;
    const totalMs = 24 * 60 * 60 * 1000; // 24 hours for worst case
    
    const percentageRemaining = (diffMs / totalMs) * 100;
    
    if (percentageRemaining < 0) return 'BREACHED';
    if (percentageRemaining < 25) return 'CRITICAL';
    if (percentageRemaining < 50) return 'WARNING';
    return 'ON_TRACK';
  }
}

module.exports = new SLAService();
