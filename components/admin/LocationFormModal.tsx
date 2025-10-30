import React from 'react';

// Fix: Replaced component with a placeholder as the "Locations" feature is not supported by the API, resolving import errors.

interface LocationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  // The props are kept for compatibility with where it might be called, but they are unused.
  location: any | null;
  refreshLocations: () => void;
}

const LocationFormModal: React.FC<LocationFormModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b">
          <h3 className="text-xl font-serif font-bold text-theme-primary">Quản lý Địa điểm</h3>
        </div>
        <div className="p-6">
          <p className="text-gray-600">
            Tính năng này không được hỗ trợ bởi API hiện tại.
          </p>
        </div>
        <div className="p-4 bg-gray-50 flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default LocationFormModal;
