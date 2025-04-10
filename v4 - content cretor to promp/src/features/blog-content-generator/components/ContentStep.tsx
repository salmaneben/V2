import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle, ArrowLeft, ArrowRight, RefreshCw, Edit, Utensils, Settings, Sliders, AlertCircle, Server, Key, Stars } from 'lucide-react';
import { generateContent, generateRecipeContent } from '../utils/blogContentGenerator';
import { StepProps, Provider } from '../types';
import AdvancedContentSettings from './AdvancedContentSettings';

export const ContentStep: React.FC<StepProps> = ({
  data,
  updateData,
  onNextStep,
  onPrevStep
}) => {
  // --- State Variables ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showApiSettings, setShowApiSettings] = useState(true); // Default to showing API settings
  const [showContentSettings, setShowContentSettings] = useState(false);
  const [apiKeyWarning, setApiKeyWarning] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState(''); // State to hold the API key input

  // --- Effects ---

  // Initialize API settings and load API key on mount
  useEffect(() => {
    // Default API settings if not present
    if (!data.apiSettings?.contentApiProvider) {
      const defaultSettings = {
        contentApiProvider: 'openai' as Provider,
        contentApiModel: 'gpt-4o-mini',
        recipeApiProvider: 'openai' as Provider,
        recipeApiModel: 'gpt-4o-mini',
      };
      updateData({
        apiSettings: {
          ...data.apiSettings,
          ...defaultSettings,
        }
      });
    }

    // Determine the current provider based on content type
    const currentProvider = data.isRecipe
      ? (data.apiSettings?.recipeApiProvider || 'openai')
      : (data.apiSettings?.contentApiProvider || 'openai');

    // Load API key from localStorage for the current provider
    const savedKey = localStorage.getItem(`${currentProvider}_api_key`) || localStorage.getItem('api_key') || ''; // Fallback to generic 'api_key'
    setApiKey(savedKey);
    verifyApiKey(currentProvider); // Verify if a key exists

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.isRecipe, data.apiSettings?.recipeApiProvider, data.apiSettings?.contentApiProvider]); // Rerun if recipe type or providers change

  // --- Helper Functions ---

  // Verifies if an API key exists in localStorage for the given provider
  const verifyApiKey = (provider: Provider) => {
    const key = localStorage.getItem(`${provider}_api_key`) || localStorage.getItem('api_key');
    if (!key) {
      setApiKeyWarning(`No API key found for ${getProviderName(provider)}. Please enter and save your API key.`);
    } else {
      setApiKeyWarning(null); // Clear warning if key exists
    }
  };

  // Model presets for different AI providers
  const modelPresets: Record<Provider, { id: string; name: string; description: string }[]> = {
    openai: [
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Fast & affordable' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Balanced' },
      { id: 'gpt-4o', name: 'GPT-4o', description: 'Most capable' }
    ],
    claude: [
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', description: 'Fast & affordable' },
      { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', description: 'Balanced' },
      { id: 'claude-3-5-sonnet-20240620', name: 'Claude 3.5 Sonnet', description: 'Most capable' } // Updated model ID
    ],
    perplexity: [
      { id: 'llama-3.1-sonar-small-128k-online', name: 'Llama 3.1 Sonar (Small)', description: 'Fast & affordable' },
      { id: 'sonar-medium-online', name: 'Sonar Medium', description: 'Balanced' }, // Assuming this is a valid ID
      { id: 'llama-3.1-sonar-large-256k-online', name: 'Llama 3.1 Sonar (Large)', description: 'Most capable' }
    ],
    deepseek: [
      { id: 'deepseek-chat', name: 'DeepSeek Chat (Default)', description: 'General-purpose' }, // Simplified default
      { id: 'deepseek-coder', name: 'DeepSeek Coder (Default)', description: 'Code-focused' }, // Simplified default
      // Add other specific DeepSeek models if needed, e.g., deepseek-llm-67b-chat
    ],
    gemini: [
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', description: 'Fast & affordable' },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: 'Balanced' },
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', description: 'Advanced & efficient' },
      { id: 'gemini-2.0-pro', name: 'Gemini 2.0 Pro', description: 'Most capable' }
    ],
    // 'custom' provider has no presets, models are defined by the user elsewhere
    custom: [],
  };

  // Gets the display name for a provider ID
  const getProviderName = (provider: Provider): string => {
    switch (provider) {
      case 'openai': return 'OpenAI';
      case 'claude': return 'Anthropic Claude';
      case 'perplexity': return 'Perplexity';
      case 'deepseek': return 'DeepSeek';
      case 'gemini': return 'Google Gemini';
      case 'custom': return 'Custom API'; // Added custom provider name
      default: return 'API';
    }
  };

  // --- Event Handlers ---

  // Handles toggling between Blog Post and Recipe Post
  const handleRecipeTypeToggle = (isRecipe: boolean) => {
    updateData({
      isRecipe,
      // Initialize recipe name if switching to recipe mode and it's empty
      recipeName: isRecipe && !data.recipeName ? data.relatedTerm || data.focusKeyword : data.recipeName
    });

    // Update API key state and verification for the potentially new provider
    const provider = isRecipe
      ? (data.apiSettings?.recipeApiProvider || 'openai')
      : (data.apiSettings?.contentApiProvider || 'openai');
    const savedKey = localStorage.getItem(`${provider}_api_key`) || localStorage.getItem('api_key') || '';
    setApiKey(savedKey);
    verifyApiKey(provider);
  };

  // Handles changing the AI provider
  const handleProviderChange = (provider: Provider) => {
    // Set the default model for the newly selected provider
    const defaultModel = modelPresets[provider]?.[0]?.id || '';

    // Update the correct provider and model based on the current content type
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

    // Load and verify the API key for the new provider
    const savedKey = localStorage.getItem(`${provider}_api_key`) || localStorage.getItem('api_key') || '';
    setApiKey(savedKey);
    verifyApiKey(provider);
  };

  // Handles changing the AI model
  const handleModelChange = (model: string) => {
    // Update the correct model based on the current content type
    if (data.isRecipe) {
      updateData({
        apiSettings: { ...data.apiSettings, recipeApiModel: model }
      });
    } else {
      updateData({
        apiSettings: { ...data.apiSettings, contentApiModel: model }
      });
    }
  };

  // Saves the entered API key to localStorage
  const handleSaveApiKey = () => {
    const provider = data.isRecipe
      ? (data.apiSettings?.recipeApiProvider || 'openai')
      : (data.apiSettings?.contentApiProvider || 'openai');

    if (!apiKey) {
        setError(`Please enter an API key for ${getProviderName(provider)}.`);
        return;
    }

    // Save to provider-specific key
    localStorage.setItem(`${provider}_api_key`, apiKey);
    // Also save as generic key for potential fallback/other uses
    localStorage.setItem('api_key', apiKey);

    // Clear warning and show success message
    setApiKeyWarning(null);
    setError(null); // Clear any previous errors
    setSuccessMessage('API key saved successfully!');
    setTimeout(() => setSuccessMessage(null), 3000); // Clear message after 3s
  };

  // Handles the generation of content (Blog or Recipe)
  const handleGenerateContent = async () => {
    // Basic validation
    if (data.isRecipe && !data.recipeName?.trim()) {
      setError('Please enter a recipe name.');
      return;
    }
     if (!data.isRecipe && !data.selectedTitle?.trim()) {
        setError('Please ensure a Meta Title is selected from the previous step.');
        return;
    }

    // Determine provider and check for API key
    const provider = data.isRecipe
      ? (data.apiSettings?.recipeApiProvider || 'openai')
      : (data.apiSettings?.contentApiProvider || 'openai');
    const model = data.isRecipe
      ? (data.apiSettings?.recipeApiModel || '')
      : (data.apiSettings?.contentApiModel || '');

    const key = localStorage.getItem(`${provider}_api_key`) || localStorage.getItem('api_key');

    if (!key) {
      setError(`No API key found for ${getProviderName(provider)}. Please enter and save your API key in the settings.`);
      return;
    }
     if (!model) {
        setError(`No model selected for ${getProviderName(provider)}. Please select a model in the settings.`);
        return;
    }


    // Start loading state
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      let result;
      const commonParams = {
        metaTitle: data.selectedTitle,
        focusKeyword: data.focusKeyword,
        provider,
        model, // Pass the selected model
        apiKey: key, // Pass the API key
        customApiUrl: data.apiSettings?.customApiUrl, // Pass custom URL if applicable
        customApiModel: data.apiSettings?.customApiModel // Pass custom model if applicable
      };

      if (data.isRecipe) {
        // Generate Recipe Content
        console.log(`Generating recipe content with provider: ${provider}, model: ${model}`);
        result = await generateRecipeContent({
          ...commonParams,
          recipeName: data.recipeName || '', // Ensure recipeName is passed
        });
      } else {
        // Generate Blog Content
        console.log(`Generating blog content with provider: ${provider}, model: ${model}`);
        result = await generateContent({
          ...commonParams,
          outline: data.outline || '', // Pass outline if available
          // Pass all advanced content settings
          contentLength: data.contentLength,
          targetAudience: data.targetAudience,
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
          seoKeywords: data.seoKeywords,
          longTailKeywords: data.longTailKeywords,
          internalLinkingWebsite: data.internalLinkingWebsite,
          externalLinkType: data.externalLinkType,
          faqs: data.faqs,
          outputFormat: data.outputFormat,
          additionalInstructions: data.additionalInstructions
        });
      }

      // Handle result
      if (result.error) {
        setError(result.error);
      } else {
        // Update data with generated content
        updateData(data.isRecipe
          ? { recipeContent: result.content, content: result.content } // Sync both for recipe
          : { content: result.content }
        );
        setIsEditing(false); // Exit editing mode after generation
        setSuccessMessage('Content generated successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      console.error('Error generating content:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate content: ${errorMessage}. Please check console or try a different provider/model.`);
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  // Copies the generated content to the clipboard
  const handleCopy = () => {
    const contentToCopy = data.isRecipe ? data.recipeContent : data.content;
    if (!contentToCopy) return;

    navigator.clipboard.writeText(contentToCopy)
      .then(() => {
        setCopied(true);
        setSuccessMessage('Content copied to clipboard!');
        setTimeout(() => {
          setCopied(false);
          setSuccessMessage(null);
        }, 2000);
      })
      .catch(() => {
        setError('Failed to copy content. Please try again or copy manually.');
        setTimeout(() => setError(null), 3000);
      });
  };

  // Handles changes in the content textarea when editing
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    updateData(data.isRecipe
        ? { recipeContent: newValue, content: newValue } // Keep recipe content synced
        : { content: newValue }
    );
  };

  // Toggles the editing state for the content display
  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  // --- Render Logic ---

  // Determine which content to display (recipe or blog)
  const contentToDisplay = data.isRecipe ? data.recipeContent : data.content;
  // Determine if the user can proceed to the next step
  const canProceed = !!contentToDisplay; // Can proceed if content exists

  // Determine the current provider and model for display
  const currentProvider = data.isRecipe
    ? (data.apiSettings?.recipeApiProvider || 'openai')
    : (data.apiSettings?.contentApiProvider || 'openai');
  const currentModel = data.isRecipe
    ? (data.apiSettings?.recipeApiModel || '') // Default to empty if not set
    : (data.apiSettings?.contentApiModel || ''); // Default to empty if not set

  // Available models for the currently selected provider
  const availableModels = modelPresets[currentProvider] || [];

  // Function to get provider icon
  const getProviderIcon = (provider: Provider) => {
    switch(provider) {
      case 'openai': return <svg className="h-4 w-4 text-green-500 mr-1" viewBox="0 0 24 24" fill="currentColor"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.392.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" /></svg>;
      case 'claude': return <svg className="h-4 w-4 text-purple-500 mr-1" viewBox="0 0 24 24" fill="currentColor"><path d="M18.236 3.982c3.13 0 5.764 2.635 5.764 5.764v4.508c0 3.13-2.635 5.764-5.764 5.764h-4.508L3.982 9.745v4.509c0 3.129-2.635 5.764-5.764 5.764v-16c0-3.13 2.635-5.764 5.764-5.764z" /></svg>;
      case 'perplexity': return <svg className="h-4 w-4 text-blue-500 mr-1" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="12" /></svg>;
      case 'deepseek': return <svg className="h-4 w-4 text-gray-500 mr-1" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h18v18H3z" /></svg>;
      case 'gemini': return <Stars className="h-4 w-4 text-amber-500 mr-1" />;
      case 'custom': return <Settings className="h-4 w-4 text-gray-500 mr-1" />;
      default: return <Settings className="h-4 w-4 text-gray-500 mr-1" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-md shadow-sm">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md shadow-sm">
          {error}
        </div>
      )}

      {/* API Key Warning */}
      {apiKeyWarning && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md flex items-start shadow-sm">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">API Key Required</p>
            <p>{apiKeyWarning}</p>
          </div>
        </div>
      )}

      {/* Main Content Generation Card */}
      <div className="p-4 md:p-6 border rounded-lg bg-white shadow-md space-y-6">
        {/* Header and Edit/Copy Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Step 4: Generate Content</h2>
          <div className="flex gap-2 flex-wrap">
            {contentToDisplay && (
              <>
                <button
                  className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                  onClick={toggleEditing}
                  aria-label={isEditing ? 'Preview Content' : 'Edit Content'}
                >
                  <Edit className="h-4 w-4" />
                  <span>{isEditing ? 'Preview' : 'Edit'}</span>
                </button>
                <button
                  className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                  onClick={handleCopy}
                  aria-label="Copy Content"
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

        {/* Content Type Toggle */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-sm font-medium text-gray-600">Content Type:</span>
          <div className="flex gap-2">
            <button
              onClick={() => handleRecipeTypeToggle(false)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                !data.isRecipe
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'border bg-white hover:bg-gray-50 text-gray-700'
              }`}
              aria-pressed={!data.isRecipe}
            >
              <Edit className="h-4 w-4" />
              <span>Blog Post</span>
            </button>
            <button
              onClick={() => handleRecipeTypeToggle(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                data.isRecipe
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'border bg-white hover:bg-gray-50 text-gray-700'
              }`}
              aria-pressed={data.isRecipe}
            >
              <Utensils className="h-4 w-4" />
              <span>Recipe Post</span>
            </button>
          </div>
        </div>

        {/* Collapsible Settings Sections */}
        <div className="space-y-4">
          {/* API Settings Section */}
          <div className="w-full border rounded-md bg-gray-50">
            <button
              className="flex items-center gap-2 w-full text-left p-3 font-medium text-gray-700 hover:bg-gray-100 rounded-t-md"
              onClick={() => setShowApiSettings(!showApiSettings)}
              aria-expanded={showApiSettings}
            >
              <Settings className="h-5 w-5" />
              <span>API Settings</span>
              <span className="ml-auto text-lg">{showApiSettings ? '−' : '+'}</span>
            </button>
            {showApiSettings && (
              <div className="p-4 space-y-4 border-t">
                {/* API Provider Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-1 text-gray-700">
                    <Server className="h-4 w-4" />
                    <span>Select AI Provider</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {(['openai', 'claude', 'perplexity', 'deepseek', 'gemini', 'custom'] as Provider[]).map((provider) => (
                      <button
                        key={provider}
                        onClick={() => handleProviderChange(provider)}
                        className={`p-2 border rounded-md text-center text-sm transition-colors ${
                          currentProvider === provider
                            ? 'bg-blue-100 border-blue-300 font-medium text-blue-800 ring-1 ring-blue-300'
                            : 'bg-white hover:bg-gray-50 border-gray-300 text-gray-700'
                        }`}
                        aria-pressed={currentProvider === provider}
                      >
                        <div className="flex items-center justify-center">
                          {getProviderIcon(provider)}
                          <span>{getProviderName(provider)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Model Selection (only if provider is not 'custom') */}
                 {currentProvider !== 'custom' && availableModels.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                        Select {getProviderName(currentProvider)} Model
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {availableModels.map((model) => (
                            <button
                            key={model.id}
                            onClick={() => handleModelChange(model.id)}
                            className={`p-3 border rounded-md text-left transition-colors text-sm ${
                                currentModel === model.id
                                ? 'bg-blue-100 border-blue-300 ring-1 ring-blue-300'
                                : 'bg-white hover:bg-gray-50 border-gray-300'
                            }`}
                            aria-pressed={currentModel === model.id}
                            >
                            <div className="font-medium text-gray-800">{model.name}</div>
                            <div className="text-xs text-gray-500">{model.description}</div>
                            </button>
                        ))}
                        </div>
                    </div>
                 )}

                 {/* Custom API Settings (only if provider is 'custom') */}
                 {currentProvider === 'custom' && (
                    <div className="space-y-3">
                        <div>
                        <label htmlFor="custom-api-url" className="block text-sm font-medium mb-1 text-gray-700">
                            Custom API URL
                        </label>
                        <input
                            id="custom-api-url"
                            type="url"
                            value={data.apiSettings?.customApiUrl || ''}
                            onChange={(e) => updateData({ apiSettings: { ...data.apiSettings, customApiUrl: e.target.value } })}
                            placeholder="e.g., http://localhost:11434/v1/chat/completions"
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        />
                        </div>
                         <div>
                            <label htmlFor="custom-api-model" className="block text-sm font-medium mb-1 text-gray-700">
                                Custom API Model Name
                            </label>
                            <input
                                id="custom-api-model"
                                type="text"
                                value={data.apiSettings?.customApiModel || ''}
                                onChange={(e) => updateData({ apiSettings: { ...data.apiSettings, customApiModel: e.target.value } })}
                                placeholder="e.g., llama3"
                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            />
                         </div>
                    </div>
                 )}


                {/* API Key Input */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-1 text-gray-700">
                    <Key className="h-4 w-4" />
                    <span>{getProviderName(currentProvider)} API Key</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="password" // Keep as password for security
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder={`Enter your ${getProviderName(currentProvider)} API key`}
                      className="flex-grow p-2 border border-gray-300 rounded-md text-sm"
                      aria-label={`${getProviderName(currentProvider)} API Key Input`}
                    />
                    <button
                      onClick={handleSaveApiKey}
                      disabled={!apiKey.trim()} // Disable if key is empty or just whitespace
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        !apiKey.trim()
                          ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                      }`}
                    >
                      Save Key
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {currentProvider === 'gemini' && (
                      <>
                        You can get your Google Gemini API key from the <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Google AI Studio</a>.
                      </>
                    )}
                    {currentProvider !== 'gemini' && (
                      <>Your API key is stored locally in your browser's localStorage.</>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Content Settings Section (uses AdvancedContentSettings component) */}
          <div className="w-full border rounded-md bg-gray-50">
            <button
              className="flex items-center gap-2 w-full text-left p-3 font-medium text-gray-700 hover:bg-gray-100 rounded-t-md"
              onClick={() => setShowContentSettings(!showContentSettings)}
              aria-expanded={showContentSettings}
            >
              <Sliders className="h-5 w-5" />
              <span>Advanced Content Settings</span>
              <span className="ml-auto text-lg">{showContentSettings ? '−' : '+'}</span>
            </button>
            {showContentSettings && (
              <div className="p-4 border-t">
                <AdvancedContentSettings
                  data={data}
                  updateData={updateData}
                />
              </div>
            )}
          </div>
        </div>

        {/* Recipe Name Input (conditional) */}
        {data.isRecipe && (
          <div className="pt-2">
            <label className="block text-sm font-medium mb-1 text-gray-700" htmlFor="recipe-name">
              Recipe Name <span className="text-red-500">*</span>
            </label>
            <input
              id="recipe-name"
              type="text"
              value={data.recipeName || ''} // Ensure value is controlled
              onChange={(e) => updateData({ recipeName: e.target.value })}
              placeholder="Enter the name of your delicious recipe"
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              required={data.isRecipe}
            />
          </div>
        )}

        {/* Content Display/Editing Area */}
        <div className="mt-6">
          {isEditing && contentToDisplay ? (
            // Editing Mode: Textarea
             <div>
                <label htmlFor="content-editor" className="block text-sm font-medium mb-1 text-gray-700">Edit Content:</label>
                <textarea
                    id="content-editor"
                    value={contentToDisplay}
                    onChange={handleContentChange}
                    className="w-full min-h-[400px] p-3 border border-gray-300 rounded-md font-mono text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Edit your generated content here..."
                    aria-label="Content Editor"
                ></textarea>
             </div>
          ) : contentToDisplay ? (
            // Preview Mode: Rendered HTML
            <div className="border rounded-lg p-4 md:p-6 bg-gray-50 overflow-auto max-h-[600px] shadow-inner">
               <label className="block text-sm font-medium mb-2 text-gray-700">Generated Content Preview:</label>
              <div
                className="prose prose-sm sm:prose lg:prose-lg max-w-none" // Using Tailwind Typography
                dangerouslySetInnerHTML={{ __html: contentToDisplay }} // Be cautious with dangerouslySetInnerHTML
              />
            </div>
          ) : (
            // Initial State: Generate Button
            <div className="text-center py-6">
              <p className="text-gray-500 mb-4">
                {data.isRecipe ? 'Enter a recipe name and click below to generate the recipe content.' : 'Adjust settings if needed and click below to generate the blog post content.'}
              </p>
               <button
                onClick={handleGenerateContent}
                disabled={isLoading || (data.isRecipe ? !data.recipeName?.trim() : !data.selectedTitle?.trim()) || !apiKey.trim() || !currentModel} // Also disable if no API key or model
                className={`w-full md:w-auto inline-flex items-center justify-center px-6 py-3 rounded-md font-semibold text-white transition-colors ${
                  isLoading || (data.isRecipe ? !data.recipeName?.trim() : !data.selectedTitle?.trim()) || !apiKey.trim() || !currentModel
                    ? (data.isRecipe ? 'bg-green-300 cursor-not-allowed' : 'bg-indigo-300 cursor-not-allowed')
                    : (data.isRecipe ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700')
                } shadow-sm`}
                aria-live="polite" // Announce loading state changes
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5" />
                    <span>
                      {data.isRecipe ? 'Generate Recipe Content' : 'Generate Blog Content'}
                    </span>
                  </>
                )}
              </button>
               {/* Show reason for disabled button */}
               { !isLoading && ((data.isRecipe ? !data.recipeName?.trim() : !data.selectedTitle?.trim()) || !apiKey.trim() || !currentModel) && (
                    <p className="text-xs text-red-500 mt-2">
                        {data.isRecipe && !data.recipeName?.trim() && "Recipe name is required. "}
                        {!data.isRecipe && !data.selectedTitle?.trim() && "Meta title is required. "}
                        {!apiKey.trim() && "API key is required. "}
                        {!currentModel && "Model selection is required. "}
                    </p>
               )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onPrevStep}
          className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium flex items-center transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Meta Description {/* Assuming previous step is Meta Description */}
        </button>

        {/* --- MODIFIED PART --- */}
        {/* Update the text based on isRecipe, removing the Schema step reference */}
        <button
          onClick={onNextStep}
          disabled={!canProceed || isLoading} // Disable if no content or loading
          className={`px-4 py-2 rounded-md text-sm font-medium flex items-center text-white transition-colors shadow-sm ${
            !canProceed || isLoading
              ? 'bg-indigo-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {/* Change text based on whether it's a recipe or blog post */}
          {data.isRecipe ? 'Next Step: Recipe Details' : 'Next Step: Full Article'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
        {/* --- END OF MODIFIED PART --- */}
      </div>
    </div>
  );
};