import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Loader, MessageCircle } from 'lucide-react';
import './ChatAssistant.css';

function ChatAssistant({ onSuccess }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [structuredRequest, setStructuredRequest] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setLoading(true);

    try {
      // Convert chat to structured request
      const response = await axios.post(`${API_URL}/ai/chat`, { message: input });
      const request = response.data.request;
      setStructuredRequest(request);

      // Add AI response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I've extracted a service request from your message:\n\n📋 Title: ${request.title}\n📝 Description: ${request.description}\n📍 Location: ${request.location}\n🏷️ Category: ${request.category}`,
        structured: true
      }]);

      setInput('');
    } catch (error) {
      toast.error('Failed to process message');
      setMessages(prev => prev.slice(0, -1));
    }
    setLoading(false);
  };

  const handleSubmitRequest = async () => {
    if (!structuredRequest) return;
    
    setLoading(true);
    try {
      await axios.post(`${API_URL}/requests`, structuredRequest);
      toast.success('Request created from chat!');
      setMessages([]);
      setStructuredRequest(null);
      setInput('');
      onSuccess();
    } catch (error) {
      toast.error('Failed to create request');
    }
    setLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <MessageCircle size={24} />
        <h2>AI Chat Assistant</h2>
        <p>Describe your issue, and AI will convert it to a service request</p>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-welcome">
            <MessageCircle size={48} />
            <h3>Start a Conversation</h3>
            <p>Describe your issue in natural language, and I'll help you create a service request.</p>
            <div className="sample-prompts">
              <p>Example:</p>
              <li>"WiFi is not working in Lab 3"</li>
              <li>"Printer in building A is jammed"</li>
              <li>"Server exam system is down"</li>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              <div className="message-content">
                {msg.content}
              </div>
            </div>
          ))
        )}
      </div>

      {structuredRequest && (
        <div className="structured-request">
          <h3>📋 Extracted Request</h3>
          <div className="request-preview">
            <p><strong>Title:</strong> {structuredRequest.title}</p>
            <p><strong>Description:</strong> {structuredRequest.description}</p>
            <p><strong>Category:</strong> {structuredRequest.category}</p>
            <p><strong>Location:</strong> {structuredRequest.location}</p>
          </div>
          <button onClick={handleSubmitRequest} disabled={loading} className="btn-submit">
            {loading ? 'Creating...' : '✓ Create Request'}
          </button>
        </div>
      )}

      <div className="chat-input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Describe your issue..."
          disabled={loading}
        />
        <button onClick={handleSendMessage} disabled={loading} className="btn-send">
          {loading ? <Loader size={20} /> : '→'}
        </button>
      </div>
    </div>
  );
}

export default ChatAssistant;
