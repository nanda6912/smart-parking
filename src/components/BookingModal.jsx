import React, { useState } from 'react';

const BookingModal = ({ isOpen, onClose, onSubmit, selectedSlot }) => {
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.vehicleNumber.trim()) {
      newErrors.vehicleNumber = 'Enter a valid vehicle number';
    } else if (formData.vehicleNumber.length < 6 || formData.vehicleNumber.length > 10) {
      newErrors.vehicleNumber = 'Vehicle number must be 6-10 characters';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Enter a valid 10-digit phone number';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData.vehicleNumber, formData.phone);
      setFormData({ vehicleNumber: '', phone: '' });
      setErrors({});
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Book Slot {selectedSlot?.label}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Vehicle Number
            </label>
            <input
              type="text"
              value={formData.vehicleNumber}
              onChange={(e) => handleInputChange('vehicleNumber', e.target.value.toUpperCase())}
              className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.vehicleNumber ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="e.g., TS09AB1234"
              maxLength={10}
            />
            {errors.vehicleNumber && (
              <p className="mt-2 text-sm text-red-400">{errors.vehicleNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, ''))}
              className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="9876543210"
              maxLength={10}
            />
            {errors.phone && (
              <p className="mt-2 text-sm text-red-400">{errors.phone}</p>
            )}
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Generate Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
