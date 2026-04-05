import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import './Dashboard.css';

function Dashboard({ requests }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const fetchDashboard = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard`);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    }
    setLoading(false);
  }, [API_URL]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  if (!dashboardData) {
    return <div className="dashboard-error">Failed to load dashboard</div>;
  }

  const { stats, recentRequests, breakdowns } = dashboardData;

  const statCards = [
    { 
      label: 'Total Requests', 
      value: stats.totalRequests, 
      icon: Clock, 
      gradient: 'from-blue-500 to-blue-600' 
    },
    { 
      label: 'New Requests', 
      value: stats.newRequests, 
      icon: AlertCircle, 
      gradient: 'from-yellow-500 to-yellow-600' 
    },
    { 
      label: 'Critical Issues', 
      value: stats.criticalRequests, 
      icon: AlertCircle, 
      gradient: 'from-red-500 to-red-600' 
    },
    { 
      label: 'SLA Breached', 
      value: stats.breachedSLA, 
      icon: TrendingUp, 
      gradient: 'from-orange-500 to-orange-600' 
    },
    { 
      label: 'Completed', 
      value: stats.completedRequests, 
      icon: CheckCircle, 
      gradient: 'from-green-500 to-green-600' 
    },
    { 
      label: 'In Progress', 
      value: stats.inProgressRequests, 
      icon: TrendingUp, 
      gradient: 'from-purple-500 to-purple-600' 
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>📊 Service Platform Dashboard</h1>
        <p>Real-time AI-powered service request analytics</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statCards.map((card, idx) => (
          <div key={idx} className={`stat-card gradient-${card.gradient}`}>
            <div className="stat-icon">
              <card.icon size={28} />
            </div>
            <div className="stat-content">
              <p className="stat-label">{card.label}</p>
              <h3 className="stat-value">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Priority Breakdown */}
        {breakdowns.byPriority && breakdowns.byPriority.length > 0 && (
          <div className="chart-card">
            <h3>Requests by Priority</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={breakdowns.byPriority}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#667eea" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Category Breakdown */}
        {breakdowns.byCategory && breakdowns.byCategory.length > 0 && (
          <div className="chart-card">
            <h3>Requests by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={breakdowns.byCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#764ba2" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Recent Requests */}
      <div className="recent-section">
        <h3>Recent Requests</h3>
        {recentRequests && recentRequests.length > 0 ? (
          <div className="recent-list">
            {recentRequests.slice(0, 5).map((req) => (
              <div key={req._id} className="recent-item">
                <div className="recent-info">
                  <h4>{req.title}</h4>
                  <p>{req.description.substring(0, 60)}...</p>
                  <small>{req.location}</small>
                </div>
                <div className="recent-status">
                  <span className={`priority-${req.priority.toLowerCase()}`}>
                    {req.priority}
                  </span>
                  <span className="status">{req.status}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No recent requests</p>
        )}
      </div>

      {/* AI Insights */}
      <div className="insights-section">
        <h3>🤖 AI Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>Average Resolution Time</h4>
            <p className="insight-value">
              {stats.avgResolutionTime ? `${(stats.avgResolutionTime / (1000 * 60 * 60)).toFixed(1)} hours` : 'N/A'}
            </p>
          </div>
          <div className="insight-card">
            <h4>Completion Rate</h4>
            <p className="insight-value">
              {stats.totalRequests > 0 ? `${((stats.completedRequests / stats.totalRequests) * 100).toFixed(1)}%` : '0%'}
            </p>
          </div>
          <div className="insight-card">
            <h4>Critical Priority %</h4>
            <p className="insight-value">
              {stats.totalRequests > 0 ? `${((stats.criticalRequests / stats.totalRequests) * 100).toFixed(1)}%` : '0%'}
            </p>
          </div>
          <div className="insight-card">
            <h4>SLA Compliance</h4>
            <p className="insight-value">
              {stats.totalRequests > 0 ? `${(((stats.totalRequests - stats.breachedSLA) / stats.totalRequests) * 100).toFixed(1)}%` : '0%'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
