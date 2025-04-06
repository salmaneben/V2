// src/features/blog-content-generator/components/ApiSettingsSelector.tsx
import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { Provider } from '../types';

interface ApiSettingsSelectorProps {
  stepName: string;
  providerId: string;
  modelId: string;
  provider: Provider;
  model: string;
  onProviderChange: (providerId: string, provider: Provider) => void;
  onModelChange: (modelId: string, model: string) => void;
  showCustomOptions?: boolean;
}

const ApiSettingsSelector: React.FC<ApiSettingsSelectorProps> = ({
  stepName,
  providerId,
  modelId,
  provider,
  model,
  onProviderChange,
  onModelChange,
  showCustomOptions = false
}) => {
  const [showCustomSettings, setShowCustomSettings] = useState(false);
  const [customEndpoint, setCustomEndpoint] = useState('');
  const [customApiKey, setCustomApiKey] = useState('');
  const [customApiModel, setCustomApiModel] = useState('');
  const [customVerifySSL, setCustomVerifySSL] = useState(true);

  // Load custom API settings on initial render
  useEffect(() => {
    if (provider === 'custom') {
      const savedEndpoint = localStorage.getItem('custom_api_endpoint');
      const savedApiKey = localStorage.getItem('custom_api_key');
      const savedApiModel = localStorage.getItem('custom_api_model');
      const savedVerifySSL = localStorage.getItem('custom_api_verify');
      
      if (savedEndpoint) setCustomEndpoint(savedEndpoint);
      if (savedApiKey) setCustomApiKey(savedApiKey);
      if (savedApiModel) setCustomApiModel(savedApiModel);
      if (savedVerifySSL !== null) setCustomVerifySSL(savedVerifySSL !== 'false');
    }
  }, [provider]);

  // When custom settings change, save to localStorage
  useEffect(() => {
    if (provider === 'custom') {
      localStorage.setItem('custom_api_endpoint', customEndpoint);
      localStorage.setItem('custom_api_key', customApiKey);
      localStorage.setItem('custom_api_model', customApiModel);
      localStorage.setItem('custom_api_verify', customVerifySSL.toString());
    }
  }, [provider, customEndpoint, customApiKey, customApiModel, customVerifySSL]);

  // Define model options per provider
  const getModelOptions = (selectedProvider: Provider) => {
    switch (selectedProvider) {
      case 'openai':
        return [
          { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
          { value: 'gpt-4', label: 'GPT-4' },
          { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' }
        ];
      case 'claude':
        return [
          { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus' },
          { value: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet' },
          { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku' }
        ];
      case 'perplexity':
        return [
          { value: 'llama-3.1-sonar-small-128k-online', label: 'Llama 3.1 Sonar (Small)' },
          { value: 'llama-3.1-sonar-large-256k-online', label: 'Llama 3.1 Sonar (Large)' },
          { value: 'sonar-small-online', label: 'Sonar Small' },
          { value: 'sonar-medium-online', label: 'Sonar Medium' }
        ];
      case 'deepseek':
        return [
          { value: 'deepseek-chat', label: 'DeepSeek Chat' },
          { value: 'deepseek-coder', label: 'DeepSeek Coder' }
        ];
      case 'custom':
        return [
          { value: customApiModel || 'custom-model', label: customApiModel || 'Custom Model' }
        ];
      default:
        return [
          { value: 'default', label: 'Default Model' }
        ];
    }
  };

  // Helper function to save API settings
  const saveApiSettings = (providerId: string, provider: Provider, modelId?: string, model?: string) => {
    // Save provider preference
    localStorage.setItem(`preferred_provider_${providerId}`, provider);
    
    // Also set as global preference
    localStorage.setItem('preferred_provider', provider);
    
    // Save model preference if provided
    if (modelId && model) {
      localStorage.setItem(`preferred_model_${modelId}`, model);
    }
  };

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProvider = e.target.value as Provider;
    onProviderChange(providerId, newProvider);
    
    // When provider changes, set a default model
    const modelOptions = getModelOptions(newProvider);
    if (modelOptions.length > 0) {
      onModelChange(modelId, modelOptions[0].value);
      
      // Save the model preference
      localStorage.setItem(`preferred_model_${modelId}`, modelOptions[0].value);
    }
    
    // Save the provider preference
    saveApiSettings(providerId, newProvider);
    
    // If changing to custom, show custom settings
    if (newProvider === 'custom') {
      setShowCustomSettings(true);
    }
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onModelChange(modelId, value);
    
    // Save the model preference
    localStorage.setItem(`preferred_model_${modelId}`, value);
    
    // Also save specific model for provider
    localStorage.setItem(`${provider}_model`, value);
  };

  const handleSaveCustomSettings = () => {
    // Update custom settings
    localStorage.setItem('custom_api_endpoint', customEndpoint);
    localStorage.setItem('custom_api_key', customApiKey);
    localStorage.setItem('custom_api_model', customApiModel);
    localStorage.setItem('custom_api_verify', customVerifySSL.toString());
    
    // Update the model selector with the new custom model
    if (provider === 'custom') {
      onModelChange(modelId, customApiModel);
      localStorage.setItem(`preferred_model_${modelId}`, customApiModel);
    }
    
    setShowCustomSettings(false);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-2 items-start md:items-center mb-2">
        <div className="flex gap-2 items-center">
          <Settings className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{stepName} API:</span>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <div className="min-w-[140px]">
            <select 
              value={provider} 
              onChange={handleProviderChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="perplexity">Perplexity</option>
              <option value="openai">OpenAI</option>
              <option value="claude">Claude</option>
              <option value="deepseek">DeepSeek</option>
              <option value="custom">Custom API</option>
            </select>
          </div>
          
          <div className="min-w-[200px] flex-grow">
            <select 
              value={model} 
              onChange={handleModelChange}
              className="w-full p-2 border rounded-md"
            >
              {getModelOptions(provider).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {showCustomOptions && provider === 'custom' && (
            <button 
              onClick={() => setShowCustomSettings(!showCustomSettings)}
              className="px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200"
            >
              Configure
            </button>
          )}
        </div>
      </div>
      
      {showCustomOptions && provider === 'custom' && showCustomSettings && (
        <div className="mt-4 p-4 border rounded-md bg-gray-50">
          <h4 className="text-md font-medium mb-3">Custom API Settings</h4>
          <div className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="custom-endpoint" className="text-sm font-medium">API Endpoint</label>
              <input
                id="custom-endpoint"
                type="text"
                placeholder="https://api.example.com/v1/chat/completions"
                value={customEndpoint}
                onChange={(e) => setCustomEndpoint(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="custom-api-key" className="text-sm font-medium">API Key</label>
              <input
                id="custom-api-key"
                type="password"
                placeholder="Your API key"
                value={customApiKey}
                onChange={(e) => setCustomApiKey(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="custom-model" className="text-sm font-medium">Model Identifier</label>
              <input
                id="custom-model"
                type="text"
                placeholder="model-name"
                value={customApiModel}
                onChange={(e) => setCustomApiModel(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="verify-ssl"
                type="checkbox"
                checked={customVerifySSL}
                onChange={(e) => setCustomVerifySSL(e.target.checked)}
                className="h-4 w-4"
              />
              <label htmlFor="verify-ssl" className="text-sm">Verify SSL</label>
            </div>
            <button 
              className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" 
              onClick={handleSaveCustomSettings}
            >
              Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiSettingsSelector;