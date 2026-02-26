import React, { useState } from 'react';
import { useParking } from '../context/ParkingContext';
import SlotCard from '../components/SlotCard';
import BookingModal from '../components/BookingModal';
import { generateTicketPDF } from '../utils/pdfGenerator';

const EntranceKiosk = () => {
  const { slots, bookSlot } = useParking();
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(null);

  const handleSlotClick = (slot) => {
    if (slot.status === 'empty') {
      setSelectedSlot(slot);
      setIsModalOpen(true);
    }
  };

  const handleBookingSubmit = async (vehicleNumber, phone) => {
    try {
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
      
      // Auto-generate PDF after a short delay
      setTimeout(() => {
        generateTicketPDF(ticketData);
      }, 1000);
    } catch (error) {
      console.error('Error booking slot:', error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
  };

  const groundFloorSlots = slots.filter(slot => slot.floor === 'ground');
  const firstFloorSlots = slots.filter(slot => slot.floor === 'first');

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-green-400">🅿️ SmartPark</h1>
          <h2 className="text-2xl text-gray-300">Parking Management System</h2>
          <p className="text-gray-400 mt-2">Select an available slot to begin parking</p>
        </header>

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

        {/* Parking Slots Grid */}
        <div className="space-y-12">
          {/* Ground Floor */}
          <section>
            <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">Ground Floor</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-center max-w-4xl mx-auto">
              {groundFloorSlots.map(slot => (
                <SlotCard
                  key={slot.slotId}
                  slot={slot}
                  onClick={handleSlotClick}
                  disabled={slot.status === 'occupied'}
                />
              ))}
            </div>
          </section>

          {/* First Floor */}
          <section>
            <h2 className="text-3xl font-bold mb-6 text-center text-purple-400">First Floor</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-center max-w-4xl mx-auto">
              {firstFloorSlots.map(slot => (
                <SlotCard
                  key={slot.slotId}
                  slot={slot}
                  onClick={handleSlotClick}
                  disabled={slot.status === 'occupied'}
                />
              ))}
            </div>
          </section>
        </div>

        {/* Legend */}
        <div className="mt-12 flex justify-center space-x-8 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-green-500 rounded"></div>
            <span className="text-gray-400">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-red-500 rounded"></div>
            <span className="text-gray-400">Occupied</span>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleBookingSubmit}
        selectedSlot={selectedSlot}
      />
    </div>
  );
};

export default EntranceKiosk;
