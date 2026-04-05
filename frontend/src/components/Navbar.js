import React from 'react';
import { Menu, Plus, Zap, MessageSquare, MapPin, BarChart3 } from 'lucide-react';
import './Navbar.css';

function Navbar({ currentPage, setCurrentPage }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Zap size={28} />
        <h1>Smart Service Platform AI</h1>
      </div>
      
      <div className="navbar-menu">
        <button 
          className={`nav-btn ${currentPage === 'dashboard' ? 'active' : ''}`}
          onClick={() => setCurrentPage('dashboard')}
        >
          <BarChart3 size={20} />
          Dashboard
        </button>
        
        <button 
          className={`nav-btn ${currentPage === 'requests' ? 'active' : ''}`}
          onClick={() => setCurrentPage('requests')}
        >
          <Menu size={20} />
          Requests
        </button>
        
        <button 
          className={`nav-btn ${currentPage === 'create' ? 'active' : ''}`}
          onClick={() => setCurrentPage('create')}
        >
          <Plus size={20} />
          Create Request
        </button>
        
        <button 
          className={`nav-btn ${currentPage === 'chat' ? 'active' : ''}`}
          onClick={() => setCurrentPage('chat')}
        >
          <MessageSquare size={20} />
          AI Chat
        </button>
        
        <button 
          className={`nav-btn ${currentPage === 'map' ? 'active' : ''}`}
          onClick={() => setCurrentPage('map')}
        >
          <MapPin size={20} />
          Map View
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
