// For example, update ApiSettingsButton.tsx:
import React from 'react';
import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Or your routing library

const ApiSettingsButton = ({ className }) => {
  const navigate = useNavigate();
  
  return (
    <button
      onClick={() => navigate('/api-settings')} // Adjust path based on your routing
      className={`flex items-center gap-1 px-3 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 ${className || ''}`}
    >
      <Settings className="h-4 w-4" />
      <span>API Settings</span>
    </button>
  );
};

export default ApiSettingsButton;