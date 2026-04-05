import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const priorityColors = {
  'CRITICAL': '#ff4757',
  'HIGH': '#ffa502',
  'MEDIUM': '#ffc107',
  'LOW': '#1ee0c6'
};

function MapView({ requests }) {
  const [mapCenter] = useState([6.9271, 80.7744]); // Colombo, Sri Lanka default
  const [requestsWithCoords, setRequestsWithCoords] = useState([]);

  useEffect(() => {
    // Mock geocoding - in production use a real geocoding API
    const mockCoords = [
      { lat: 6.9271, lng: 80.7744, name: 'Central Campus' },
      { lat: 6.9300, lng: 80.7700, name: 'Lab 1' },
      { lat: 6.9250, lng: 80.7800, name: 'Lab 2' },
      { lat: 6.9200, lng: 80.7700, name: 'Lab 3' },
    ];

    const withCoords = requests.map((req, idx) => ({
      ...req,
      latitude: req.latitude || mockCoords[idx % mockCoords.length].lat,
      longitude: req.longitude || mockCoords[idx % mockCoords.length].lng
    }));
    setRequestsWithCoords(withCoords);
  }, [requests]);

  const customIcon = (priority) => {
    return L.divIcon({
      html: `<div style="background-color: ${priorityColors[priority]}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">${priority[0]}</div>`,
      iconSize: [30, 30],
      className: 'custom-icon'
    });
  };

  return (
    <div className="map-view-container">
      <div className="map-header">
        <h2>📍 Service Requests Map</h2>
        <p>View all service requests on the map by location</p>
      </div>

      <div className="map-legend">
        {Object.entries(priorityColors).map(([priority, color]) => (
          <div key={priority} className="legend-item">
            <span style={{ background: color }} className="legend-color"></span>
            <span>{priority}</span>
          </div>
        ))}
      </div>

      <MapContainer center={mapCenter} zoom={13} className="map">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {requestsWithCoords.map((req) => (
          <Marker
            key={req._id}
            position={[req.latitude, req.longitude]}
            icon={customIcon(req.priority)}
          >
            <Popup>
              <div className="popup-content">
                <h4>{req.title}</h4>
                <p><strong>Status:</strong> {req.status}</p>
                <p><strong>Priority:</strong> {req.priority}</p>
                <p><strong>Location:</strong> {req.location}</p>
                <p><strong>Category:</strong> {req.category}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="map-info">
        <h3>Total Requests: {requestsWithCoords.length}</h3>
      </div>
    </div>
  );
}

export default MapView;
