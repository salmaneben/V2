// src/pages/Generator.tsx
import React, { useState, useEffect } from 'react';
import GeneratorForm from '@/features/generator/components/GeneratorForm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { savePrompt, incrementStat } from '@/lib/appStats';
import { 
  requestNotificationPermission, 
  showNotification 
} from '@/lib/notificationUtils';

interface GeneratorProps {
  sidebarState: string;
}

const Generator: React.FC<GeneratorProps> = ({ sidebarState }) => {
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [apiKeys, setApiKeys] = useState<{[key: string]: string}>({});
  const [apiModels, setApiModels] = useState<{[key: string]: string}>({});

  useEffect(() => {
    // Increment API calls when Generator page is visited
    incrementStat('apiCalls');
    
    // Request notification permissions
    const setupNotifications = async () => {
      const permissionGranted = await requestNotificationPermission();
      setNotificationsEnabled(permissionGranted);
    };
    
    setupNotifications();

    // Load preferred provider and API keys from localStorage
    const preferredProvider = localStorage.getItem('preferred_provider') || 'perplexity';
    setSelectedProvider(preferredProvider);
    
    // Load all API keys
    const keys = {
      perplexity: localStorage.getItem('perplexity_api_key') || '',
      openai: localStorage.getItem('openai_api_key') || '',
      claude: localStorage.getItem('claude_api_key') || '',
      deepseek: localStorage.getItem('deepseek_api_key') || '',
      gemini: localStorage.getItem('gemini_api_key') || '',
      custom: localStorage.getItem('custom_api_key') || ''
    };
    setApiKeys(keys);
    
    // Load all API models
    const models = {
      perplexity: localStorage.getItem('perplexity_model') || 'llama-3.1-sonar-small-128k-online',
      openai: localStorage.getItem('openai_model') || 'gpt-4o',
      claude: localStorage.getItem('claude_model') || 'claude-3-5-sonnet',
      deepseek: localStorage.getItem('deepseek_model') || 'deepseek-chat',
      gemini: localStorage.getItem('gemini_model') || 'gemini-2.0-flash',
      custom: localStorage.getItem('custom_api_model') || '',
    };
    setApiModels(models);
  }, []);

  const handleGenerate = (formData: any) => {
    console.log('Generating prompt with data:', formData);
    
    if (formData.generatedPrompt) {
      setGeneratedPrompt(formData.generatedPrompt);
      
      // Get the title from the form data or use a default
      const title = formData.mainKeyword 
        ? `Prompt for: ${formData.mainKeyword}` 
        : 'New SEO Prompt';
        
      // Save the prompt and update stats
      savePrompt(title, formData.generatedPrompt);
      
      // Show success notification
      if (notificationsEnabled) {
        showNotification(
          'Prompt Generated Successfully!', 
          {
            body: `Your prompt "${title}" has been created and saved.`,
            icon: '/favicon.ico'
          }
        );
      }
      
      console.log('Prompt generated successfully');
    }
  };

  const handleCopy = async () => {
    if (generatedPrompt) {
      try {
        await navigator.clipboard.writeText(generatedPrompt);
        setCopied(true);
        
        // Show notification for copy success
        if (notificationsEnabled) {
          showNotification(
            'Copied to Clipboard', 
            {
              body: 'The prompt has been copied to your clipboard.',
              icon: '/favicon.ico'
            }
          );
        }
        
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provider = e.target.value;
    setSelectedProvider(provider);
    localStorage.setItem('preferred_provider', provider);
  };

  // Get the current API config for the selected provider
  const getApiConfig = () => {
    const config = {
      provider: selectedProvider,
      apiKey: apiKeys[selectedProvider] || '',
    };
    
    // Add model if applicable for this provider
    if (selectedProvider in apiModels) {
      config['model'] = apiModels[selectedProvider];
    }
    
    // Add endpoint for custom API
    if (selectedProvider === 'custom') {
      config['endpoint'] = localStorage.getItem('custom_api_endpoint') || '';
      config['verifySSL'] = localStorage.getItem('custom_api_verify') !== 'false';
    }
    
    return config;
  };

  return (
    <div className={`
      py-6 px-2 transition-all duration-300
      ${sidebarState === 'expanded' ? 'max-w-5xl' : 'max-w-6xl'} 
      mx-auto
    `}>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">SEO Prompt Generator</h1>
        <p className="text-gray-600 mt-2">
          Fill out the form below to generate an optimized content creation prompt.
        </p>
      </div>
      
      <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">API Provider Settings</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="apiProvider" className="block text-sm font-medium text-gray-700 mb-1">
              Select API Provider
            </label>
            <select
              id="apiProvider"
              value={selectedProvider}
              onChange={handleProviderChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="perplexity">Perplexity AI</option>
              <option value="openai">OpenAI</option>
              <option value="claude">Anthropic Claude</option>
              <option value="deepseek">DeepSeek</option>
              <option value="gemini">Google Gemini</option>
              <option value="custom">Custom API</option>
            </select>
          </div>
          
          {selectedProvider === 'perplexity' && (
            <div className="flex-1">
              <label htmlFor="perplexityModel" className="block text-sm font-medium text-gray-700 mb-1">
                Perplexity Model
              </label>
              <select
                id="perplexityModel"
                value={apiModels.perplexity}
                onChange={(e) => {
                  const newModels = {...apiModels, perplexity: e.target.value};
                  setApiModels(newModels);
                  localStorage.setItem('perplexity_model', e.target.value);
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="llama-3.1-sonar-small-128k-online">Llama 3.1 Sonar Small</option>
                <option value="llama-3.1-sonar-medium-128k-online">Llama 3.1 Sonar Medium</option>
                <option value="sonar-small-online">Sonar Small</option>
                <option value="sonar-medium-online">Sonar Medium</option>
              </select>
            </div>
          )}
          
          {selectedProvider === 'openai' && (
            <div className="flex-1">
              <label htmlFor="openaiModel" className="block text-sm font-medium text-gray-700 mb-1">
                OpenAI Model
              </label>
              <select
                id="openaiModel"
                value={apiModels.openai}
                onChange={(e) => {
                  const newModels = {...apiModels, openai: e.target.value};
                  setApiModels(newModels);
                  localStorage.setItem('openai_model', e.target.value);
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="gpt-4o">GPT-4o</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              </select>
            </div>
          )}
          
          {selectedProvider === 'claude' && (
            <div className="flex-1">
              <label htmlFor="claudeModel" className="block text-sm font-medium text-gray-700 mb-1">
                Claude Model
              </label>
              <select
                id="claudeModel"
                value={apiModels.claude}
                onChange={(e) => {
                  const newModels = {...apiModels, claude: e.target.value};
                  setApiModels(newModels);
                  localStorage.setItem('claude_model', e.target.value);
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                <option value="claude-3-opus">Claude 3 Opus</option>
                <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                <option value="claude-3-haiku">Claude 3 Haiku</option>
                <option value="claude-2">Claude 2</option>
              </select>
            </div>
          )}
          
          {selectedProvider === 'deepseek' && (
            <div className="flex-1">
              <label htmlFor="deepseekModel" className="block text-sm font-medium text-gray-700 mb-1">
                DeepSeek Model
              </label>
              <select
                id="deepseekModel"
                value={apiModels.deepseek}
                onChange={(e) => {
                  const newModels = {...apiModels, deepseek: e.target.value};
                  setApiModels(newModels);
                  localStorage.setItem('deepseek_model', e.target.value);
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="deepseek-chat">DeepSeek Chat</option>
                <option value="deepseek-coder">DeepSeek Coder</option>
              </select>
            </div>
          )}

          {selectedProvider === 'gemini' && (
            <div className="flex-1">
              <label htmlFor="geminiModel" className="block text-sm font-medium text-gray-700 mb-1">
                Gemini Model
              </label>
              <select
                id="geminiModel"
                value={apiModels.gemini}
                onChange={(e) => {
                  const newModels = {...apiModels, gemini: e.target.value};
                  setApiModels(newModels);
                  localStorage.setItem('gemini_model', e.target.value);
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                <option value="gemini-2.0-pro">Gemini 2.0 Pro</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
              </select>
            </div>
          )}
          
          {selectedProvider === 'custom' && (
            <div className="flex-1">
              <label htmlFor="customModel" className="block text-sm font-medium text-gray-700 mb-1">
                Custom Model Name
              </label>
              <input
                type="text"
                id="customModel"
                value={apiModels.custom}
                onChange={(e) => {
                  const newModels = {...apiModels, custom: e.target.value};
                  setApiModels(newModels);
                  localStorage.setItem('custom_api_model', e.target.value);
                }}
                placeholder="Enter model name if required"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
        </div>
        
        {(!apiKeys[selectedProvider]) && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
            <p className="font-medium">API key not found!</p>
            <p>You need to set up your API key in the Settings page before using this provider.</p>
          </div>
        )}
      </div>
      
      <GeneratorForm 
        onSubmit={handleGenerate} 
        sidebarState={sidebarState} 
        apiConfig={getApiConfig()}
      />

      {generatedPrompt && (
        <Card className="p-6 mt-6 border-green-200">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Generated Prompt</h2>
              <Button
                onClick={handleCopy}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy to Clipboard
                  </>
                )}
              </Button>
            </div>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap bg-gray-50 p-6 rounded-lg border border-gray-100">
                {generatedPrompt}
              </div>
            </div>
            <div className="text-sm text-gray-500 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="font-medium">Tip: Use this prompt with ChatGPT, Claude, or other AI assistants.</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Generator;