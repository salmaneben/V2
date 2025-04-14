import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useContentCreatorForm } from '../hooks/useContentCreatorForm';
import { GeneratedPromptCard } from './GeneratedPromptCard';
import { Spinner } from '@/components/ui/spinner';
import { Alert } from '@/components/ui/alert';
import { ApiConfig } from '../types';
import { 
  HelpCircle, ChevronUp, ChevronDown, Sparkles, CheckCircle, AlertCircle, 
  Loader2, Stars, FileText, Hash, Globe, Users, Search, Zap, 
  ListChecks, Link, ExternalLink, Settings, Type, LayoutList,
  Lightbulb, BrainCircuit, CheckSquare, Languages, MapPin, BookOpen,
  AlignLeft, LucideProps, Copy, CheckCircle2, ThumbsUp, Info
} from 'lucide-react';

// Hook descriptions object
const hookDescriptions = {
  "Question": "Craft an intriguing question that immediately draws the reader's attention. The question should be relevant to the article's topic and evoke curiosity or challenge common beliefs. Aim to make the reader reflect or feel compelled to find the answer within the article.",
  "Statistical or Fact": "Begin with a surprising statistic or an unexpected fact that relates directly to the article's main topic. This hook should provide a sense of scale or impact that makes the reader eager to learn more about the subject.",
  "Quotation": "Use a powerful or thought-provoking quote from a well-known figure that ties into the theme of the article. The quote should set the tone for the article and provoke interest in the topic.",
  "Anecdotal or Story": "Create a brief, engaging story or anecdote that is relevant to the article's main subject. This story should be relatable and set the stage for the main content.",
  "Personal or Emotional": "Start with a personal experience or an emotional appeal that connects with the reader on a deeper level. This approach should establish empathy and make the topic feel more relevant to the reader's life."
};

// Helper function for section icons with consistent styling
const SectionIcon = ({ icon: Icon, ...props }: { icon: React.ElementType } & LucideProps) => (
  <span className="inline-flex items-center justify-center p-1 rounded-md bg-emerald-100">
    <Icon className="h-4 w-4 text-emerald-600" {...props} />
  </span>
);

interface ContentCreatorFormProps {
  onSubmit?: (data: any) => void;
  apiConfig: ApiConfig;
}

export const ContentCreatorForm: React.FC<ContentCreatorFormProps> = ({ 
  onSubmit,
  apiConfig
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(apiConfig.provider || 'perplexity');
  const [selectedModel, setSelectedModel] = useState(apiConfig.model || '');
  const [apiTestStatus, setApiTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [apiTestMessage, setApiTestMessage] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    aiSettings: true,
    basicInfo: true,
    coreSettings: true,
    textSettings: true,
    seoSettings: true,
    structure: true,
    documentElements: true,
    internalLinking: true,
    externalLinking: true
  });
  
  // Get all available API providers from localStorage
  const [availableProviders, setAvailableProviders] = useState<Array<{label: string, value: string, configured: boolean}>>([]);
  
  // Initialize available providers
  useEffect(() => {
    const providers = [
      { 
        label: 'Perplexity AI', 
        value: 'perplexity',
        configured: !!localStorage.getItem('perplexity_api_key')
      },
      { 
        label: 'OpenAI (GPT)', 
        value: 'openai',
        configured: !!localStorage.getItem('openai_api_key')
      },
      { 
        label: 'Claude AI', 
        value: 'claude',
        configured: !!localStorage.getItem('claude_api_key')
      },
      { 
        label: 'DeepSeek AI', 
        value: 'deepseek',
        configured: !!localStorage.getItem('deepseek_api_key')
      },
      { 
        label: 'Google Gemini', 
        value: 'gemini',
        configured: !!localStorage.getItem('gemini_api_key')
      },
      { 
        label: 'Custom API', 
        value: 'custom',
        configured: !!(localStorage.getItem('custom_api_key') && localStorage.getItem('custom_api_endpoint'))
      },
    ];
    
    setAvailableProviders(providers);
    
    // Set initial model selection based on provider
    updateModelOptions(selectedProvider);
  }, []);
  
  // Model options for different providers
  const getModelOptions = (provider: string) => {
    switch (provider) {
      case 'openai':
        return [
          { label: 'GPT-4o', value: 'gpt-4o' },
          { label: 'GPT-4 Turbo', value: 'gpt-4-turbo' },
          { label: 'GPT-4', value: 'gpt-4' },
          { label: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
        ];
      case 'claude':
        return [
          { label: 'Claude 3.5 Sonnet', value: 'claude-3-5-sonnet' },
          { label: 'Claude 3 Opus', value: 'claude-3-opus' },
          { label: 'Claude 3 Sonnet', value: 'claude-3-sonnet' },
          { label: 'Claude 3 Haiku', value: 'claude-3-haiku' },
        ];
      case 'perplexity':
        return [
          { label: 'Llama 3.1 Sonar Small 128K', value: 'llama-3.1-sonar-small-128k-online' },
          { label: 'Llama 3.1 Sonar Medium 128K', value: 'llama-3.1-sonar-medium-128k-online' },
          { label: 'Mixtral 8x7B', value: 'mixtral-8x7b-32768' },
          { label: 'Sonar Small Online', value: 'sonar-small-online' },
          { label: 'Sonar Medium Online', value: 'sonar-medium-online' },
        ];
      case 'deepseek':
        return [
          { label: 'DeepSeek Chat', value: 'deepseek-chat' },
          { label: 'DeepSeek Coder', value: 'deepseek-coder' },
        ];
      case 'gemini':
        return [
          { label: 'Gemini 2.0 Flash', value: 'gemini-2.0-flash' },
          { label: 'Gemini 2.0 Pro', value: 'gemini-2.0-pro' },
          { label: 'Gemini 1.5 Pro', value: 'gemini-1.5-pro' },
          { label: 'Gemini 1.5 Flash', value: 'gemini-1.5-flash' },
        ];
      case 'custom':
        return [
          { label: localStorage.getItem('custom_api_model') || 'Custom Model', value: localStorage.getItem('custom_api_model') || '' },
        ];
      default:
        return [];
    }
  };
  
  const [modelOptions, setModelOptions] = useState(getModelOptions(selectedProvider));
  
  const updateModelOptions = (provider: string) => {
    const options = getModelOptions(provider);
    setModelOptions(options);
    
    // Set default model for the selected provider
    let defaultModel = '';
    if (options.length > 0) {
      if (provider === 'perplexity') {
        defaultModel = localStorage.getItem('perplexity_model') || 'llama-3.1-sonar-small-128k-online';
      } else if (provider === 'openai') {
        defaultModel = localStorage.getItem('openai_model') || 'gpt-4o';
      } else if (provider === 'claude') {
        defaultModel = localStorage.getItem('claude_model') || 'claude-3-5-sonnet';
      } else if (provider === 'deepseek') {
        defaultModel = localStorage.getItem('deepseek_model') || 'deepseek-chat';
      } else if (provider === 'gemini') {
        defaultModel = localStorage.getItem('gemini_model') || 'gemini-2.0-flash';
      } else if (provider === 'custom') {
        defaultModel = localStorage.getItem('custom_api_model') || '';
      }
      
      setSelectedModel(defaultModel);
    }
  };

  // Get a new apiConfig based on selected provider and model
  const getUpdatedApiConfig = (): ApiConfig => {
    let updatedConfig: ApiConfig = {
      provider: selectedProvider,
      apiKey: '',
      model: selectedModel,
    };
    
    // Get API key based on selected provider
    switch (selectedProvider) {
      case 'perplexity':
        updatedConfig.apiKey = localStorage.getItem('perplexity_api_key') || '';
        break;
      case 'openai':
        updatedConfig.apiKey = localStorage.getItem('openai_api_key') || '';
        break;
      case 'claude':
        updatedConfig.apiKey = localStorage.getItem('claude_api_key') || '';
        break;
      case 'deepseek':
        updatedConfig.apiKey = localStorage.getItem('deepseek_api_key') || '';
        break;
      case 'gemini':
        updatedConfig.apiKey = localStorage.getItem('gemini_api_key') || '';
        break;
      case 'custom':
        updatedConfig.endpoint = localStorage.getItem('custom_api_endpoint') || '';
        updatedConfig.apiKey = localStorage.getItem('custom_api_key') || '';
        updatedConfig.verifySSL = localStorage.getItem('custom_api_verify') !== 'false';
        break;
    }
    
    return updatedConfig;
  };
  
  // Create a modified apiConfig that includes our selected provider and model
  const modifiedApiConfig = getUpdatedApiConfig();

  // Updated destructuring to include isGeneratingLongTailKeywords and generateLongTailKeywords
  const {
    formData,
    generatedPrompt,
    apiError,
    isGenerating,
    isGeneratingKeywords,
    isGeneratingLongTailKeywords,
    isGeneratingFAQs,
    isGeneratingTargetAudience,
    isGeneratingTitle,
    isGeneratingLinks,
    isGeneratingInternalLinks,
    handleInputChange,
    handleCheckboxChange,
    handleSubmit,
    generateSEOKeywords,
    generateLongTailKeywords,
    generateFAQs,
    generateTargetAudience,
    generateTitle,
    generateLinks,
    generateInternalLinks,
    websiteUrl,
    setWebsiteUrl,
    websiteUrls,
    setWebsiteUrls,
  } = useContentCreatorForm({ 
    onSubmit, 
    generationMode: 'prompt', // Hardcoded to prompt mode
    apiConfig: modifiedApiConfig
  });
  
  const handleCopyContent = () => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };
  
  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provider = e.target.value;
    setSelectedProvider(provider);
    updateModelOptions(provider);
    
    // Save as preferred provider
    localStorage.setItem('preferred_provider', provider);
  };
  
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const model = e.target.value;
    setSelectedModel(model);
    
    // Save model selection for this provider
    if (selectedProvider === 'perplexity') {
      localStorage.setItem('perplexity_model', model);
    } else if (selectedProvider === 'openai') {
      localStorage.setItem('openai_model', model);
    } else if (selectedProvider === 'claude') {
      localStorage.setItem('claude_model', model);
    } else if (selectedProvider === 'deepseek') {
      localStorage.setItem('deepseek_model', model);
    } else if (selectedProvider === 'gemini') {
      localStorage.setItem('gemini_model', model);
    } else if (selectedProvider === 'custom') {
      localStorage.setItem('custom_api_model', model);
    }
  };
  
  // Function to handle hook type change
  const handleHookTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedHookType = e.target.value;
    
    // Update the hook type
    handleInputChange('introductoryHook', selectedHookType);
    
    // If a hook type was selected, also update the custom hook text with the appropriate description
    if (selectedHookType && hookDescriptions[selectedHookType]) {
      handleInputChange('customHook', hookDescriptions[selectedHookType]);
    } else {
      // If "None" was selected, clear the custom hook text
      handleInputChange('customHook', '');
    }
  };
  
  // Get provider icon with enhanced styling
  const getProviderIcon = (provider: string) => {
    switch(provider) {
      case 'perplexity':
        return (
          <span className="inline-flex items-center justify-center p-1 rounded-md bg-indigo-100">
            <Sparkles className="h-4 w-4 text-indigo-500" />
          </span>
        );
      case 'openai':
        return (
          <span className="inline-flex items-center justify-center p-1 rounded-md bg-green-100">
            <Sparkles className="h-4 w-4 text-green-500" />
          </span>
        );
      case 'claude':
        return (
          <span className="inline-flex items-center justify-center p-1 rounded-md bg-purple-100">
            <Sparkles className="h-4 w-4 text-purple-500" />
          </span>
        );
      case 'deepseek':
        return (
          <span className="inline-flex items-center justify-center p-1 rounded-md bg-blue-100">
            <Sparkles className="h-4 w-4 text-blue-500" />
          </span>
        );
      case 'gemini':
        return (
          <span className="inline-flex items-center justify-center p-1 rounded-md bg-amber-100">
            <Stars className="h-4 w-4 text-amber-500" />
          </span>
        );
      case 'custom':
        return (
          <span className="inline-flex items-center justify-center p-1 rounded-md bg-gray-100">
            <Sparkles className="h-4 w-4 text-gray-500" />
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center justify-center p-1 rounded-md bg-purple-100">
            <Sparkles className="h-4 w-4 text-purple-500" />
          </span>
        );
    }
  };

  // Custom spinner component to match our design
  const CustomSpinner = () => (
    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-emerald-500 border-t-transparent"></div>
  );

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Enhanced Card Style for AI Settings Section */}
      <Card className="w-full border border-emerald-200 shadow-md hover:shadow-lg transition-shadow rounded-xl overflow-hidden">
        <CardHeader 
          className="cursor-pointer bg-gradient-to-r from-emerald-50 to-transparent border-b border-emerald-100"
          onClick={() => toggleSection('aiSettings')}
        >
          <div className="flex justify-between items-center w-full">
            <CardTitle className="text-emerald-800 font-semibold flex items-center gap-2">
              <SectionIcon icon={BrainCircuit} />
              AI Settings
            </CardTitle>
            {expandedSections.aiSettings ? 
              <ChevronUp className="h-5 w-5 text-emerald-500 transition-transform duration-200" /> : 
              <ChevronDown className="h-5 w-5 text-emerald-500 transition-transform duration-200" />
            }
          </div>
        </CardHeader>
        {expandedSections.aiSettings && (
          <CardContent className="p-5 animate-[fadeIn_0.3s_ease-in-out]">
            <div className="space-y-6">
              <div className="mb-5">
                <div className="flex items-center mb-2">
                  {getProviderIcon(selectedProvider)}
                  <label className="text-sm font-medium text-gray-700 ml-2 flex items-center">AI Provider</label>
                </div>
                <select
                  value={selectedProvider}
                  onChange={handleProviderChange}
                  className="w-full py-2 px-3 border border-emerald-300 rounded-md focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all"
                >
                  {availableProviders.map(provider => (
                    <option 
                      key={provider.value} 
                      value={provider.value}
                      disabled={!provider.configured}
                    >
                      {provider.label}
                      {!provider.configured && " (Not Configured)"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="h-px bg-gradient-to-r from-emerald-200 to-transparent my-5"></div>

              <div className="mb-5">
                <div className="flex items-center mb-2">
                  <span className="inline-flex items-center justify-center p-1 rounded-md bg-emerald-100">
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                  </span>
                  <label className="text-sm font-medium text-gray-700 ml-2">AI Model</label>
                </div>
                <select
                  value={selectedModel}
                  onChange={handleModelChange}
                  className="w-full py-2 px-3 border border-emerald-300 rounded-md focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all"
                >
                  {modelOptions.map(model => (
                    <option key={model.value} value={model.value}>
                      {model.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {selectedProvider === 'custom' && (
                <div className="space-y-3 bg-emerald-50 p-4 rounded-md border border-emerald-100 shadow-sm">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">API Endpoint</label>
                    <input
                      type="text"
                      value={formData.customApiEndpoint || ""}
                      onChange={(e) => handleInputChange('customApiEndpoint', e.target.value)}
                      placeholder="https://api.yourservice.com/v1/completion"
                      className="w-full py-2 px-3 border border-emerald-300 rounded-md focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">API Key</label>
                    <input
                      type="password"
                      value={formData.customApiKey || ""}
                      onChange={(e) => handleInputChange('customApiKey', e.target.value)}
                      placeholder="Enter your API key"
                      className="w-full py-2 px-3 border border-emerald-300 rounded-md focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Model Name (Optional)</label>
                    <input
                      type="text"
                      value={formData.customApiModel || ""}
                      onChange={(e) => handleInputChange('customApiModel', e.target.value)}
                      placeholder="e.g., gpt-4-turbo, claude-3-opus"
                      className="w-full py-2 px-3 border border-emerald-300 rounded-md focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="customApiVerify"
                      checked={formData.customApiVerify || false}
                      onChange={(e) => handleInputChange('customApiVerify', e.target.checked)}
                      className="h-4 w-4 text-emerald-500 focus:ring-emerald-400 border-gray-300 rounded"
                    />
                    <label htmlFor="customApiVerify" className="ml-2 text-sm text-gray-700">
                      Verify SSL certificate
                    </label>
                  </div>
                  
                  <button
                    type="button"
                    className={`w-full py-2 px-3 flex justify-center items-center rounded-md transition-colors text-sm font-medium ${
                      apiTestStatus === 'testing' 
                        ? 'bg-emerald-400 text-white opacity-75 cursor-not-allowed' 
                        : apiTestStatus === 'success' 
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                          : apiTestStatus === 'error' 
                            ? 'bg-red-600 hover:bg-red-700 text-white' 
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                    onClick={() => {
                      // Set states for test connection
                      if (!formData.customApiEndpoint || !formData.customApiKey) {
                        setApiTestStatus('error');
                        setApiTestMessage('API endpoint and API key are required');
                        return;
                      }
                      
                      setApiTestStatus('testing');
                      setApiTestMessage('Testing connection...');
                      
                      // Simulate connection test
                      setTimeout(() => {
                        setApiTestStatus('success');
                        setApiTestMessage('Connection successful!');
                      }, 2000);
                    }}
                    disabled={apiTestStatus === 'testing'}
                  >
                    {apiTestStatus === 'testing' ? (
                      <>
                        <CustomSpinner />
                        <span className="ml-2">Testing...</span>
                      </>
                    ) : apiTestStatus === 'success' ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Connection Successful
                      </>
                    ) : apiTestStatus === 'error' ? (
                      <>
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Test Connection Again
                      </>
                    ) : (
                      'Test Connection'
                    )}
                  </button>
                  
                  {apiTestStatus !== 'idle' && (
                    <div className={`mt-2 text-sm ${
                      apiTestStatus === 'success' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {apiTestMessage}
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Display error if any */}
        {apiError && (
          <Alert variant="destructive" className="border-red-300 bg-red-50 text-red-800">
            <AlertCircle className="h-4 w-4 mr-2" />
            {apiError}
          </Alert>
        )}

        {/* Basic Info Section */}
        <Card className="w-full border border-emerald-200 shadow-md hover:shadow-lg transition-shadow rounded-xl overflow-hidden">
          <CardHeader 
            className="cursor-pointer bg-gradient-to-r from-emerald-50 to-transparent border-b border-emerald-100"
            onClick={() => toggleSection('basicInfo')}
          >
            <div className="flex justify-between items-center w-full">
              <CardTitle className="text-emerald-800 font-semibold flex items-center gap-2">
                <SectionIcon icon={FileText} />
                Basic Info
              </CardTitle>
              {expandedSections.basicInfo ? 
                <ChevronUp className="h-5 w-5 text-emerald-500 transition-transform duration-200" /> : 
                <ChevronDown className="h-5 w-5 text-emerald-500 transition-transform duration-200" />
              }
            </div>
          </CardHeader>
          {expandedSections.basicInfo && (
            <CardContent className="p-5 animate-[fadeIn_0.3s_ease-in-out]">
              <div className="mb-5">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Hash className="h-4 w-4 text-emerald-500 mr-1" />
                  Main Keyword
                </label>
                <Input
                  placeholder="Enter your main keyword or topic"
                  value={formData.mainKeyword}
                  onChange={(e) => handleInputChange('mainKeyword', e.target.value)}
                  required
                  className="border-emerald-300 focus:border-emerald-500 focus:ring-emerald-200"
                />
              </div>
              
              <div className="h-px bg-gradient-to-r from-emerald-200 to-transparent my-5"></div>
              
              <div className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <FileText className="h-4 w-4 text-emerald-500 mr-1" />
                    Title
                  </label>
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="outline"
                    onClick={generateTitle}
                    disabled={!formData.mainKeyword || isGeneratingTitle}
                    className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    {isGeneratingTitle ? (
                      <CustomSpinner />
                    ) : (
                      <Sparkles className="h-3 w-3 mr-1" />
                    )}
                    <span className="ml-1">{isGeneratingTitle ? 'Generating...' : 'Generate'}</span>
                  </Button>
                </div>
                <Input
                  placeholder="Title for your content"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="border-emerald-300 focus:border-emerald-500 focus:ring-emerald-200"
                />
              </div>
              
              <div className="h-px bg-gradient-to-r from-emerald-200 to-transparent my-5"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Languages className="h-4 w-4 text-emerald-500 mr-1" />
                    Language
                  </label>
                  <select
                    className="w-full py-2 px-3 border border-emerald-300 rounded-md focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all"
                    value={formData.language}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                  >
                    <option value="English (US)">🇺🇸 English (US)</option>
                    <option value="English (UK)">🇬🇧 English (UK)</option>
                    <option value="English (Australia)">🇦🇺 English (Australia)</option>
                    <option value="English (Canada)">🇨🇦 English (Canada)</option>
                    <option value="Afrikaans">Afrikaans</option>
                    <option value="Albanian">Albanian</option>
                    <option value="Arabic">Arabic</option>
                    <option value="Armenian">Armenian</option>
                    <option value="Azerbaijani">Azerbaijani</option>
                    <option value="Bengali">Bengali</option>
                    <option value="Bulgarian">Bulgarian</option>
                    <option value="Chinese (Simplified)">Chinese (Simplified)</option>
                    <option value="Chinese (Traditional)">Chinese (Traditional)</option>
                    <option value="Croatian">Croatian</option>
                    <option value="Czech">Czech</option>
                    <option value="Danish">Danish</option>
                    <option value="Dutch">Dutch</option>
                    <option value="Estonian">Estonian</option>
                    <option value="Filipino">Filipino</option>
                    <option value="Finnish">Finnish</option>
                    <option value="French">French</option>
                    <option value="Georgian">Georgian</option>
                    <option value="German">German</option>
                    <option value="Greek">Greek</option>
                    <option value="Hebrew">Hebrew</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Hungarian">Hungarian</option>
                    <option value="Indonesian">Indonesian</option>
                    <option value="Italian">Italian</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Kazakh">Kazakh</option>
                    <option value="Korean">Korean</option>
                    <option value="Kyrgyz">Kyrgyz</option>
                    <option value="Latvian">Latvian</option>
                    <option value="Lithuanian">Lithuanian</option>
                    <option value="Macedonian">Macedonian</option>
                    <option value="Malay">Malay</option>
                    <option value="Norwegian">Norwegian</option>
                    <option value="Persian">Persian</option>
                    <option value="Polish">Polish</option>
                    <option value="Portuguese (Brazilian)">Portuguese (Brazilian)</option>
                    <option value="Portuguese (European)">Portuguese (European)</option>
                    <option value="Romanian">Romanian</option>
                    <option value="Russian">Russian</option>
                    <option value="Serbian">Serbian</option>
                    <option value="Sinhala">Sinhala</option>
                    <option value="Slovak">Slovak</option>
                    <option value="Slovenian">Slovenian</option>
                    <option value="Spanish">Spanish</option>
                    <option value="Swahili">Swahili</option>
                    <option value="Swedish">Swedish</option>
                    <option value="Tajik">Tajik</option>
                    <option value="Thai">Thai</option>
                    <option value="Turkish">Turkish</option>
                    <option value="Turkmen">Turkmen</option>
                    <option value="Ukrainian">Ukrainian</option>
                    <option value="Urdu">Urdu</option>
                    <option value="Uzbek">Uzbek</option>
                    <option value="Vietnamese">Vietnamese</option>
                  </select>
                </div>
                
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 text-emerald-500 mr-1" />
                    Country/Region
                  </label>
                  <select
                    className="w-full py-2 px-3 border border-emerald-300 rounded-md focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                  >
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Spain">Spain</option>
                    <option value="Italy">Italy</option>
                    <option value="Japan">Japan</option>
                    <option value="Brazil">Brazil</option>
                    <option value="Mexico">Mexico</option>
                    <option value="India">India</option>
                    <option value="Global">Global</option>
                  </select>
                </div>
              </div>
              
              <div className="h-px bg-gradient-to-r from-emerald-200 to-transparent my-5"></div>
              
              <div className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Users className="h-4 w-4 text-emerald-500 mr-1" />
                    Target Audience
                  </label>
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="outline"
                    onClick={generateTargetAudience}
                    disabled={!formData.mainKeyword || isGeneratingTargetAudience}
                    className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    {isGeneratingTargetAudience ? (
                      <CustomSpinner />
                    ) : (
                      <Sparkles className="h-3 w-3 mr-1" />
                    )}
                    <span className="ml-1">{isGeneratingTargetAudience ? 'Generating...' : 'Generate'}</span>
                  </Button>
                </div>
                <Textarea
                  placeholder="Describe your target audience"
                  value={formData.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  rows={3}
                  className="border-emerald-300 focus:border-emerald-500 focus:ring-emerald-200"
                />
              </div>
              
              <div className="h-px bg-gradient-to-r from-emerald-200 to-transparent my-5"></div>
              
              <div className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Search className="h-4 w-4 text-emerald-500 mr-1" />
                    SEO Keywords
                  </label>
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="outline"
                    onClick={generateSEOKeywords}
                    disabled={!formData.mainKeyword || isGeneratingKeywords}
                    className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    {isGeneratingKeywords ? (
                      <CustomSpinner />
                    ) : (
                      <Sparkles className="h-3 w-3 mr-1" />
                    )}
                    <span className="ml-1">{isGeneratingKeywords ? 'Generating...' : 'Generate'}</span>
                  </Button>
                </div>
                <Textarea
                  placeholder="Additional SEO keywords, separated by commas"
                  value={formData.seoKeywords}
                  onChange={(e) => handleInputChange('seoKeywords', e.target.value)}
                  rows={3}
                  className="border-emerald-300 focus:border-emerald-500 focus:ring-emerald-200"
                />
              </div>
              
              <div className="h-px bg-gradient-to-r from-emerald-200 to-transparent my-5"></div>
              
              {/* New Long Tail Keywords Component */}
              <div className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Search className="h-4 w-4 text-emerald-500 mr-1" />
                    Long Tail Keywords
                  </label>
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="outline"
                    onClick={generateLongTailKeywords}
                    disabled={!formData.mainKeyword || isGeneratingLongTailKeywords}
                    className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    {isGeneratingLongTailKeywords ? (
                      <CustomSpinner />
                    ) : (
                      <Sparkles className="h-3 w-3 mr-1" />
                    )}
                    <span className="ml-1">{isGeneratingLongTailKeywords ? 'Generating...' : 'Generate'}</span>
                  </Button>
                </div>
                <Textarea
                  placeholder="Long tail keyword variations (3-5 word phrases)"
                  value={formData.longTailKeywords}
                  onChange={(e) => handleInputChange('longTailKeywords', e.target.value)}
                  rows={3}
                  className="border-emerald-300 focus:border-emerald-500 focus:ring-emerald-200"
                />
              </div>
              
              <div className="h-px bg-gradient-to-r from-emerald-200 to-transparent my-5"></div>
              
              <div className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <HelpCircle className="h-4 w-4 text-emerald-500 mr-1" />
                    FAQs
                  </label>
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="outline"
                    onClick={generateFAQs}
                    disabled={!formData.mainKeyword || isGeneratingFAQs}
                    className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    {isGeneratingFAQs ? (
                      <CustomSpinner />
                    ) : (
                      <Sparkles className="h-3 w-3 mr-1" />
                    )}
                    <span className="ml-1">{isGeneratingFAQs ? 'Generating...' : 'Generate'}</span>
                  </Button>
                </div>
                <Textarea
                  placeholder="FAQs to include in the content"
                  value={formData.faqs}
                  onChange={(e) => handleInputChange('faqs', e.target.value)}
                  rows={5}
                  className="border-emerald-300 focus:border-emerald-500 focus:ring-emerald-200"
                />
              </div>
              
              <div className="h-px bg-gradient-to-r from-emerald-200 to-transparent my-5"></div>
              
              <div className="mb-5">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Info className="h-4 w-4 text-emerald-500 mr-1" />
                  Additional Instructions
                </label>
                <Textarea
                  placeholder="Any additional instructions for the content"
                  value={formData.additionalInstructions}
                  onChange={(e) => handleInputChange('additionalInstructions', e.target.value)}
                  rows={4}
                  className="border-emerald-300 focus:border-emerald-500 focus:ring-emerald-200"
                />
              </div>
            </CardContent>
          )}
        </Card>

        {/* Core Settings Section */}
        <Card className="w-full border border-emerald-200 shadow-md hover:shadow-lg transition-shadow rounded-xl overflow-hidden">
          <CardHeader 
            className="cursor-pointer bg-gradient-to-r from-emerald-50 to-transparent border-b border-emerald-100"
            onClick={() => toggleSection('coreSettings')}
          >
            <div className="flex justify-between items-center w-full">
              <CardTitle className="text-emerald-800 font-semibold flex items-center gap-2">
                <SectionIcon icon={Settings} />
                Core Settings
              </CardTitle>
              {expandedSections.coreSettings ? 
                <ChevronUp className="h-5 w-5 text-emerald-500 transition-transform duration-200" /> : 
                <ChevronDown className="h-5 w-5 text-emerald-500 transition-transform duration-200" />
              }
            </div>
          </CardHeader>
          {expandedSections.coreSettings && (
            <CardContent className="p-5 animate-[fadeIn_0.3s_ease-in-out]">
              <div className="mb-5">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <BookOpen className="h-4 w-4 text-emerald-500 mr-1" />
                  Article Type
                </label>
                <select
                  className="w-full py-2 px-3 border border-emerald-300 rounded-md focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all"
                  value={formData.articleType}
                  onChange={(e) => handleInputChange('articleType', e.target.value)}
                >
                  <option value="None">None</option>
                  <option value="How-to guide">How-to guide</option>
                  <option value="Listicle">Listicle</option>
                  <option value="Product review">Product review</option>
                  <option value="News">News</option>
                  <option value="Comparison">Comparison</option>
                  <option value="Case study">Case study</option>
                  <option value="Opinion piece">Opinion piece</option>
                  <option value="Tutorial">Tutorial</option>
                  <option value="Roundup post">Roundup post</option>
                  <option value="Q&A page">Q&A page</option>
                </select>
              </div>
              
              <div className="h-px bg-gradient-to-r from-emerald-200 to-transparent my-5"></div>
              
              <div className="mb-5">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FileText className="h-4 w-4 text-emerald-500 mr-1" />
                  Article Size
                </label>
                <select
                  className="w-full py-2 px-3 border border-emerald-300 rounded-md focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all"
                  value={formData.wordCount}
                  onChange={(e) => handleInputChange('wordCount', e.target.value)}
                >
                  <option value="x-small">X-Small (600-1200 words, 2-5 H2)</option>
                  <option value="small">Small (1200-2400 words, 5-8 H2)</option>
                  <option value="medium">Medium (2400-3600 words, 9-12 H2)</option>
                  <option value="large">Large (3600-5200 words, 13-16 H2)</option>
                </select>
              </div>
              
              <div className="h-px bg-gradient-to-r from-emerald-200 to-transparent my-5"></div>
              
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <AlignLeft className="h-4 w-4 text-emerald-500 mr-1" />
                    Tone of voice
                  </label>
                  <span className="text-xs py-1 px-2 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">0/50</span>
                </div>
                <select
                  className="w-full py-2 px-3 border border-emerald-300 rounded-md focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all"
                  value={formData.tone}
                  onChange={(e) => handleInputChange('tone', e.target.value)}
                >
                  <option value="None">None</option>
                  <option value="Friendly">Friendly</option>
                  <option value="Professional">Professional</option>
                  <option value="Informational">Informational</option>
                  <option value="Transactional">Transactional</option>
                  <option value="Inspirational">Inspirational</option>
                  <option value="Neutral">Neutral</option>
                  <option value="Witty">Witty</option>
                  <option value="Casual">Casual</option>
                  <option value="Authoritative">Authoritative</option>
                  <option value="Encouraging">Encouraging</option>
                  <option value="Persuasive">Persuasive</option>
                  <option value="Poetic">Poetic</option>
                </select>
              </div>
              
              <div className="h-px bg-gradient-to-r from-emerald-200 to-transparent my-5"></div>
              
              <div className="mb-5">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Users className="h-4 w-4 text-emerald-500 mr-1" />
                  Point of View
                </label>
                <select
                  className="w-full py-2 px-3 border border-emerald-300 rounded-md focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all"
                  value={formData.pointOfView}
                  onChange={(e) => handleInputChange('pointOfView', e.target.value)}
                >
                  <option value="None">None</option>
                  <option value="First Person">First Person (I, We)</option>
                  <option value="Second Person">Second Person (You)</option>
                  <option value="Third Person">Third Person (He, She, They)</option>
                </select>
              </div>
              
              <div className="h-px bg-gradient-to-r from-emerald-200 to-transparent my-5"></div>
              
              <div className="mb-5">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Zap className="h-4 w-4 text-emerald-500 mr-1" />
                  Brand Voice
                </label>
                <Textarea
                  placeholder="Describe your brand voice"
                  value={formData.brandVoice}
                  onChange={(e) => handleInputChange('brandVoice', e.target.value)}
                  rows={3}
                  className="border-emerald-300 focus:border-emerald-500 focus:ring-emerald-200"
                />
              </div>
            </CardContent>
          )}
        </Card>

        {/* Text Settings Section */}
        <Card className="w-full border border-emerald-200 shadow-md hover:shadow-lg transition-shadow rounded-xl overflow-hidden">
          <CardHeader 
            className="cursor-pointer bg-gradient-to-r from-emerald-50 to-transparent border-b border-emerald-100"
            onClick={() => toggleSection('textSettings')}
          >
            <div className="flex justify-between items-center w-full">
              <CardTitle className="text-emerald-800 font-semibold flex items-center gap-2">
                <SectionIcon icon={Type} />
                Text Settings
              </CardTitle>
              {expandedSections.textSettings ? 
                <ChevronUp className="h-5 w-5 text-emerald-500 transition-transform duration-200" /> : 
                <ChevronDown className="h-5 w-5 text-emerald-500 transition-transform duration-200" />
              }
            </div>
          </CardHeader>
          {expandedSections.textSettings && (
            <CardContent className="p-5 animate-[fadeIn_0.3s_ease-in-out]">
              <div className="mb-5">
                <div className="flex items-center mb-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Type className="h-4 w-4 text-emerald-500 mr-1" />
                    Text Readability
                  </label>
                  <div className="ml-1 group relative">
                    <HelpCircle className="h-4 w-4 text-emerald-500 cursor-help" />
                    <div className="absolute left-0 -bottom-1 transform translate-y-full w-64 bg-white p-2 rounded-md shadow-md border border-emerald-200 hidden group-hover:block text-xs text-gray-600 z-10">
                      Readability level determines how easy your content is to understand for different audience levels.
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <select
                    className="w-full py-2 px-3 border border-emerald-300 rounded-md focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all pr-24"
                    value={formData.textReadability || "8th & 9th grade"}
                    onChange={(e) => handleInputChange('textReadability', e.target.value)}
                  >
                    <option value="None">None</option>
                    <option value="5th grade">5th grade, easily understood by 11-year-olds</option>
                    <option value="6th grade">6th grade, easy to read. Conversational language</option>
                    <option value="7th grade">7th grade, fairly easy to read</option>
                    <option value="8th & 9th grade">8th & 9th grade, easily understood</option>
                    <option value="10th to 12th grade">10th to 12th grade, fairly difficult to read</option>
                    <option value="College">College, difficult to read</option>
                    <option value="College graduate">College graduate, very difficult to read</option>
                    <option value="Professional">Professional, extremely difficult to read</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-xs py-1 px-2 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">Recommended</span>
                  </div>
                </div>
              </div>
              
              <div className="h-px bg-gradient-to-r from-emerald-200 to-transparent my-5"></div>
              
              <div className="mb-5">
                <div className="flex items-center mb-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Sparkles className="h-4 w-4 text-emerald-500 mr-1" />
                    AI Content Cleaning
                  </label>
                  <div className="ml-1 group relative">
                    <HelpCircle className="h-4 w-4 text-emerald-500 cursor-help" />
                    <div className="absolute left-0 -bottom-1 transform translate-y-full w-64 bg-white p-2 rounded-md shadow-md border border-emerald-200 hidden group-hover:block text-xs text-gray-600 z-10">
                      Removes patterns and phrases that are commonly associated with AI-generated content.
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <select
                    className="w-full py-2 px-3 border border-emerald-300 rounded-md focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all"
                    value={formData.aiContentCleaning || "No AI Words Removal"}
                    onChange={(e) => handleInputChange('aiContentCleaning', e.target.value)}
                  >
                    <option value="No AI Words Removal">No AI Words Removal</option>
                    <option value="Basic AI Words Removal">Basic AI Words Removal</option>
                    <option value="Extended AI Words Removal">Extended AI Words Removal</option>
                  </select>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* SEO Section */}
        <Card className="w-full border border-emerald-200 shadow-md hover:shadow-lg transition-shadow rounded-xl overflow-hidden">
          <CardHeader 
            className="cursor-pointer bg-gradient-to-r from-emerald-50 to-transparent border-b border-emerald-100"
            onClick={() => toggleSection('seoSettings')}
          >
            <div className="flex justify-between items-center w-full">
              <CardTitle className="text-emerald-800 font-semibold flex items-center gap-2">
                <SectionIcon icon={Search} />
                SEO Settings
              </CardTitle>
              {expandedSections.seoSettings ? 
                <ChevronUp className="h-5 w-5 text-emerald-500 transition-transform duration-200" /> : 
                <ChevronDown className="h-5 w-5 text-emerald-500 transition-transform duration-200" />
              }
            </div>
          </CardHeader>
          {expandedSections.seoSettings && (
            <CardContent className="p-5 animate-[fadeIn_0.3s_ease-in-out]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeBold"
                    checked={formData.includeBold}
                    onChange={(e) => handleCheckboxChange('includeBold', e.target.checked)}
                    className="h-4 w-4 text-emerald-500 focus:ring-emerald-400 border-gray-300 rounded"
                  />
                  <label htmlFor="includeBold" className="ml-2 text-sm text-gray-700">Include Bold Keywords</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeH3"
                    checked={formData.includeH3}
                    onChange={(e) => handleCheckboxChange('includeH3', e.target.checked)}
                    className="h-4 w-4 text-emerald-500 focus:ring-emerald-400 border-gray-300 rounded"
                  />
                  <label htmlFor="includeH3" className="ml-2 text-sm text-gray-700">Include H3 Tags</label>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Structure Section with Enhanced Hook Selection */}
        <Card className="w-full border border-emerald-200 shadow-md hover:shadow-lg transition-shadow rounded-xl overflow-hidden">
          <CardHeader 
            className="cursor-pointer bg-gradient-to-r from-emerald-50 to-transparent border-b border-emerald-100"
            onClick={() => toggleSection('structure')}
          >
            <div className="flex justify-between items-center w-full">
              <CardTitle className="text-emerald-800 font-semibold flex items-center gap-2">
                <SectionIcon icon={LayoutList} />
                Structure
              </CardTitle>
              {expandedSections.structure ? 
                <ChevronUp className="h-5 w-5 text-emerald-500 transition-transform duration-200" /> : 
                <ChevronDown className="h-5 w-5 text-emerald-500 transition-transform duration-200" />
              }
            </div>
          </CardHeader>
          {expandedSections.structure && (
            <CardContent className="p-5 animate-[fadeIn_0.3s_ease-in-out]">
              <div className="mb-5">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Lightbulb className="h-4 w-4 text-emerald-500 mr-1" />
                  Introductory Hook Type
                </label>
                <select
                  className="w-full py-2 px-3 border border-emerald-300 rounded-md focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all"
                  value={formData.introductoryHook}
                  onChange={handleHookTypeChange}
                >
                  <option value="">None</option>
                  <option value="Question">Question</option>
                  <option value="Statistical or Fact">Statistical or Fact</option>
                  <option value="Quotation">Quotation</option>
                  <option value="Anecdotal or Story">Anecdotal or Story</option>
                  <option value="Personal or Emotional">Personal or Emotional</option>
                </select>
              </div>
              
              <div className="h-px bg-gradient-to-r from-emerald-200 to-transparent my-5"></div>
              
              <div className="mb-5">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <AlignLeft className="h-4 w-4 text-emerald-500 mr-1" />
                  Hook Instructions
                </label>
                <Textarea
                  placeholder="Instructions for the hook"
                  value={formData.customHook}
                  onChange={(e) => handleInputChange('customHook', e.target.value)}
                  rows={4}
                  className="border-emerald-300 focus:border-emerald-500 focus:ring-emerald-200"
                />
              </div>
            </CardContent>
          )}
        </Card>

        {/* Document Elements Section */}
        <Card className="w-full border border-emerald-200 shadow-md hover:shadow-lg transition-shadow rounded-xl overflow-hidden">
          <CardHeader 
            className="cursor-pointer bg-gradient-to-r from-emerald-50 to-transparent border-b border-emerald-100"
            onClick={() => toggleSection('documentElements')}
          >
            <div className="flex justify-between items-center w-full">
              <CardTitle className="text-emerald-800 font-semibold flex items-center gap-2">
                <SectionIcon icon={ListChecks} />
                Document Elements
              </CardTitle>
              {expandedSections.documentElements ? 
                <ChevronUp className="h-5 w-5 text-emerald-500 transition-transform duration-200" /> : 
                <ChevronDown className="h-5 w-5 text-emerald-500 transition-transform duration-200" />
              }
            </div>
          </CardHeader>
          {expandedSections.documentElements && (
            <CardContent className="p-5 animate-[fadeIn_0.3s_ease-in-out]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeConclusion"
                    checked={formData.includeConclusion}
                    onChange={(e) => handleCheckboxChange('includeConclusion', e.target.checked)}
                    className="h-4 w-4 text-emerald-500 focus:ring-emerald-400 border-gray-300 rounded"
                  />
                  <label htmlFor="includeConclusion" className="ml-2 text-sm text-gray-700">Include Conclusion</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeTables"
                    checked={formData.includeTables}
                    onChange={(e) => handleCheckboxChange('includeTables', e.target.checked)}
                    className="h-4 w-4 text-emerald-500 focus:ring-emerald-400 border-gray-300 rounded"
                  />
                  <label htmlFor="includeTables" className="ml-2 text-sm text-gray-700">Include Tables</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeH3"
                    checked={formData.includeH3}
                    onChange={(e) => handleCheckboxChange('includeH3', e.target.checked)}
                    className="h-4 w-4 text-emerald-500 focus:ring-emerald-400 border-gray-300 rounded"
                  />
                  <label htmlFor="includeH3" className="ml-2 text-sm text-gray-700">Include H3 Subheadings</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeLists"
                    checked={formData.includeLists}
                    onChange={(e) => handleCheckboxChange('includeLists', e.target.checked)}
                    className="h-4 w-4 text-emerald-500 focus:ring-emerald-400 border-gray-300 rounded"
                  />
                  <label htmlFor="includeLists" className="ml-2 text-sm text-gray-700">Include Lists</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeItalics"
                    checked={formData.includeItalics}
                    onChange={(e) => handleCheckboxChange('includeItalics', e.target.checked)}
                    className="h-4 w-4 text-emerald-500 focus:ring-emerald-400 border-gray-300 rounded"
                  />
                  <label htmlFor="includeItalics" className="ml-2 text-sm text-gray-700">Include Italics</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeQuotes"
                    checked={formData.includeQuotes}
                    onChange={(e) => handleCheckboxChange('includeQuotes', e.target.checked)}
                    className="h-4 w-4 text-emerald-500 focus:ring-emerald-400 border-gray-300 rounded"
                  />
                  <label htmlFor="includeQuotes" className="ml-2 text-sm text-gray-700">Include Quotes</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeKeyTakeaways"
                    checked={formData.includeKeyTakeaways}
                    onChange={(e) => handleCheckboxChange('includeKeyTakeaways', e.target.checked)}
                    className="h-4 w-4 text-emerald-500 focus:ring-emerald-400 border-gray-300 rounded"
                  />
                  <label htmlFor="includeKeyTakeaways" className="ml-2 text-sm text-gray-700">Include Key Takeaways</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeFAQs"
                    checked={formData.includeFAQs}
                    onChange={(e) => handleCheckboxChange('includeFAQs', e.target.checked)}
                    className="h-4 w-4 text-emerald-500 focus:ring-emerald-400 border-gray-300 rounded"
                  />
                  <label htmlFor="includeFAQs" className="ml-2 text-sm text-gray-700">Include FAQs Section</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeBold"
                    checked={formData.includeBold}
                    onChange={(e) => handleCheckboxChange('includeBold', e.target.checked)}
                    className="h-4 w-4 text-emerald-500 focus:ring-emerald-400 border-gray-300 rounded"
                  />
                  <label htmlFor="includeBold" className="ml-2 text-sm text-gray-700">Include Bold Text</label>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Internal Linking Section */}
        <Card className="w-full border border-emerald-200 shadow-md hover:shadow-lg transition-shadow rounded-xl overflow-hidden">
          <CardHeader 
            className="cursor-pointer bg-gradient-to-r from-emerald-50 to-transparent border-b border-emerald-100"
            onClick={() => toggleSection('internalLinking')}
          >
            <div className="flex justify-between items-center w-full">
              <CardTitle className="text-emerald-800 font-semibold flex items-center gap-2">
                <SectionIcon icon={Link} />
                Internal Linking
              </CardTitle>
              {expandedSections.internalLinking ? 
                <ChevronUp className="h-5 w-5 text-emerald-500 transition-transform duration-200" /> : 
                <ChevronDown className="h-5 w-5 text-emerald-500 transition-transform duration-200" />
              }
            </div>
          </CardHeader>
          {expandedSections.internalLinking && (
            <CardContent className="p-5 animate-[fadeIn_0.3s_ease-in-out]">
              <div className="space-y-4">
                <div className="mb-5">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Globe className="h-4 w-4 text-emerald-500 mr-1" />
                    Website URL
                  </label>
                  <Input
                    placeholder="Your website URL (e.g., https://example.com)"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="border-emerald-300 focus:border-emerald-500 focus:ring-emerald-200"
                  />
                </div>
                
                <div className="h-px bg-gradient-to-r from-emerald-200 to-transparent my-5"></div>
                
                <div className="mb-5">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Link className="h-4 w-4 text-emerald-500 mr-1" />
                    Website URLs/Sitemap
                  </label>
                  <Textarea
                    placeholder="Paste your website URLs or sitemap content here"
                    value={websiteUrls}
                    onChange={(e) => setWebsiteUrls(e.target.value)}
                    rows={4}
                    className="border-emerald-300 focus:border-emerald-500 focus:ring-emerald-200"
                  />
                </div>
                
                <div className="h-px bg-gradient-to-r from-emerald-200 to-transparent my-5"></div>
                
                <div className="flex justify-between items-start">
                  <div className="flex flex-col space-y-1.5 flex-1">
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Link className="h-4 w-4 text-emerald-500 mr-1" />
                      Internal Links
                    </label>
                    <Textarea
                      placeholder="Internal links for your content"
                      value={formData.internalLinkingWebsite}
                      onChange={(e) => handleInputChange('internalLinkingWebsite', e.target.value)}
                      rows={4}
                      className="border-emerald-300 focus:border-emerald-500 focus:ring-emerald-200"
                    />
                  </div>
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="outline"
                    className="mt-8 ml-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                    onClick={generateInternalLinks}
                    disabled={!formData.mainKeyword || !websiteUrl || !websiteUrls || isGeneratingInternalLinks}
                  >
                    {isGeneratingInternalLinks ? (
                      <CustomSpinner />
                    ) : (
                      <Sparkles className="h-3 w-3 mr-1" />
                    )}
                    <span className="ml-1">{isGeneratingInternalLinks ? 'Generating...' : 'Generate'}</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* External Linking Section */}
        <Card className="w-full border border-emerald-200 shadow-md hover:shadow-lg transition-shadow rounded-xl overflow-hidden">
          <CardHeader 
            className="cursor-pointer bg-gradient-to-r from-emerald-50 to-transparent border-b border-emerald-100"
            onClick={() => toggleSection('externalLinking')}
          >
            <div className="flex justify-between items-center w-full">
              <CardTitle className="text-emerald-800 font-semibold flex items-center gap-2">
                <SectionIcon icon={ExternalLink} />
                External Linking
              </CardTitle>
              {expandedSections.externalLinking ? 
                <ChevronUp className="h-5 w-5 text-emerald-500 transition-transform duration-200" /> : 
                <ChevronDown className="h-5 w-5 text-emerald-500 transition-transform duration-200" />
              }
            </div>
          </CardHeader>
          {expandedSections.externalLinking && (
            <CardContent className="p-5 animate-[fadeIn_0.3s_ease-in-out]">
              <div className="flex flex-col space-y-1.5">
                <div className="flex justify-between items-center mb-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <ExternalLink className="h-4 w-4 text-emerald-500 mr-1" />
                    External Links
                  </label>
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="outline"
                    onClick={generateLinks}
                    disabled={!formData.mainKeyword || isGeneratingLinks}
                    className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    {isGeneratingLinks ? (
                      <CustomSpinner />
                    ) : (
                      <Sparkles className="h-3 w-3 mr-1" />
                    )}
                    <span className="ml-1">{isGeneratingLinks ? 'Generating...' : 'Generate'}</span>
                  </Button>
                </div>
                <Textarea
                  placeholder="External links for your content"
                  value={formData.externalLinkType}
                  onChange={(e) => handleInputChange('externalLinkType', e.target.value)}
                  rows={4}
                  className="border-emerald-300 focus:border-emerald-500 focus:ring-emerald-200"
                />
              </div>
            </CardContent>
          )}
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end mt-6">
          <Button
            type="submit"
            disabled={isGenerating || !formData.mainKeyword}
            className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md min-w-[150px] flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-md group"
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <CustomSpinner /> Generating...
              </div>
            ) : (
              <>
                <Sparkles className="h-4 w-4 group-hover:scale-110 transition-transform" /> Generate Prompt
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Generated Prompt Display */}
      {generatedPrompt && (
        <GeneratedPromptCard
          prompt={generatedPrompt}
          copied={copied}
          onCopy={handleCopyContent}
        />
      )}
    </div>
  );
};