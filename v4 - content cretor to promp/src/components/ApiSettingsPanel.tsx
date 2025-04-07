// src/components/ApiSettingsPanel.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Settings, X } from 'lucide-react';
import { 
  Provider,
  getPreferredProvider,
  setPreferredProvider
} from '@/api';
import APISettings from '@/features/settings/components/APISettings';

interface ApiSettingsPanelProps {
  onComplete?: () => void;
  initialProvider?: Provider;
  compact?: boolean;
}

const ApiSettingsPanel: React.FC<ApiSettingsPanelProps> = ({
  onComplete,
  initialProvider,
  compact = false
}) => {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [provider, setProvider] = useState<Provider>(
    initialProvider || getPreferredProvider()
  );
  
  const handleSettingsChange = (newProvider: Provider) => {
    setProvider(newProvider);
    setPreferredProvider(newProvider);
  };
  
  const handleComplete = () => {
    setIsExpanded(false);
    if (onComplete) {
      onComplete();
    }
  };
  
  return (
    <div className="relative">
      {compact && !isExpanded && (
        <Button
          onClick={() => setIsExpanded(true)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          API Settings
        </Button>
      )}
      
      {isExpanded && (
        <Card className="p-4 mb-6 relative">
          {compact && (
            <Button
              onClick={() => setIsExpanded(false)}
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 p-1 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          
          <APISettings onSettingsChange={handleSettingsChange} />
          
          {compact && (
            <div className="mt-4 flex justify-end">
              <Button onClick={handleComplete}>
                Save & Close
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default ApiSettingsPanel;