import React, { useState, useEffect } from 'react';
import { useParking } from '../context/ParkingContext';
import { calculateBilling, formatCurrency } from '../utils/billing';

const QuickStatsWidget = () => {
  const { tickets, slots } = useParking();
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [stats, setStats] = useState({
    activeVehicles: 0,
    availableSlots: 0,
    todayRevenue: 0,
    occupancyRate: 0
  });

  useEffect(() => {
    const calculateStats = () => {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const activeTickets = tickets.filter(t => t.status === 'ACTIVE');
      const completedToday = tickets.filter(t => 
        t.status === 'COMPLETED' && 
        new Date(t.exitTime) >= todayStart
      );
      
      const todayRevenue = completedToday.reduce((sum, t) => {
        if (t.exitTime && t.entryTime) {
          try {
            const billing = calculateBilling(t.entryTime, t.exitTime);
            return sum + (billing.amountDue || 0);
          } catch {
            return sum;
          }
        }
        return sum;
      }, 0);

      const occupiedSlots = slots.filter(slot => slot.status === 'occupied').length;
      const occupancyRate = Math.round((occupiedSlots / slots.length) * 100);

      setStats({
        activeVehicles: activeTickets.length,
        availableSlots: slots.length - occupiedSlots,
        todayRevenue,
        occupancyRate
      });
    };

    calculateStats();
    const interval = setInterval(calculateStats, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [tickets, slots]);

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-4 right-4 bg-gray-800 rounded-lg shadow-2xl border border-gray-700 z-50 transition-all duration-300 ${
      isMinimized ? 'w-16 h-16' : 'w-80'
    }`}>
      {/* Header */}
      <div className="bg-gray-700 px-4 py-2 rounded-t-lg flex justify-between items-center">
        {!isMinimized && <span className="text-sm font-bold text-blue-400">📊 Quick Stats</span>}
        <div className="flex space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-gray-400 hover:text-white transition-colors"
            title={isMinimized ? "Expand" : "Minimize"}
          >
            {isMinimized ? '📊' : '➖'}
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-red-400 transition-colors"
            title="Close"
          >
            ❌
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="p-4 space-y-3">
          {/* Active Vehicles */}
          <div className="flex justify-between items-center bg-gray-700 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🚗</span>
              <span className="text-sm text-gray-300">Active</span>
            </div>
            <span className="text-lg font-bold text-green-400">{stats.activeVehicles}</span>
          </div>

          {/* Available Slots */}
          <div className="flex justify-between items-center bg-gray-700 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🅿️</span>
              <span className="text-sm text-gray-300">Available</span>
            </div>
            <span className="text-lg font-bold text-blue-400">{stats.availableSlots}</span>
          </div>

          {/* Today's Revenue */}
          <div className="flex justify-between items-center bg-gray-700 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg">💰</span>
              <span className="text-sm text-gray-300">Today</span>
            </div>
            <span className="text-lg font-bold text-yellow-400">{formatCurrency(stats.todayRevenue)}</span>
          </div>

          {/* Occupancy Rate */}
          <div className="flex justify-between items-center bg-gray-700 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg">📈</span>
              <span className="text-sm text-gray-300">Occupancy</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-orange-400">{stats.occupancyRate}%</span>
              <div className="w-16 h-2 bg-gray-600 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-400 transition-all duration-500"
                  style={{ width: `${stats.occupancyRate}%` }}
                />
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-600">
            Updated {new Date().toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickStatsWidget;
