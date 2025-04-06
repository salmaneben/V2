// src/features/blog-content-generator/components/MetaTitleStep.tsx

import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle, RefreshCw, ArrowRight, Settings } from 'lucide-react';
import { generateMetaTitles } from '../utils/blogContentGenerator';
import { StepProps, Provider } from '../types';
import ApiSettingsSelector from './ApiSettingsSelector';

export const MetaTitleStep: React.FC<StepProps> = ({ data, updateData, onNextStep }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  
  // Initialize API settings if they don't exist
  useEffect(() => {
    if (!data.apiSettings) {
      // Try to load from localStorage or use defaults
      const titleApiProvider = localStorage.getItem('preferred_provider_titleApiProvider') as Provider || 'deepseek';
      const titleApiModel = localStorage.getItem('preferred_model_titleApiModel') || getDefaultModel(titleApiProvider);
      
      updateData({
        apiSettings: {
          titleApiProvider,
          titleApiModel
        }
      });
    }
  }, []);
  
  const getDefaultModel = (provider: Provider): string => {
    switch (provider) {
      case 'openai': return 'gpt-4';
      case 'claude': return 'claude-3-sonnet-20240229';
      case 'perplexity': return 'llama-3.1-sonar-small-128k-online';
      case 'deepseek': return 'deepseek-chat';
      case 'custom': return localStorage.getItem('custom_api_model') || '';
      default: return '';
    }
  };
  
  const handleGenerate = async () => {
    if (!data.focusKeyword) {
      setError('Please enter a focus keyword');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Use the step-specific provider if available, otherwise fall back to global provider
      const provider = data.apiSettings?.titleApiProvider || data.provider || 'deepseek';
      
      const result = await generateMetaTitles({
        focusKeyword: data.focusKeyword,
        relatedTerm: data.relatedTerm,
        provider
      });

      if (result.error) {
        setError(result.error);
      } else {
        updateData({ 
          generatedTitles: result.titles,
          selectedTitle: result.titles[0] || ''
        });
        
        setSuccessMessage('Titles generated successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      }
    } catch (err) {
      setError('Failed to generate titles. Please try again.');
      console.error(err);
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
  
  const handleProviderChange = (providerId: string, provider: Provider) => {
    updateData({
      apiSettings: {
        ...data.apiSettings,
        [providerId]: provider
      }
    });
  };
  
  const handleModelChange = (modelId: string, model: string) => {
    updateData({
      apiSettings: {
        ...data.apiSettings,
        [modelId]: model
      }
    });
  };

  const canProceed = !!data.selectedTitle;

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
          
          <div className="w-full border rounded-md p-4 hidden">
            <button 
              className="flex items-center gap-2 w-full text-left"
              onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
            >
              <Settings className="h-4 w-4" />
              <span>API Settings</span>
              <span className="ml-auto">{showAdvancedSettings ? '▲' : '▼'}</span>
            </button>
            
            {showAdvancedSettings && (
              <div className="mt-3">
                <ApiSettingsSelector
                  stepName="Title Generator"
                  providerId="titleApiProvider"
                  modelId="titleApiModel"
                  provider={data.apiSettings?.titleApiProvider || data.provider || 'deepseek'}
                  model={data.apiSettings?.titleApiModel || getDefaultModel(data.apiSettings?.titleApiProvider || data.provider || 'deepseek')}
                  onProviderChange={handleProviderChange}
                  onModelChange={handleModelChange}
                  showCustomOptions={true}
                />
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