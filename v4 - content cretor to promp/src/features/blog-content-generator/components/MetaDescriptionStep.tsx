// src/features/blog-content-generator/components/MetaDescriptionStep.tsx

import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle, RefreshCw, ArrowLeft, ArrowRight, Info, Settings, AlertCircle, Server, Key, Stars } from 'lucide-react';
import { generateMetaDescriptions } from '../utils/blogContentGenerator';
import { StepProps, Provider } from '../types';

export const MetaDescriptionStep: React.FC<StepProps> = ({ 
  data, 
  updateData, 
  onNextStep,
  onPrevStep 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [charCount, setCharCount] = useState<{[key: number]: number}>({});
  const [showApiSettings, setShowApiSettings] = useState(true);
  const [apiKeyWarning, setApiKeyWarning] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  
  // Initialize API settings if they don't exist
  useEffect(() => {
    if (!data.apiSettings?.descriptionApiProvider) {
      // Default to OpenAI
      const descriptionApiProvider = 'openai';
      const descriptionApiModel = 'gpt-4o-mini';
      
      updateData({
        apiSettings: {
          ...data.apiSettings,
          descriptionApiProvider,
          descriptionApiModel
        }
      });
    }
    
    // Load API key from localStorage
    const provider = data.apiSettings?.descriptionApiProvider || 'openai';
    const savedKey = localStorage.getItem(`${provider}_api_key`) || localStorage.getItem('api_key') || '';
    setApiKey(savedKey);
    verifyApiKey(provider);
  }, []);
  
  // Calculate character count for each description
  useEffect(() => {
    const counts: {[key: number]: number} = {};
    if (data.generatedDescriptions) {
      data.generatedDescriptions.forEach((desc, index) => {
        counts[index] = desc.length;
      });
      setCharCount(counts);
    }
  }, [data.generatedDescriptions]);
  
  const verifyApiKey = (provider: Provider) => {
    const key = localStorage.getItem(`${provider}_api_key`) || localStorage.getItem('api_key');
    if (!key) {
      setApiKeyWarning(`No API key found for ${provider}. Please enter your API key below.`);
    } else {
      setApiKeyWarning(null);
    }
  };
  
  // Model presets for each provider
  const modelPresets = {
    openai: [
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Fast & affordable' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Balanced' },
      { id: 'gpt-4o', name: 'GPT-4o', description: 'Most capable' }
    ],
    claude: [
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', description: 'Fast & affordable' },
      { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', description: 'Balanced' },
      { id: 'claude-3-7-sonnet-20250219', name: 'Claude 3.7 Sonnet', description: 'Most capable' }
    ],
    perplexity: [
      { id: 'llama-3.1-sonar-small-128k-online', name: 'Llama 3.1 Sonar (Small)', description: 'Fast & affordable' },
      { id: 'sonar-medium-online', name: 'Sonar Medium', description: 'Balanced' },
      { id: 'llama-3.1-sonar-large-256k-online', name: 'Llama 3.1 Sonar (Large)', description: 'Most capable' }
    ],
    deepseek: [
      { id: 'deepseek-chat', name: 'DeepSeek Chat', description: 'General-purpose' },
      { id: 'deepseek-coder', name: 'DeepSeek Coder', description: 'Code-focused' }
    ],
    gemini: [
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', description: 'Fast & affordable' },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: 'Balanced' },
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', description: 'Advanced & efficient' },
      { id: 'gemini-2.0-pro', name: 'Gemini 2.0 Pro', description: 'Most capable' }
    ]
  };
  
  const handleProviderChange = (provider: Provider) => {
    // Set default model for the new provider
    const defaultModel = modelPresets[provider]?.[0]?.id || '';
    
    updateData({
      apiSettings: {
        ...data.apiSettings,
        descriptionApiProvider: provider,
        descriptionApiModel: defaultModel
      }
    });
    
    // Load API key for the new provider
    const savedKey = localStorage.getItem(`${provider}_api_key`) || localStorage.getItem('api_key') || '';
    setApiKey(savedKey);
    verifyApiKey(provider);
  };
  
  const handleModelChange = (model: string) => {
    updateData({
      apiSettings: {
        ...data.apiSettings,
        descriptionApiModel: model
      }
    });
  };
  
  const handleSaveApiKey = () => {
    const provider = data.apiSettings?.descriptionApiProvider || 'openai';
    
    // Save to provider-specific key
    localStorage.setItem(`${provider}_api_key`, apiKey);
    
    // Also save as global key for backward compatibility
    localStorage.setItem('api_key', apiKey);
    
    // Clear warning
    setApiKeyWarning(null);
    setSuccessMessage('API key saved successfully!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const handleGenerate = async () => {
    if (!data.selectedTitle) {
      setError('Please select a title first');
      return;
    }

    if (!data.focusKeyword) {
      setError('Focus keyword is required');
      return;
    }

    // Check if API key exists
    const provider = data.apiSettings?.descriptionApiProvider || 'openai';
    const key = localStorage.getItem(`${provider}_api_key`) || localStorage.getItem('api_key');
    
    if (!key) {
      setError(`No API key found for ${provider}. Please enter your API key in the settings.`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      console.log(`Generating descriptions with provider: ${provider}`);
      
      const result = await generateMetaDescriptions({
        metaTitle: data.selectedTitle,
        focusKeyword: data.focusKeyword,
        relatedTerm: data.relatedTerm,
        provider
      });

      if (result.error) {
        setError(result.error);
      } else {
        updateData({ 
          generatedDescriptions: result.descriptions,
          selectedDescription: result.descriptions[0] || ''
        });
        
        setSuccessMessage('Descriptions generated successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      }
    } catch (err) {
      console.error('Error details:', err);
      
      // Provide more detailed error message if possible
      if (err instanceof Error) {
        setError(`Failed to generate descriptions: ${err.message}`);
      } else {
        setError('Failed to generate descriptions. Please try again or try a different provider.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (description: string, index: number) => {
    navigator.clipboard.writeText(description)
      .then(() => {
        setCopiedIndex(index);
        setSuccessMessage('Description copied to clipboard!');
        
        // Reset the copied status after 2 seconds
        setTimeout(() => {
          setCopiedIndex(null);
          setSuccessMessage(null);
        }, 2000);
      })
      .catch(() => {
        setError('Failed to copy description');
        
        // Clear error after 3 seconds
        setTimeout(() => {
          setError(null);
        }, 3000);
      });
  };

  const handleDescriptionSelect = (description: string) => {
    updateData({ selectedDescription: description });
  };

  // Get color class based on character count
  const getCharCountColorClass = (count: number) => {
    if (count <= 120) return 'text-green-600';
    if (count <= 155) return 'text-amber-600';
    return 'text-red-600';
  };

  const canProceed = !!data.selectedDescription;
  const currentProvider = data.apiSettings?.descriptionApiProvider || 'openai';
  const currentModel = data.apiSettings?.descriptionApiModel || 'gpt-4o-mini';

  // Helper function to get provider display name
  const getProviderName = (provider: Provider): string => {
    switch (provider) {
      case 'openai': return 'OpenAI';
      case 'claude': return 'Anthropic Claude';
      case 'perplexity': return 'Perplexity';
      case 'deepseek': return 'DeepSeek';
      case 'gemini': return 'Google Gemini';
      case 'custom': return 'Custom API';
      default: return 'API';
    }
  };

  // Function to get provider icon
  const getProviderIcon = (provider: Provider) => {
    switch(provider) {
      case 'gemini': return <Stars className="h-4 w-4 text-amber-500 mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-md">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md">
          {error}
        </div>
      )}
      
      {apiKeyWarning && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
          <div>
            <p className="font-medium">API Key Warning</p>
            <p>{apiKeyWarning}</p>
          </div>
        </div>
      )}
      
      <div className="p-6 border rounded-md bg-white shadow-sm">
        <h2 className="text-xl font-bold mb-4">Step 2: Generate Meta Descriptions</h2>
        <p className="text-gray-600 mb-6">
          Based on your selected title "{data.selectedTitle}", we'll generate SEO-friendly meta descriptions.
        </p>
        
        <div className="w-full border rounded-md p-4 mb-4">
          <button 
            className="flex items-center gap-2 w-full text-left"
            onClick={() => setShowApiSettings(!showApiSettings)}
          >
            <Settings className="h-4 w-4" />
            <span>API Settings</span>
            <span className="ml-auto">{showApiSettings ? '▲' : '▼'}</span>
          </button>
          
          {showApiSettings && (
            <div className="mt-3 space-y-4">
              {/* API Provider Selection */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-1">
                  <Server className="h-4 w-4" />
                  <span>Select AI Provider</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {(['openai', 'claude', 'perplexity', 'deepseek', 'gemini'] as Provider[]).map((provider) => (
                    <button
                      key={provider}
                      onClick={() => handleProviderChange(provider)}
                      className={`p-2 border rounded-md text-center transition-colors ${
                        currentProvider === provider 
                          ? 'bg-blue-100 border-blue-300 font-medium' 
                          : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        {getProviderIcon(provider)}
                        <span>{getProviderName(provider)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Model Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select {getProviderName(currentProvider)} Model
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {modelPresets[currentProvider]?.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => handleModelChange(model.id)}
                      className={`p-3 border rounded-md text-left transition-colors ${
                        currentModel === model.id 
                          ? 'bg-blue-100 border-blue-300' 
                          : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium">{model.name}</div>
                      <div className="text-xs text-gray-500">{model.description}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* API Key Input */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-1">
                  <Key className="h-4 w-4" />
                  <span>{getProviderName(currentProvider)} API Key</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={`Enter your ${getProviderName(currentProvider)} API key`}
                    className="flex-grow p-2 border rounded-md"
                  />
                  <button
                    onClick={handleSaveApiKey}
                    disabled={!apiKey}
                    className={`px-3 py-2 rounded-md ${
                      !apiKey ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    Save Key
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {currentProvider === 'gemini' ? (
                    <>You can get your Google Gemini API key from the <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Google AI Studio</a>.</>
                  ) : (
                    <>Your API key is stored locally in your browser and is never sent to our servers.</>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
        
        <button 
          onClick={handleGenerate} 
          disabled={isLoading || !data.selectedTitle}
          className={`w-full p-3 rounded-md ${isLoading || !data.selectedTitle ? 'bg-orange-300' : 'bg-orange-600 hover:bg-orange-700'} text-white flex items-center justify-center`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Generating Descriptions...</span>
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              <span>Generate Meta Descriptions</span>
            </>
          )}
        </button>
      </div>

      {data.generatedDescriptions && data.generatedDescriptions.length > 0 && (
        <div className="p-6 border rounded-md bg-white shadow-sm">
          <div className="flex items-start gap-3 mb-4">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="text-xl font-bold">Select a Description</h3>
              <p className="text-gray-600 mt-1">
                Choose one of the generated descriptions to use for your blog post. Ideal meta descriptions are 50-160 characters. 
                <span className="text-green-600"> Green</span> means good, 
                <span className="text-amber-600"> amber</span> is acceptable, and 
                <span className="text-red-600"> red</span> is too long.
              </p>
            </div>
          </div>
          
          <ul className="space-y-4 mt-6">
            {data.generatedDescriptions.map((description, index) => (
              <li 
                key={index} 
                className={`p-4 border rounded-md transition-colors cursor-pointer ${
                  data.selectedDescription === description 
                    ? 'bg-orange-50 border-orange-300' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleDescriptionSelect(description)}
              >
                <div className="flex items-center mb-2">
                  <input
                    type="radio"
                    id={`description-${index}`}
                    name="selectedDescription"
                    checked={data.selectedDescription === description}
                    onChange={() => handleDescriptionSelect(description)}
                    className="mr-3 h-4 w-4 text-orange-600"
                  />
                  <label htmlFor={`description-${index}`} className="text-gray-800 cursor-pointer">
                    {description}
                  </label>
                  <button 
                    className="flex items-center gap-1 min-w-[80px] ml-auto px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(description, index);
                    }}
                  >
                    {copiedIndex === index ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className={`text-xs ${getCharCountColorClass(charCount[index] || 0)}`}>
                  {charCount[index] || 0} characters
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={onPrevStep}
          className="px-3 py-2 border rounded-md bg-gray-100 hover:bg-gray-200 flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Meta Title
        </button>
        
        <button
          onClick={onNextStep}
          disabled={!canProceed}
          className={`p-3 rounded-md ${!canProceed ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'} text-white flex items-center`}
        >
          Next Step: Content Settings
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};