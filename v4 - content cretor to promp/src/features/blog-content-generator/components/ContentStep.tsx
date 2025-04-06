// src/features/blog-content-generator/components/ContentStep.tsx

import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle, ArrowLeft, ArrowRight, RefreshCw, Edit, Utensils, Settings, Sliders } from 'lucide-react';
import { generateContent, generateRecipeContent } from '../utils/blogContentGenerator';
import { StepProps, Provider } from '../types';
import ApiSettingsSelector from './ApiSettingsSelector';
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
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [showContentSettings, setShowContentSettings] = useState(false);
  
  // Initialize API settings if they don't exist
  useEffect(() => {
    if (!data.apiSettings?.contentApiProvider) {
      // Try to load from localStorage or use defaults
      const contentApiProvider = localStorage.getItem('preferred_provider_contentApiProvider') as Provider || data.provider || 'deepseek';
      const contentApiModel = localStorage.getItem('preferred_model_contentApiModel') || getDefaultModel(contentApiProvider);
      
      const recipeApiProvider = localStorage.getItem('preferred_provider_recipeApiProvider') as Provider || data.provider || 'deepseek';
      const recipeApiModel = localStorage.getItem('preferred_model_recipeApiModel') || getDefaultModel(recipeApiProvider);
      
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
  
  const handleRecipeTypeToggle = (isRecipe: boolean) => {
    updateData({ 
      isRecipe,
      // Initialize recipe name if toggling to recipe mode
      recipeName: isRecipe && !data.recipeName ? data.relatedTerm || data.focusKeyword : data.recipeName
    });
  };

  const handleGenerateContent = async () => {
    // Modified to remove outline check
    if (data.isRecipe && !data.recipeName) {
      setError('Please enter a recipe name');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      let result;
      
      if (data.isRecipe) {
        // Use the recipe-specific provider
        const provider = data.apiSettings?.recipeApiProvider || data.provider || 'deepseek';
        
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
        const provider = data.apiSettings?.contentApiProvider || data.provider || 'deepseek';
        
        // Prepare all content settings to pass to the generateContent function
        result = await generateContent({
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
      setError('Failed to generate content. Please try again.');
      console.error(err);
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

  const contentToDisplay = data.isRecipe ? data.recipeContent : data.content;
  const canProceed = data.isRecipe ? !!data.recipeContent : !!data.content;

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
              <div className="mt-3">
                <ApiSettingsSelector
                  stepName={data.isRecipe ? "Recipe Generator" : "Content Generator"}
                  providerId={data.isRecipe ? "recipeApiProvider" : "contentApiProvider"}
                  modelId={data.isRecipe ? "recipeApiModel" : "contentApiModel"}
                  provider={data.isRecipe 
                    ? (data.apiSettings?.recipeApiProvider || data.provider || 'deepseek') 
                    : (data.apiSettings?.contentApiProvider || data.provider || 'deepseek')}
                  model={data.isRecipe 
                    ? (data.apiSettings?.recipeApiModel || getDefaultModel(data.apiSettings?.recipeApiProvider || data.provider || 'deepseek')) 
                    : (data.apiSettings?.contentApiModel || getDefaultModel(data.apiSettings?.contentApiProvider || data.provider || 'deepseek'))}
                  onProviderChange={handleProviderChange}
                  onModelChange={handleModelChange}
                  showCustomOptions={true}
                />
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
        
        {data.isRecipe ? (
          <button
            onClick={onNextStep}
            disabled={!canProceed}
            className={`p-3 rounded-md ${!canProceed ? 'bg-purple-300' : 'bg-purple-600 hover:bg-purple-700'} text-white flex items-center`}
          >
            Next Step: Recipe Schema
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={() => {
              // For blog posts, we're done
              // You could add a final function call here to save or export
              // For now, just show a success message
              setSuccessMessage('Blog content generation complete! You can copy and use it now.');
              setTimeout(() => setSuccessMessage(null), 5000);
            }}
            disabled={!canProceed}
            className={`p-3 rounded-md ${!canProceed ? 'bg-green-300' : 'bg-green-600 hover:bg-green-700'} text-white flex items-center`}
          >
            Complete Content Generation
            <CheckCircle className="ml-2 h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};