// src/features/blog-content-generator/components/ContentStep.tsx

import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle, ArrowLeft, ArrowRight, RefreshCw, Edit, Utensils, Settings, Sliders, AlertCircle, Server, Key } from 'lucide-react';
import { generateContent, generateRecipeContent } from '../utils/blogContentGenerator';
import { StepProps, Provider } from '../types';
import AdvancedContentSettings from './AdvancedContentSettings';

export const ContentStep: React.FC<StepProps> = ({ 
  data, 
  updateData, 
  onNextStep,
  onPrevStep 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showApiSettings, setShowApiSettings] = useState(true);
  const [showContentSettings, setShowContentSettings] = useState(false);
  const [apiKeyWarning, setApiKeyWarning] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  
  // Initialize API settings if they don't exist
  useEffect(() => {
    if (!data.apiSettings?.contentApiProvider) {
      // Default to OpenAI
      const contentApiProvider = 'openai';
      const contentApiModel = 'gpt-4o-mini';
      
      const recipeApiProvider = 'openai';
      const recipeApiModel = 'gpt-4o-mini';
      
      updateData({
        apiSettings: {
          ...data.apiSettings,
          contentApiProvider,
          contentApiModel,
          recipeApiProvider,
          recipeApiModel
        }
      });
    }
    
    // Load API key from localStorage
    const provider = data.isRecipe 
      ? (data.apiSettings?.recipeApiProvider || 'openai')
      : (data.apiSettings?.contentApiProvider || 'openai');
    
    const savedKey = localStorage.getItem(`${provider}_api_key`) || localStorage.getItem('api_key') || '';
    setApiKey(savedKey);
    verifyApiKey(provider);
  }, []);
  
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
      { id: 'deepseek-llm-67b-chat', name: 'DeepSeek LLM 67B Chat', description: 'General-purpose' },
      { id: 'deepseek-coder-33b-instruct', name: 'DeepSeek Coder 33B', description: 'Code-focused' },
      { id: 'deepseek-math-7b-instruct', name: 'DeepSeek Math 7B', description: 'Math-focused' },
      { id: 'deepseek-llm-7b-chat', name: 'DeepSeek LLM 7B Chat', description: 'Lightweight general-purpose' }
    ]
  };
  
  const handleRecipeTypeToggle = (isRecipe: boolean) => {
    updateData({ 
      isRecipe,
      // Initialize recipe name if toggling to recipe mode
      recipeName: isRecipe && !data.recipeName ? data.relatedTerm || data.focusKeyword : data.recipeName
    });
    
    // Update API key for the appropriate provider
    const provider = isRecipe 
      ? (data.apiSettings?.recipeApiProvider || 'openai')
      : (data.apiSettings?.contentApiProvider || 'openai');
    
    const savedKey = localStorage.getItem(`${provider}_api_key`) || localStorage.getItem('api_key') || '';
    setApiKey(savedKey);
    verifyApiKey(provider);
  };
  
  const handleProviderChange = (provider: Provider) => {
    // Set default model for the new provider
    const defaultModel = modelPresets[provider]?.[0]?.id || '';
    
    // Update appropriate provider based on content type
    if (data.isRecipe) {
      updateData({
        apiSettings: {
          ...data.apiSettings,
          recipeApiProvider: provider,
          recipeApiModel: defaultModel
        }
      });
    } else {
      updateData({
        apiSettings: {
          ...data.apiSettings,
          contentApiProvider: provider,
          contentApiModel: defaultModel
        }
      });
    }
    
    // Load API key for the new provider
    const savedKey = localStorage.getItem(`${provider}_api_key`) || localStorage.getItem('api_key') || '';
    setApiKey(savedKey);
    verifyApiKey(provider);
  };
  
  const handleModelChange = (model: string) => {
    // Update appropriate model based on content type
    if (data.isRecipe) {
      updateData({
        apiSettings: {
          ...data.apiSettings,
          recipeApiModel: model
        }
      });
    } else {
      updateData({
        apiSettings: {
          ...data.apiSettings,
          contentApiModel: model
        }
      });
    }
  };
  
  const handleSaveApiKey = () => {
    const provider = data.isRecipe 
      ? (data.apiSettings?.recipeApiProvider || 'openai')
      : (data.apiSettings?.contentApiProvider || 'openai');
    
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

  const handleGenerateContent = async () => {
    // Modified to remove outline check
    if (data.isRecipe && !data.recipeName) {
      setError('Please enter a recipe name');
      return;
    }

    // Check if API key exists
    const provider = data.isRecipe 
      ? (data.apiSettings?.recipeApiProvider || 'openai')
      : (data.apiSettings?.contentApiProvider || 'openai');
    
    const key = localStorage.getItem(`${provider}_api_key`) || localStorage.getItem('api_key');
    
    if (!key) {
      setError(`No API key found for ${provider}. Please enter your API key in the settings.`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      let result;
      
      if (data.isRecipe) {
        // Use the recipe-specific provider
        const provider = data.apiSettings?.recipeApiProvider || 'openai';
        console.log(`Generating recipe content with provider: ${provider}`);
        
        result = await generateRecipeContent({
          metaTitle: data.selectedTitle,
          focusKeyword: data.focusKeyword,
          recipeName: data.recipeName,
          provider
        });
        
        if (result.error) {
          setError(result.error);
        } else {
          updateData({ 
            recipeContent: result.content,
            content: result.content // Also update the general content field
          });
        }
      } else {
        // Use the content-specific provider
        const provider = data.apiSettings?.contentApiProvider || 'openai';
        console.log(`Generating content with provider: ${provider}`);
        
        // Prepare all content settings to pass to the generateContent function
        result = await generateContent({
          metaTitle: data.selectedTitle,
          focusKeyword: data.focusKeyword,
          outline: data.outline || '', // Keep outline optional for backward compatibility
          contentLength: data.contentLength,
          targetAudience: data.targetAudience,
          provider,
          
          // Add all the content settings
          wordCount: data.wordCount,
          tone: data.tone,
          textReadability: data.textReadability,
          includeConclusion: data.includeConclusion,
          includeTables: data.includeTables,
          includeH3: data.includeH3,
          includeLists: data.includeLists,
          includeItalics: data.includeItalics,
          includeQuotes: data.includeQuotes,
          includeBold: data.includeBold,
          includeKeyTakeaways: data.includeKeyTakeaways,
          includeFAQs: data.includeFAQs,
          
          // Add SEO settings
          seoKeywords: data.seoKeywords,
          longTailKeywords: data.longTailKeywords,
          internalLinkingWebsite: data.internalLinkingWebsite,
          externalLinkType: data.externalLinkType,
          faqs: data.faqs,
          
          // Add output format
          outputFormat: data.outputFormat,
          
          // Add additional instructions
          additionalInstructions: data.additionalInstructions
        });
        
        if (result.error) {
          setError(result.error);
        } else {
          updateData({ content: result.content });
        }
      }
      
      setIsEditing(false);
      setSuccessMessage('Content generated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error generating content:', err);
      
      // Provide more detailed error message if possible
      if (err instanceof Error) {
        setError(`Failed to generate content: ${err.message}`);
      } else {
        setError('Failed to generate content. Please try again or try a different provider.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    const contentToCopy = data.isRecipe ? data.recipeContent : data.content;
    if (!contentToCopy) return;
    
    navigator.clipboard.writeText(contentToCopy)
      .then(() => {
        setCopied(true);
        setSuccessMessage('Content copied to clipboard!');
        
        // Reset the copied status after 2 seconds
        setTimeout(() => {
          setCopied(false);
          setSuccessMessage(null);
        }, 2000);
      })
      .catch(() => {
        setError('Failed to copy content');
        
        // Clear error after 3 seconds
        setTimeout(() => {
          setError(null);
        }, 3000);
      });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (data.isRecipe) {
      updateData({ 
        recipeContent: e.target.value,
        content: e.target.value // Keep both in sync
      });
    } else {
      updateData({ content: e.target.value });
    }
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const contentToDisplay = data.isRecipe ? data.recipeContent : data.content;
  const canProceed = data.isRecipe ? !!data.recipeContent : !!data.content;
  
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
  
  const currentProvider = data.isRecipe 
    ? (data.apiSettings?.recipeApiProvider || 'openai')
    : (data.apiSettings?.contentApiProvider || 'openai');
    
  const currentModel = data.isRecipe 
    ? (data.apiSettings?.recipeApiModel || 'gpt-4o-mini')
    : (data.apiSettings?.contentApiModel || 'gpt-4o-mini');

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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Step 4: Generate Content</h2>
          <div className="flex gap-2">
            {contentToDisplay && (
              <>
                <button 
                  className="flex items-center gap-1 px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200"
                  onClick={toggleEditing}
                >
                  <Edit className="h-4 w-4" />
                  <span>{isEditing ? 'Preview' : 'Edit'}</span>
                </button>
                <button 
                  className="flex items-center gap-1 px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200"
                  onClick={handleCopy}
                >
                  {copied ? (
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
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4 mb-6">
          <span className="text-gray-600">Content Type:</span>
          <div className="flex gap-2">
            <button
              onClick={() => handleRecipeTypeToggle(false)}
              className={`flex items-center gap-1 px-3 py-1 rounded-md ${!data.isRecipe ? 'bg-indigo-600 text-white' : 'border bg-white'}`}
            >
              <Edit className="h-4 w-4" />
              <span>Blog Post</span>
            </button>
            <button
              onClick={() => handleRecipeTypeToggle(true)}
              className={`flex items-center gap-1 px-3 py-1 rounded-md ${data.isRecipe ? 'bg-green-600 text-white' : 'border bg-white'}`}
            >
              <Utensils className="h-4 w-4" />
              <span>Recipe Post</span>
            </button>
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
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
                    Your API key is stored locally in your browser and is never sent to our servers.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="w-full border rounded-md p-4">
            <button 
              className="flex items-center gap-2 w-full text-left"
              onClick={() => setShowContentSettings(!showContentSettings)}
            >
              <Sliders className="h-4 w-4" />
              <span>Content Settings</span>
              <span className="ml-auto">{showContentSettings ? '▲' : '▼'}</span>
            </button>
            
            {showContentSettings && (
              <div className="mt-3">
                <AdvancedContentSettings 
                  data={data} 
                  updateData={updateData} 
                />
              </div>
            )}
          </div>
          
          {data.isRecipe ? (
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="recipe-name">
                Recipe Name *
              </label>
              <input
                id="recipe-name"
                type="text"
                value={data.recipeName}
                onChange={(e) => updateData({ recipeName: e.target.value })}
                placeholder="Enter the name of your recipe"
                className="w-full p-2 border rounded-md"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="content-length">
                  Content Length (words)
                </label>
                <input
                  id="content-length"
                  type="number"
                  value={data.contentLength || 1200}
                  onChange={(e) => updateData({ contentLength: Number(e.target.value) })}
                  placeholder="1200"
                  className="w-full p-2 border rounded-md"
                  min={500}
                  max={5000}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="target-audience">
                  Target Audience
                </label>
                <input
                  id="target-audience"
                  type="text"
                  value={data.targetAudience || ''}
                  onChange={(e) => updateData({ targetAudience: e.target.value })}
                  placeholder="e.g., beginners, professionals, parents"
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
          )}
        </div>
        
        {!contentToDisplay || isEditing ? (
          <div className="space-y-4">
            {isEditing && contentToDisplay ? (
              <textarea
                value={contentToDisplay}
                onChange={handleContentChange}
                className="w-full min-h-[500px] p-2 border rounded-md font-mono text-sm"
                placeholder="Edit your content here..."
              ></textarea>
            ) : (
              <button 
                onClick={handleGenerateContent} 
                disabled={isLoading || (data.isRecipe ? !data.recipeName : false)} // Removed outline check
                className={`w-full p-3 rounded-md ${
                  isLoading || (data.isRecipe ? !data.recipeName : false) 
                    ? (data.isRecipe ? 'bg-green-300' : 'bg-indigo-300') 
                    : (data.isRecipe ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700')
                } text-white flex items-center justify-center`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Generating Content...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    <span>
                      {data.isRecipe ? 'Generate Recipe Content' : 'Generate Blog Content'}
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        ) : (
          <div className="border rounded-lg p-6 bg-gray-50 overflow-auto max-h-[600px]">
            <div className="prose prose-sm sm:prose max-w-none" dangerouslySetInnerHTML={{ __html: contentToDisplay }} />
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrevStep}
          className="px-3 py-2 border rounded-md bg-gray-100 hover:bg-gray-200 flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Content Settings
        </button>
        
        {/* Fixed: Always use the Next Step button for navigating to either the Full Article or Schema step */}
        <button
          onClick={onNextStep}
          disabled={!canProceed}
          className={`p-3 rounded-md ${!canProceed ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'} text-white flex items-center`}
        >
          {data.isRecipe ? 'Next Step: Recipe Schema' : 'Next Step: Full Article'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};