import React, { useState, useEffect } from 'react';
import { useParking } from '../context/ParkingContext';
import { calculateBilling, formatDuration, formatCurrency } from '../utils/billing';

const RecentVehicles = ({ limit = 5, showCompleted = false }) => {
  const { tickets, releaseSlot } = useParking();
  const [recentVehicles, setRecentVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const filterAndSortVehicles = () => {
      let filtered = tickets;
      
      if (!showCompleted) {
        filtered = tickets.filter(t => t.status === 'ACTIVE');
      }

      if (searchTerm) {
        filtered = filtered.filter(t => 
          t.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.slotId.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      const sorted = filtered
        .sort((a, b) => new Date(b.entryTime) - new Date(a.entryTime))
        .slice(0, limit);

      setRecentVehicles(sorted);
    };

    filterAndSortVehicles();
    const interval = setInterval(filterAndSortVehicles, 3000);
    return () => clearInterval(interval);
  }, [tickets, limit, showCompleted, searchTerm]);

  const handleQuickExit = async (ticketId) => {
    const result = releaseSlot(ticketId);
    if (result) {
      // Show success feedback
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
      audio.play().catch(() => {}); // Ignore audio errors
    }
  };

  const getDuration = (entryTime) => {
    const now = new Date();
    const entry = new Date(entryTime);
    return (now - entry) / (1000 * 60); // minutes
  };

  const getBilling = (entryTime) => {
    try {
      const now = new Date();
      return calculateBilling(entryTime, now);
    } catch {
      return { amountDue: 0, duration: 0 };
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-blue-400">
          {showCompleted ? '📋 Recent Activity' : '🚗 Recent Vehicles'}
        </h3>
        <span className="text-sm text-gray-400">
          {recentVehicles.length} {showCompleted ? 'activities' : 'vehicles'}
        </span>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by vehicle, ticket, or slot..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Vehicle List */}
      <div className="space-y-3">
        {recentVehicles.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🅿️</div>
            <p className="text-gray-400">
              {searchTerm ? 'No vehicles found' : (showCompleted ? 'No recent activity' : 'No active vehicles')}
            </p>
          </div>
        ) : (
          recentVehicles.map(vehicle => {
            const duration = getDuration(vehicle.entryTime);
            const billing = getBilling(vehicle.entryTime);
            const isCompleted = vehicle.status === 'COMPLETED';
            
            return (
              <div 
                key={vehicle.ticketId} 
                className={`bg-gray-700 rounded-lg p-4 border transition-all duration-200 hover:shadow-lg ${
                  isCompleted ? 'border-gray-600 opacity-75' : 'border-gray-500 hover:border-blue-500'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-mono text-sm text-blue-400">{vehicle.ticketId}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        isCompleted 
                          ? 'bg-gray-600 text-gray-300' 
                          : 'bg-green-900 text-green-300'
                      }`}>
                        {vehicle.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-white font-medium">{vehicle.vehicleNumber}</p>
                        <p className="text-gray-400">📞 {vehicle.phone}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-300">🅿️ Slot {vehicle.slotId}</p>
                        <p className="text-gray-400">
                          ⏱️ {formatDuration(duration)}
                        </p>
                      </div>
                    </div>

                    {!isCompleted && (
                      <div className="mt-3 pt-3 border-t border-gray-600">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-400">Current billing</p>
                            <p className="text-lg font-bold text-yellow-400">
                              {formatCurrency(billing.amountDue)}
                            </p>
                          </div>
                          <button
                            onClick={() => handleQuickExit(vehicle.ticketId)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium"
                          >
                            🚪 Quick Exit
                          </button>
                        </div>
                      </div>
                    )}

                    {isCompleted && vehicle.exitTime && (
                      <div className="mt-3 pt-3 border-t border-gray-600">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400">Exited: {new Date(vehicle.exitTime).toLocaleTimeString()}</span>
                          <span className="text-green-400 font-medium">
                            {formatCurrency(calculateBilling(vehicle.entryTime, vehicle.exitTime).amountDue)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Show More Link */}
      {tickets.length > limit && (
        <div className="mt-4 text-center">
          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
            View all vehicles →
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentVehicles;
