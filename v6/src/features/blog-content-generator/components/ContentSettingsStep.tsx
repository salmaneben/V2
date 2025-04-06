// src/features/blog-content-generator/components/ContentSettingsStep.tsx

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RefreshCw, Settings } from 'lucide-react';
import { StepProps, Provider } from '../types';
import ApiSettingsSelector from './ApiSettingsSelector';

// Simplified mock API functions (you would replace these with your real API calls)
const generateSEOKeywords = async (mainKeyword: string, apiSettings: any) => {
  // In a real implementation, this would call your API
  return "- Top ranking keyword for this topic\n- Related keyword variation\n- High search volume term\n- Long-tail keyword opportunity\n- Competitor targeted keyword";
};

const generateLongTailKeywords = async (mainKeyword: string, apiSettings: any) => {
  return "- How to " + mainKeyword + " effectively\n- Best " + mainKeyword + " strategies for beginners\n- " + mainKeyword + " tips and tricks";
};

const generateInternalLinks = async (mainKeyword: string, apiSettings: any) => {
  return "1. https://yourdomain.com/related-page-1 - Suggested anchor text: Complete Guide\n2. https://yourdomain.com/related-page-2 - Suggested anchor text: Advanced Tips\n3. https://yourdomain.com/related-page-3 - Suggested anchor text: Case Study";
};

const generateExternalLinks = async (mainKeyword: string, apiSettings: any) => {
  return "1. https://authority-site.com/relevant-article\n2. https://trusted-resource.org/research-study\n3. https://industry-leader.com/expert-opinion";
};

const generateFAQs = async (mainKeyword: string, apiSettings: any) => {
  return "1. Q: What is " + mainKeyword + "?\nA: Brief definition of " + mainKeyword + ".\n\n2. Q: How does " + mainKeyword + " work?\nA: Simple explanation of the process.\n\n3. Q: What are the benefits of " + mainKeyword + "?\nA: List of main advantages.\n\n4. Q: How to get started with " + mainKeyword + "?\nA: Basic steps to begin.\n\n5. Q: What are common mistakes with " + mainKeyword + "?\nA: Typical errors to avoid.";
};

export const ContentSettingsStep: React.FC<StepProps> = ({ 
  data, 
  updateData, 
  onNextStep,
  onPrevStep 
}) => {
  const [activeTab, setActiveTab] = useState('content');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Loading states for API calls
  const [isGeneratingSEOKeywords, setIsGeneratingSEOKeywords] = useState(false);
  const [isGeneratingLongTail, setIsGeneratingLongTail] = useState(false);
  const [isGeneratingInternalLinks, setIsGeneratingInternalLinks] = useState(false);
  const [isGeneratingExternalLinks, setIsGeneratingExternalLinks] = useState(false);
  const [isGeneratingFAQs, setIsGeneratingFAQs] = useState(false);
  const [showApiSettings, setShowApiSettings] = useState(false);
  
  // Initialize settings on first render
  useEffect(() => {
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
  
  // Generate SEO Keywords
  const handleGenerateSEOKeywords = async () => {
    if (!data.focusKeyword) {
      setError('Please provide a focus keyword first');
      return;
    }
    
    setIsGeneratingSEOKeywords(true);
    setError(null);
    try {
      const keywords = await generateSEOKeywords(data.focusKeyword, data.apiSettings);
      updateData({ seoKeywords: keywords });
      setSuccessMessage('SEO Keywords generated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
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
    
    setIsGeneratingLongTail(true);
    setError(null);
    try {
      const longTail = await generateLongTailKeywords(data.focusKeyword, data.apiSettings);
      updateData({ longTailKeywords: longTail });
      setSuccessMessage('Long Tail Keywords generated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
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
    
    setIsGeneratingInternalLinks(true);
    setError(null);
    try {
      const internalLinks = await generateInternalLinks(data.focusKeyword, data.apiSettings);
      updateData({ internalLinkingWebsite: internalLinks });
      setSuccessMessage('Internal Links generated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
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
    
    setIsGeneratingExternalLinks(true);
    setError(null);
    try {
      const externalLinks = await generateExternalLinks(data.focusKeyword, data.apiSettings);
      updateData({ externalLinkType: externalLinks });
      setSuccessMessage('External Links generated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
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
    
    setIsGeneratingFAQs(true);
    setError(null);
    try {
      const faqs = await generateFAQs(data.focusKeyword, data.apiSettings);
      updateData({ faqs: faqs });
      setSuccessMessage('FAQs generated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
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
  
  // Handle API provider changes
  const handleProviderChange = (providerId: string, provider: Provider) => {
    updateData({
      apiSettings: {
        ...data.apiSettings,
        [providerId]: provider
      }
    });
  };
  
  // Handle API model changes
  const handleModelChange = (modelId: string, model: string) => {
    updateData({
      apiSettings: {
        ...data.apiSettings,
        [modelId]: model
      }
    });
  };
  
  const handleNextStepClick = () => {
    console.log("Next step button clicked in ContentSettingsStep");
    onNextStep(); // Call onNextStep without any validation
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
      
      <div className="p-6 border rounded-md bg-white shadow-sm">
        <h2 className="text-xl font-bold mb-4">Step 3: Content Settings</h2>
        
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
            <div className="mt-3">
              <ApiSettingsSelector
                stepName="SEO Generator"
                providerId="seoApiProvider"
                modelId="seoApiModel"
                provider={data.apiSettings?.seoApiProvider || data.provider || 'deepseek'}
                model={data.apiSettings?.seoApiModel || (data.apiSettings?.seoApiProvider === 'openai' ? 'gpt-4' : 
                      data.apiSettings?.seoApiProvider === 'claude' ? 'claude-3-sonnet-20240229' : 
                      data.apiSettings?.seoApiProvider === 'perplexity' ? 'llama-3.1-sonar-small-128k-online' : 'deepseek-chat')}
                onProviderChange={handleProviderChange}
                onModelChange={handleModelChange}
                showCustomOptions={true}
              />
            </div>
          )}
        </div>
        
        <div className="mb-4 border-b">
          <div className="flex flex-wrap space-x-2">
            <button 
              className={`py-2 px-4 ${activeTab === 'content' ? 'bg-blue-100 border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('content')}
            >
              Content Settings
            </button>
            <button 
              className={`py-2 px-4 ${activeTab === 'images' ? 'bg-blue-100 border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('images')}
            >
              Image Prompts
            </button>
            <button 
              className={`py-2 px-4 ${activeTab === 'optin' ? 'bg-blue-100 border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('optin')}
            >
              Opt-In Form
            </button>
            <button 
              className={`py-2 px-4 ${activeTab === 'seo' ? 'bg-blue-100 border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('seo')}
            >
              SEO Options
            </button>
          </div>
        </div>
        
        {/* Content Settings Tab */}
        {activeTab === 'content' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="word-count">Word Count</label>
                <select
                  id="word-count"
                  value={data.wordCount || 'medium'}
                  onChange={(e) => updateData({ wordCount: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="small">Small (~800 words)</option>
                  <option value="medium">Medium (~1200 words)</option>
                  <option value="large">Large (~2000 words)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="tone">Tone</label>
                <select
                  id="tone"
                  value={data.tone || 'Professional'}
                  onChange={(e) => updateData({ tone: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Professional">Professional</option>
                  <option value="Conversational">Conversational</option>
                  <option value="Friendly">Friendly</option>
                  <option value="Authoritative">Authoritative</option>
                  <option value="Humorous">Humorous</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="readability">Readability Level</label>
                <select
                  id="readability"
                  value={data.textReadability || '8th & 9th grade'}
                  onChange={(e) => updateData({ textReadability: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="8th & 9th grade">8th & 9th grade (Standard)</option>
                  <option value="6th & 7th grade">Simple (6th & 7th grade)</option>
                  <option value="10th & 11th grade">Advanced (10th & 11th grade)</option>
                  <option value="College">Expert (College level)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="output-format">Output Format</label>
                <select
                  id="output-format"
                  value={data.outputFormat || 'blogPost'}
                  onChange={(e) => updateData({ outputFormat: e.target.value as 'standard' | 'blogPost' })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="blogPost">Blog Post (Rich Format)</option>
                  <option value="standard">Standard Content</option>
                </select>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Content Elements</h4>
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
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="additional-instructions">Additional Instructions</label>
              <textarea
                id="additional-instructions"
                value={data.additionalInstructions || ''}
                onChange={(e) => updateData({ additionalInstructions: e.target.value })}
                placeholder="Any specific instructions for content generation..."
                className="w-full p-2 border rounded-md min-h-[100px]"
              ></textarea>
            </div>
          </div>
        )}
        
        {/* Image Prompts Tab */}
        {activeTab === 'images' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="number-of-image-prompts">Number of Image Suggestions</label>
              <select
                id="number-of-image-prompts"
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
              <label className="block text-sm font-medium mb-1" htmlFor="image-prompt-style">Image Prompt Style</label>
              <select
                id="image-prompt-style"
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
              <label className="block text-sm font-medium mb-1" htmlFor="image-distribution">Image Distribution</label>
              <select
                id="image-distribution"
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
              <label className="block text-sm font-medium mb-1" htmlFor="custom-image-prompts">Custom Image Instructions</label>
              <textarea
                id="custom-image-prompts"
                value={data.imageSettings?.customImagePrompts || ''}
                onChange={(e) => updateImageSettings({ customImagePrompts: e.target.value })}
                placeholder="Any specific instructions for image generation..."
                className="w-full p-2 border rounded-md min-h-[100px]"
              ></textarea>
            </div>
          </div>
        )}
        
        {/* Opt-In Tab */}
        {activeTab === 'optin' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium" htmlFor="enable-optin">Enable Email Opt-In Form</label>
              <input
                type="checkbox"
                id="enable-optin"
                checked={data.optInSettings?.enableOptIn === true}
                onChange={(e) => updateOptInSettings({ enableOptIn: e.target.checked })}
                className="h-4 w-4"
              />
            </div>
            
            {data.optInSettings?.enableOptIn && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="optin-text">Opt-In Text</label>
                  <input
                    type="text"
                    id="optin-text"
                    value={data.optInSettings?.optInText || 'Subscribe to our newsletter for more content like this'}
                    onChange={(e) => updateOptInSettings({ optInText: e.target.value })}
                    placeholder="Enter opt-in text prompt"
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="optin-placement">Placement</label>
                  <select
                    id="optin-placement"
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
                  <label className="block text-sm font-medium mb-1" htmlFor="optin-design">Design Style</label>
                  <select
                    id="optin-design"
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
                  <label className="text-sm font-medium" htmlFor="optin-required">Make Opt-In Required</label>
                  <input
                    type="checkbox"
                    id="optin-required"
                    checked={data.optInSettings?.optInRequired === true}
                    onChange={(e) => updateOptInSettings({ optInRequired: e.target.checked })}
                    className="h-4 w-4"
                  />
                </div>
              </>
            )}
          </div>
        )}
        
        {/* SEO Options Tab with Generation Buttons */}
        {activeTab === 'seo' && (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium" htmlFor="seo-keywords">SEO Keywords</label>
                <button
                  onClick={handleGenerateSEOKeywords}
                  disabled={isGeneratingSEOKeywords}
                  className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                >
                  {isGeneratingSEOKeywords ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1" /> Generate
                    </>
                  )}
                </button>
              </div>
              <textarea
                id="seo-keywords"
                value={data.seoKeywords || ''}
                onChange={(e) => updateData({ seoKeywords: e.target.value })}
                placeholder="Enter secondary keywords (separated by commas)"
                className="w-full p-2 border rounded-md"
                rows={3}
              ></textarea>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium" htmlFor="long-tail-keywords">Long Tail Keywords</label>
                <button
                  onClick={handleGenerateLongTail}
                  disabled={isGeneratingLongTail}
                  className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                >
                  {isGeneratingLongTail ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1" /> Generate
                    </>
                  )}
                </button>
              </div>
              <textarea
                id="long-tail-keywords"
                value={data.longTailKeywords || ''}
                onChange={(e) => updateData({ longTailKeywords: e.target.value })}
                placeholder="Enter long-tail keyword variations"
                className="w-full p-2 border rounded-md"
                rows={3}
              ></textarea>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium" htmlFor="internal-links">Internal Linking</label>
                <button
                  onClick={handleGenerateInternalLinks}
                  disabled={isGeneratingInternalLinks}
                  className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                >
                  {isGeneratingInternalLinks ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1" /> Generate
                    </>
                  )}
                </button>
              </div>
              <textarea
                id="internal-links"
                value={data.internalLinkingWebsite || ''}
                onChange={(e) => updateData({ internalLinkingWebsite: e.target.value })}
                placeholder="URLs to internal pages for linking"
                className="w-full p-2 border rounded-md"
                rows={3}
              ></textarea>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium" htmlFor="external-links">External Linking</label>
                <button
                  onClick={handleGenerateExternalLinks}
                  disabled={isGeneratingExternalLinks}
                  className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                >
                  {isGeneratingExternalLinks ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1" /> Generate
                    </>
                  )}
                </button>
              </div>
              <textarea
                id="external-links"
                value={data.externalLinkType || ''}
                onChange={(e) => updateData({ externalLinkType: e.target.value })}
                placeholder="Suggested external resources to reference"
                className="w-full p-2 border rounded-md"
                rows={3}
              ></textarea>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium" htmlFor="faqs">FAQ Content</label>
                <button
                  onClick={handleGenerateFAQs}
                  disabled={isGeneratingFAQs}
                  className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                >
                  {isGeneratingFAQs ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1" /> Generate
                    </>
                  )}
                </button>
              </div>
              <textarea
                id="faqs"
                value={data.faqs || ''}
                onChange={(e) => updateData({ faqs: e.target.value })}
                placeholder="Questions to address in the FAQ section"
                className="w-full p-2 border rounded-md"
                rows={4}
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">Generated FAQs will be optimized for Google's "People Also Ask" feature.</p>
            </div>
          </div>
        )}
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
          onClick={handleNextStepClick} // Use this dedicated handler
          className="p-3 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white flex items-center"
        >
          Next Step: Content Generation
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};