import React, { useState, useEffect } from 'react';

const RecentVehicles = ({ tickets, onVehicleSelect, className = '' }) => {
  const [recentVehicles, setRecentVehicles] = useState([]);
  const [filter, setFilter] = useState('all'); // all, today, week

  useEffect(() => {
    if (!tickets) return;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    let filtered = tickets.filter(ticket => {
      const entryTime = new Date(ticket.entryTime);
      
      switch (filter) {
        case 'today':
          return entryTime >= today;
        case 'week':
          return entryTime >= weekAgo;
        default:
          return true;
      }
    });

    // Sort by entry time (most recent first)
    filtered.sort((a, b) => new Date(b.entryTime) - new Date(a.entryTime));

    // Take only the most recent 10
    setRecentVehicles(filtered.slice(0, 10));
  }, [tickets, filter]);

  const formatDuration = (entryTime, exitTime = null) => {
    const start = new Date(entryTime);
    const end = exitTime ? new Date(exitTime) : new Date();
    const duration = Math.floor((end - start) / (1000 * 60)); // minutes
    
    if (duration < 60) {
      return `${duration} min`;
    } else {
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return `${hours}h ${minutes}m`;
    }
  };

  const getVehicleIcon = (vehicleType) => {
    switch (vehicleType?.toLowerCase()) {
      case 'car': return '🚗';
      case 'bike': return '🏍️';
      case 'suv': return '🚙';
      case 'truck': return '🚚';
      default: return '🚗';
    }
  };

  const getStatusBadge = (ticket) => {
    if (ticket.exitTime) {
      return (
        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs">
          Completed
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs">
          Active
        </span>
      );
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Recent Vehicles
        </h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
        </select>
      </div>

      {recentVehicles.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">🚗</div>
          <p>No vehicles found</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {recentVehicles.map((ticket) => (
            <div
              key={ticket.ticketId}
              onClick={() => onVehicleSelect && onVehicleSelect(ticket)}
              className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {getVehicleIcon(ticket.vehicle?.type)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-200">
                      {ticket.vehicle?.number || 'Unknown'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Slot: {ticket.slotId || ticket.slotNumber} • {formatDuration(ticket.entryTime, ticket.exitTime)}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      {ticket.vehicle?.phone && `📱 ${ticket.vehicle.phone}`}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {getStatusBadge(ticket)}
                  {ticket.amount && (
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1">
                      ₹{ticket.amount}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {recentVehicles.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Showing {recentVehicles.length} most recent vehicles
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentVehicles;
