import React, { useState } from 'react';

const BatchOperations = ({ selectedSlots, onBatchAction, onClearSelection }) => {
  const [action, setAction] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBatchAction = async () => {
    if (!action || selectedSlots.length === 0) return;
    
    setLoading(true);
    try {
      await onBatchAction(action, selectedSlots);
      setAction('');
      onClearSelection();
    } catch (error) {
      console.error('Batch action failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionButtonColor = (actionType) => {
    switch (actionType) {
      case 'release': return 'bg-red-500 hover:bg-red-600';
      case 'reserve': return 'bg-blue-500 hover:bg-blue-600';
      case 'maintenance': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'clean': return 'bg-green-500 hover:bg-green-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getActionIcon = (actionType) => {
    switch (actionType) {
      case 'release': return '🚪';
      case 'reserve': return '🔒';
      case 'maintenance': return '🔧';
      case 'clean': return '🧹';
      default: return '⚙️';
    }
  };

  const getActionLabel = (actionType) => {
    switch (actionType) {
      case 'release': return 'Release Slots';
      case 'reserve': return 'Reserve Slots';
      case 'maintenance': return 'Mark for Maintenance';
      case 'clean': return 'Mark as Cleaned';
      default: return 'Perform Action';
    }
  };

  if (selectedSlots.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 max-w-md">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Batch Operations ({selectedSlots.length} slots selected)
        </h3>
        <div className="flex flex-wrap gap-1 mb-3">
          {selectedSlots.map(slotId => (
            <span
              key={slotId}
              className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs"
            >
              {slotId}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <select
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          disabled={loading}
        >
          <option value="">Select Action...</option>
          <option value="release">Release Slots</option>
          <option value="reserve">Reserve Slots</option>
          <option value="maintenance">Mark for Maintenance</option>
          <option value="clean">Mark as Cleaned</option>
        </select>

        <div className="flex gap-2">
          <button
            onClick={handleBatchAction}
            disabled={!action || loading}
            className={`flex-1 px-4 py-2 text-white rounded-md transition-colors ${
              action && !loading 
                ? getActionButtonColor(action) 
                : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                {action && getActionIcon(action)}
                {action ? getActionLabel(action) : 'Select Action'}
              </span>
            )}
          </button>

          <button
            onClick={onClearSelection}
            disabled={loading}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Action Preview */}
      {action && (
        <div className="mt-3 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">
          <strong>Preview:</strong> {getActionLabel(action)} for {selectedSlots.length} slot(s)
          {action === 'release' && ' - This will free all selected slots and complete any active tickets.'}
          {action === 'reserve' && ' - This will mark selected slots as reserved.'}
          {action === 'maintenance' && ' - This will mark selected slots as under maintenance.'}
          {action === 'clean' && ' - This will mark selected slots as cleaned and ready for use.'}
        </div>
      )}
    </div>
  );
};

export default BatchOperations;
