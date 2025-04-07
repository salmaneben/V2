import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle, RefreshCw, ArrowRight, Settings, AlertCircle, Server, Key } from 'lucide-react';
import { StepProps, Provider } from '../types';
import { 
  generateMetaTitles 
} from '../utils/blogContentGenerator';
// Assuming these utility functions exist and work as intended
import { getPreferredProvider, getModelForProvider, getApiKey, getModelsForProvider, setApiKey } from '@/api/storage'; 
import { ApiModelOption } from '@/api/types'; // Assuming this type definition exists

export const MetaTitleStep: React.FC<StepProps> = ({ data, updateData, onNextStep }) => {
  // --- State Variables ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showApiSettings, setShowApiSettings] = useState(true); // Default to showing settings
  const [apiKeyWarning, setApiKeyWarning] = useState<string | null>(null);
  const [apiKey, setApiKeyState] = useState(''); // Local state for the API key input field

  // --- Effects ---

  // Initialize API settings and load API key on component mount
  useEffect(() => {
    // Initialize API settings in the central data state if they don't exist
    if (!data.apiSettings?.titleApiProvider) { // Check specifically for title provider setting
      const titleApiProvider = getPreferredProvider(); // Get default/preferred provider
      const titleApiModel = getModelForProvider(titleApiProvider); // Get default model for that provider
      
      updateData({
        apiSettings: {
          ...data.apiSettings, // Preserve other potential settings
          titleApiProvider,
          titleApiModel
        }
      });
    }
    
    // Determine the provider to use (from state or default)
    const provider = data.apiSettings?.titleApiProvider || getPreferredProvider();
    // Load the API key for this provider using the utility function
    const savedKey = getApiKey(provider);
    setApiKeyState(savedKey); // Update local input state
    verifyApiKey(provider); // Check if a key exists and set warning if needed

    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []); // Run only on mount

  // --- Helper Functions ---

  // Checks if an API key exists for the provider and sets a warning message
  const verifyApiKey = (provider: Provider) => {
    const key = getApiKey(provider); // Use utility function to get key
    if (!key) {
      setApiKeyWarning(`No API key found for ${getProviderName(provider)}. Please enter and save your API key.`);
    } else {
      setApiKeyWarning(null); // Clear warning if key exists
    }
  };

  // Gets available models for a provider and formats them for the UI buttons
  const getModelPresetsForProvider = (provider: Provider): { id: string; name: string; description: string }[] => {
    const models: ApiModelOption[] = getModelsForProvider(provider); // Use utility function
    
    // Helper to generate a simple description based on model name patterns
    const getDescription = (model: ApiModelOption): string => {
      const modelValue = model.value.toLowerCase(); // Case-insensitive check
      if (modelValue.includes('mini') || modelValue.includes('haiku') || modelValue.includes('small') || modelValue.includes('flash')) {
        return 'Fast & affordable';
      } else if (modelValue.includes('large') || modelValue.includes('opus') || modelValue.includes('ultra')) {
        return 'Most capable';
      } else {
        return 'Balanced'; // Default description
      }
    };
    
    // Map the raw model options to the format needed for UI buttons
    return models.map(model => ({
      id: model.value,
      name: model.label,
      description: getDescription(model)
    }));
  };

  // Gets the display name for a provider ID
  const getProviderName = (provider: Provider): string => {
    // Simple mapping from provider ID to display name
    switch (provider) {
      case 'openai': return 'OpenAI';
      case 'claude': return 'Anthropic Claude';
      case 'perplexity': return 'Perplexity';
      case 'deepseek': return 'DeepSeek';
      case 'custom': return 'Custom API'; // Added custom provider name
      default: return provider.toUpperCase(); // Fallback for unknown providers
    }
  };

  // --- Event Handlers ---

  // Handles changing the selected AI provider
  const handleProviderChange = (provider: Provider) => {
    const models = getModelPresetsForProvider(provider);
    // Default to the first model in the list for the new provider
    const defaultModel = models[0]?.id || ''; 
    
    // Update the central data state with the new provider and default model
    updateData({
      apiSettings: {
        ...data.apiSettings,
        titleApiProvider: provider,
        titleApiModel: defaultModel
      }
    });
    
    // Load the API key for the newly selected provider and verify it
    const savedKey = getApiKey(provider);
    setApiKeyState(savedKey); // Update local input state
    verifyApiKey(provider);
  };

  // Handles changing the selected AI model
  const handleModelChange = (model: string) => {
    // Update the central data state with the new model selection
    updateData({
      apiSettings: {
        ...data.apiSettings,
        titleApiModel: model
      }
    });
  };

  // Saves the entered API key using the utility function
  const handleSaveApiKey = () => {
    const provider = data.apiSettings?.titleApiProvider || getPreferredProvider();
    
    if (!apiKey.trim()) {
        setError(`Please enter an API key for ${getProviderName(provider)}.`);
        return;
    }

    // Use the utility function to save the key (handles localStorage)
    setApiKey(provider, apiKey); 
    
    // Clear warning, show success message
    setApiKeyWarning(null);
    setError(null);
    setSuccessMessage('API key saved successfully!');
    setTimeout(() => setSuccessMessage(null), 3000); // Clear message after 3s
  };

  // Handles the "Generate Meta Titles" button click
  const handleGenerate = async () => {
    // Basic input validation
    if (!data.focusKeyword?.trim()) {
      setError('Please enter a focus keyword.');
      return;
    }

    // Determine provider and model, check for API key
    const provider = data.apiSettings?.titleApiProvider || getPreferredProvider();
    const model = data.apiSettings?.titleApiModel || getModelForProvider(provider);
    const key = getApiKey(provider);
    
    if (!key) {
      setError(`No API key found for ${getProviderName(provider)}. Please enter and save your API key in the settings.`);
      return;
    }
     if (!model) {
        setError(`No model selected for ${getProviderName(provider)}. Please select a model in the settings.`);
        return;
    }

    // Set loading state and clear previous messages
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    updateData({ generatedTitles: [], selectedTitle: '' }); // Clear previous results

    try {
      console.log(`Generating titles with provider: ${provider}, model: ${model}`);
      
      // Call the generation utility function
      const result = await generateMetaTitles({
        focusKeyword: data.focusKeyword,
        relatedTerm: data.relatedTerm,
        provider: provider as Provider, // Ensure type compatibility
        model: model, // Pass the selected model
        apiKey: key, // Pass the API key
        customApiUrl: data.apiSettings?.customApiUrl, // Pass custom URL if applicable
        customApiModel: data.apiSettings?.customApiModel, // Pass custom model if applicable
        numTitles: 10 // Specify number of titles to generate
      });

      // Handle the result
      if (result.error) {
        setError(result.error || 'Failed to generate titles. Please check console or try again.');
      } else if (result.titles && result.titles.length > 0) {
        // Update central data state with generated titles and select the first one by default
        updateData({ 
          generatedTitles: result.titles,
          selectedTitle: result.titles[0] || '' // Default to first title
        });
        setSuccessMessage('Titles generated successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        // Handle case where generation succeeded but returned no titles
        setError('No titles were generated. Try adjusting your keywords or provider.');
        updateData({ generatedTitles: [] }); // Ensure titles array is empty
      }
    } catch (err) {
      console.error('Error generating meta titles:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate titles: ${errorMessage}. Please check console or try a different provider/model.`);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  // Handles copying a generated title to the clipboard
  const handleCopy = (title: string, index: number) => {
    navigator.clipboard.writeText(title)
      .then(() => {
        setCopiedIndex(index); // Highlight the copied item briefly
        setSuccessMessage('Title copied to clipboard!');
        setTimeout(() => {
          setCopiedIndex(null);
          setSuccessMessage(null);
        }, 2000);
      })
      .catch(() => {
        setError('Failed to copy title. Please try again or copy manually.');
        setTimeout(() => setError(null), 3000);
      });
  };

  // Handles selecting a title (updates the central data state)
  const handleTitleSelect = (title: string) => {
    // *** ADDED LOGGING HERE ***
    console.log('MetaTitleStep: Selecting title:', title); 
    updateData({ selectedTitle: title });
  };

  // --- Render Logic ---

  // Determine if the user can proceed to the next step
  const canProceed = !!data.selectedTitle; // Can proceed only if a title is selected

  // Get current provider/model for display in settings UI
  const currentProvider = data.apiSettings?.titleApiProvider || getPreferredProvider();
  const currentModel = data.apiSettings?.titleApiModel || getModelForProvider(currentProvider);
  // Get model presets for the current provider to render buttons
  const modelPresets = getModelPresetsForProvider(currentProvider);

  return (
    // Main container with spacing
    <div className="space-y-6">
      {/* Display Success Messages */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-200 text-green-800 rounded-md shadow-sm text-sm">
          {successMessage}
        </div>
      )}
      
      {/* Display Error Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-800 rounded-md shadow-sm text-sm">
          {error}
        </div>
      )}
      
      {/* Display API Key Warnings */}
      {apiKeyWarning && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-md flex items-start shadow-sm text-sm">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">API Key Required</p>
            <p>{apiKeyWarning}</p>
          </div>
        </div>
      )}
      
      {/* Input Section Card */}
      <div className="p-4 md:p-6 border rounded-lg bg-white shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Step 1: Generate SEO-Friendly Blog Titles</h2>
        <p className="text-sm text-gray-600 mb-6">
          Enter your focus keyword and an optional related term to generate 10 SEO-friendly blog titles.
        </p>
        
        {/* Input fields and settings container */}
        <div className="space-y-4">
          {/* Focus Keyword Input */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700" htmlFor="focus-keyword">
              Focus Keyword <span className="text-red-500">*</span>
            </label>
            <input
              id="focus-keyword"
              type="text"
              value={data.focusKeyword || ''} // Ensure controlled component
              onChange={(e) => updateData({ focusKeyword: e.target.value })}
              placeholder="e.g., best chocolate chip cookies"
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">This keyword should ideally appear near the beginning of the title.</p>
          </div>
          
          {/* Related Term Input */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700" htmlFor="related-term">
              Related Term / Recipe Name (Optional)
            </label>
            <input
              id="related-term"
              type="text"
              value={data.relatedTerm || ''} // Ensure controlled component
              onChange={(e) => updateData({ relatedTerm: e.target.value })}
              placeholder="e.g., chewy, gluten-free, easy recipe"
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">Adding context can improve title relevance and variety.</p>
          </div>
          
          {/* Collapsible API Settings Section */}
          <div className="w-full border rounded-md bg-gray-50">
             <button 
               className="flex items-center gap-2 w-full text-left p-3 font-medium text-gray-700 hover:bg-gray-100 rounded-t-md"
               onClick={() => setShowApiSettings(!showApiSettings)}
               aria-expanded={showApiSettings}
             >
               <Settings className="h-5 w-5" />
               <span>API Settings for Title Generation</span>
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
                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                     {/* Map through available providers */}
                     {(['openai', 'claude', 'perplexity', 'deepseek', 'custom'] as Provider[]).map((provider) => (
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
                         {getProviderName(provider)}
                       </button>
                     ))}
                   </div>
                 </div>
                 
                 {/* Model Selection (only show if provider is not 'custom') */}
                 {currentProvider !== 'custom' && modelPresets.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                        Select {getProviderName(currentProvider)} Model
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {modelPresets.map((model) => (
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

                 {/* Custom API Settings (only show if provider is 'custom') */}
                 {currentProvider === 'custom' && (
                    <div className="space-y-3 p-3 border rounded-md bg-white">
                         <p className="text-sm font-medium text-gray-600">Custom API Endpoint:</p>
                         {/* Inputs for Custom URL and Model Name - assuming these are stored in data.apiSettings */}
                         <div>
                            <label htmlFor="custom-api-url-title" className="block text-xs font-medium mb-1 text-gray-600">
                                API URL
                            </label>
                            <input
                                id="custom-api-url-title"
                                type="url"
                                value={data.apiSettings?.customApiUrl || ''}
                                onChange={(e) => updateData({ apiSettings: { ...data.apiSettings, customApiUrl: e.target.value } })}
                                placeholder="e.g., http://localhost:11434/v1/chat/completions"
                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            />
                         </div>
                         <div>
                            <label htmlFor="custom-api-model-title" className="block text-xs font-medium mb-1 text-gray-600">
                                Model Name
                            </label>
                            <input
                                id="custom-api-model-title"
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
                       type="password" // Keep as password type for masking
                       value={apiKey}
                       onChange={(e) => setApiKeyState(e.target.value)}
                       placeholder={`Enter your ${getProviderName(currentProvider)} API key`}
                       className="flex-grow p-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                       aria-label={`${getProviderName(currentProvider)} API Key Input`}
                     />
                     <button
                       onClick={handleSaveApiKey}
                       disabled={!apiKey.trim()} // Disable if key input is empty
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
                     Your API key is stored locally in your browser's localStorage.
                   </p>
                 </div>
               </div>
             )}
          </div>
          
          {/* Generate Button */}
          <button 
            onClick={handleGenerate} 
            disabled={isLoading || !data.focusKeyword?.trim() || !apiKey.trim() || !currentModel} // Disable if loading, no keyword, no key, or no model selected
            className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-md font-semibold text-white transition-colors ${
              isLoading || !data.focusKeyword?.trim() || !apiKey.trim() || !currentModel
                ? 'bg-amber-300 cursor-not-allowed' 
                : 'bg-amber-600 hover:bg-amber-700'
            } shadow-sm`}
            aria-live="polite" // Announce loading state changes
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
                <RefreshCw className="mr-2 h-5 w-5" />
                <span>Generate Meta Titles</span>
              </>
            )}
          </button>
          {/* Show reason for disabled button */}
           { !isLoading && (!data.focusKeyword?.trim() || !apiKey.trim() || !currentModel) && (
                <p className="text-xs text-red-500 mt-1 text-center">
                    {!data.focusKeyword?.trim() && "Focus keyword is required. "}
                    {!apiKey.trim() && "API key is required. "}
                    {!currentModel && "Model selection is required. "}
                </p>
           )}
        </div>
      </div>

      {/* Generated Titles List Section (only shown if titles exist) */}
      {data.generatedTitles && data.generatedTitles.length > 0 && (
        <div className="p-4 md:p-6 border rounded-lg bg-white shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Select a Title</h3>
          <p className="text-sm text-gray-600 mb-4">
            Choose one of the generated titles. The selected title will be used in subsequent steps.
          </p>
          {/* List of generated titles */}
          <ul className="space-y-3 mt-4">
            {data.generatedTitles.map((title: string, index: number) => (
              <li 
                key={index} 
                className={`p-3 border rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center transition-colors cursor-pointer ${
                  data.selectedTitle === title 
                    ? 'bg-amber-50 border-amber-300 ring-1 ring-amber-300' 
                    : 'hover:bg-gray-50 border-gray-200'
                }`}
                onClick={() => handleTitleSelect(title)} // Select title on click
                role="radio"
                aria-checked={data.selectedTitle === title}
                tabIndex={0} // Make it focusable
                onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && handleTitleSelect(title)} // Allow selection with keyboard
              >
                {/* Radio button and title text */}
                <div className="flex items-center mb-2 sm:mb-0 mr-4">
                  <input
                    type="radio"
                    id={`title-${index}`}
                    name="selectedTitle"
                    value={title}
                    checked={data.selectedTitle === title}
                    onChange={() => handleTitleSelect(title)} // Ensure radio change also selects
                    className="mr-3 h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                  />
                  <label htmlFor={`title-${index}`} className="text-sm text-gray-800 cursor-pointer">
                    {title}
                  </label>
                </div>
                {/* Copy Button */}
                <button 
                  className="flex-shrink-0 flex items-center gap-1 text-xs px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent title selection when clicking copy
                    handleCopy(title, index);
                  }}
                  aria-label={`Copy title ${index + 1}`}
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

      {/* Navigation Button Section */}
      <div className="flex justify-end mt-8">
        {/* Next Step Button (disabled until a title is selected) */}
        <button
          onClick={onNextStep}
          disabled={!canProceed} // Use canProceed flag
          className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white transition-colors shadow-sm ${
            !canProceed 
              ? 'bg-indigo-300 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          }`}
        >
          Next Step: Meta Description
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
