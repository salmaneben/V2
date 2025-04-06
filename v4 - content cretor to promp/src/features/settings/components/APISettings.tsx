import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, CheckCircle, AlertCircle, Lock, Globe, Sparkles, Server, Brain, Cpu, Code } from 'lucide-react';
import { testApiConnection } from '@/features/contentCreator/services/apiService';
import { cn } from '@/lib/utils';

// Define API endpoints and default models as constants
const API_ENDPOINTS = {
  PERPLEXITY: 'https://api.perplexity.ai/v2/chat/completions',
  OPENAI: 'https://api.openai.com/v1/chat/completions',
  CLAUDE: 'https://api.anthropic.com/v1/messages',
  DEEPSEEK: 'https://api.deepseek.ai/v1/chat/completions'
};

const DEFAULT_MODELS = {
  PERPLEXITY: 'llama-3.1-sonar-small-128k-online',
  OPENAI: 'gpt-4o',
  CLAUDE: 'claude-3-5-sonnet',
  DEEPSEEK: 'deepseek-llm-67b-chat'
};

export interface APISettingsProps {
  onSettingsChange?: (settings: APISettingsState) => void;
}

export interface APISettingsState {
  // Perplexity
  perplexityApiKey: string;
  // OpenAI
  openaiApiKey: string;
  openaiModel: string;
  // Claude
  claudeApiKey: string;
  claudeModel: string;
  // DeepSeek - New
  deepseekApiKey: string;
  deepseekModel: string;
  // Custom API
  customApiEndpoint: string;
  customApiKey: string;
  customApiModel: string;
  customApiVerify: boolean;
  // Preferred provider
  preferredProvider: 'perplexity' | 'openai' | 'claude' | 'deepseek' | 'custom';
}

interface TestStatus {
  status: 'idle' | 'testing' | 'success' | 'error';
  message: string;
}

const APISettings: React.FC<APISettingsProps> = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState<APISettingsState>({
    perplexityApiKey: '',
    openaiApiKey: '',
    openaiModel: 'gpt-4o',
    claudeApiKey: '',
    claudeModel: 'claude-3-5-sonnet',
    deepseekApiKey: '', // New
    deepseekModel: 'deepseek-llm-67b-chat', // New
    customApiEndpoint: '',
    customApiKey: '',
    customApiModel: '',
    customApiVerify: true,
    preferredProvider: 'perplexity',
  });

  const [testStatus, setTestStatus] = useState<Record<string, TestStatus>>({
    perplexity: { status: 'idle', message: '' },
    openai: { status: 'idle', message: '' },
    claude: { status: 'idle', message: '' },
    deepseek: { status: 'idle', message: '' }, // New
    custom: { status: 'idle', message: '' },
  });

  // OpenAI model options
  const openaiModelOptions = [
    { value: 'gpt-4o', label: 'GPT-4o' },
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  ];

  // Claude model options
  const claudeModelOptions = [
    { value: 'claude-3-opus', label: 'Claude 3 Opus' },
    { value: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet' },
    { value: 'claude-3-haiku', label: 'Claude 3 Haiku' },
    { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
  ];

  // DeepSeek model options - New
  const deepseekModelOptions = [
    { value: 'deepseek-llm-67b-chat', label: 'DeepSeek LLM 67B Chat' },
    { value: 'deepseek-coder-33b-instruct', label: 'DeepSeek Coder 33B' },
    { value: 'deepseek-math-7b-instruct', label: 'DeepSeek Math 7B' },
    { value: 'deepseek-llm-7b-chat', label: 'DeepSeek LLM 7B Chat' },
  ];

  // Load saved settings on component mount
  useEffect(() => {
    const loadedSettings: Partial<APISettingsState> = {};

    // Load Perplexity settings
    loadedSettings.perplexityApiKey = localStorage.getItem('perplexity_api_key') || '';

    // Load OpenAI settings
    loadedSettings.openaiApiKey = localStorage.getItem('openai_api_key') || '';
    loadedSettings.openaiModel = localStorage.getItem('openai_model') || 'gpt-4o';

    // Load Claude settings
    loadedSettings.claudeApiKey = localStorage.getItem('claude_api_key') || '';
    loadedSettings.claudeModel = localStorage.getItem('claude_model') || 'claude-3-5-sonnet';

    // Load DeepSeek settings - New
    loadedSettings.deepseekApiKey = localStorage.getItem('deepseek_api_key') || '';
    loadedSettings.deepseekModel = localStorage.getItem('deepseek_model') || 'deepseek-llm-67b-chat';

    // Load Custom API settings
    loadedSettings.customApiEndpoint = localStorage.getItem('custom_api_endpoint') || '';
    loadedSettings.customApiKey = localStorage.getItem('custom_api_key') || '';
    loadedSettings.customApiModel = localStorage.getItem('custom_api_model') || '';
    loadedSettings.customApiVerify = localStorage.getItem('custom_api_verify') !== 'false';

    // Load preferred provider
    const savedProvider = localStorage.getItem('preferred_provider');
    loadedSettings.preferredProvider = (savedProvider as APISettingsState['preferredProvider']) || 'perplexity';

    setSettings(prev => ({ ...prev, ...loadedSettings }));
  }, []);

  // Save settings to localStorage when they change
  const saveSettings = (newSettings: Partial<APISettingsState>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);

    // Save to localStorage
    Object.entries(newSettings).forEach(([key, value]) => {
      if (value !== undefined) {
        const storageKey = key.replace(/([A-Z])/g, '_$1').toLowerCase(); // camelCase to snake_case
        localStorage.setItem(storageKey, value.toString());
      }
    });

    // Notify parent component
    if (onSettingsChange) {
      onSettingsChange(updatedSettings);
    }
  };

  // Set preferred provider
  const setPreferredProvider = (provider: APISettingsState['preferredProvider']) => {
    saveSettings({ preferredProvider: provider });
  };

  // Test API connections
  const testApiConnection = async (provider: string) => {
    setTestStatus(prev => ({
      ...prev,
      [provider]: { status: 'testing', message: 'Testing connection...' },
    }));

    try {
      let result = { success: false, error: '' };

      switch (provider) {
        case 'perplexity':
          if (!settings.perplexityApiKey) {
            throw new Error('API key is required');
          }
          const perplexityResponse = await fetch(API_ENDPOINTS.PERPLEXITY, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${settings.perplexityApiKey}`,
            },
            body: JSON.stringify({
              model: DEFAULT_MODELS.PERPLEXITY,
              messages: [
                { role: 'system', content: 'This is a connection test.' },
                { role: 'user', content: 'Test connection' },
              ],
            }),
          });
          if (!perplexityResponse.ok) {
            throw new Error(`API returned status ${perplexityResponse.status}`);
          }
          result.success = true;
          break;

        case 'openai':
          if (!settings.openaiApiKey) {
            throw new Error('API key is required');
          }
          const openaiResponse = await fetch(API_ENDPOINTS.OPENAI, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${settings.openaiApiKey}`,
            },
            body: JSON.stringify({
              model: settings.openaiModel,
              messages: [
                { role: 'system', content: 'This is a connection test.' },
                { role: 'user', content: 'Test connection' },
              ],
              max_tokens: 10,
            }),
          });
          if (!openaiResponse.ok) {
            throw new Error(`API returned status ${openaiResponse.status}`);
          }
          result.success = true;
          break;

        case 'claude':
          if (!settings.claudeApiKey) {
            throw new Error('API key is required');
          }
          const claudeResponse = await fetch(API_ENDPOINTS.CLAUDE, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': settings.claudeApiKey,
              'anthropic-version': '2023-01-01',
            },
            body: JSON.stringify({
              model: settings.claudeModel,
              messages: [{ role: 'user', content: 'Test connection' }],
              max_tokens: 10,
            }),
          });
          if (!claudeResponse.ok) {
            throw new Error(`API returned status ${claudeResponse.status}`);
          }
          result.success = true;
          break;

        case 'deepseek':
          if (!settings.deepseekApiKey) {
            throw new Error('API key is required');
          }
          const deepseekResponse = await fetch(API_ENDPOINTS.DEEPSEEK, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${settings.deepseekApiKey}`,
            },
            body: JSON.stringify({
              model: settings.deepseekModel,
              messages: [
                { role: 'system', content: 'This is a connection test.' },
                { role: 'user', content: 'Test connection' },
              ],
              max_tokens: 10,
            }),
          });
          if (!deepseekResponse.ok) {
            throw new Error(`API returned status ${deepseekResponse.status}`);
          }
          result.success = true;
          break;

        case 'custom':
          if (!settings.customApiEndpoint || !settings.customApiKey) {
            throw new Error('API endpoint and key are required');
          }
          result = await testApiConnection({
            endpoint: settings.customApiEndpoint,
            apiKey: settings.customApiKey,
            model: settings.customApiModel,
            verifySSL: settings.customApiVerify,
          });
          break;
      }

      if (result.success) {
        setTestStatus(prev => ({
          ...prev,
          [provider]: { status: 'success', message: 'Connection successful!' },
        }));
      } else {
        throw new Error(result.error || 'Connection failed');
      }
    } catch (error) {
      setTestStatus(prev => ({
        ...prev,
        [provider]: {
          status: 'error',
          message: error instanceof Error ? error.message : 'An unknown error occurred',
        },
      }));
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">API Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <button
          type="button"
          className={cn(
            "p-3 rounded-md flex flex-col items-center justify-center gap-2 border transition-colors",
            settings.preferredProvider === 'perplexity'
              ? 'bg-indigo-50 border-indigo-300 text-indigo-800'
              : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100',
          )}
          onClick={() => setPreferredProvider('perplexity')}
        >
          <Sparkles className="h-6 w-6" />
          <span className="text-sm font-medium">Perplexity</span>
        </button>

        <button
          type="button"
          className={cn(
            "p-3 rounded-md flex flex-col items-center justify-center gap-2 border transition-colors",
            settings.preferredProvider === 'openai'
              ? 'bg-indigo-50 border-indigo-300 text-indigo-800'
              : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100',
          )}
          onClick={() => setPreferredProvider('openai')}
        >
          <Brain className="h-6 w-6" />
          <span className="text-sm font-medium">OpenAI</span>
        </button>

        <button
          type="button"
          className={cn(
            "p-3 rounded-md flex flex-col items-center justify-center gap-2 border transition-colors",
            settings.preferredProvider === 'claude'
              ? 'bg-indigo-50 border-indigo-300 text-indigo-800'
              : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100',
          )}
          onClick={() => setPreferredProvider('claude')}
        >
          <Cpu className="h-6 w-6" />
          <span className="text-sm font-medium">Claude</span>
        </button>

        {/* New DeepSeek button */}
        <button
          type="button"
          className={cn(
            "p-3 rounded-md flex flex-col items-center justify-center gap-2 border transition-colors",
            settings.preferredProvider === 'deepseek'
              ? 'bg-indigo-50 border-indigo-300 text-indigo-800'
              : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100',
          )}
          onClick={() => setPreferredProvider('deepseek')}
        >
          <Code className="h-6 w-6" />
          <span className="text-sm font-medium">DeepSeek</span>
        </button>

        <button
          type="button"
          className={cn(
            "p-3 rounded-md flex flex-col items-center justify-center gap-2 border transition-colors",
            settings.preferredProvider === 'custom'
              ? 'bg-indigo-50 border-indigo-300 text-indigo-800'
              : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100',
          )}
          onClick={() => setPreferredProvider('custom')}
        >
          <Server className="h-6 w-6" />
          <span className="text-sm font-medium">Custom API</span>
        </button>
      </div>

      {/* Perplexity API Section */}
      {settings.preferredProvider === 'perplexity' && (
        <Card className="p-6">
          <div className="flex items-center mb-4 gap-2">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            <h3 className="text-xl font-semibold">Perplexity API</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">API Key</label>
              <div className="relative">
                <input
                  type="password"
                  value={settings.perplexityApiKey}
                  onChange={(e) => saveSettings({ perplexityApiKey: e.target.value })}
                  placeholder="Enter your Perplexity API key"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div>
              <Button
                type="button"
                onClick={() => testApiConnection('perplexity')}
                disabled={testStatus.perplexity.status === 'testing'}
                className={cn(
                  "w-full p-3 flex justify-center items-center rounded-md text-white",
                  testStatus.perplexity.status === 'testing'
                    ? 'bg-indigo-400'
                    : testStatus.perplexity.status === 'success'
                      ? 'bg-green-600 hover:bg-green-700'
                      : testStatus.perplexity.status === 'error'
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-indigo-600 hover:bg-indigo-700',
                )}
              >
                {testStatus.perplexity.status === 'testing' ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Testing...
                  </>
                ) : testStatus.perplexity.status === 'success' ? (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Connection Successful
                  </>
                ) : testStatus.perplexity.status === 'error' ? (
                  <>
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Test Connection Again
                  </>
                ) : (
                  'Test Perplexity API Connection'
                )}
              </Button>
              {testStatus.perplexity.status !== 'idle' && (
                <div className={cn(
                  "mt-2 text-sm",
                  testStatus.perplexity.status === 'success' ? 'text-green-600' : 'text-red-600',
                )}>
                  {testStatus.perplexity.message}
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* OpenAI API Section */}
      {settings.preferredProvider === 'openai' && (
        <Card className="p-6">
          <div className="flex items-center mb-4 gap-2">
            <Brain className="h-5 w-5 text-indigo-500" />
            <h3 className="text-xl font-semibold">OpenAI API</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">API Key</label>
              <div className="relative">
                <input
                  type="password"
                  value={settings.openaiApiKey}
                  onChange={(e) => saveSettings({ openaiApiKey: e.target.value })}
                  placeholder="Enter your OpenAI API key"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Model</label>
              <select
                value={settings.openaiModel}
                onChange={(e) => saveSettings({ openaiModel: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                {openaiModelOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Button
                type="button"
                onClick={() => testApiConnection('openai')}
                disabled={testStatus.openai.status === 'testing'}
                className={cn(
                  "w-full p-3 flex justify-center items-center rounded-md text-white",
                  testStatus.openai.status === 'testing'
                    ? 'bg-indigo-400'
                    : testStatus.openai.status === 'success'
                      ? 'bg-green-600 hover:bg-green-700'
                      : testStatus.openai.status === 'error'
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-indigo-600 hover:bg-indigo-700',
                )}
              >
                {testStatus.openai.status === 'testing' ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Testing...
                  </>
                ) : testStatus.openai.status === 'success' ? (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Connection Successful
                  </>
                ) : testStatus.openai.status === 'error' ? (
                  <>
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Test Connection Again
                  </>
                ) : (
                  'Test OpenAI API Connection'
                )}
              </Button>
              {testStatus.openai.status !== 'idle' && (
                <div className={cn(
                  "mt-2 text-sm",
                  testStatus.openai.status === 'success' ? 'text-green-600' : 'text-red-600',
                )}>
                  {testStatus.openai.message}
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Claude API Section */}
      {settings.preferredProvider === 'claude' && (
        <Card className="p-6">
          <div className="flex items-center mb-4 gap-2">
            <Cpu className="h-5 w-5 text-indigo-500" />
            <h3 className="text-xl font-semibold">Claude API</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">API Key</label>
              <div className="relative">
                <input
                  type="password"
                  value={settings.claudeApiKey}
                  onChange={(e) => saveSettings({ claudeApiKey: e.target.value })}
                  placeholder="Enter your Anthropic API key"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Model</label>
              <select
                value={settings.claudeModel}
                onChange={(e) => saveSettings({ claudeModel: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                {claudeModelOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Button
                type="button"
                onClick={() => testApiConnection('claude')}
                disabled={testStatus.claude.status === 'testing'}
                className={cn(
                  "w-full p-3 flex justify-center items-center rounded-md text-white",
                  testStatus.claude.status === 'testing'
                    ? 'bg-indigo-400'
                    : testStatus.claude.status === 'success'
                      ? 'bg-green-600 hover:bg-green-700'
                      : testStatus.claude.status === 'error'
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-indigo-600 hover:bg-indigo-700',
                )}
              >
                {testStatus.claude.status === 'testing' ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Testing...
                  </>
                ) : testStatus.claude.status === 'success' ? (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Connection Successful
                  </>
                ) : testStatus.claude.status === 'error' ? (
                  <>
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Test Connection Again
                  </>
                ) : (
                  'Test Claude API Connection'
                )}
              </Button>
              {testStatus.claude.status !== 'idle' && (
                <div className={cn(
                  "mt-2 text-sm",
                  testStatus.claude.status === 'success' ? 'text-green-600' : 'text-red-600',
                )}>
                  {testStatus.claude.message}
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* DeepSeek API Section - New */}
      {settings.preferredProvider === 'deepseek' && (
        <Card className="p-6">
          <div className="flex items-center mb-4 gap-2">
            <Code className="h-5 w-5 text-indigo-500" />
            <h3 className="text-xl font-semibold">DeepSeek API</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">API Key</label>
              <div className="relative">
                <input
                  type="password"
                  value={settings.deepseekApiKey}
                  onChange={(e) => saveSettings({ deepseekApiKey: e.target.value })}
                  placeholder="Enter your DeepSeek API key"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Model</label>
              <select
                value={settings.deepseekModel}
                onChange={(e) => saveSettings({ deepseekModel: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                {deepseekModelOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Button
                type="button"
                onClick={() => testApiConnection('deepseek')}
                disabled={testStatus.deepseek.status === 'testing'}
                className={cn(
                  "w-full p-3 flex justify-center items-center rounded-md text-white",
                  testStatus.deepseek.status === 'testing'
                    ? 'bg-indigo-400'
                    : testStatus.deepseek.status === 'success'
                      ? 'bg-green-600 hover:bg-green-700'
                      : testStatus.deepseek.status === 'error'
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-indigo-600 hover:bg-indigo-700',
                )}
              >
                {testStatus.deepseek.status === 'testing' ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Testing...
                  </>
                ) : testStatus.deepseek.status === 'success' ? (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Connection Successful
                  </>
                ) : testStatus.deepseek.status === 'error' ? (
                  <>
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Test Connection Again
                  </>
                ) : (
                  'Test DeepSeek API Connection'
                )}
              </Button>
              {testStatus.deepseek.status !== 'idle' && (
                <div className={cn(
                  "mt-2 text-sm",
                  testStatus.deepseek.status === 'success' ? 'text-green-600' : 'text-red-600',
                )}>
                  {testStatus.deepseek.message}
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Custom API Section */}
      {settings.preferredProvider === 'custom' && (
        <Card className="p-6">
          <div className="flex items-center mb-4 gap-2">
            <Server className="h-5 w-5 text-indigo-500" />
            <h3 className="text-xl font-semibold">Custom API</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">API Endpoint</label>
              <div className="relative">
                <input
                  type="text"
                  value={settings.customApiEndpoint}
                  onChange={(e) => saveSettings({ customApiEndpoint: e.target.value })}
                  placeholder="https://api.yourservice.com/v1/completion"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
                />
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">API Key</label>
              <div className="relative">
                <input
                  type="password"
                  value={settings.customApiKey}
                  onChange={(e) => saveSettings({ customApiKey: e.target.value })}
                  placeholder="Enter your API key"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Model Name (Optional)</label>
              <input
                type="text"
                value={settings.customApiModel}
                onChange={(e) => saveSettings({ customApiModel: e.target.value })}
                placeholder="e.g., gpt-4-turbo, claude-3-opus"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="customApiVerify"
                checked={settings.customApiVerify}
                onChange={(e) => saveSettings({ customApiVerify: e.target.checked })}
                className="mr-2 h-4 w-4"
              />
              <label htmlFor="customApiVerify" className="text-gray-700">
                Verify SSL certificate
              </label>
            </div>
            <div>
              <Button
                type="button"
                onClick={() => testApiConnection('custom')}
                disabled={testStatus.custom.status === 'testing'}
                className={cn(
                  "w-full p-3 flex justify-center items-center rounded-md text-white",
                  testStatus.custom.status === 'testing'
                    ? 'bg-indigo-400'
                    : testStatus.custom.status === 'success'
                      ? 'bg-green-600 hover:bg-green-700'
                      : testStatus.custom.status === 'error'
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-indigo-600 hover:bg-indigo-700',
                )}
              >
                {testStatus.custom.status === 'testing' ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Testing...
                  </>
                ) : testStatus.custom.status === 'success' ? (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Connection Successful
                  </>
                ) : testStatus.custom.status === 'error' ? (
                  <>
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Test Connection Again
                  </>
                ) : (
                  'Test Custom API Connection'
                )}
              </Button>
              {testStatus.custom.status !== 'idle' && (
                <div className={cn(
                  "mt-2 text-sm",
                  testStatus.custom.status === 'success' ? 'text-green-600' : 'text-red-600',
                )}>
                  {testStatus.custom.message}
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default APISettings;