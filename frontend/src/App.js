import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import Navbar from './components/Navbar';
import RequestForm from './components/RequestForm';
import RequestList from './components/RequestList';
import Dashboard from './pages/Dashboard';
import ChatAssistant from './components/ChatAssistant';
import MapView from './components/MapView';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/requests`);
      setRequests(response.data.requests);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
    setLoading(false);
  }, [API_URL]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleRequestCreated = () => {
    fetchRequests();
    setCurrentPage('requests');
  };

  return (
    <div className="app">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <main className="main-content">
        {currentPage === 'dashboard' && <Dashboard requests={requests} />}
        
        {currentPage === 'requests' && (
          <div className="requests-page">
            <RequestList requests={requests} loading={loading} onRefresh={fetchRequests} />
          </div>
        )}
        
        {currentPage === 'create' && (
          <div className="create-page">
            <RequestForm onSuccess={handleRequestCreated} />
          </div>
        )}
        
        {currentPage === 'chat' && <ChatAssistant onSuccess={handleRequestCreated} />}
        
        {currentPage === 'map' && <MapView requests={requests} />}
      </main>
    </div>
  );
}

export default App;
