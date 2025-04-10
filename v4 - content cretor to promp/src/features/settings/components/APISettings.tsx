import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, CheckCircle, AlertCircle, Lock, Globe, Sparkles, Server, Brain, Cpu, Code, Stars } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Provider, 
  ApiConfig,
  MODEL_OPTIONS,
  getApiConfig, 
  getPreferredProvider, 
  setPreferredProvider,
  setApiKey,
  setModelForProvider,
  setCustomApiSettings,
  testConnection,
  getModelsForProvider
} from '@/api';
import { useApiConnection } from '@/api/hooks/useApiConnection';

export interface APISettingsProps {
  onSettingsChange?: (provider: Provider) => void;
}

const APISettings: React.FC<APISettingsProps> = ({ onSettingsChange }) => {
  // State for API keys and models
  const [apiKeys, setApiKeys] = useState<Record<Provider, string>>({
    perplexity: '',
    openai: '',
    claude: '',
    deepseek: '',
    gemini: '',
    custom: ''
  });
  
  const [models, setModels] = useState<Record<Provider, string>>({
    perplexity: '',
    openai: '',
    claude: '',
    deepseek: '',
    gemini: '',
    custom: ''
  });
  
  // Custom API specific state
  const [customSettings, setCustomSettings] = useState({
    endpoint: '',
    verifySSL: true
  });
  
  // Current selected provider
  const [selectedProvider, setSelectedProvider] = useState<Provider>('perplexity');
  
  // Connection testing state using our hook
  const { 
    connectionStatus, 
    errorMessage, 
    testApiConnection 
  } = useApiConnection();
  
  // Provider display information
  const providerInfo = {
    perplexity: { label: 'Perplexity', icon: Sparkles },
    openai: { label: 'OpenAI', icon: Brain },
    claude: { label: 'Claude', icon: Cpu },
    deepseek: { label: 'DeepSeek', icon: Code },
    gemini: { label: 'Gemini', icon: Stars },
    custom: { label: 'Custom API', icon: Server }
  };
  
  // Load saved settings on component mount
  useEffect(() => {
    const preferredProvider = getPreferredProvider();
    setSelectedProvider(preferredProvider);
    
    // Load API keys and models for all providers
    const keys: Record<Provider, string> = {} as Record<Provider, string>;
    const modelSettings: Record<Provider, string> = {} as Record<Provider, string>;
    
    (['perplexity', 'openai', 'claude', 'deepseek', 'gemini', 'custom'] as Provider[]).forEach((provider) => {
      const config = getApiConfig(provider);
      keys[provider] = config.apiKey;
      modelSettings[provider] = config.model || '';
    });
    
    setApiKeys(keys);
    setModels(modelSettings);
    
    // Load custom API settings
    const customConfig = getApiConfig('custom');
    setCustomSettings({
      endpoint: customConfig.endpoint || '',
      verifySSL: customConfig.verifySSL !== false
    });
  }, []);
  
  // Handle provider selection
  const handleProviderChange = (provider: Provider) => {
    setSelectedProvider(provider);
    setPreferredProvider(provider);
    
    if (onSettingsChange) {
      onSettingsChange(provider);
    }
  };
  
  // Handle API key changes
  const handleApiKeyChange = (provider: Provider, key: string) => {
    setApiKeys(prev => ({ ...prev, [provider]: key }));
    setApiKey(provider, key);
  };
  
  // Handle model changes
  const handleModelChange = (provider: Provider, model: string) => {
    setModels(prev => ({ ...prev, [provider]: model }));
    setModelForProvider(provider, model);
  };
  
  // Handle custom API settings changes
  const handleCustomSettingsChange = (settings: Partial<typeof customSettings>) => {
    const updatedSettings = { ...customSettings, ...settings };
    setCustomSettings(updatedSettings);
    
    setCustomApiSettings({
      endpoint: updatedSettings.endpoint,
      apiKey: apiKeys.custom,
      model: models.custom,
      verifySSL: updatedSettings.verifySSL
    });
  };
  
  // Test connection for the current provider
  const handleTestConnection = async () => {
    const config: ApiConfig = {
      provider: selectedProvider,
      apiKey: apiKeys[selectedProvider],
      model: models[selectedProvider]
    };
    
    if (selectedProvider === 'custom') {
      config.endpoint = customSettings.endpoint;
      config.verifySSL = customSettings.verifySSL;
    }
    
    await testApiConnection(config);
  };
  
  // Get model options for the current provider
  const getModelOptionsForProvider = (provider: Provider) => {
    return MODEL_OPTIONS.filter(model => model.provider === provider);
  };
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">API Settings</h2>
      
      {/* Provider Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        {Object.entries(providerInfo).map(([provider, info]) => {
          const Icon = info.icon;
          return (
            <button
              key={provider}
              type="button"
              className={cn(
                "p-3 rounded-md flex flex-col items-center justify-center gap-2 border transition-colors",
                selectedProvider === provider
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-800'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100',
              )}
              onClick={() => handleProviderChange(provider as Provider)}
            >
              <Icon className="h-6 w-6" />
              <span className="text-sm font-medium">{info.label}</span>
            </button>
          );
        })}
      </div>
      
      {/* Provider Settings Card */}
      <Card className="p-6">
        <div className="flex items-center mb-4 gap-2">
          {React.createElement(providerInfo[selectedProvider].icon, { className: "h-5 w-5 text-indigo-500" })}
          <h3 className="text-xl font-semibold">{providerInfo[selectedProvider].label} API</h3>
        </div>
        
        <div className="space-y-4">
          {/* API Key Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">API Key</label>
            <div className="relative">
              <input
                type="password"
                value={apiKeys[selectedProvider]}
                onChange={(e) => handleApiKeyChange(selectedProvider, e.target.value)}
                placeholder={`Enter your ${providerInfo[selectedProvider].label} API key`}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {selectedProvider === 'gemini' && (
              <p className="text-xs text-gray-500 mt-1">
                Enter your Google Gemini API key. You can find this in the Google AI Studio console.
              </p>
            )}
          </div>
          
          {/* Model Selection - For all except custom */}
          {selectedProvider !== 'custom' && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">Model</label>
              <select
                value={models[selectedProvider]}
                onChange={(e) => handleModelChange(selectedProvider, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                {getModelOptionsForProvider(selectedProvider).map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {/* Custom API specific settings */}
          {selectedProvider === 'custom' && (
            <>
              <div>
                <label className="block text-gray-700 font-medium mb-2">API Endpoint</label>
                <div className="relative">
                  <input
                    type="text"
                    value={customSettings.endpoint}
                    onChange={(e) => handleCustomSettingsChange({ endpoint: e.target.value })}
                    placeholder="https://api.yourservice.com/v1/completion"
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
                  />
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Model Name (Optional)</label>
                <input
                  type="text"
                  value={models.custom}
                  onChange={(e) => handleModelChange('custom', e.target.value)}
                  placeholder="e.g., gpt-4-turbo, claude-3-opus"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="customApiVerify"
                  checked={customSettings.verifySSL}
                  onChange={(e) => handleCustomSettingsChange({ verifySSL: e.target.checked })}
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="customApiVerify" className="text-gray-700">
                  Verify SSL certificate
                </label>
              </div>
            </>
          )}
          
          {/* Test Connection Button */}
          <div>
            <Button
              type="button"
              onClick={handleTestConnection}
              disabled={connectionStatus === 'connecting'}
              className={cn(
                "w-full p-3 flex justify-center items-center rounded-md text-white",
                connectionStatus === 'connecting'
                  ? 'bg-indigo-400'
                  : connectionStatus === 'success'
                    ? 'bg-green-600 hover:bg-green-700'
                    : connectionStatus === 'error'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-indigo-600 hover:bg-indigo-700',
              )}
            >
              {connectionStatus === 'connecting' ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Testing...
                </>
              ) : connectionStatus === 'success' ? (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Connection Successful
                </>
              ) : connectionStatus === 'error' ? (
                <>
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Test Connection Again
                </>
              ) : (
                `Test ${providerInfo[selectedProvider].label} API Connection`
              )}
            </Button>
            
            {connectionStatus !== 'idle' && (
              <div className={cn(
                "mt-2 text-sm",
                connectionStatus === 'success' ? 'text-green-600' : 'text-red-600',
              )}>
                {connectionStatus === 'success' 
                  ? 'Connection successful!' 
                  : errorMessage || 'Connection failed'}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default APISettings;