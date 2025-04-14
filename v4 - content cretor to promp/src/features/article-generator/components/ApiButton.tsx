import React from 'react';

export const ApiButton: React.FC = () => {
  return (
    <button
      className="px-3 py-1.5 text-sm font-medium rounded-md text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
      onClick={() => {
        // You can replace this with actual API settings dialog logic later
        // For now, just show a simple alert
        alert('API Settings would open here');
      }}
    >
      API Settings
    </button>
  );
};