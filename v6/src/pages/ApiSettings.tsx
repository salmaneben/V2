import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import APISettings, { APISettingsState } from '@/features/settings/components/APISettings';
import { Info, CheckCircle } from 'lucide-react';

const ApiSettings = ({ sidebarState }) => {
  const [settings, setSettings] = useState(null);
  const [updateMessage, setUpdateMessage] = useState({ show: false, type: '', text: '' });

  useEffect(() => {
    // Load settings from localStorage on component mount
    const savedPerplexityApiKey = localStorage.getItem('perplexity_api_key');
    const savedOpenaiApiKey = localStorage.getItem('openai_api_key');
    const savedClaudeApiKey = localStorage.getItem('claude_api_key');
    const savedDeepseekApiKey = localStorage.getItem('deepseek_api_key');
    const savedCustomApiEndpoint = localStorage.getItem('custom_api_endpoint');
    const savedCustomApiKey = localStorage.getItem('custom_api_key');
    const savedCustomApiModel = localStorage.getItem('custom_api_model');
    const savedCustomApiVerify = localStorage.getItem('custom_api_verify');
    const savedPreferredProvider = localStorage.getItem('preferred_provider');
    
    setSettings({
      perplexityApiKey: savedPerplexityApiKey || '',
      openaiApiKey: savedOpenaiApiKey || '',
      openaiModel: localStorage.getItem('openai_model') || 'gpt-4o',
      claudeApiKey: savedClaudeApiKey || '',
      claudeModel: localStorage.getItem('claude_model') || 'claude-3-5-sonnet',
      deepseekApiKey: savedDeepseekApiKey || '',
      deepseekModel: localStorage.getItem('deepseek_model') || 'deepseek-chat',
      // Removed fluxaiApiKey and fluxaiModel
      customApiEndpoint: savedCustomApiEndpoint || '',
      customApiKey: savedCustomApiKey || '',
      customApiModel: savedCustomApiModel || '',
      customApiVerify: savedCustomApiVerify !== 'false',
      preferredProvider: savedPreferredProvider || 'perplexity'
    });
  }, []);

  const handleApiSettingsChange = (updatedSettings) => {
    setSettings(updatedSettings);
    
    // Show success message
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
              You can choose between Perplexity AI, OpenAI (GPT), Claude, DeepSeek, or your own custom API endpoint.
              {/* Removed Flux AI from description */}
            </p>
          </div>
        </div>
      </Card>
      
      <div className="space-y-8">
        {settings && (
          <APISettings 
            onSettingsChange={handleApiSettingsChange}
            // Make sure these props match what APISettings component expects
            settings={settings}
            providerOptions={[
              'perplexity',
              'openai', 
              'claude',
              'deepseek',
              'custom'
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default ApiSettings;