// src/features/blog-content-generator/components/ApiKeyInputComponent.tsx
import React, { useState, useEffect } from 'react';
import { Provider } from '../types';
import { Settings, Key, Eye, EyeOff, Save } from 'lucide-react';

interface ApiKeyInputProps {
  provider: Provider;
  onSave?: () => void;
}

const ApiKeyInputComponent: React.FC<ApiKeyInputProps> = ({ provider, onSave }) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Load existing API key
    const savedKey = localStorage.getItem(`${provider}_api_key`);
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, [provider]);

  const handleSaveApiKey = () => {
    // Save to provider-specific key
    localStorage.setItem(`${provider}_api_key`, apiKey);
    
    // Also save as global key for backward compatibility
    localStorage.setItem('api_key', apiKey);
    
    // Show success message
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    
    // Call onSave callback if provided
    if (onSave) onSave();
  };

  const getProviderName = (provider: Provider): string => {
    switch (provider) {
      case 'openai': return 'OpenAI';
      case 'claude': return 'Anthropic Claude';
      case 'perplexity': return 'Perplexity';
      case 'deepseek': return 'DeepSeek';
      case 'custom': return 'Custom API';
      default: return 'API';
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-md border">
      <div className="flex items-center gap-2 mb-3">
        <Settings className="h-4 w-4 text-gray-500" />
        <h3 className="text-md font-medium">{getProviderName(provider)} API Key</h3>
      </div>
      
      <div className="space-y-3">
        <div className="relative">
          <div className="flex items-center">
            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type={showApiKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={`Enter your ${getProviderName(provider)} API key`}
              className="w-full pl-10 pr-10 py-2 border rounded-md"
            />
            <button
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showApiKey ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={handleSaveApiKey}
            disabled={!apiKey}
            className={`flex items-center gap-1 px-3 py-1 rounded-md ${
              !apiKey ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <Save className="h-4 w-4" />
            <span>Save API Key</span>
          </button>
        </div>
        
        {saveSuccess && (
          <div className="p-2 bg-green-50 text-green-700 text-sm rounded-md border border-green-200">
            API key saved successfully!
          </div>
        )}
        
        <div className="text-xs text-gray-500">
          <p>Your API key is stored locally in your browser and is never sent to our servers.</p>
          {provider === 'openai' && (
            <p className="mt-1">You can find or create your OpenAI API key in the <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">OpenAI dashboard</a>.</p>
          )}
          {provider === 'claude' && (
            <p className="mt-1">You can find or create your Claude API key in the <a href="https://console.anthropic.com/keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Anthropic console</a>.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiKeyInputComponent;