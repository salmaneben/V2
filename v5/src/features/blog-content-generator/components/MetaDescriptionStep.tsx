// src/features/blog-content-generator/components/MetaDescriptionStep.tsx

import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle, RefreshCw, ArrowLeft, ArrowRight, Info, Settings } from 'lucide-react';
import { generateMetaDescriptions } from '../utils/blogContentGenerator';
import { StepProps, Provider } from '../types';
import ApiSettingsSelector from './ApiSettingsSelector';

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
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  
  // Initialize API settings if they don't exist
  useEffect(() => {
    if (!data.apiSettings?.descriptionApiProvider) {
      // Try to load from localStorage or use defaults
      const descriptionApiProvider = localStorage.getItem('preferred_provider_descriptionApiProvider') as Provider || data.provider || 'deepseek';
      const descriptionApiModel = localStorage.getItem('preferred_model_descriptionApiModel') || getDefaultModel(descriptionApiProvider);
      
      updateData({
        apiSettings: {
          ...data.apiSettings,
          descriptionApiProvider,
          descriptionApiModel
        }
      });
    }
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
    if (!data.selectedTitle) {
      setError('Please select a title first');
      return;
    }

    if (!data.focusKeyword) {
      setError('Focus keyword is required');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Use the step-specific provider if available, otherwise fall back to global provider
      const provider = data.apiSettings?.descriptionApiProvider || data.provider || 'deepseek';
      
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
      setError('Failed to generate descriptions. Please try again.');
      console.error(err);
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

  // Get color class based on character count
  const getCharCountColorClass = (count: number) => {
    if (count <= 120) return 'text-green-600';
    if (count <= 155) return 'text-amber-600';
    return 'text-red-600';
  };

  const canProceed = !!data.selectedDescription;

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
        <h2 className="text-xl font-bold mb-4">Step 2: Generate Meta Descriptions</h2>
        <p className="text-gray-600 mb-6">
          Based on your selected title "{data.selectedTitle}", we'll generate SEO-friendly meta descriptions.
        </p>
        
        <div className="w-full border rounded-md p-4 mb-4">
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
                stepName="Description Generator"
                providerId="descriptionApiProvider"
                modelId="descriptionApiModel"
                provider={data.apiSettings?.descriptionApiProvider || data.provider || 'deepseek'}
                model={data.apiSettings?.descriptionApiModel || getDefaultModel(data.apiSettings?.descriptionApiProvider || data.provider || 'deepseek')}
                onProviderChange={handleProviderChange}
                onModelChange={handleModelChange}
                showCustomOptions={true}
              />
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
          Next Step: Outline
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};