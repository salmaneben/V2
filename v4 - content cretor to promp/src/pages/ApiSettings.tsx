import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import ApiSettingsPanel from '@/components/ApiSettingsPanel';
import { Info, CheckCircle } from 'lucide-react';

const ApiSettings = ({ sidebarState }) => {
  const [updateMessage, setUpdateMessage] = useState({ show: false, type: '', text: '' });

  const showSuccessMessage = () => {
    setUpdateMessage({
      show: true,
      type: 'success',
      text: 'Your API settings have been saved successfully.'
    });
    
    setTimeout(() => {
      setUpdateMessage({ show: false, type: '', text: '' });
    }, 3000);
  };

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">API Settings</h1>
        <p className="text-gray-600 mt-2">
          Configure your AI API connections to generate content with your preferred provider.
        </p>
      </header>

      {updateMessage.show && (
        <div className={`mb-6 p-4 rounded-md flex items-start ${
          updateMessage.type === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          {updateMessage.type === 'success' && (
            <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
          )}
          <p className={`text-sm ${
            updateMessage.type === 'success' ? 'text-green-700' : 'text-red-700'
          }`}>
            {updateMessage.text}
          </p>
        </div>
      )}
      
      <Card className="bg-white p-4 mb-6 border-l-4 border-indigo-500">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-indigo-500 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-gray-800">About API Settings</h3>
            <p className="text-sm text-gray-600 mt-1">
              You can choose between Perplexity AI, OpenAI (GPT), Claude, DeepSeek LLM/Coder/Math models, or your own custom API endpoint.
            </p>
          </div>
        </div>
      </Card>
      
      <div className="space-y-8">
        <ApiSettingsPanel />
      </div>
    </div>
  );
};

export default ApiSettings;