// client/src/components/Notifications.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function Notifications() {
  const [alerts, setAlerts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { authHeader } = useAuth();

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/notifications', {
          headers: authHeader()
        });
        setAlerts(res.data);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };

    fetchAlerts();
  }, [authHeader]);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  return (
    <div className="notifications">
      <button onClick={() => setIsOpen(!isOpen)}>
        🔔 {alerts.length > 0 ? `(${alerts.length})` : ''}
      </button>
      {isOpen && (
        <div className="notifications-dropdown">
          {alerts.length === 0 ? (
            <p>No upcoming alerts.</p>
          ) : (
            <ul>
              {alerts.map((alert) => (
                <li key={`${alert.type}-${alert.id}`}>
                  <strong>{alert.name}</strong>: Upcoming {alert.type} on {formatDate(alert.date)}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default Notifications;