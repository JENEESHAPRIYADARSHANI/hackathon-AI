import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';
import './RequestForm.css';

function RequestForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'AUTO',
    priority: 'AUTO',
    location: '',
    latitude: null,
    longitude: null
  });
  const [loading, setLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getAISuggestions = async () => {
    if (!formData.title || !formData.description) {
      toast.error('Please fill in title and description');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/ai/analyze`, {
        title: formData.title,
        description: formData.description,
        category: 'AUTO',
        priority: 'AUTO',
        location: formData.location
      });
      setAiSuggestions(response.data.analysis);
      toast.success('AI Analysis Complete!');
    } catch (error) {
      toast.error('Failed to get AI suggestions');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/requests`, formData);
      toast.success('Request created successfully!');
      setFormData({
        title: '',
        description: '',
        category: 'AUTO',
        priority: 'AUTO',
        location: '',
        latitude: null,
        longitude: null
      });
      setAiSuggestions(null);
      onSuccess();
    } catch (error) {
      toast.error('Failed to create request');
    }
    setLoading(false);
  };

  return (
    <div className="request-form-container">
      <h2>Create New Service Request</h2>
      
      <form onSubmit={handleSubmit} className="request-form">
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Brief description of issue"
            required
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed description"
            rows="6"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Lab 3, Building A"
              required
            />
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select name="priority" value={formData.priority} onChange={handleChange}>
              <option value="AUTO">Let AI Decide</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="AUTO">Let AI Decide</option>
              <option value="TECHNICAL">Technical</option>
              <option value="FACILITY">Facility</option>
              <option value="ADMINISTRATIVE">Administrative</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={getAISuggestions}
            disabled={loading}
            className="btn-secondary"
          >
            {loading ? <Loader size={20} /> : '🤖 Get AI Suggestions'}
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Creating...' : '✓ Create Request'}
          </button>
        </div>
      </form>

      {aiSuggestions && (
        <div className="ai-suggestions">
          <h3>🤖 AI Analysis</h3>
          <div className="suggestion-item">
            <strong>Suggested Priority:</strong> 
            <span className={`priority-badge priority-${aiSuggestions.suggestedPriority.toLowerCase()}`}>
              {aiSuggestions.suggestedPriority}
            </span>
          </div>
          <div className="suggestion-item">
            <strong>Category:</strong> {aiSuggestions.suggestedCategory}
          </div>
          <div className="suggestion-item">
            <strong>Summary:</strong> {aiSuggestions.summary}
          </div>
          <div className="suggestion-item">
            <strong>Suggested Resolution:</strong> {aiSuggestions.suggestedResolution}
          </div>
          <div className="suggestion-item">
            <strong>Escalate:</strong> {aiSuggestions.shouldEscalate ? '⚠️ Yes - Immediate action needed' : 'No'}
          </div>
        </div>
      )}
    </div>
  );
}

export default RequestForm;
