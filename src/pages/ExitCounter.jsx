import React, { useState, useEffect } from 'react';
import { useParking } from '../context/ParkingContext';
import { useToast } from '../components/ToastContainer';
import { calculateBilling, formatDuration, formatCurrency } from '../utils/billing';
import RecentVehicles from '../components/RecentVehicles';
import { exportTicketsToCSV, generateDailyReport } from '../utils/exportData';

const ExitCounter = () => {
  const { getTicket, releaseSlot, tickets, slots } = useParking();
  const { showSuccess, showError, showInfo } = useToast();
  const [ticketId, setTicketId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [billingInfo, setBillingInfo] = useState(null);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Get active tickets only - this will update automatically when tickets change
  const activeTickets = tickets.filter(ticket => ticket.status === 'ACTIVE');

  // Auto-refresh for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(Date.now());
      
      // Update billing info for any active search result
      if (searchResult && searchResult.status === 'ACTIVE') {
        const exitTime = new Date();
        const billing = calculateBilling(searchResult.entryTime, exitTime);
        setBillingInfo({
          ...billing,
          exitTime,
        });
      }
    }, 3000); // Update every 3 seconds for better responsiveness

    return () => clearInterval(interval);
  }, [searchResult]);

  // Auto-refresh page when new bookings detected
  useEffect(() => {
    const checkForNewBookings = () => {
      const currentTicketCount = activeTickets.length;
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
  }, [activeTickets]);

  const handleSearch = (e) => {
    e.preventDefault();
    setError('');
    setSearchResult(null);
    
    if (!ticketId.trim()) {
      showError('Please enter a ticket ID');
      return;
    }

    const ticket = getTicket(ticketId.trim());
    if (!ticket) {
      setError('Ticket not found');
      setSearchResult(null);
      setBillingInfo(null);
      showError('Ticket not found');
      return;
    }

    if (ticket.status === 'COMPLETED') {
      setError('This ticket has already been processed');
      setSearchResult(null);
      setBillingInfo(null);
      showInfo('This ticket has already been processed');
      return;
    }

    setSearchResult(ticket);
    const exitTime = new Date();
    const billing = calculateBilling(ticket.entryTime, exitTime);
    setBillingInfo({
      ...billing,
      exitTime,
    });
    setError('');
    showSuccess('Ticket found!');
  };

  const handleConfirmExit = () => {
    if (!searchResult || !billingInfo) return;

    setIsProcessing(true);
    
    try {
      const updatedTicket = releaseSlot(searchResult.ticketId);
      
      if (updatedTicket) {
        setSearchResult({ ...searchResult, status: 'COMPLETED', exitTime: billingInfo.exitTime });
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Error processing exit:', error);
      setError('Error processing exit. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setTicketId('');
    setSearchResult(null);
    setBillingInfo(null);
    setError('');
    setIsProcessing(false);
  };

  const handleVehicleSelect = (ticket) => {
    setTicketId(ticket.ticketId);
    setSearchResult(ticket);
    const exitTime = new Date();
    const billing = calculateBilling(ticket.entryTime, exitTime);
    setBillingInfo({
      ...billing,
      exitTime,
    });
    setError('');
    showSuccess(`Selected ticket: ${ticket.ticketId}`);
  };

  const handleExportData = (type) => {
    try {
      switch (type) {
        case 'today':
          exportTicketsToCSV(tickets, 'today');
          showSuccess('Today\'s tickets exported successfully');
          break;
        case 'week':
          exportTicketsToCSV(tickets, 'week');
          showSuccess('Weekly tickets exported successfully');
          break;
        case 'daily':
          generateDailyReport(slots, tickets);
          showSuccess('Daily report generated successfully');
          break;
        default:
          showError('Invalid export type');
      }
    } catch (error) {
      console.error('Export error:', error);
      showError('Failed to export data');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
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

        {/* Real-time Active Tickets Display */}
        <div className="bg-gray-800 rounded-lg p-8 mb-8 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-orange-400">🚗 Active Parked Vehicles</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">Live</span>
              <span className="text-xs text-gray-500 ml-2">
                Updated: {new Date(lastUpdate).toLocaleTimeString('en-IN')}
              </span>
            </div>
          </div>
          
          {activeTickets.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-2">🅿️</div>
              <p>No active vehicles parked</p>
              <p className="text-sm mt-2">Waiting for vehicles to enter...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeTickets.map(ticket => {
                const currentBilling = calculateBilling(ticket.entryTime, new Date());
                
                return (
                  <div
                    key={ticket.ticketId}
                    className="bg-gray-700 rounded-lg p-6 border-2 border-gray-600 hover:border-orange-500 transition-all duration-200 cursor-pointer transform hover:scale-102"
                    onClick={() => {
                      setTicketId(ticket.ticketId);
                      handleSearch({ preventDefault: () => {} });
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <div>
                            <span className="text-xs text-gray-400 block">Ticket ID</span>
                            <p className="font-mono text-lg text-white font-bold">{ticket.ticketId}</p>
                          </div>
                          <div className="bg-orange-900 bg-opacity-50 px-3 py-1 rounded-full">
                            <span className="text-orange-400 font-medium">Slot {ticket.slotId}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div>
                            <span className="text-xs text-gray-400 block">Vehicle</span>
                            <p className="text-white font-medium">
                              {ticket.vehicle?.number || ticket.vehicleNumber || 'Unknown'}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-400 block">Phone</span>
                            <p className="text-white font-medium">
                              {ticket.vehicle?.phone || ticket.phone || 'Unknown'}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-400 block">Entry Time</span>
                            <p className="text-white font-medium">
                              {new Date(ticket.entryTime).toLocaleString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                              })}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-xs text-gray-400 block">Current Duration</span>
                            <p className="text-white font-medium">
                              {formatDuration(currentBilling.durationMinutes)}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-gray-400 block">Current Amount</span>
                            <p className="text-2xl font-bold text-orange-400">
                              {formatCurrency(currentBilling.amountDue)}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-6 flex flex-col items-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTicketId(ticket.ticketId);
                            handleSearch({ preventDefault: () => {} });
                          }}
                          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium mb-2"
                        >
                          ⚡ Quick Exit
                        </button>
                        <span className="text-xs text-gray-400">Click to process</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Action - Selected Vehicle */}
        {searchResult && searchResult.status === 'ACTIVE' && (
          <div className="bg-gradient-to-r from-green-800 to-green-900 rounded-lg p-6 mb-8 shadow-xl border-2 border-green-600">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-green-400 mb-2">⚡ Ready to Process Exit</h3>
                <div className="flex items-center space-x-6">
                  <div>
                    <span className="text-green-300 text-sm">Vehicle:</span>
                    <span className="text-white font-medium ml-2">{searchResult.vehicleNumber}</span>
                  </div>
                  <div>
                    <span className="text-green-300 text-sm">Slot:</span>
                    <span className="text-white font-medium ml-2">{searchResult.slotId}</span>
                  </div>
                  <div>
                    <span className="text-green-300 text-sm">Amount:</span>
                    <span className="text-green-400 font-bold ml-2 text-lg">
                      {billingInfo ? formatCurrency(billingInfo.amountDue) : 'Calculating...'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleConfirmExit}
                disabled={isProcessing}
                className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {isProcessing ? 'Processing...' : '🚗 Release Slot & Collect Payment'}
              </button>
            </div>
          </div>
        )}

        {/* Search Form */}
        <div className="bg-gray-800 rounded-lg p-8 mb-8 shadow-xl">
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Or Enter Ticket ID Manually
              </label>
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value.toUpperCase())}
                  className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg font-mono"
                  placeholder="e.g., TKT-20240226-0001"
                />
                <button
                  type="submit"
                  className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 font-medium"
                >
                  Process Exit
                </button>
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-400">{error}</p>
              )}
            </div>
          </form>
        </div>

        {/* Ticket Details and Billing */}
        {searchResult && billingInfo && (
          <div className="space-y-8">
            {/* Ticket Details */}
            <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
              <h3 className="text-2xl font-bold mb-6 text-orange-400">🎫 Ticket Details</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <span className="text-gray-400 block text-sm mb-1">Ticket ID</span>
                  <span className="text-white font-mono text-lg">{searchResult.ticketId}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-sm mb-1">Vehicle Number</span>
                  <span className="text-white text-lg">{searchResult.vehicleNumber}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-sm mb-1">Phone Number</span>
                  <span className="text-white text-lg">{searchResult.phone}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-sm mb-1">Slot Number</span>
                  <span className="text-white text-lg">{searchResult.slotId}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-sm mb-1">Entry Time</span>
                  <span className="text-white text-lg">
                    {new Date(searchResult.entryTime).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-sm mb-1">Exit Time</span>
                  <span className="text-white text-lg">
                    {new Date(billingInfo.exitTime).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Billing Information */}
            <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
              <h3 className="text-2xl font-bold mb-6 text-orange-400">💰 Billing Information</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <span className="text-gray-400">Duration Parked</span>
                  <span className="text-white text-lg font-medium">
                    {formatDuration(billingInfo.durationMinutes)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <span className="text-gray-400">Hours Charged</span>
                  <span className="text-white text-lg font-medium">
                    {billingInfo.hoursCharged} hour{billingInfo.hoursCharged !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <span className="text-gray-400">Rate</span>
                  <span className="text-white text-lg font-medium">₹20/hour</span>
                </div>
                <div className="flex justify-between items-center py-4">
                  <span className="text-xl font-semibold text-orange-400">Amount Due</span>
                  <span className="text-2xl font-bold text-orange-400">
                    {formatCurrency(billingInfo.amountDue)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-6">
              {searchResult.status === 'ACTIVE' ? (
                <button
                  onClick={handleConfirmExit}
                  disabled={isProcessing}
                  className="flex-1 px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : '✅ Confirm Exit & Free Slot'}
                </button>
              ) : (
                <div className="flex-1 px-8 py-4 bg-green-900 text-green-300 rounded-lg text-center font-medium text-lg">
                  ✅ Slot Released Successfully
                </div>
              )}
              
              <button
                onClick={handleReset}
                className="px-8 py-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium text-lg"
              >
                New Search
              </button>
            </div>
          </div>
        )}
        
        {/* Recent Vehicles Sidebar */}
        <div className="mt-8">
          <RecentVehicles 
            tickets={tickets} 
            onVehicleSelect={handleVehicleSelect}
            className="max-w-md"
          />
        </div>
        
        {/* Export Options */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-orange-400">📊 Export Data</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleExportData('today')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Export Today's Tickets
            </button>
            <button
              onClick={() => handleExportData('week')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Export Weekly Report
            </button>
            <button
              onClick={() => handleExportData('daily')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Generate Daily Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExitCounter;
