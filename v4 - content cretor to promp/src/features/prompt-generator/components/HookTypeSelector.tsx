import React, { useState, useEffect, useRef } from 'react';
import { useSeoPromptGenerator } from '../hooks/useSeoPromptGenerator';
import NicheSelector from './NicheSelector';
import PromptTypeSelector from './PromptTypeSelector';
import DetailLevelSelector from './DetailLevelSelector';
import ToneSelector from './ToneSelector';
import ProviderSelector from './ProviderSelector';
import KeywordGenerator from './KeywordGenerator';
import FaqGenerator from './FaqGenerator';
import ArticleSizeSelector from './ArticleSizeSelector';
import HookTypeSelector from './HookTypeSelector';
import LocaleSelector from './LocaleSelector';
import { EnhancedPromptGeneratorData, ArticleSizeType, HookType } from '../types';

type TabType = 'basic' | 'structure' | 'seo' | 'advanced';

const EnhancedPromptGenerator: React.FC = () => {
  // Setup hooks
  const {
    formData,
    handleInputChange,
    handleHookTypeChange: hookTypeChangeHandler,
    handleCountryChange,
    handleLanguageChange,
    generatePrompt,
    generateSeoKeywords,
    generateLongTailKeywords,
    generateFaqs,
    generateTargetAudience,
    isGeneratingKeywords,
    isGeneratingLongTailKeywords,
    isGeneratingFaqs,
    isGeneratingTargetAudience,
    error,
    isApiAvailable,
    resetForm
  } = useSeoPromptGenerator();

  // UI state
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const [isCopied, setIsCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const promptPreviewRef = useRef<HTMLDivElement>(null);

  // Handle article size change
  const handleArticleSizeChange = (size: ArticleSizeType) => {
    handleInputChange('articleSize', size);
  };

  // Handle custom word count change
  const handleCustomWordCountChange = (count: number) => {
    handleInputChange('customWordCount', count);
  };

  // Handle hook type change
  const handleHookTypeChange = (hookType: HookType) => {
    hookTypeChangeHandler(hookType);
  };

  // Handle hook details change
  const handleHookDetailsChange = (details: string) => {
    handleInputChange('hookDetails', details);
  };

  // Handle generating the prompt
  const handleGeneratePrompt = () => {
    const prompt = generatePrompt();
    if (prompt) {
      setShowPreview(true);
      setTimeout(() => {
        if (promptPreviewRef.current) {
          promptPreviewRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  // Handle copying the prompt to clipboard
  const handleCopyPrompt = () => {
    if (formData.generatedPrompt) {
      navigator.clipboard.writeText(formData.generatedPrompt)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy prompt:', err);
        });
    }
  };

  // Handle reset form button
  const handleResetForm = () => {
    if (window.confirm('Are you sure you want to reset all form fields?')) {
      resetForm();
      setShowPreview(false);
    }
  };

  // Tab navigation component
  const TabNavigation = () => (
    <div className="mb-6 border-b border-gray-200">
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
        {[
          { key: 'basic', label: 'Basic Settings' },
          { key: 'structure', label: 'Structure' },
          { key: 'seo', label: 'SEO' },
          { key: 'advanced', label: 'Advanced' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as TabType)}
            className={`
              whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium
              ${activeTab === tab.key
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}
            `}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Tab Navigation */}
        <TabNavigation />

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Basic Settings Tab */}
        {activeTab === 'basic' && (
          <div className="space-y-8">
            {/* Focus Keyword */}
            <div className="space-y-2">
              <label htmlFor="focusKeyword" className="block text-sm font-medium text-gray-700">
                Focus Keyword / Topic:
              </label>
              <input
                id="focusKeyword"
                type="text"
                value={formData.focusKeyword}
                onChange={(e) => handleInputChange('focusKeyword', e.target.value)}
                placeholder="Enter your main topic or keyword"
                className="block w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                This is the primary topic your prompt and content will focus on
              </p>
            </div>

            {/* Niche Selector */}
            <NicheSelector
              selectedNiche={formData.niche}
              onNicheChange={(niche) => handleInputChange('niche', niche)}
            />

            {/* Prompt Type Selector */}
            <PromptTypeSelector
              selectedType={formData.promptType}
              onTypeChange={(type) => handleInputChange('promptType', type)}
            />

            {/* Tone Selector */}
            <ToneSelector
              selectedTone={formData.tone}
              onToneChange={(tone) => handleInputChange('tone', tone)}
            />

            {/* Provider Selector */}
            <ProviderSelector
              selectedProvider={formData.targetProvider}
              onProviderChange={(provider) => handleInputChange('targetProvider', provider)}
            />
          </div>
        )}

        {/* Structure Tab */}
        {activeTab === 'structure' && (
          <div className="space-y-8">
            {/* Article Size Selector */}
            <ArticleSizeSelector
              selectedSize={formData.articleSize}
              customWordCount={formData.customWordCount}
              onSizeChange={handleArticleSizeChange}
              onCustomWordCountChange={handleCustomWordCountChange}
            />

            {/* Hook Type Selector */}
            <HookTypeSelector
              selectedHookType={formData.hookType}
              hookDetails={formData.hookDetails}
              onHookTypeChange={handleHookTypeChange}
              onHookDetailsChange={handleHookDetailsChange}
            />

            {/* Detail Level Selector */}
            <DetailLevelSelector
              selectedLevel={formData.promptLevel}
              onLevelChange={(level) => handleInputChange('promptLevel', level)}
            />

            {/* Structure Checkbox */}
            <div className="flex items-center">
              <input
                id="includeStructure"
                type="checkbox"
                checked={formData.includeStructure}
                onChange={() => handleInputChange('includeStructure', !formData.includeStructure)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="includeStructure" className="ml-2 text-sm text-gray-700">
                Include detailed content structure guidelines
              </label>
            </div>

            {/* Examples Checkbox */}
            <div className="flex items-center">
              <input
                id="includeExamples"
                type="checkbox"
                checked={formData.includeExamples}
                onChange={() => handleInputChange('includeExamples', !formData.includeExamples)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="includeExamples" className="ml-2 text-sm text-gray-700">
                Include examples in the prompt
              </label>
            </div>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === 'seo' && (
          <div className="space-y-8">
            {/* SEO Checkbox */}
            <div className="flex items-center">
              <input
                id="includeSEO"
                type="checkbox"
                checked={formData.includeSEO}
                onChange={() => handleInputChange('includeSEO', !formData.includeSEO)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="includeSEO" className="ml-2 text-sm text-gray-700">
                Include SEO optimization instructions
              </label>
            </div>

            {/* Keywords Checkbox */}
            <div className="flex items-center">
              <input
                id="includeKeywords"
                type="checkbox"
                checked={formData.includeKeywords}
                onChange={() => handleInputChange('includeKeywords', !formData.includeKeywords)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="includeKeywords" className="ml-2 text-sm text-gray-700">
                Include secondary keywords integration
              </label>
            </div>

            {/* SEO Keywords Generator */}
            <KeywordGenerator
              focusKeyword={formData.focusKeyword}
              seoKeywords={formData.seoKeywords}
              onSeoKeywordsChange={(keywords) => handleInputChange('seoKeywords', keywords)}
              onGenerate={generateSeoKeywords}
              isGenerating={isGeneratingKeywords}
              isApiAvailable={isApiAvailable()}
              title="SEO Keywords"
              description="Include relevant SEO keywords to optimize your content"
              placeholder="Enter secondary keywords, one per line"
            />

            {/* Long-tail Keywords Generator */}
            <KeywordGenerator
              focusKeyword={formData.focusKeyword}
              seoKeywords={formData.longTailKeywords}
              onSeoKeywordsChange={(keywords) => handleInputChange('longTailKeywords', keywords)}
              onGenerate={generateLongTailKeywords}
              isGenerating={isGeneratingLongTailKeywords}
              isApiAvailable={isApiAvailable()}
              title="Long-tail Keywords"
              description="Include long-tail keyword phrases for comprehensive coverage"
              placeholder="Enter long-tail keywords, one per line"
            />

            {/* FAQ Checkbox */}
            <div className="flex items-center">
              <input
                id="includeFaqs"
                type="checkbox"
                checked={formData.includeFaqs}
                onChange={() => handleInputChange('includeFaqs', !formData.includeFaqs)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="includeFaqs" className="ml-2 text-sm text-gray-700">
                Include FAQ section in prompt
              </label>
            </div>

            {/* FAQs Generator */}
            <FaqGenerator
              focusKeyword={formData.focusKeyword}
              faqs={formData.faqs}
              onFaqsChange={(faqs) => handleInputChange('faqs', faqs)}
              onGenerate={generateFaqs}
              isGenerating={isGeneratingFaqs}
              isApiAvailable={isApiAvailable()}
            />

            {/* Target Audience Generator */}
            <div className="space-y-3 bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-medium text-gray-700">Target Audience</h3>
                {isApiAvailable() && (
                  <button
                    onClick={generateTargetAudience}
                    disabled={isGeneratingTargetAudience || !formData.focusKeyword}
                    className="inline-flex items-center py-1.5 px-3 text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
                  >
                    {isGeneratingTargetAudience ? (
                      <>
                        <RefreshCw className="animate-spin h-3.5 w-3.5 mr-1.5" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                        Generate
                      </>
                    )}
                  </button>
                )}
              </div>
              
              <p className="text-xs text-gray-500">Define your target audience to tailor content appropriately</p>
              
              <textarea
                value={formData.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                placeholder="Describe your target audience's demographics, interests, pain points, and goals"
                rows={5}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* Advanced Tab */}
        {activeTab === 'advanced' && (
          <div className="space-y-8">
            {/* Locale Selector */}
            <LocaleSelector
              selectedCountry={formData.country}
              selectedLanguage={formData.language}
              onCountryChange={handleCountryChange}
              onLanguageChange={handleLanguageChange}
            />

            {/* External Links */}
            <div className="space-y-3">
              <label htmlFor="externalLinks" className="block text-sm font-medium text-gray-700">
                External Links:
              </label>
              <textarea
                id="externalLinks"
                value={formData.externalLinks}
                onChange={(e) => handleInputChange('externalLinks', e.target.value)}
                placeholder="Enter URLs to authoritative external resources that should be referenced, one per line"
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500">
                Add links to authoritative sources to back up statements in your content
              </p>
            </div>

            {/* Internal Links */}
            <div className="space-y-3">
              <label htmlFor="internalLinks" className="block text-sm font-medium text-gray-700">
                Internal Links:
              </label>
              <textarea
                id="internalLinks"
                value={formData.internalLinks}
                onChange={(e) => handleInputChange('internalLinks', e.target.value)}
                placeholder="Enter internal links from your site that should be included, one per line"
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500">
                Add links to relevant content on your own site to improve SEO
              </p>
            </div>

            {/* Custom Instructions */}
            <div className="space-y-3">
              <label htmlFor="customInstructions" className="block text-sm font-medium text-gray-700">
                Custom Instructions:
              </label>
              <textarea
                id="customInstructions"
                value={formData.customInstructions}
                onChange={(e) => handleInputChange('customInstructions', e.target.value)}
                placeholder="Add any specific instructions or requirements for your prompt"
                rows={5}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500">
                These instructions will be added verbatim to your prompt
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleResetForm}
            className="px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Reset Form
          </button>
          <button
            onClick={handleGeneratePrompt}
            disabled={!formData.focusKeyword}
            className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            Generate Prompt
          </button>
        </div>
      </div>

      {/* Generated Prompt Preview */}
      {formData.generatedPrompt && showPreview && (
        <div className="bg-white rounded-lg shadow-md p-6" ref={promptPreviewRef}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Generated Prompt:</h2>
            <div className="flex space-x-2">
              <button
                onClick={handleCopyPrompt}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isCopied ? 'Copied!' : 'Copy Prompt'}
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Hide
              </button>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200 overflow-auto max-h-96">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
              {formData.generatedPrompt}
            </pre>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <p>This prompt is ready to use with your preferred AI provider. Copy and paste it into your AI interface to generate content.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedPromptGenerator;