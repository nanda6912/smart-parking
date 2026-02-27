import React from 'react';

const SlotCard = ({ slot, onClick, disabled, compact = false }) => {
  const isEmpty = slot.status === 'empty';
  const bgColor = isEmpty ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500';
  const cursor = isEmpty ? 'cursor-pointer' : 'cursor-not-allowed';
  const transition = 'transition-all duration-300 ease-in-out transform';

  if (compact) {
    return (
      <div
        onClick={() => isEmpty && onClick(slot)}
        className={`
          ${bgColor} ${cursor} ${transition}
          relative w-12 h-12 rounded shadow-md
          flex flex-col items-center justify-center
          text-white font-bold text-xs
          ${isEmpty ? 'hover:scale-110' : ''}
          ${disabled ? 'opacity-75' : ''}
        `}
        title={`${slot.label} - ${slot.floor === 'ground' ? 'Ground Floor' : 'First Floor'} - ${isEmpty ? 'Available' : 'Occupied'}`}
      >
        <div className="text-center">
          <div className="text-xs font-bold">{slot.label}</div>
        </div>
        
        {!isEmpty && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-gray-900"></div>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={() => isEmpty && onClick(slot)}
      className={`
        ${bgColor} ${cursor} ${transition}
        relative w-32 h-32 rounded-lg shadow-lg
        flex flex-col items-center justify-center
        text-white font-bold text-lg
        ${isEmpty ? 'hover:scale-105' : ''}
        ${disabled ? 'opacity-75' : ''}
      `}
    >
      {!isEmpty && (
        <div className="absolute top-2 right-2">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/>
          </svg>
        </div>
      )}
      
      <div className="text-center">
        <div className="text-2xl mb-1">{slot.label}</div>
        <div className="text-xs opacity-90">
          {slot.floor === 'ground' ? 'Ground Floor' : 'First Floor'}
        </div>
      </div>
      
      {!isEmpty && (
        <div className="text-xs mt-2 opacity-90">
          OCCUPIED
        </div>
      )}
    </div>
  );
};

export default SlotCard;
