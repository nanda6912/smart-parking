import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              🅿️ SmartPark
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="text-gray-300 hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              🚗 Entrance
            </Link>
            <Link 
              to="/exit" 
              className="text-gray-300 hover:text-orange-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              🚪 Exit
            </Link>
            <Link 
              to="/admin" 
              className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              📊 Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
