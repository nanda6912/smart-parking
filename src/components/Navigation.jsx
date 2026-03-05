import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useParking } from '../context/ParkingContext';
import { exportAllReports, exportActiveVehicles } from '../utils/exportData';

const Navigation = () => {
  const location = useLocation();
  const { tickets, slots } = useParking();
  const [showExportMenu, setShowExportMenu] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleExport = (type) => {
    switch (type) {
      case 'today':
        exportAllReports(tickets, slots, 'today');
        break;
      case 'week':
        exportAllReports(tickets, slots, 'week');
        break;
      case 'month':
        exportAllReports(tickets, slots, 'month');
        break;
      case 'active':
        exportActiveVehicles(tickets);
        break;
      default:
        break;
    }
    setShowExportMenu(false);
  };

  const getOccupancyRate = () => {
    const occupiedSlots = slots.filter(slot => slot.status === 'occupied').length;
    return Math.round((occupiedSlots / slots.length) * 100);
  };

  const activeVehicles = tickets.filter(t => t.status === 'ACTIVE').length;

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-green-400 text-xl font-bold hover:text-green-300 transition-colors"
            >
              🅿️ SmartPark
            </Link>
            
            <div className="flex space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/')
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                🚗 Entrance
              </Link>
              
              <Link
                to="/exit"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/exit')
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                🚪 Exit
              </Link>
              
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/admin')
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                📊 Admin
              </Link>

              {/* Export Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    showExportMenu
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  📤 Export
                </button>
                
                {showExportMenu && (
                  <div className="absolute top-full left-0 mt-1 bg-gray-700 rounded-lg shadow-lg border border-gray-600 z-50">
                    <div className="py-1">
                      <button
                        onClick={() => handleExport('today')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white"
                      >
                        📊 Today's Reports
                      </button>
                      <button
                        onClick={() => handleExport('week')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white"
                      >
                        📈 Weekly Reports
                      </button>
                      <button
                        onClick={() => handleExport('month')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white"
                      >
                        📅 Monthly Reports
                      </button>
                      <hr className="my-1 border-gray-600" />
                      <button
                        onClick={() => handleExport('active')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white"
                      >
                        🚗 Active Vehicles
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Quick Stats */}
            <div className="hidden md:flex items-center space-x-4 text-sm text-gray-400">
              <span>🅿️ {activeVehicles}/{slots.length}</span>
              <span>📈 {getOccupancyRate()}%</span>
            </div>
            
            <div className="text-sm text-gray-400">
              200 Slots • 100 per floor
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
