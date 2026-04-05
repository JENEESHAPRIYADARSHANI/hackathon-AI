import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ChevronDown, MapPin, RefreshCw } from 'lucide-react';
import './RequestList.css';

function RequestList({ requests, loading, onRefresh }) {
  const [expandedId, setExpandedId] = useState(null);
  const [filters, setFilters] = useState({ status: '', category: '', priority: '' });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const priorityColors = {
    'CRITICAL': '#ff4757',
    'HIGH': '#ffa502',
    'MEDIUM': '#ffc107',
    'LOW': '#1ee0c6'
  };

  const getPriorityLabel = (priority) => {
    const labels = { 'CRITICAL': '🚨', 'HIGH': '⚠️', 'MEDIUM': '📌', 'LOW': 'ℹ️' };
    return labels[priority] || '•';
  };

  const statusBadge = (status) => {
    const badges = {
      'NEW': { bg: '#e3f2fd', color: '#1976d2', label: 'NEW' },
      'ASSIGNED': { bg: '#f3e5f5', color: '#7b1fa2', label: 'ASSIGNED' },
      'IN_PROGRESS': { bg: '#fff3e0', color: '#f57c00', label: 'IN PROGRESS' },
      'COMPLETED': { bg: '#e8f5e9', color: '#388e3c', label: 'COMPLETED' }
    };
    const badge = badges[status] || badges['NEW'];
    return badge;
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(`${API_URL}/requests/${id}/status`, { status: newStatus });
      toast.success('Status updated');
      onRefresh();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredRequests = requests.filter(req => {
    if (filters.status && req.status !== filters.status) return false;
    if (filters.category && req.category !== filters.category) return false;
    if (filters.priority && req.priority !== filters.priority) return false;
    return true;
  });

  return (
    <div className="request-list-container">
      <div className="list-header">
        <h2>Service Requests</h2>
        <button onClick={onRefresh} className="btn-refresh">
          <RefreshCw size={20} /> Refresh
        </button>
      </div>

      <div className="filters">
        <select 
          value={filters.status} 
          onChange={(e) => setFilters({...filters, status: e.target.value})}
        >
          <option value="">All Status</option>
          <option value="NEW">NEW</option>
          <option value="ASSIGNED">ASSIGNED</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>

        <select 
          value={filters.category} 
          onChange={(e) => setFilters({...filters, category: e.target.value})}
        >
          <option value="">All Categories</option>
          <option value="TECHNICAL">Technical</option>
          <option value="FACILITY">Facility</option>
          <option value="ADMINISTRATIVE">Administrative</option>
          <option value="OTHER">Other</option>
        </select>

        <select 
          value={filters.priority} 
          onChange={(e) => setFilters({...filters, priority: e.target.value})}
        >
          <option value="">All Priority</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading requests...</div>
      ) : filteredRequests.length === 0 ? (
        <div className="empty-state">No requests found</div>
      ) : (
        <div className="requests-list">
          {filteredRequests.map((req) => {
            const badge = statusBadge(req.status);
            const isExpanded = expandedId === req._id;
            return (
              <div key={req._id} className="request-card">
                <div className="card-header" onClick={() => setExpandedId(isExpanded ? null : req._id)}>
                  <div className="header-left">
                    <span className="priority-icon" style={{ color: priorityColors[req.priority] }}>
                      {getPriorityLabel(req.priority)}
                    </span>
                    <div>
                      <h3>{req.title}</h3>
                      <p className="request-id">ID: {req._id.substring(0, 8)}</p>
                    </div>
                  </div>
                  <div className="header-right">
                    <span style={badge} className="status-badge">{badge.label}</span>
                    {req.breached && <span className="breached-badge">SLA BREACHED</span>}
                    <ChevronDown size={20} className={isExpanded ? 'rotated' : ''} />
                  </div>
                </div>

                {isExpanded && (
                  <div className="card-body">
                    <div className="info-row">
                      <label>Description:</label>
                      <p>{req.description}</p>
                    </div>

                    <div className="info-row">
                      <label>Summary:</label>
                      <p>{req.description_summary || 'N/A'}</p>
                    </div>

                    <div className="info-grid">
                      <div>
                        <label>Category:</label>
                        <p>{req.category}</p>
                      </div>
                      <div>
                        <label>Priority:</label>
                        <p>{req.priority}</p>
                      </div>
                      <div>
                        <label>Location:</label>
                        <p><MapPin size={16} /> {req.location}</p>
                      </div>
                      <div>
                        <label>Assigned To:</label>
                        <p>{req.assignedTo || 'Unassigned'}</p>
                      </div>
                    </div>

                    {req.aiAnalysis && (
                      <div className="ai-analysis">
                        <h4>🤖 AI Analysis</h4>
                        <p><strong>Suggested Priority:</strong> {req.aiAnalysis.suggestedPriority}</p>
                        <p><strong>Suggested Category:</strong> {req.aiAnalysis.suggestedCategory}</p>
                        <p><strong>Resolution:</strong> {req.aiAnalysis.suggestedResolution}</p>
                      </div>
                    )}

                    <div className="status-actions">
                      <select 
                        value={req.status}
                        onChange={(e) => handleStatusUpdate(req._id, e.target.value)}
                      >
                        <option value="NEW">NEW</option>
                        <option value="ASSIGNED">ASSIGNED</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RequestList;
