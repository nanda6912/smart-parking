import React, { useState, useEffect } from 'react';
import { useParking } from '../context/ParkingContext';
import { calculateBilling, formatDuration, formatCurrency } from '../utils/billing';

const ExitAdminPanel = () => {
  const { getTicket, releaseSlot, tickets, slots } = useParking();
  const [activeTab, setActiveTab] = useState('exit');
  const [ticketId, setTicketId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [billingInfo, setBillingInfo] = useState(null);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalVehicles: 0,
    activeVehicles: 0,
    completedVehicles: 0,
    averageDuration: 0,
    peakHour: null,
  });

  // Get active tickets only
  const activeTickets = tickets.filter(ticket => ticket.status === 'ACTIVE');

  // Auto-refresh for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update billing info for any active search result
      if (searchResult && searchResult.status === 'ACTIVE') {
        const exitTime = new Date();
        const billing = calculateBilling(searchResult.entryTime, exitTime);
        setBillingInfo({
          ...billing,
          exitTime,
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [searchResult]);

  // Auto-refresh page when new bookings detected
  useEffect(() => {
    const checkForNewBookings = () => {
      const currentTicketCount = activeTickets.length;
      const previousCount = localStorage.getItem('lastTicketCount');
      
      if (previousCount && currentTicketCount > parseInt(previousCount)) {
        window.location.reload();
      }
      
      localStorage.setItem('lastTicketCount', currentTicketCount.toString());
    };

    checkForNewBookings();
    const bookingCheckInterval = setInterval(checkForNewBookings, 2000);

    return () => clearInterval(bookingCheckInterval);
  }, [activeTickets]);

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
        window.location.reload();
      }
      
      localStorage.setItem('lastTicketCount', currentTicketCount.toString());
    };

    checkForNewBookings();
    const bookingCheckInterval = setInterval(checkForNewBookings, 2000);

    return () => clearInterval(bookingCheckInterval);
  }, [tickets]);

  const handleSearch = (e) => {
    e.preventDefault();
    setError('');
    setSearchResult(null);
    setBillingInfo(null);

    if (!ticketId.trim()) {
      setError('Please enter a Ticket ID');
      return;
    }

    const ticket = getTicket(ticketId.trim());
    if (!ticket) {
      setError('Ticket not found');
      return;
    }

    setSearchResult(ticket);
  };

  const handleProcessExit = async () => {
    if (!searchResult) return;

    setIsProcessing(true);
    setError('');

    try {
      const exitTime = new Date();
      const billing = calculateBilling(searchResult.entryTime, exitTime);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const updatedTicket = releaseSlot(searchResult.ticketId);
      if (updatedTicket) {
        setBillingInfo({
          ...billing,
          exitTime,
        });
        setSearchResult({ ...updatedTicket, status: 'COMPLETED' });
      }
    } catch (error) {
      setError('Failed to process exit. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getOccupancyRate = () => {
    const occupiedSlots = slots.filter(slot => slot.status === 'occupied').length;
    return Math.round((occupiedSlots / slots.length) * 100);
  };

  const getRecentActivity = () => {
    return tickets
      .sort((a, b) => new Date(b.entryTime) - new Date(a.entryTime))
      .slice(0, 10);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-1 flex">
            <button
              onClick={() => setActiveTab('exit')}
              className={`px-6 py-2 rounded-md transition-colors duration-200 ${
                activeTab === 'exit'
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🚪 Exit Counter
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-6 py-2 rounded-md transition-colors duration-200 ${
                activeTab === 'admin'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📊 Admin Dashboard
            </button>
          </div>
        </div>

        {/* Exit Counter Tab */}
        {activeTab === 'exit' && (
          <div>
            <header className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4 text-orange-400">🚪 Exit Counter</h1>
              <h2 className="text-2xl text-gray-300">Process Vehicle Exit</h2>
              <p className="text-gray-400 mt-2">
                Real-time monitoring of active vehicles • Click any ticket below to process exit
              </p>
              <div className="mt-4 text-sm text-gray-500">
                Active Vehicles: {activeTickets.length}
              </div>
              {activeTickets.length > 0 && (
                <div className="mt-4 inline-flex items-center px-4 py-2 bg-orange-900 bg-opacity-50 rounded-full">
                  <span className="text-orange-400 font-medium">
                    {activeTickets.length} vehicle{activeTickets.length !== 1 ? 's' : ''} currently parked
                  </span>
                </div>
              )}
            </header>

            {/* Search Section */}
            <section className="mb-12">
              <div className="max-w-md mx-auto">
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      value={ticketId}
                      onChange={(e) => setTicketId(e.target.value)}
                      placeholder="Enter Ticket ID (e.g., TKT-20260226-1234)"
                      className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                    >
                      {isProcessing ? 'Processing...' : 'Search'}
                    </button>
                  </div>
                  {error && (
                    <div className="text-red-400 text-sm mt-2">{error}</div>
                  )}
                </form>
              </div>
            </section>

            {/* Active Tickets Grid */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-300">Active Parked Vehicles</h2>
              {activeTickets.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg">No active vehicles parked</div>
                  <div className="text-gray-500 mt-2">Vehicles will appear here when parked</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeTickets.map(ticket => (
                    <div
                      key={ticket.ticketId}
                      onClick={() => {
                        setSearchResult(ticket);
                        setTicketId(ticket.ticketId);
                        setError('');
                      }}
                      className="bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-700 transition-colors duration-200 border border-gray-700"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-orange-400">{ticket.ticketId}</h3>
                          <p className="text-gray-400 text-sm">Slot: {ticket.slotId}</p>
                        </div>
                        <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">ACTIVE</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Vehicle:</span>
                          <span className="text-white font-medium">{ticket.vehicleNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Phone:</span>
                          <span className="text-white">{ticket.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Entry:</span>
                          <span className="text-white">{new Date(ticket.entryTime).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Processing Result */}
            {searchResult && (
              <section className="mb-12">
                <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-8 border border-gray-700">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-orange-400">Exit Processing</h2>
                      <p className="text-gray-400 mt-1">Ticket: {searchResult.ticketId}</p>
                    </div>
                    {searchResult.status === 'ACTIVE' && (
                      <button
                        onClick={handleProcessExit}
                        disabled={isProcessing}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                      >
                        {isProcessing ? 'Processing...' : '✅ Process Exit & Free Slot'}
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-gray-300">Vehicle Details</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Vehicle Number:</span>
                          <span className="text-white font-medium">{searchResult.vehicleNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Phone:</span>
                          <span className="text-white">{searchResult.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Parking Slot:</span>
                          <span className="text-white font-medium">{searchResult.slotId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Entry Time:</span>
                          <span className="text-white">{new Date(searchResult.entryTime).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-gray-300">Billing Information</h3>
                      {billingInfo ? (
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Exit Time:</span>
                            <span className="text-white">{new Date(billingInfo.exitTime).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Duration:</span>
                            <span className="text-white">{formatDuration(billingInfo.durationMinutes)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Hours Charged:</span>
                            <span className="text-white">{billingInfo.hoursCharged}</span>
                          </div>
                          <div className="flex justify-between text-xl font-bold">
                            <span className="text-gray-400">Total Amount:</span>
                            <span className="text-green-400">{formatCurrency(billingInfo.amountDue)}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-400">
                          {searchResult.status === 'COMPLETED' 
                            ? 'Vehicle already exited' 
                            : 'Process exit to calculate billing'
                          }
                        </div>
                      )}
                    </div>
                  </div>

                  {searchResult.status === 'COMPLETED' && (
                    <div className="mt-6 p-4 bg-green-900 bg-opacity-50 rounded-lg border border-green-700">
                      <div className="text-green-400 text-center">
                        ✅ Vehicle successfully exited at {new Date(searchResult.exitTime).toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Admin Dashboard Tab */}
        {activeTab === 'admin' && (
          <div>
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
                    className={`px-6 py-2 rounded-md capitalize transition-colors duration-200 ${
                      selectedPeriod === period
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
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 bg-green-600 rounded-lg mr-4">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-400">{formatCurrency(stats.totalRevenue)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-600 rounded-lg mr-4">
                    <span className="text-2xl">🚗</span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Vehicles</p>
                    <p className="text-2xl font-bold text-blue-400">{stats.totalVehicles}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-600 rounded-lg mr-4">
                    <span className="text-2xl">🅿️</span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Active Now</p>
                    <p className="text-2xl font-bold text-orange-400">{stats.activeVehicles}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-600 rounded-lg mr-4">
                    <span className="text-2xl">⏱️</span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Avg Duration</p>
                    <p className="text-2xl font-bold text-purple-400">{Math.round(stats.averageDuration)}m</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Occupancy Rate */}
            <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-gray-300">Current Occupancy</h3>
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Occupancy Rate</span>
                    <span className="text-white font-medium">{getOccupancyRate()}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-4">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${getOccupancyRate()}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-gray-300">Recent Activity</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-400">Ticket ID</th>
                      <th className="text-left py-3 px-4 text-gray-400">Vehicle</th>
                      <th className="text-left py-3 px-4 text-gray-400">Slot</th>
                      <th className="text-left py-3 px-4 text-gray-400">Entry Time</th>
                      <th className="text-left py-3 px-4 text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getRecentActivity().map(ticket => (
                      <tr key={ticket.ticketId} className="border-b border-gray-700">
                        <td className="py-3 px-4 text-white font-medium">{ticket.ticketId}</td>
                        <td className="py-3 px-4 text-white">{ticket.vehicleNumber}</td>
                        <td className="py-3 px-4 text-white">{ticket.slotId}</td>
                        <td className="py-3 px-4 text-white">{new Date(ticket.entryTime).toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            ticket.status === 'ACTIVE' 
                              ? 'bg-green-600 text-white' 
                              : 'bg-gray-600 text-white'
                          }`}>
                            {ticket.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExitAdminPanel;
