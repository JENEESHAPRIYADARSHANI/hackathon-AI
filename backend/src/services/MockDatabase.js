/**
 * Mock Database Service
 * Provides in-memory storage for testing without MongoDB
 */

class MockDatabase {
  constructor() {
    this.requests = [
      {
        _id: '1',
        title: 'Laptop not connecting to WiFi',
        description: 'My laptop in room 205 is unable to connect to the campus WiFi network. It keeps showing "Connection Failed" error.',
        category: 'TECHNICAL',
        priority: 'HIGH',
        status: 'in_progress',
        location: 'Room 205, Building A',
        userId: 'student1',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        assignedTo: 'IT Support Team',
        estimatedResolution: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        aiSummary: 'WiFi connectivity issue affecting student productivity',
        suggestedResolution: 'Check WiFi adapter drivers and network settings'
      },
      {
        _id: '2',
        title: 'Broken desk in study area',
        description: 'One of the desks in the study area has a broken leg and is unstable.',
        category: 'FACILITY',
        priority: 'MEDIUM',
        status: 'pending',
        location: 'Study Area, 3rd Floor',
        userId: 'student1',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        assignedTo: null,
        estimatedResolution: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        aiSummary: 'Furniture repair needed in study area',
        suggestedResolution: 'Send maintenance team to assess and repair desk'
      },
      {
        _id: '3',
        title: 'Course registration deadline extension request',
        description: 'I was unable to complete my course registration due to technical issues. Can I get an extension?',
        category: 'ADMINISTRATIVE',
        priority: 'HIGH',
        status: 'resolved',
        location: 'Online',
        userId: 'student1',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        assignedTo: 'Academic Affairs',
        estimatedResolution: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        aiSummary: 'Request for academic deadline extension',
        suggestedResolution: 'Approve extension and reset registration deadline for student'
      }
    ];
    
    this.stats = {
      totalRequests: 3,
      activeRequests: 1,
      resolvedRequests: 1,
      criticalRequests: 0,
      slaCompliance: 95,
      averageResolutionTime: 24
    };
  }

  // Requests operations
  getAllRequests() {
    return Promise.resolve(this.requests);
  }

  getRequestById(id) {
    const request = this.requests.find(r => r._id === id);
    return Promise.resolve(request);
  }

  createRequest(data) {
    const newRequest = {
      _id: String(this.requests.length + 1),
      ...data,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      assignedTo: null
    };
    this.requests.push(newRequest);
    return Promise.resolve(newRequest);
  }

  updateRequestStatus(id, status) {
    const request = this.requests.find(r => r._id === id);
    if (request) {
      request.status = status;
      request.updatedAt = new Date();
    }
    return Promise.resolve(request);
  }

  getUserRequests(userId) {
    const userRequests = this.requests.filter(r => r.userId === userId);
    return Promise.resolve(userRequests);
  }

  // Dashboard operations
  getDashboardStats() {
    return Promise.resolve(this.stats);
  }

  // AI operations
  analyzePriority(description) {
    // Simple heuristic for demo
    const urgent = ['critical', 'urgent', 'emergency', 'immediately'];
    const high = ['important', 'broken', 'not working', 'error'];
    const medium = ['issue', 'problem', 'help needed'];
    
    const lowerDesc = description.toLowerCase();
    if (urgent.some(word => lowerDesc.includes(word))) return 'CRITICAL';
    if (high.some(word => lowerDesc.includes(word))) return 'HIGH';
    if (medium.some(word => lowerDesc.includes(word))) return 'MEDIUM';
    return 'LOW';
  }

  analyzeCategory(description) {
    // Simple heuristic for demo
    const technical = ['laptop', 'computer', 'network', 'internet', 'wifi', 'code', 'software', 'app'];
    const facility = ['desk', 'chair', 'light', 'room', 'broken', 'leaking', 'furniture'];
    const administrative = ['course', 'registration', 'grade', 'transcript', 'deadline'];
    
    const lowerDesc = description.toLowerCase();
    if (technical.some(word => lowerDesc.includes(word))) return 'TECHNICAL';
    if (facility.some(word => lowerDesc.includes(word))) return 'FACILITY';
    if (administrative.some(word => lowerDesc.includes(word))) return 'ADMINISTRATIVE';
    return 'OTHER';
  }
}

module.exports = new MockDatabase();
