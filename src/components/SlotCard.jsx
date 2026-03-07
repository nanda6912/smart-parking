import React from 'react';

const SlotCard = ({ slot, onClick, disabled, compact = false, selected = false, onSelect = null }) => {
  const isEmpty = slot.status === 'empty';
  const isMaintenance = slot.status === 'maintenance';
  const isReserved = slot.status === 'reserved';
  
  const getBgColor = () => {
    if (selected) return 'bg-purple-500 hover:bg-purple-600';
    if (isMaintenance) return 'bg-yellow-500 hover:bg-yellow-600';
    if (isReserved) return 'bg-blue-500 hover:bg-blue-600';
    if (isEmpty) return 'bg-green-500 hover:bg-green-600';
    return 'bg-red-500 hover:bg-red-600';
  };
  
  const getCursor = () => {
    if (disabled) return 'cursor-not-allowed';
    if (onSelect) return 'cursor-pointer';
    return isEmpty ? 'cursor-pointer' : 'cursor-not-allowed';
  };
  
  const bgColor = getBgColor();
  const cursor = getCursor();
  const transition = 'transition-all duration-300 ease-in-out transform';

  const handleClick = () => {
    if (onSelect) {
      onSelect(slot);
    } else if (isEmpty && onClick) {
      onClick(slot);
    }
  };

  if (compact) {
    return (
      <div
        onClick={handleClick}
        className={`
          ${bgColor} ${cursor} ${transition}
          relative w-12 h-12 rounded shadow-md
          flex flex-col items-center justify-center
          text-white font-bold text-xs
          ${isEmpty || onSelect ? 'hover:scale-110' : ''}
          ${disabled ? 'opacity-75' : ''}
        `}
        title={`${slot.label} - ${slot.floor === 'ground' ? 'Ground Floor' : 'First Floor'} - ${isEmpty ? 'Available' : isMaintenance ? 'Maintenance' : isReserved ? 'Reserved' : 'Occupied'}`}
      >
        <div className="text-center">
          <div className="text-xs font-bold">{slot.label}</div>
        </div>
        
        {/* Status Indicators */}
        {!isEmpty && (
          <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-900 ${
            isMaintenance ? 'bg-yellow-400' : 
            isReserved ? 'bg-blue-400' : 'bg-red-400'
          }`}></div>
        )}
        
        {selected && (
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-purple-400 rounded-full border-2 border-gray-900"></div>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`
        ${bgColor} ${cursor} ${transition}
        relative w-32 h-32 rounded-lg shadow-lg
        flex flex-col items-center justify-center
        text-white font-bold text-lg
        ${isEmpty || onSelect ? 'hover:scale-105' : ''}
        ${disabled ? 'opacity-75' : ''}
      `}
    >
      {/* Status Icons */}
      {!isEmpty && (
        <div className="absolute top-2 right-2">
          {isMaintenance ? (
            <div className="text-2xl">🔧</div>
          ) : isReserved ? (
            <div className="text-2xl">🔒</div>
          ) : (
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/>
            </svg>
          )}
        </div>
      )}
      
      {/* Selection Indicator */}
      {selected && (
        <div className="absolute top-2 left-2 text-2xl">✓</div>
      )}
      
      <div className="text-center">
        <div className="text-2xl mb-1">{slot.label}</div>
        <div className="text-xs opacity-90">
          {slot.floor === 'ground' ? 'Ground Floor' : 'First Floor'}
        </div>
      </div>
      
      <div className="text-xs mt-2 opacity-90">
        {isEmpty ? 'AVAILABLE' : 
         isMaintenance ? 'MAINTENANCE' :
         isReserved ? 'RESERVED' : 'OCCUPIED'}
      </div>
    </div>
  );
};

export default SlotCard;
