import React, { useState, useEffect } from 'react';

const SlotSearchFilter = ({ slots, onFilter, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [vehicleType, setVehicleType] = useState('all');

  useEffect(() => {
    const filtered = slots.filter(slot => {
      // Search by slot number
      const slotIdentifier = slot.slotId || slot.label || '';
      const matchesSearch = slotIdentifier.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by floor
      const matchesFloor = selectedFloor === 'all' || slot.floor === selectedFloor;
      
      // Filter by status
      const matchesStatus = selectedStatus === 'all' || slot.status === selectedStatus;
      
      // Filter by vehicle type
      const matchesVehicleType = vehicleType === 'all' || 
        (slot.vehicle && slot.vehicle.type === vehicleType);
      
      return matchesSearch && matchesFloor && matchesStatus && matchesVehicleType;
    });
    
    onFilter(filtered);
  }, [searchTerm, selectedFloor, selectedStatus, vehicleType, slots, onFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedFloor('all');
    setSelectedStatus('all');
    setVehicleType('all');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search Input */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Search by slot ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Floor Filter */}
        <div>
          <select
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Floors</option>
            <option value="ground">Ground Floor</option>
            <option value="first">First Floor</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
          </select>
        </div>

        {/* Vehicle Type Filter */}
        <div>
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Vehicles</option>
            <option value="car">Car</option>
            <option value="bike">Bike</option>
            <option value="suv">SUV</option>
            <option value="truck">Truck</option>
          </select>
        </div>
      </div>

      {/* Clear Filters Button */}
      {(searchTerm || selectedFloor !== 'all' || selectedStatus !== 'all' || vehicleType !== 'all') && (
        <div className="mt-3">
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Active Filters Display */}
      <div className="mt-3 flex flex-wrap gap-2">
        {searchTerm && (
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
            Search: {searchTerm}
          </span>
        )}
        {selectedFloor !== 'all' && (
          <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs">
            Floor: {selectedFloor}
          </span>
        )}
        {selectedStatus !== 'all' && (
          <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-xs">
            Status: {selectedStatus}
          </span>
        )}
        {vehicleType !== 'all' && (
          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs">
            Vehicle: {vehicleType}
          </span>
        )}
      </div>
    </div>
  );
};

export default SlotSearchFilter;
