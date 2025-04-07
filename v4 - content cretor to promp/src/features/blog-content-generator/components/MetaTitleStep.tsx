// src/features/blog-content-generator/components/MetaTitleStep.tsx

import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle, RefreshCw, ArrowRight, Settings, AlertCircle, Server, Key } from 'lucide-react';
import { StepProps, Provider } from '../types';
import { 
  generateMetaTitles 
} from '../utils/blogContentGenerator';
import { getPreferredProvider, getModelForProvider, getApiKey, getModelsForProvider, setApiKey } from '@/api/storage';
import { ApiModelOption } from '@/api/types';

export const MetaTitleStep: React.FC<StepProps> = ({ data, updateData, onNextStep }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showApiSettings, setShowApiSettings] = useState(true);
  const [apiKeyWarning, setApiKeyWarning] = useState<string | null>(null);
  const [apiKey, setApiKeyState] = useState('');
  
  // Initialize API settings if they don't exist
  useEffect(() => {
    if (!data.apiSettings) {
      // Use the preferred provider from our API module
      const titleApiProvider = getPreferredProvider();
      const titleApiModel = getModelForProvider(titleApiProvider);
      
      updateData({
        apiSettings: {
          titleApiProvider,
          titleApiModel
        }
      });
    }
    
    // Load API key from our API module
    const provider = data.apiSettings?.titleApiProvider || getPreferredProvider();
    const savedKey = getApiKey(provider);
    setApiKeyState(savedKey);
    verifyApiKey(provider);
  }, []);
  
  const verifyApiKey = (provider: Provider) => {
    const key = getApiKey(provider);
    if (!key) {
      setApiKeyWarning(`No API key found for ${provider}. Please enter your API key below.`);
    } else {
      setApiKeyWarning(null);
    }
  };
  
  // Create model presets using the getModelsForProvider function
  const getModelPresetsForProvider = (provider: Provider) => {
    const models = getModelsForProvider(provider);
    
    // Map the models to a more friendly format for our UI
    const getDescription = (model: ApiModelOption) => {
      // Base description on model name patterns
      if (model.value.includes('mini') || model.value.includes('haiku') || model.value.includes('small')) {
        return 'Fast & affordable';
      } else if (model.value.includes('large') || model.value.includes('opus')) {
        return 'Most capable';
      } else {
        return 'Balanced';
      }
    };
    
    return models.map(model => ({
      id: model.value,
      name: model.label,
      description: getDescription(model)
    }));
  };
  
  const handleProviderChange = (provider: Provider) => {
    // Get models for this provider
    const models = getModelPresetsForProvider(provider);
    // Set default model for the new provider (first one in the list)
    const defaultModel = models[0]?.id || '';
    
    updateData({
      apiSettings: {
        ...data.apiSettings,
        titleApiProvider: provider,
        titleApiModel: defaultModel
      }
    });
    
    // Load API key for the new provider
    const savedKey = getApiKey(provider);
    setApiKeyState(savedKey);
    verifyApiKey(provider);
  };
  
  const handleModelChange = (model: string) => {
    updateData({
      apiSettings: {
        ...data.apiSettings,
        titleApiModel: model
      }
    });
  };
  
  const handleSaveApiKey = () => {
    const provider = data.apiSettings?.titleApiProvider || getPreferredProvider();
    
    // Use our API module to save the key
    setApiKey(provider, apiKey);
    
    // Clear warning
    setApiKeyWarning(null);
    setSuccessMessage('API key saved successfully!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };
  
  const handleGenerate = async () => {
    if (!data.focusKeyword) {
      setError('Please enter a focus keyword');
      return;
    }

    // Check if API key exists
    const provider = data.apiSettings?.titleApiProvider || getPreferredProvider();
    const key = getApiKey(provider);
    
    if (!key) {
      setError(`No API key found for ${provider}. Please enter your API key in the settings.`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      console.log(`Generating titles with provider: ${provider}`);
      
      // Fixed: Pass a single object parameter to match the function signature
      const result = await generateMetaTitles({
        focusKeyword: data.focusKeyword,
        relatedTerm: data.relatedTerm,
        provider: provider as Provider,
        numTitles: 10
      });

      if (result.error) {
        setError(result.error || 'Failed to generate titles. Please try again.');
      } else if (result.titles && result.titles.length > 0) {
        updateData({ 
          generatedTitles: result.titles,
          selectedTitle: result.titles[0] || ''
        });
        
        setSuccessMessage('Titles generated successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        setError('No titles were generated. Please try again.');
      }
    } catch (err) {
      console.error('Error details:', err);
      
      // Provide more detailed error message if possible
      if (err instanceof Error) {
        setError(`Failed to generate titles: ${err.message}`);
      } else {
        setError('Failed to generate titles. Please try again or try a different provider.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (title: string, index: number) => {
    navigator.clipboard.writeText(title)
      .then(() => {
        setCopiedIndex(index);
        setSuccessMessage('Title copied to clipboard!');
        
        // Reset the copied status after 2 seconds
        setTimeout(() => {
          setCopiedIndex(null);
          setSuccessMessage(null);
        }, 2000);
      })
      .catch(() => {
        setError('Failed to copy title');
        
        // Clear error after 3 seconds
        setTimeout(() => {
          setError(null);
        }, 3000);
      });
  };

  const handleTitleSelect = (title: string) => {
    updateData({ selectedTitle: title });
  };

  const canProceed = !!data.selectedTitle;
  const currentProvider = data.apiSettings?.titleApiProvider || getPreferredProvider();
  const currentModel = data.apiSettings?.titleApiModel || getModelForProvider(currentProvider);
  const modelPresets = getModelPresetsForProvider(currentProvider);

  // Helper function to get provider display name
  const getProviderName = (provider: Provider): string => {
    switch (provider) {
      case 'openai': return 'OpenAI';
      case 'claude': return 'Anthropic Claude';
      case 'perplexity': return 'Perplexity';
      case 'deepseek': return 'DeepSeek';
      default: return 'API';
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
        <h2 className="text-xl font-bold mb-4">Step 1: Generate SEO-Friendly Blog Titles</h2>
        <p className="text-gray-600 mb-6">
          Enter your focus keyword and related term to generate 10 SEO-friendly blog titles.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="focus-keyword">
              Focus Keyword *
            </label>
            <input
              id="focus-keyword"
              type="text"
              value={data.focusKeyword}
              onChange={(e) => updateData({ focusKeyword: e.target.value })}
              placeholder="Enter your focus keyword"
              className="w-full p-2 border rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">The keyword will appear at the beginning of each title.</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="related-term">
              Related Term / Recipe Name (Optional)
            </label>
            <input
              id="related-term"
              type="text"
              value={data.relatedTerm}
              onChange={(e) => updateData({ relatedTerm: e.target.value })}
              placeholder="Enter a related term or recipe name"
              className="w-full p-2 border rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">Adding a related term will improve title relevance.</p>
          </div>
          
          <div className="w-full border rounded-md p-4">
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
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {(['openai', 'claude', 'perplexity', 'deepseek'] as Provider[]).map((provider) => (
                      <button
                        key={provider}
                        onClick={() => handleProviderChange(provider)}
                        className={`p-2 border rounded-md text-center transition-colors ${
                          currentProvider === provider 
                            ? 'bg-blue-100 border-blue-300 font-medium' 
                            : 'bg-white hover:bg-gray-50'
                        }`}
                      >
                        {getProviderName(provider)}
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
                    {modelPresets.map((model) => (
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
                      onChange={(e) => setApiKeyState(e.target.value)}
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
                    Your API key is stored locally in your browser and is never sent to our servers.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <button 
            onClick={handleGenerate} 
            disabled={isLoading || !data.focusKeyword}
            className={`w-full p-3 rounded-md ${isLoading || !data.focusKeyword ? 'bg-amber-300' : 'bg-amber-600 hover:bg-amber-700'} text-white flex items-center justify-center`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating Titles...</span>
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                <span>Generate Meta Titles</span>
              </>
            )}
          </button>
        </div>
      </div>

      {data.generatedTitles && data.generatedTitles.length > 0 && (
        <div className="p-6 border rounded-md bg-white shadow-sm">
          <h3 className="text-xl font-bold mb-4">Select a Title</h3>
          <p className="text-gray-600 mb-4">
            Choose one of the generated titles to use for your blog post. Selected title will be used in the next steps.
          </p>
          <ul className="space-y-3 mt-6">
            {data.generatedTitles.map((title, index) => (
              <li 
                key={index} 
                className={`p-4 border rounded-md flex justify-between items-center transition-colors cursor-pointer ${
                  data.selectedTitle === title 
                    ? 'bg-amber-50 border-amber-300' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleTitleSelect(title)}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    id={`title-${index}`}
                    name="selectedTitle"
                    checked={data.selectedTitle === title}
                    onChange={() => handleTitleSelect(title)}
                    className="mr-3 h-4 w-4 text-amber-600"
                  />
                  <label htmlFor={`title-${index}`} className="text-gray-800 cursor-pointer">
                    {title}
                  </label>
                </div>
                <button 
                  className="flex items-center gap-1 min-w-[80px] px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(title, index);
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
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={onNextStep}
          disabled={!canProceed}
          className={`p-3 rounded-md ${!canProceed ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'} text-white flex items-center`}
        >
          Next Step: Meta Description
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};