// src/features/blog-content-generator/components/ApiSettingsButton.tsx
import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import ApiSettingsDialog from './ApiSettingsDialog';

interface ApiSettingsButtonProps {
  className?: string;
}

const ApiSettingsButton: React.FC<ApiSettingsButtonProps> = ({ className }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  return (
    <>
      <button
        onClick={() => setIsDialogOpen(true)}
        className={`flex items-center gap-1 px-3 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 ${className || ''}`}
      >
        <Settings className="h-4 w-4" />
        <span>API Settings</span>
      </button>
      
      <ApiSettingsDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
      />
    </>
  );
};

export default ApiSettingsButton;