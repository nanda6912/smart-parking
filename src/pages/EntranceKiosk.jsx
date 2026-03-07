import React, { useState, useMemo, useEffect } from 'react';
import { useParking } from '../context/ParkingContext';
import { useToast } from '../components/ToastContainer';
import SlotCard from '../components/SlotCard';
import BookingModal from '../components/BookingModal';
import SlotSearchFilter from '../components/SlotSearchFilter';
import SkeletonLoader from '../components/SkeletonLoader';
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts';
import { generateTicketPDF } from '../utils/pdfGenerator';

const ITEMS_PER_PAGE = 50;

const EntranceKiosk = () => {
  const { slots, bookSlot, loading, setLoading } = useParking();
  const { showSuccess, showError } = useToast();
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'ctrl+n': () => {
      const availableSlot = slots.find(slot => slot.status === 'empty');
      if (availableSlot) {
        setSelectedSlot(availableSlot);
        setIsModalOpen(true);
        showSuccess('Quick booking activated!');
      } else {
        showError('No available slots for quick booking');
      }
    }
  });

  // Clear old cache if we have 600 slots (old version)
  useEffect(() => {
    if (slots.length === 600) {
      console.log('Detected old 600-slot cache, clearing localStorage...');
      localStorage.removeItem('parkingState');
      window.location.reload();
    }
  }, [slots]);

  // Pagination
  const totalPages = Math.ceil(filteredSlots.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSlots = filteredSlots.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Stats
  const stats = useMemo(() => {
    const groundSlots = slots.filter(s => s.floor === 'ground');
    const firstSlots = slots.filter(s => s.floor === 'first');

    return {
      ground: {
        total: groundSlots.length,
        occupied: groundSlots.filter(s => s.status === 'occupied').length,
        available: groundSlots.filter(s => s.status === 'empty').length,
      },
      first: {
        total: firstSlots.length,
        occupied: firstSlots.filter(s => s.status === 'occupied').length,
        available: firstSlots.filter(s => s.status === 'empty').length,
      },
      overall: {
        total: slots.length,
        occupied: slots.filter(s => s.status === 'occupied').length,
        available: slots.filter(s => s.status === 'empty').length,
      }
    };
  }, [slots]);

  const handleSlotClick = (slot) => {
    if (slot.status === 'empty') {
      setSelectedSlot(slot);
      setIsModalOpen(true);
    }
  };

  const handleBookingSubmit = async (vehicleNumber, phone) => {
    try {
      setLoading(true);
      const { ticketId, entryTime } = bookSlot(selectedSlot.slotId, vehicleNumber, phone);

      const ticketData = {
        ticketId,
        vehicleNumber,
        phone,
        slotId: selectedSlot.slotId,
        entryTime,
      };

      setCurrentTicket(ticketData);
      setIsModalOpen(false);
      setSelectedSlot(null);

      showSuccess(`Booking successful! Ticket ID: ${ticketId}`);

      // Auto-generate PDF after a short delay
      setTimeout(() => {
        generateTicketPDF(ticketData);
      }, 1000);
    } catch (error) {
      console.error('Error booking slot:', error);
      showError('Failed to book slot. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
  };

  const handleFilter = (filtered) => {
    setFilteredSlots(filtered);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-green-400">🅿️ SmartPark</h1>
          <h2 className="text-xl text-gray-300">Parking Management System - 200 Slots</h2>
          <p className="text-gray-400 mt-2">Select an available slot to begin parking</p>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{stats.overall.total}</div>
            <div className="text-sm text-gray-400">Total Slots</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{stats.overall.available}</div>
            <div className="text-sm text-gray-400">Available</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{stats.overall.occupied}</div>
            <div className="text-sm text-gray-400">Occupied</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {Math.round((stats.overall.occupied / stats.overall.total) * 100)}%
            </div>
            <div className="text-sm text-gray-400">Occupancy</div>
          </div>
        </div>

        {/* Current Ticket Display */}
        {currentTicket && (
          <div className="bg-green-900 bg-opacity-50 border border-green-500 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-4 text-green-400">🎫 Active Ticket Generated</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Ticket ID:</span>
                <span className="ml-2 font-mono">{currentTicket.ticketId}</span>
              </div>
              <div>
                <span className="text-gray-400">Vehicle:</span>
                <span className="ml-2">{currentTicket.vehicleNumber}</span>
              </div>
              <div>
                <span className="text-gray-400">Phone:</span>
                <span className="ml-2">{currentTicket.phone}</span>
              </div>
              <div>
                <span className="text-gray-400">Slot:</span>
                <span className="ml-2">{currentTicket.slotId}</span>
              </div>
            </div>
            <button
              onClick={() => generateTicketPDF(currentTicket)}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              📄 Download Ticket (PDF)
            </button>
          </div>
        )}

        {/* Search and Filter */}
        <SlotSearchFilter 
          slots={slots} 
          onFilter={handleFilter}
          className="mb-8"
        />

        {/* Parking Slots Grid */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Parking Slots
          </h2>

          {loading ? (
            <SkeletonLoader type="slot" count={20} />
          ) : paginatedSlots.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg">
                No slots found matching your criteria
              </div>
            </div>
          ) : (
            <>
              {/* Results Info */}
              <div className="text-sm text-gray-400 mb-4 text-center">
                Showing {paginatedSlots.length} of {filteredSlots.length} slots
              </div>

              <div className="grid grid-cols-5 md:grid-cols-10 lg:grid-cols-15 xl:grid-cols-20 gap-3">
                {paginatedSlots.map(slot => (
                  <SlotCard
                    key={slot.slotId}
                    slot={slot}
                    onClick={handleSlotClick}
                    disabled={slot.status === 'occupied'}
                    compact={true}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                  >
                    Previous
                  </button>

                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-1 rounded ${currentPage === pageNum
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-700 text-white hover:bg-gray-600'
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Booking Modal */}
        <BookingModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={handleBookingSubmit}
          selectedSlot={selectedSlot}
        />
      </div>
    </div>
  );
};

export default EntranceKiosk;
