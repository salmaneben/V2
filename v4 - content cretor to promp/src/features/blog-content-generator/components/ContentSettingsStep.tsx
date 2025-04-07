// src/features/blog-content-generator/components/ContentSettingsStep.tsx

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RefreshCw, Settings, Server, Key, AlertCircle, 
  ChevronDown, ChevronUp, HelpCircle, Sliders, Image, Mail, Search, Sparkles } from 'lucide-react';
import { StepProps, Provider } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { 
  generateBlogContent
} from '@/api/services/content';
import { useContentGeneration } from '@/api/hooks/useContentGeneration';

// Hook descriptions object
const hookDescriptions = {
  "Question": "Craft an intriguing question that immediately draws the reader's attention. The question should be relevant to the article's topic and evoke curiosity or challenge common beliefs. Aim to make the reader reflect or feel compelled to find the answer within the article.",
  "Statistical or Fact": "Begin with a surprising statistic or an unexpected fact that relates directly to the article's main topic. This hook should provide a sense of scale or impact that makes the reader eager to learn more about the subject.",
  "Quotation": "Use a powerful or thought-provoking quote from a well-known figure that ties into the theme of the article. The quote should set the tone for the article and provoke interest in the topic.",
  "Anecdotal or Story": "Create a brief, engaging story or anecdote that is relevant to the article's main subject. This story should be relatable and set the stage for the main content.",
  "Personal or Emotional": "Start with a personal experience or an emotional appeal that connects with the reader on a deeper level. This approach should establish empathy and make the topic feel more relevant to the reader's life."
};

export const ContentSettingsStep: React.FC<StepProps> = ({ 
  data, 
  updateData, 
  onNextStep,
  onPrevStep 
}) => {
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Loading states for API calls
  const [isGeneratingSEOKeywords, setIsGeneratingSEOKeywords] = useState(false);
  const [isGeneratingLongTail, setIsGeneratingLongTail] = useState(false);
  const [isGeneratingInternalLinks, setIsGeneratingInternalLinks] = useState(false);
  const [isGeneratingExternalLinks, setIsGeneratingExternalLinks] = useState(false);
  const [isGeneratingFAQs, setIsGeneratingFAQs] = useState(false);
  const [isGeneratingTargetAudience, setIsGeneratingTargetAudience] = useState(false);
  const [apiKeyWarning, setApiKeyWarning] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [websiteUrls, setWebsiteUrls] = useState('');
  
  // Content generation hook
  const { generateContent } = useContentGeneration();
  
  // State for expanded sections (replacing tabs with collapsible sections)
  const [expandedSections, setExpandedSections] = useState({
    apiSettings: true,
    basicInfo: true,
    coreSettings: true,
    textSettings: true,
    documentElements: true,
    structure: true,
    internalLinking: false,
    externalLinking: false,
    imageSettings: false,
    optInSettings: false,
    seoSettings: false
  });
  
  // Initialize settings on first render
  useEffect(() => {
    if (!data.apiSettings?.seoApiProvider) {
      // Default to OpenAI
      const seoApiProvider = 'openai';
      const seoApiModel = 'gpt-4o-mini';
      
      updateData({
        apiSettings: {
          ...data.apiSettings,
          seoApiProvider,
          seoApiModel
        }
      });
    }
    
    // Load API key from localStorage
    const provider = data.apiSettings?.seoApiProvider || 'openai';
    const savedKey = localStorage.getItem(`${provider}_api_key`) || localStorage.getItem('api_key') || '';
    setApiKey(savedKey);
    verifyApiKey(provider);
    
    if (!data.imageSettings) {
      updateData({
        imageSettings: {
          numberOfImagePrompts: 5,
          imagePromptStyle: 'detailed',
          imageDistribution: 'balanced',
          customImagePrompts: ''
        }
      });
    }
    
    if (!data.optInSettings) {
      updateData({
        optInSettings: {
          enableOptIn: false,
          optInText: 'Subscribe to our newsletter for more content like this',
          optInRequired: false,
          optInPlacement: 'bottom',
          optInDesign: 'standard'
        }
      });
    }
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
      { id: 'deepseek-chat', name: 'DeepSeek Chat', description: 'General-purpose' },
      { id: 'deepseek-coder', name: 'DeepSeek Coder', description: 'Code-focused' }
    ]
  };
  
  const handleProviderChange = (provider: Provider) => {
    // Set default model for the new provider
    const defaultModel = modelPresets[provider]?.[0]?.id || '';
    
    updateData({
      apiSettings: {
        ...data.apiSettings,
        seoApiProvider: provider,
        seoApiModel: defaultModel
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
        seoApiModel: model
      }
    });
  };
  
  const handleSaveApiKey = () => {
    const provider = data.apiSettings?.seoApiProvider || 'openai';
    
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
  
  // Generate Target Audience
  const handleGenerateTargetAudience = async () => {
    if (!data.focusKeyword) {
      setError('Please provide a focus keyword first');
      return;
    }
    
    // Check if API key exists
    const provider = data.apiSettings?.seoApiProvider || 'openai';
    const key = localStorage.getItem(`${provider}_api_key`) || localStorage.getItem('api_key');
    
    if (!key) {
      setError(`No API key found for ${provider}. Please enter your API key in the settings.`);
      return;
    }
    
    setIsGeneratingTargetAudience(true);
    setError(null);
    try {
      const prompt = `Generate a comprehensive target audience description for content about "${data.focusKeyword}". 
      Format the output as a bulleted list of 3-5 different audience segments. For each segment, include demographics, 
      interests, and what they would be looking for in content about this topic.`;
      
      const systemPrompt = "You are an expert in audience research and content marketing. Create a concise but detailed target audience profile in a bulleted list format.";
      
      const result = await generateContent(prompt, {
        provider: provider,
        apiConfig: {
          provider: provider,
          apiKey: key,
          model: data.apiSettings?.seoApiModel
        },
        systemPrompt: systemPrompt
      });
      
      if (result) {
        updateData({ targetAudience: result });
        setSuccessMessage('Target audience generated successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        throw new Error('Failed to generate target audience');
      }
    } catch (err) {
      setError('Failed to generate target audience. Please try again.');
      console.error(err);
    } finally {
      setIsGeneratingTargetAudience(false);
    }
  };
  
  // Generate SEO Keywords
  const handleGenerateSEOKeywords = async () => {
    if (!data.focusKeyword) {
      setError('Please provide a focus keyword first');
      return;
    }
    
    // Check if API key exists
    const provider = data.apiSettings?.seoApiProvider || 'openai';
    const key = localStorage.getItem(`${provider}_api_key`) || localStorage.getItem('api_key');
    
    if (!key) {
      setError(`No API key found for ${provider}. Please enter your API key in the settings.`);
      return;
    }
    
    setIsGeneratingSEOKeywords(true);
    setError(null);
    try {
      const prompt = `Generate a list of 5-7 high-value SEO keywords related to "${data.focusKeyword}". 
      Include a mix of short-tail and mid-tail keywords with good search volume. Format as a bullet list.`;
      
      const systemPrompt = "You are an SEO expert. Generate a list of valuable, relevant keywords for content creation. Focus on keywords with good search volume and reasonable competition.";
      
      const result = await generateContent(prompt, {
        provider: provider,
        apiConfig: {
          provider: provider,
          apiKey: key,
          model: data.apiSettings?.seoApiModel
        },
        systemPrompt: systemPrompt
      });
      
      if (result) {
        updateData({ seoKeywords: result });
        setSuccessMessage('SEO Keywords generated successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        throw new Error('Failed to generate SEO keywords');
      }
    } catch (err) {
      setError('Failed to generate SEO keywords. Please try again.');
      console.error(err);
    } finally {
      setIsGeneratingSEOKeywords(false);
    }
  };
  
  // Generate Long Tail Keywords
  const handleGenerateLongTail = async () => {
    if (!data.focusKeyword) {
      setError('Please provide a focus keyword first');
      return;
    }
    
    // Check if API key exists
    const provider = data.apiSettings?.seoApiProvider || 'openai';
    const key = localStorage.getItem(`${provider}_api_key`) || localStorage.getItem('api_key');
    
    if (!key) {
      setError(`No API key found for ${provider}. Please enter your API key in the settings.`);
      return;
    }
    
    setIsGeneratingLongTail(true);
    setError(null);
    try {
      const prompt = `Generate a list of 5-7 long-tail keyword phrases (3-5 words each) for the main keyword "${data.focusKeyword}". 
      Focus on question-based and problem-solving phrases that people might search for. Format as a bullet list.`;
      
      const systemPrompt = "You are an SEO expert specializing in long-tail keyword research. Generate valuable long-tail keywords that have lower competition but clear search intent.";
      
      const result = await generateContent(prompt, {
        provider: provider,
        apiConfig: {
          provider: provider,
          apiKey: key,
          model: data.apiSettings?.seoApiModel
        },
        systemPrompt: systemPrompt
      });
      
      if (result) {
        updateData({ longTailKeywords: result });
        setSuccessMessage('Long Tail Keywords generated successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        throw new Error('Failed to generate long tail keywords');
      }
    } catch (err) {
      setError('Failed to generate long tail keywords. Please try again.');
      console.error(err);
    } finally {
      setIsGeneratingLongTail(false);
    }
  };
  
  // Generate Internal Links
  const handleGenerateInternalLinks = async () => {
    if (!data.focusKeyword) {
      setError('Please provide a focus keyword first');
      return;
    }
    
    if (!websiteUrl) {
      setError('Please enter your website URL first');
      return;
    }
    
    if (!websiteUrls) {
      setError('Please enter website URLs or sitemap content first');
      return;
    }
    
    // Check if API key exists
    const provider = data.apiSettings?.seoApiProvider || 'openai';
    const key = localStorage.getItem(`${provider}_api_key`) || localStorage.getItem('api_key');
    
    if (!key) {
      setError(`No API key found for ${provider}. Please enter your API key in the settings.`);
      return;
    }
    
    setIsGeneratingInternalLinks(true);
    setError(null);
    try {
      const prompt = `Based on the following website URLs, recommend 3-5 internal linking opportunities for content about "${data.focusKeyword}".
      
      Website URL: ${websiteUrl}
      Available URLs:
      ${websiteUrls}
      
      For each recommendation, include:
      1. Full URL
      2. Suggested anchor text
      3. Brief reason why this is a good linking opportunity
      
      Format as a numbered list.`;
      
      const systemPrompt = "You are an SEO internal linking expert. Analyze the provided URLs and suggest the best internal linking opportunities that would create a strong topic cluster and improve SEO.";
      
      const result = await generateContent(prompt, {
        provider: provider,
        apiConfig: {
          provider: provider,
          apiKey: key,
          model: data.apiSettings?.seoApiModel
        },
        systemPrompt: systemPrompt
      });
      
      if (result) {
        updateData({ internalLinkingWebsite: result });
        setSuccessMessage('Internal Links generated successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        throw new Error('Failed to generate internal links');
      }
    } catch (err) {
      setError('Failed to generate internal links. Please try again.');
      console.error(err);
    } finally {
      setIsGeneratingInternalLinks(false);
    }
  };
  
  // Generate External Links
  const handleGenerateExternalLinks = async () => {
    if (!data.focusKeyword) {
      setError('Please provide a focus keyword first');
      return;
    }
    
    // Check if API key exists
    const provider = data.apiSettings?.seoApiProvider || 'openai';
    const key = localStorage.getItem(`${provider}_api_key`) || localStorage.getItem('api_key');
    
    if (!key) {
      setError(`No API key found for ${provider}. Please enter your API key in the settings.`);
      return;
    }
    
    setIsGeneratingExternalLinks(true);
    setError(null);
    try {
      const prompt = `Suggest 3-5 types of authoritative external sources that would be valuable to link to in content about "${data.focusKeyword}". 
      For each suggestion, provide:
      1. The type of source (e.g., research institution, industry association)
      2. Examples of specific websites in this category
      3. What kind of information from these sources would be valuable to cite
      
      Format as a numbered list.`;
      
      const systemPrompt = "You are an expert in content research and external linking strategy. Recommend high-quality external linking opportunities that would add credibility and value to content.";
      
      const result = await generateContent(prompt, {
        provider: provider,
        apiConfig: {
          provider: provider,
          apiKey: key,
          model: data.apiSettings?.seoApiModel
        },
        systemPrompt: systemPrompt
      });
      
      if (result) {
        updateData({ externalLinkType: result });
        setSuccessMessage('External Links generated successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        throw new Error('Failed to generate external links');
      }
    } catch (err) {
      setError('Failed to generate external links. Please try again.');
      console.error(err);
    } finally {
      setIsGeneratingExternalLinks(false);
    }
  };
  
  // Generate FAQs
  const handleGenerateFAQs = async () => {
    if (!data.focusKeyword) {
      setError('Please provide a focus keyword first');
      return;
    }
    
    // Check if API key exists
    const provider = data.apiSettings?.seoApiProvider || 'openai';
    const key = localStorage.getItem(`${provider}_api_key`) || localStorage.getItem('api_key');
    
    if (!key) {
      setError(`No API key found for ${provider}. Please enter your API key in the settings.`);
      return;
    }
    
    setIsGeneratingFAQs(true);
    setError(null);
    try {
      const prompt = `Generate 5 frequently asked questions (FAQs) with detailed answers about "${data.focusKeyword}". 
      Include a mix of basic and advanced questions that would provide value to readers.
      Format each as "Q: [Question]" followed by "A: [Answer]" with a blank line between each FAQ.`;
      
      const systemPrompt = "You are an expert in creating FAQ sections for content. Generate comprehensive, accurate, and helpful FAQs that address common questions and search intents related to the topic.";
      
      const result = await generateContent(prompt, {
        provider: provider,
        apiConfig: {
          provider: provider,
          apiKey: key,
          model: data.apiSettings?.seoApiModel
        },
        systemPrompt: systemPrompt
      });
      
      if (result) {
        updateData({ faqs: result });
        setSuccessMessage('FAQs generated successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        throw new Error('Failed to generate FAQs');
      }
    } catch (err) {
      setError('Failed to generate FAQs. Please try again.');
      console.error(err);
    } finally {
      setIsGeneratingFAQs(false);
    }
  };
  
  // Update image settings
  const updateImageSettings = (newSettings: Partial<any>) => {
    updateData({
      imageSettings: {
        ...data.imageSettings,
        ...newSettings
      }
    });
  };
  
  // Update opt-in settings
  const updateOptInSettings = (newSettings: Partial<any>) => {
    updateData({
      optInSettings: {
        ...data.optInSettings,
        ...newSettings
      }
    });
  };
  
  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };
  
  // Handle hook type change
  const handleHookTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedHookType = e.target.value;
    
    // Update the hook type
    updateData({ introductoryHook: selectedHookType });
    
    // If a hook type was selected, also update the custom hook text with the appropriate description
    if (selectedHookType && hookDescriptions[selectedHookType]) {
      updateData({ customHook: hookDescriptions[selectedHookType] });
    } else {
      // If "None" was selected, clear the custom hook text
      updateData({ customHook: '' });
    }
  };
  
  const handleNextStepClick = () => {
    console.log("Next step button clicked in ContentSettingsStep - calling onNextStep");
    
    // Add an explicit check to see if onNextStep exists
    if (!onNextStep) {
      console.error("onNextStep function is not defined!");
      setError("Navigation error: Cannot proceed to next step. Please refresh the page.");
      return;
    }
    
    try {
      // Call onNextStep without any validation
      onNextStep();
    } catch (error) {
      console.error("Error in onNextStep:", error);
      setError("An error occurred when trying to navigate to the next step.");
    }
  };

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
  
  const currentProvider = data.apiSettings?.seoApiProvider || 'openai';
  const currentModel = data.apiSettings?.seoApiModel || 'gpt-4o-mini';
  
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
        <h2 className="text-xl font-bold mb-4">Step 3: Content Settings</h2>
        <p className="text-gray-600 mb-4">Configure how your content will be generated and structured.</p>
        
        {/* API Settings Section */}
        <div className="w-full border rounded-md p-4 mb-4">
          <button 
            className="flex items-center gap-2 w-full text-left"
            onClick={() => toggleSection('apiSettings')}
          >
            <Settings className="h-4 w-4" />
            <span className="font-medium">API Settings</span>
            <span className="ml-auto">{expandedSections.apiSettings ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}</span>
          </button>
          
          {expandedSections.apiSettings && (
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
        
        {/* Basic Info Section */}
        <div className="w-full border rounded-md p-4 mb-4">
          <button 
            className="flex items-center gap-2 w-full text-left"
            onClick={() => toggleSection('basicInfo')}
          >
            <Sparkles className="h-4 w-4" />
            <span className="font-medium">Basic Info</span>
            <span className="ml-auto">{expandedSections.basicInfo ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}</span>
          </button>
          
          {expandedSections.basicInfo && (
            <div className="mt-3 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Language</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={data.language || 'English (US)'}
                    onChange={(e) => updateData({ language: e.target.value })}
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
                  <label className="block text-sm font-medium mb-1">Country/Region</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={data.country || 'United States'}
                    onChange={(e) => updateData({ country: e.target.value })}
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
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-medium">Target Audience</label>
                  <button
                    onClick={handleGenerateTargetAudience}
                    disabled={isGeneratingTargetAudience}
                    className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                  >
                    {isGeneratingTargetAudience ? (
                      <>
                        <Spinner size="sm" className="mr-1" />
                        Generating...
                      </>
                    ) : (
                      'Generate'
                    )}
                  </button>
                </div>
                <textarea
                  value={data.targetAudience || ''}
                  onChange={(e) => updateData({ targetAudience: e.target.value })}
                  placeholder="Describe your target audience"
                  className="w-full p-2 border rounded-md"
                  rows={3}
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-medium">SEO Keywords</label>
                  <button
                    onClick={handleGenerateSEOKeywords}
                    disabled={isGeneratingSEOKeywords}
                    className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                  >
                    {isGeneratingSEOKeywords ? (
                      <>
                        <Spinner size="sm" className="mr-1" />
                        Generating...
                      </>
                    ) : (
                      'Generate'
                    )}
                  </button>
                </div>
                <textarea
                  value={data.seoKeywords || ''}
                  onChange={(e) => updateData({ seoKeywords: e.target.value })}
                  placeholder="SEO keywords for your content"
                  className="w-full p-2 border rounded-md"
                  rows={3}
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-medium">Long Tail Keywords</label>
                  <button
                    onClick={handleGenerateLongTail}
                    disabled={isGeneratingLongTail}
                    className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                  >
                    {isGeneratingLongTail ? (
                      <>
                        <Spinner size="sm" className="mr-1" />
                        Generating...
                      </>
                    ) : (
                      'Generate'
                    )}
                  </button>
                </div>
                <textarea
                  value={data.longTailKeywords || ''}
                  onChange={(e) => updateData({ longTailKeywords: e.target.value })}
                  placeholder="Long tail keyword variations (3-5 word phrases)"
                  className="w-full p-2 border rounded-md"
                  rows={3}
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-medium">FAQs</label>
                  <button
                    onClick={handleGenerateFAQs}
                    disabled={isGeneratingFAQs}
                    className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                  >
                    {isGeneratingFAQs ? (
                      <>
                        <Spinner size="sm" className="mr-1" />
                        Generating...
                      </>
                    ) : (
                      'Generate'
                    )}
                  </button>
                </div>
                <textarea
                  value={data.faqs || ''}
                  onChange={(e) => updateData({ faqs: e.target.value })}
                  placeholder="FAQs to include in the content"
                  className="w-full p-2 border rounded-md"
                  rows={4}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Additional Instructions</label>
                <textarea
                  value={data.additionalInstructions || ''}
                  onChange={(e) => updateData({ additionalInstructions: e.target.value })}
                  placeholder="Any additional instructions for the content"
                  className="w-full p-2 border rounded-md"
                  rows={3}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Core Settings Section */}
        <div className="w-full border rounded-md p-4 mb-4">
          <button 
            className="flex items-center gap-2 w-full text-left"
            onClick={() => toggleSection('coreSettings')}
          >
            <Sliders className="h-4 w-4" />
            <span className="font-medium">Core Settings</span>
            <span className="ml-auto">{expandedSections.coreSettings ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}</span>
          </button>
          
          {expandedSections.coreSettings && (
            <div className="mt-3 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Article Type</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={data.articleType || 'None'}
                  onChange={(e) => updateData({ articleType: e.target.value })}
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
              
              <div>
                <label className="block text-sm font-medium mb-1">Article Size</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={data.wordCount || 'medium'}
                  onChange={(e) => updateData({ wordCount: e.target.value })}
                >
                  <option value="x-small">X-Small (600-1200 words, 2-5 H2)</option>
                  <option value="small">Small (1200-2400 words, 5-8 H2)</option>
                  <option value="medium">Medium (2400-3600 words, 9-12 H2)</option>
                  <option value="large">Large (3600-5200 words, 13-16 H2)</option>
                </select>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium">Tone of Voice</label>
                  <span className="text-xs text-gray-400">0/50</span>
                </div>
                <select
                  className="w-full p-2 border rounded-md"
                  value={data.tone || 'Professional'}
                  onChange={(e) => updateData({ tone: e.target.value })}
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
              
              <div>
                <label className="block text-sm font-medium mb-1">Point of View</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={data.pointOfView || 'None'}
                  onChange={(e) => updateData({ pointOfView: e.target.value })}
                >
                  <option value="None">None</option>
                  <option value="First Person">First Person (I, We)</option>
                  <option value="Second Person">Second Person (You)</option>
                  <option value="Third Person">Third Person (He, She, They)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Brand Voice</label>
                <textarea
                  value={data.brandVoice || ''}
                  onChange={(e) => updateData({ brandVoice: e.target.value })}
                  placeholder="Describe your brand voice"
                  className="w-full p-2 border rounded-md"
                  rows={3}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Text Settings Section */}
        <div className="w-full border rounded-md p-4 mb-4">
          <button 
            className="flex items-center gap-2 w-full text-left"
            onClick={() => toggleSection('textSettings')}
          >
            <HelpCircle className="h-4 w-4" />
            <span className="font-medium">Text Settings</span>
            <span className="ml-auto">{expandedSections.textSettings ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}</span>
          </button>
          
          {expandedSections.textSettings && (
            <div className="mt-3 space-y-4">
              <div>
                <div className="flex items-center mb-1">
                  <label className="text-sm font-medium">Text Readability</label>
                  <HelpCircle className="h-4 w-4 text-gray-400 ml-1" />
                </div>
                <div className="relative">
                  <select
                    className="w-full p-2 border rounded-md"
                    value={data.textReadability || '8th & 9th grade'}
                    onChange={(e) => updateData({ textReadability: e.target.value })}
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
                    <span className="text-xs text-gray-400">Recommended</span>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center mb-1">
                  <label className="text-sm font-medium">AI Content Cleaning</label>
                  <HelpCircle className="h-4 w-4 text-gray-400 ml-1" />
                </div>
                <select
                  className="w-full p-2 border rounded-md"
                  value={data.aiContentCleaning || 'No AI Words Removal'}
                  onChange={(e) => updateData({ aiContentCleaning: e.target.value })}
                >
                  <option value="No AI Words Removal">No AI Words Removal</option>
                  <option value="Basic AI Words Removal">Basic AI Words Removal</option>
                  <option value="Extended AI Words Removal">Extended AI Words Removal</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Output Format</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={data.outputFormat || 'blogPost'}
                  onChange={(e) => updateData({ outputFormat: e.target.value as 'blogPost' | 'standard' })}
                >
                  <option value="blogPost">Blog Post (Rich Format)</option>
                  <option value="standard">Standard Content</option>
                </select>
              </div>
            </div>
          )}
        </div>
        
        {/* SEO Settings Section */}
        <div className="w-full border rounded-md p-4 mb-4">
          <button 
            className="flex items-center gap-2 w-full text-left"
            onClick={() => toggleSection('seoSettings')}
          >
            <Search className="h-4 w-4" />
            <span className="font-medium">SEO Settings</span>
            <span className="ml-auto">{expandedSections.seoSettings ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}</span>
          </button>
          
          {expandedSections.seoSettings && (
            <div className="mt-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeBold"
                    checked={data.includeBold !== false}
                    onChange={(e) => updateData({ includeBold: e.target.checked })}
                    className="mr-2 h-4 w-4"
                  />
                  <label htmlFor="includeBold" className="text-sm">Include Bold Keywords</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeH3"
                    checked={data.includeH3 !== false}
                    onChange={(e) => updateData({ includeH3: e.target.checked })}
                    className="mr-2 h-4 w-4"
                  />
                  <label htmlFor="includeH3" className="text-sm">Include H3 Tags</label>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Structure Section */}
        <div className="w-full border rounded-md p-4 mb-4">
          <button 
            className="flex items-center gap-2 w-full text-left"
            onClick={() => toggleSection('structure')}
          >
            <HelpCircle className="h-4 w-4" />
            <span className="font-medium">Structure</span>
            <span className="ml-auto">{expandedSections.structure ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}</span>
          </button>
          
          {expandedSections.structure && (
            <div className="mt-3 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Introductory Hook Type</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={data.introductoryHook || ''}
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
              
              <div>
                <label className="block text-sm font-medium mb-1">Hook Instructions</label>
                <textarea
                  value={data.customHook || ''}
                  onChange={(e) => updateData({ customHook: e.target.value })}
                  placeholder="Instructions for the hook"
                  className="w-full p-2 border rounded-md resize-y"
                  rows={4}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Document Elements Section */}
        <div className="w-full border rounded-md p-4 mb-4">
          <button 
            className="flex items-center gap-2 w-full text-left"
            onClick={() => toggleSection('documentElements')}
          >
            <HelpCircle className="h-4 w-4" />
            <span className="font-medium">Document Elements</span>
            <span className="ml-auto">{expandedSections.documentElements ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}</span>
          </button>
          
          {expandedSections.documentElements && (
            <div className="mt-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
                <div className="flex items-start space-x-2">
                  <input 
                    type="checkbox"
                    id="include-conclusion" 
                    checked={data.includeConclusion !== false}
                    onChange={(e) => updateData({ includeConclusion: e.target.checked })}
                    className="mt-1"
                  />
                  <label htmlFor="include-conclusion" className="text-sm font-normal cursor-pointer">Conclusion</label>
                </div>
                <div className="flex items-start space-x-2">
                  <input 
                    type="checkbox"
                    id="include-tables" 
                    checked={data.includeTables !== false}
                    onChange={(e) => updateData({ includeTables: e.target.checked })}
                    className="mt-1"
                  />
                  <label htmlFor="include-tables" className="text-sm font-normal cursor-pointer">Tables</label>
                </div>
                <div className="flex items-start space-x-2">
                  <input 
                    type="checkbox"
                    id="include-h3" 
                    checked={data.includeH3 !== false}
                    onChange={(e) => updateData({ includeH3: e.target.checked })}
                    className="mt-1"
                  />
                  <label htmlFor="include-h3" className="text-sm font-normal cursor-pointer">H3 Subheadings</label>
                </div>
                <div className="flex items-start space-x-2">
                  <input 
                    type="checkbox"
                    id="include-lists" 
                    checked={data.includeLists !== false}
                    onChange={(e) => updateData({ includeLists: e.target.checked })}
                    className="mt-1"
                  />
                  <label htmlFor="include-lists" className="text-sm font-normal cursor-pointer">Lists</label>
                </div>
                <div className="flex items-start space-x-2">
                  <input 
                    type="checkbox"
                    id="include-italics" 
                    checked={data.includeItalics === true}
                    onChange={(e) => updateData({ includeItalics: e.target.checked })}
                    className="mt-1"
                  />
                  <label htmlFor="include-italics" className="text-sm font-normal cursor-pointer">Italics</label>
                </div>
                <div className="flex items-start space-x-2">
                  <input 
                    type="checkbox"
                    id="include-quotes" 
                    checked={data.includeQuotes === true}
                    onChange={(e) => updateData({ includeQuotes: e.target.checked })}
                    className="mt-1"
                  />
                  <label htmlFor="include-quotes" className="text-sm font-normal cursor-pointer">Quotes</label>
                </div>
                <div className="flex items-start space-x-2">
                  <input 
                    type="checkbox"
                    id="include-key-takeaways" 
                    checked={data.includeKeyTakeaways !== false}
                    onChange={(e) => updateData({ includeKeyTakeaways: e.target.checked })}
                    className="mt-1"
                  />
                  <label htmlFor="include-key-takeaways" className="text-sm font-normal cursor-pointer">Key Takeaways</label>
                </div>
                <div className="flex items-start space-x-2">
                  <input 
                    type="checkbox"
                    id="include-faqs" 
                    checked={data.includeFAQs !== false}
                    onChange={(e) => updateData({ includeFAQs: e.target.checked })}
                    className="mt-1"
                  />
                  <label htmlFor="include-faqs" className="text-sm font-normal cursor-pointer">FAQ Section</label>
                </div>
                <div className="flex items-start space-x-2">
                  <input 
                    type="checkbox"
                    id="include-bold" 
                    checked={data.includeBold !== false}
                    onChange={(e) => updateData({ includeBold: e.target.checked })}
                    className="mt-1"
                  />
                  <label htmlFor="include-bold" className="text-sm font-normal cursor-pointer">Bold Keywords</label>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Image Settings Section */}
        <div className="w-full border rounded-md p-4 mb-4">
          <button 
            className="flex items-center gap-2 w-full text-left"
            onClick={() => toggleSection('imageSettings')}
          >
            <Image className="h-4 w-4" />
            <span className="font-medium">Image Settings</span>
            <span className="ml-auto">{expandedSections.imageSettings ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}</span>
          </button>
          
          {expandedSections.imageSettings && (
            <div className="mt-3 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Number of Image Suggestions</label>
                <select
                  value={data.imageSettings?.numberOfImagePrompts?.toString() || '5'}
                  onChange={(e) => updateImageSettings({ numberOfImagePrompts: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="3">3 Images</option>
                  <option value="5">5 Images</option>
                  <option value="7">7 Images</option>
                  <option value="10">10 Images</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Image Prompt Style</label>
                <select
                  value={data.imageSettings?.imagePromptStyle || 'detailed'}
                  onChange={(e) => updateImageSettings({ imagePromptStyle: e.target.value as any })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="simple">Simple (Brief descriptions)</option>
                  <option value="detailed">Detailed (Comprehensive descriptions)</option>
                  <option value="creative">Creative (Imaginative concepts)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Image Distribution</label>
                <select
                  value={data.imageSettings?.imageDistribution || 'balanced'}
                  onChange={(e) => updateImageSettings({ imageDistribution: e.target.value as any })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="header-only">Header Focus (Beginning of sections)</option>
                  <option value="balanced">Balanced (Evenly throughout)</option>
                  <option value="throughout">Throughout (Including subsections)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Custom Image Instructions</label>
                <textarea
                  value={data.imageSettings?.customImagePrompts || ''}
                  onChange={(e) => updateImageSettings({ customImagePrompts: e.target.value })}
                  placeholder="Any specific instructions for image generation..."
                  className="w-full p-2 border rounded-md"
                  rows={3}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Opt-In Form Section */}
        <div className="w-full border rounded-md p-4 mb-4">
          <button 
            className="flex items-center gap-2 w-full text-left"
            onClick={() => toggleSection('optInSettings')}
          >
            <Mail className="h-4 w-4" />
            <span className="font-medium">Opt-In Form</span>
            <span className="ml-auto">{expandedSections.optInSettings ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}</span>
          </button>
          
          {expandedSections.optInSettings && (
            <div className="mt-3 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Enable Email Opt-In Form</label>
                <input
                  type="checkbox"
                  checked={data.optInSettings?.enableOptIn === true}
                  onChange={(e) => updateOptInSettings({ enableOptIn: e.target.checked })}
                  className="h-4 w-4"
                />
              </div>
              
              {data.optInSettings?.enableOptIn && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Opt-In Text</label>
                    <input
                      type="text"
                      value={data.optInSettings?.optInText || 'Subscribe to our newsletter for more content like this'}
                      onChange={(e) => updateOptInSettings({ optInText: e.target.value })}
                      placeholder="Enter opt-in text prompt"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Placement</label>
                    <select
                      value={data.optInSettings?.optInPlacement || 'bottom'}
                      onChange={(e) => updateOptInSettings({ optInPlacement: e.target.value as any })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="top">Top of Content</option>
                      <option value="bottom">Bottom of Content</option>
                      <option value="after-content">After Main Content (Before Conclusion)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Design Style</label>
                    <select
                      value={data.optInSettings?.optInDesign || 'standard'}
                      onChange={(e) => updateOptInSettings({ optInDesign: e.target.value as any })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="standard">Standard</option>
                      <option value="minimalist">Minimalist</option>
                      <option value="prominent">Prominent</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Make Opt-In Required</label>
                    <input
                      type="checkbox"
                      checked={data.optInSettings?.optInRequired === true}
                      onChange={(e) => updateOptInSettings({ optInRequired: e.target.checked })}
                      className="h-4 w-4"
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        
        {/* Internal Linking Section */}
        <div className="w-full border rounded-md p-4 mb-4">
          <button 
            className="flex items-center gap-2 w-full text-left"
            onClick={() => toggleSection('internalLinking')}
          >
            <HelpCircle className="h-4 w-4" />
            <span className="font-medium">Internal Linking</span>
            <span className="ml-auto">{expandedSections.internalLinking ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}</span>
          </button>
          
          {expandedSections.internalLinking && (
            <div className="mt-3 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Website URL</label>
                <input
                  type="text"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="Your website URL (e.g., https://example.com)"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Website URLs/Sitemap</label>
                <textarea
                  value={websiteUrls}
                  onChange={(e) => setWebsiteUrls(e.target.value)}
                  placeholder="Paste your website URLs or sitemap content here"
                  className="w-full p-2 border rounded-md"
                  rows={4}
                />
              </div>
              
              <div className="flex items-start justify-between">
                <div className="flex-grow">
                  <label className="block text-sm font-medium mb-1">Internal Links</label>
                  <textarea
                    value={data.internalLinkingWebsite || ''}
                    onChange={(e) => updateData({ internalLinkingWebsite: e.target.value })}
                    placeholder="Internal links for your content"
                    className="w-full p-2 border rounded-md"
                    rows={4}
                  />
                </div>
                <button
                  onClick={handleGenerateInternalLinks}
                  disabled={isGeneratingInternalLinks || !websiteUrl || !websiteUrls}
                  className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center mt-7 ml-2"
                >
                  {isGeneratingInternalLinks ? (
                    <>
                      <Spinner size="sm" className="mr-1" />
                      Generating...
                    </>
                  ) : (
                    'Generate'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* External Linking Section */}
        <div className="w-full border rounded-md p-4 mb-4">
          <button 
            className="flex items-center gap-2 w-full text-left"
            onClick={() => toggleSection('externalLinking')}
          >
            <HelpCircle className="h-4 w-4" />
            <span className="font-medium">External Linking</span>
            <span className="ml-auto">{expandedSections.externalLinking ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}</span>
          </button>
          
          {expandedSections.externalLinking && (
            <div className="mt-3">
              <div className="flex justify-between items-start">
                <div className="flex-grow">
                  <label className="block text-sm font-medium mb-1">External Links</label>
                  <textarea
                    value={data.externalLinkType || ''}
                    onChange={(e) => updateData({ externalLinkType: e.target.value })}
                    placeholder="External links for your content"
                    className="w-full p-2 border rounded-md"
                    rows={4}
                  />
                </div>
                <button
                  onClick={handleGenerateExternalLinks}
                  disabled={isGeneratingExternalLinks}
                  className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center mt-7 ml-2"
                >
                  {isGeneratingExternalLinks ? (
                    <>
                      <Spinner size="sm" className="mr-1" />
                      Generating...
                    </>
                  ) : (
                    'Generate'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrevStep}
          className="px-3 py-2 border rounded-md bg-gray-100 hover:bg-gray-200 flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Meta Description
        </button>
        
        <button
          id="next-step-button"
          onClick={handleNextStepClick}
          className="p-3 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white flex items-center"
        >
          Next Step: Content Generation
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};