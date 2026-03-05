import React, { useState, useEffect } from 'react';
import { useParking } from '../context/ParkingContext';
import { calculateBilling, formatDuration, formatCurrency } from '../utils/billing';
import { exportAllReports, exportRevenueReport, exportOccupancyReport } from '../utils/exportData';
import RecentVehicles from '../components/RecentVehicles';

const AdminDashboard = () => {
  const { tickets, slots } = useParking();
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalVehicles: 0,
    activeVehicles: 0,
    completedVehicles: 0,
    averageDuration: 0,
    peakHour: null,
  });

  // Calculate statistics
  useEffect(() => {
    const calculateStats = () => {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      let filteredTickets = tickets;

      if (selectedPeriod === 'today') {
        filteredTickets = tickets.filter(t => new Date(t.entryTime) >= todayStart);
      } else if (selectedPeriod === 'week') {
        filteredTickets = tickets.filter(t => new Date(t.entryTime) >= weekStart);
      } else if (selectedPeriod === 'month') {
        filteredTickets = tickets.filter(t => new Date(t.entryTime) >= monthStart);
      }

      const activeTickets = tickets.filter(t => t.status === 'ACTIVE');
      const completedTickets = tickets.filter(t => t.status === 'COMPLETED');

      const totalRevenue = completedTickets.reduce((sum, t) => {
        if (t.exitTime && t.entryTime) {
          try {
            const billing = calculateBilling(t.entryTime, t.exitTime);
            const amount = billing.amountDue || 0;
            return sum + (isNaN(amount) ? 0 : amount);
          } catch (error) {
            console.error('Error calculating billing for ticket:', t.ticketId, error);
            return sum;
          }
        }
        return sum;
      }, 0);

      const averageDuration = completedTickets.length > 0
        ? completedTickets.reduce((sum, t) => {
          if (t.exitTime && t.entryTime) {
            const duration = (t.exitTime - t.entryTime) / (1000 * 60);
            return sum + (isNaN(duration) ? 0 : duration);
          }
          return sum;
        }, 0) / completedTickets.length
        : 0;

      setStats({
        totalRevenue,
        totalVehicles: filteredTickets.length,
        activeVehicles: activeTickets.length,
        completedVehicles: completedTickets.length,
        averageDuration,
        peakHour: null,
      });
    };

    calculateStats();
  }, [tickets, selectedPeriod]);

  // Auto-refresh page when new bookings detected
  useEffect(() => {
    const checkForNewBookings = () => {
      const currentTicketCount = tickets.length;
      const previousCount = localStorage.getItem('lastTicketCount');

      if (previousCount && currentTicketCount > parseInt(previousCount)) {
        // New booking detected - refresh the page
        window.location.reload();
      }

      localStorage.setItem('lastTicketCount', currentTicketCount.toString());
    };

    // Check immediately and then every 2 seconds
    checkForNewBookings();
    const bookingCheckInterval = setInterval(checkForNewBookings, 2000);

    return () => clearInterval(bookingCheckInterval);
  }, [tickets]);

  const getOccupancyRate = () => {
    const occupiedSlots = slots.filter(slot => slot.status === 'occupied').length;
    return Math.round((occupiedSlots / slots.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-blue-400">📊 Admin Dashboard</h1>
          <h2 className="text-2xl text-gray-300">Parking Management Analytics</h2>
        </header>

        {/* Period Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-1 flex">
            {['today', 'week', 'month'].map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-6 py-2 rounded-md capitalize transition-colors duration-200 ${selectedPeriod === period
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                  }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Total Revenue</span>
              <span className="text-2xl">💰</span>
            </div>
            <div className="text-3xl font-bold text-green-400">
              {formatCurrency(stats.totalRevenue)}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Total Vehicles</span>
              <span className="text-2xl">🚗</span>
            </div>
            <div className="text-3xl font-bold text-blue-400">
              {stats.totalVehicles}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Occupancy Rate</span>
              <span className="text-2xl">🅿️</span>
            </div>
            <div className="text-3xl font-bold text-orange-400">
              {getOccupancyRate()}%
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Avg Duration</span>
              <span className="text-2xl">⏱️</span>
            </div>
            <div className="text-3xl font-bold text-purple-400">
              {formatDuration(stats.averageDuration)}
            </div>
          </div>
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Recent Vehicles */}
          <RecentVehicles limit={8} showCompleted={true} />

          {/* Slot Status */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-blue-400">🅿️ Slot Status</h3>
              <button
                onClick={() => exportOccupancyReport(slots, tickets, selectedPeriod)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
              >
                📤 Export
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {slots.map(slot => (
                <div
                  key={slot.slotId}
                  className={`p-3 rounded-lg text-center font-bold transition-all duration-200 hover:scale-105 ${
                    slot.status === 'occupied'
                      ? 'bg-red-600 text-white cursor-pointer hover:bg-red-700'
                      : 'bg-green-600 text-white cursor-pointer hover:bg-green-700'
                  }`}
                  title={slot.status === 'occupied' ? `${slot.vehicleNumber} - ${slot.phone}` : 'Available'}
                >
                  <div>{slot.slotId}</div>
                  <div className="text-xs mt-1">
                    {slot.status === 'occupied' ? 'Occupied' : 'Empty'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Export Section */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
          <h3 className="text-xl font-bold mb-6 text-blue-400">📊 Export Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => exportAllReports(tickets, slots, selectedPeriod)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              📊 Export All Reports ({selectedPeriod})
            </button>
            <button
              onClick={() => exportRevenueReport(tickets, selectedPeriod)}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
            >
              💰 Revenue Report ({selectedPeriod})
            </button>
            <button
              onClick={() => exportOccupancyReport(slots, tickets, selectedPeriod)}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
            >
              🅿️ Occupancy Report ({selectedPeriod})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
