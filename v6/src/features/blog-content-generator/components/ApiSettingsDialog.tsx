// src/features/blog-content-generator/components/ApiSettingsDialog.tsx
import React, { useState } from 'react';
import { X, Settings } from 'lucide-react';
import { Provider } from '../types';
import ApiKeyInputComponent from './ApiKeyInputComponent';

interface ApiSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApiSettingsDialog: React.FC<ApiSettingsDialogProps> = ({ isOpen, onClose }) => {
  const [activeProvider, setActiveProvider] = useState<Provider>('perplexity');
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold">API Settings</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <div className="flex border-b">
              <button
                className={`px-4 py-2 ${activeProvider === 'perplexity' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveProvider('perplexity')}
              >
                Perplexity
              </button>
              <button
                className={`px-4 py-2 ${activeProvider === 'openai' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveProvider('openai')}
              >
                OpenAI
              </button>
              <button
                className={`px-4 py-2 ${activeProvider === 'claude' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveProvider('claude')}
              >
                Claude
              </button>
              <button
                className={`px-4 py-2 ${activeProvider === 'deepseek' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveProvider('deepseek')}
              >
                DeepSeek
              </button>
              <button
                className={`px-4 py-2 ${activeProvider === 'custom' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveProvider('custom')}
              >
                Custom
              </button>
            </div>
          </div>
          
          <ApiKeyInputComponent 
            provider={activeProvider} 
            onSave={() => {
              // Set this as the default provider after saving API key
              localStorage.setItem('preferred_provider', activeProvider);
            }}
          />
          
          {activeProvider === 'custom' && (
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">API Endpoint</label>
                <input
                  type="text"
                  placeholder="https://api.example.com/v1/chat/completions"
                  value={localStorage.getItem('custom_api_endpoint') || ''}
                  onChange={(e) => localStorage.setItem('custom_api_endpoint', e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Default Model</label>
                <input
                  type="text"
                  placeholder="model-name"
                  value={localStorage.getItem('custom_api_model') || ''}
                  onChange={(e) => localStorage.setItem('custom_api_model', e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  id="verify-ssl"
                  type="checkbox"
                  checked={localStorage.getItem('custom_api_verify') !== 'false'}
                  onChange={(e) => localStorage.setItem('custom_api_verify', e.target.checked.toString())}
                  className="h-4 w-4"
                />
                <label htmlFor="verify-ssl" className="text-sm">Verify SSL</label>
              </div>
            </div>
          )}
          
          <div className="text-xs text-gray-500 mt-4">
            <p>All API keys and settings are stored locally in your browser. Make sure you have valid API keys for the providers you use.</p>
          </div>
        </div>
        
        <div className="flex justify-end p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiSettingsDialog;