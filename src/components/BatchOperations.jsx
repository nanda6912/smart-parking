import React, { useState } from 'react';
import { useParking } from '../context/ParkingContext';

const BatchOperations = () => {
  const { slots, releaseSlot } = useParking();
  const [selectedSlots, setSelectedSlots] = useState(new Set());
  const [showBatchPanel, setShowBatchPanel] = useState(false);

  const handleSelectAll = (floor = null) => {
    const floorSlots = floor 
      ? slots.filter(s => s.floor === floor)
      : slots;
    
    const availableSlots = floorSlots.filter(s => s.status === 'empty');
    const slotIds = new Set(availableSlots.map(s => s.slotId));
    
    if (selectedSlots.size === slotIds.size && 
        [...selectedSlots].every(id => slotIds.has(id))) {
      // Deselect all if all are already selected
      setSelectedSlots(new Set());
    } else {
      setSelectedSlots(slotIds);
    }
  };

  const handleBatchRelease = async () => {
    const occupiedSelected = [...selectedSlots].filter(slotId => {
      const slot = slots.find(s => s.slotId === slotId);
      return slot?.status === 'occupied' && slot?.ticketId;
    });

    if (occupiedSelected.length === 0) {
      alert('No occupied slots selected for release');
      return;
    }

    const confirmed = window.confirm(
      `Release ${occupiedSelected.length} vehicles from slots: ${occupiedSelected.join(', ')}?`
    );

    if (confirmed) {
      let successCount = 0;
      let errorCount = 0;

      for (const slotId of occupiedSelected) {
        const slot = slots.find(s => s.slotId === slotId);
        if (slot?.ticketId) {
          try {
            releaseSlot(slot.ticketId);
            successCount++;
          } catch (error) {
            console.error('Error releasing slot:', slotId, error);
            errorCount++;
          }
        }
      }

      // Show results
      const message = errorCount === 0 
        ? `✅ Successfully released ${successCount} vehicles`
        : `⚠️ Released ${successCount} vehicles, ${errorCount} errors`;
      
      alert(message);
      setSelectedSlots(new Set());
    }
  };

  const handleBatchReserve = () => {
    const emptySelected = [...selectedSlots].filter(slotId => {
      const slot = slots.find(s => s.slotId === slotId);
      return slot?.status === 'empty';
    });

    if (emptySelected.length === 0) {
      alert('No empty slots selected for reservation');
      return;
    }

    alert(`Reservation feature for ${emptySelected.length} slots coming soon!`);
  };

  const getSelectedSlotsInfo = () => {
    const selectedArray = [...selectedSlots];
    const occupied = selectedArray.filter(slotId => {
      const slot = slots.find(s => s.slotId === slotId);
      return slot?.status === 'occupied';
    });
    const empty = selectedArray.filter(slotId => {
      const slot = slots.find(s => s.slotId === slotId);
      return slot?.status === 'empty';
    });

    return { total: selectedArray.length, occupied: occupied.length, empty: empty.length };
  };

  const selectedInfo = getSelectedSlotsInfo();

  return (
    <div className="fixed top-20 left-4 z-40">
      {/* Toggle Button */}
      <button
        onClick={() => setShowBatchPanel(!showBatchPanel)}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          showBatchPanel 
            ? 'bg-blue-600 text-white shadow-lg' 
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        {showBatchPanel ? '✖️ Close Batch' : '⚡ Batch Operations'}
      </button>

      {/* Batch Panel */}
      {showBatchPanel && (
        <div className="mt-2 bg-gray-800 rounded-lg shadow-2xl border border-gray-700 w-80">
          {/* Header */}
          <div className="bg-gray-700 px-4 py-3 rounded-t-lg">
            <h3 className="text-lg font-bold text-blue-400">⚡ Batch Operations</h3>
            <p className="text-sm text-gray-400 mt-1">
              {selectedInfo.total} slots selected
            </p>
          </div>

          {/* Selection Info */}
          {selectedInfo.total > 0 && (
            <div className="px-4 py-3 bg-gray-700 border-b border-gray-600">
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <span className="text-gray-400">Total</span>
                  <p className="text-white font-bold">{selectedInfo.total}</p>
                </div>
                <div>
                  <span className="text-gray-400">Occupied</span>
                  <p className="text-red-400 font-bold">{selectedInfo.occupied}</p>
                </div>
                <div>
                  <span className="text-gray-400">Empty</span>
                  <p className="text-green-400 font-bold">{selectedInfo.empty}</p>
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="p-4 space-y-3">
            {/* Selection Controls */}
            <div className="space-y-2">
              <p className="text-sm text-gray-400 font-medium">Quick Select:</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSelectAll('ground')}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
                >
                  Ground Floor
                </button>
                <button
                  onClick={() => handleSelectAll('first')}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
                >
                  First Floor
                </button>
                <button
                  onClick={() => handleSelectAll()}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors col-span-2"
                >
                  All Floors
                </button>
              </div>
            </div>

            {/* Batch Actions */}
            {selectedInfo.total > 0 && (
              <div className="space-y-2 pt-3 border-t border-gray-600">
                <p className="text-sm text-gray-400 font-medium">Batch Actions:</p>
                
                {selectedInfo.occupied > 0 && (
                  <button
                    onClick={handleBatchRelease}
                    className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                  >
                    🚪 Release {selectedInfo.occupied} Vehicles
                  </button>
                )}

                {selectedInfo.empty > 0 && (
                  <button
                    onClick={handleBatchReserve}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                  >
                    📋 Reserve {selectedInfo.empty} Slots
                  </button>
                )}

                <button
                  onClick={() => setSelectedSlots(new Set())}
                  className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
                >
                  ✖️ Clear Selection
                </button>
              </div>
            )}

            {/* Instructions */}
            {selectedInfo.total === 0 && (
              <div className="text-sm text-gray-400 bg-gray-700 rounded-lg p-3">
                <p className="font-medium mb-2">How to use:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Click slots on the main grid to select them</li>
                  <li>• Use quick select buttons above</li>
                  <li>• Selected slots will be highlighted</li>
                  <li>• Perform batch actions on selected slots</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchOperations;
