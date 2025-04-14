import React, { useState } from 'react';
// Import components directly
import ArticleSizeSelector from './ArticleSizeSelector';
import DetailLevelSelector from './DetailLevelSelector';
import FaqGenerator from './FaqGenerator';
import HookTypeSelector from './HookTypeSelector';
import KeywordGenerator from './KeywordGenerator';
import LocaleSelector from './LocaleSelector';
import NicheSelector from './NicheSelector';
import OptionsSelector from './OptionsSelector';
import PromptTypeSelector from './PromptTypeSelector';
import ProviderSelector from './ProviderSelector';
import ToneSelector from './ToneSelector';
import SerpFeaturesSelector from './SerpFeaturesSelector';
import UserIntentSelector from './UserIntentSelector';
import EeatSignalsSelector from './EeatSignalsSelector';
import ChainOfThoughtSelector from './ChainOfThoughtSelector';

import { useSeoPromptGenerator } from '../hooks/useSeoPromptGenerator';
import {
  EnhancedPromptGeneratorData,
  SerptFeatureType,
  UserIntentType,
  EeatSignalLevel
} from '../types';

const EnhancedPromptGenerator: React.FC = () => {
  const {
    formData,
    setFormData,
    isGeneratingPrompt,
    generatePrompt,
    copyPrompt,
    savePrompt,
    loadPrompt,
    resetForm,
    isCopied
  } = useSeoPromptGenerator();

  // State for tabs and accordion sections
  const [activeTab, setActiveTab] = useState('basics');
  const [expandedSections, setExpandedSections] = useState({
    advancedSeo: false,
    advancedContent: false
  });

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Update form field handler
  const handleChange = (field: keyof EnhancedPromptGeneratorData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle SERP features change
  const handleSerpFeaturesChange = (features: SerptFeatureType[]) => {
    setFormData(prev => ({
      ...prev,
      serpFeatures: features
    }));
  };

  // Handle user intent change
  const handleUserIntentChange = (primary: UserIntentType, secondary?: UserIntentType) => {
    setFormData(prev => ({
      ...prev,
      primaryIntent: primary,
      secondaryIntent: secondary
    }));
  };

  // Handle E-E-A-T level change
  const handleEeatLevelChange = (level: EeatSignalLevel) => {
    setFormData(prev => ({
      ...prev,
      eeatLevel: level
    }));
  };

  // Handle chain of thought change
  const handleChainOfThoughtChange = (enabled: boolean, steps: number) => {
    setFormData(prev => ({
      ...prev,
      enableChainOfThought: enabled,
      chainOfThoughtSteps: steps
    }));
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      {/* Header with title and management buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Enhanced SEO Prompt Generator</h1>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={savePrompt}
            className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
          >
            Save
          </button>
          <button
            onClick={loadPrompt}
            className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
          >
            Load
          </button>
          <button
            onClick={resetForm}
            className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Focus Keyword - Always visible at the top */}
      <div className="mb-6">
        <label htmlFor="focusKeyword" className="block text-sm font-medium text-gray-700 mb-1">
          Focus Keyword / Topic
        </label>
        <input
          type="text"
          id="focusKeyword"
          value={formData.focusKeyword}
          onChange={(e) => handleChange('focusKeyword', e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter main keyword or topic"
        />
        <p className="mt-1 text-xs text-gray-500">
          This is the primary topic your prompt and content will focus on
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px space-x-8">
          <button
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'basics'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('basics')}
          >
            Basic Settings
          </button>
          <button
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'structure'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('structure')}
          >
            Structure
          </button>
          <button
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'seo'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('seo')}
          >
            SEO
          </button>
          <button
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'advanced'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('advanced')}
          >
            Advanced
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mb-8">
        {/* Basic Settings Tab */}
        {activeTab === 'basics' && (
          <div className="space-y-6">
            {/* Niche Selection */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-medium text-gray-800 mb-3">Content Niche</h2>
              <NicheSelector
                selected={formData.niche}
                onChange={(niche) => handleChange('niche', niche)}
              />
            </div>

            {/* Content Type & Tone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h2 className="text-lg font-medium text-gray-800 mb-3">Content Type</h2>
                <PromptTypeSelector
                  selected={formData.promptType}
                  onChange={(type) => handleChange('promptType', type)}
                />
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h2 className="text-lg font-medium text-gray-800 mb-3">Writing Tone</h2>
                <ToneSelector
                  selected={formData.tone}
                  onChange={(tone) => handleChange('tone', tone)}
                />
              </div>
            </div>

            {/* Detail Level & Provider */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h2 className="text-lg font-medium text-gray-800 mb-3">Detail Level</h2>
                <DetailLevelSelector
                  selected={formData.promptLevel}
                  onChange={(level) => handleChange('promptLevel', level)}
                />
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h2 className="text-lg font-medium text-gray-800 mb-3">Target AI Provider</h2>
                <ProviderSelector
                  selected={formData.targetProvider}
                  onChange={(provider) => handleChange('targetProvider', provider)}
                />
              </div>
            </div>

            {/* Prompt Options */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-medium text-gray-800 mb-3">Prompt Options</h2>
              <OptionsSelector
                options={{
                  includeStructure: formData.includeStructure,
                  includeSEO: formData.includeSEO,
                  includeExamples: formData.includeExamples,
                  includeFaqs: formData.includeFaqs,
                  includeKeywords: formData.includeKeywords
                }}
                onChange={(options) => {
                  Object.entries(options).forEach(([key, value]) => {
                    handleChange(key as keyof EnhancedPromptGeneratorData, value);
                  });
                }}
              />
            </div>
          </div>
        )}

        {/* Structure Tab */}
        {activeTab === 'structure' && (
          <div className="space-y-6">
            {/* Content Structure */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-medium text-gray-800 mb-3">Content Structure</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ArticleSizeSelector
                  selected={formData.articleSize}
                  customWordCount={formData.customWordCount}
                  onChange={(size, customCount) => {
                    handleChange('articleSize', size);
                    if (customCount) {
                      handleChange('customWordCount', customCount);
                    }
                  }}
                />
                <HookTypeSelector
                  selected={formData.hookType}
                  onChange={(hookType) => handleChange('hookType', hookType)}
                  onDetailsChange={(details) => handleChange('hookDetails', details)}
                  details={formData.hookDetails}
                />
              </div>
            </div>

            {/* Localization */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-medium text-gray-800 mb-3">Content Localization</h2>
              <LocaleSelector
                selectedCountry={formData.country}
                selectedLanguage={formData.language}
                onCountryChange={(country) => handleChange('country', country)}
                onLanguageChange={(language) => handleChange('language', language)}
              />
            </div>

            {/* Advanced Content Structure - Collapsible */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('advancedContent')}
              >
                <h2 className="text-lg font-medium text-indigo-800">
                  Advanced Content Structure
                  <span className="ml-2 px-2 py-0.5 text-xs bg-indigo-100 text-indigo-800 rounded-full">
                    NEW
                  </span>
                </h2>
                <svg
                  className={`w-5 h-5 text-indigo-500 transform transition-transform ${
                    expandedSections.advancedContent ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {expandedSections.advancedContent && (
                <div className="mt-4 space-y-6">
                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <ChainOfThoughtSelector
                      enabled={formData.enableChainOfThought || false}
                      steps={formData.chainOfThoughtSteps || 3}
                      onChange={handleChainOfThoughtChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            {/* SEO Keywords */}
            <div className="p-4 bg-gray-50 rounded-lg space-y-4">
              <h2 className="text-lg font-medium text-gray-800 mb-2">SEO Keywords</h2>
              <KeywordGenerator
                primaryKeyword={formData.focusKeyword}
                secondaryKeywords={formData.seoKeywords}
                longTailKeywords={formData.longTailKeywords}
                onSecondaryKeywordsChange={(keywords) => handleChange('seoKeywords', keywords)}
                onLongTailKeywordsChange={(keywords) => handleChange('longTailKeywords', keywords)}
                disabled={!formData.includeKeywords}
              />
            </div>

            {/* Target Audience */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-medium text-gray-800 mb-2">Target Audience</h2>
              <textarea
                value={formData.targetAudience}
                onChange={(e) => handleChange('targetAudience', e.target.value)}
                rows={4}
                className="block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe the target audience for this content..."
              />
            </div>

            {/* FAQ Section */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-medium text-gray-800 mb-2">FAQ Questions</h2>
              <FaqGenerator
                faqs={formData.faqs}
                onChange={(faqs) => handleChange('faqs', faqs)}
                disabled={!formData.includeFaqs}
              />
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h2 className="text-lg font-medium text-gray-800 mb-2">Internal Links</h2>
                <textarea
                  value={formData.internalLinks}
                  onChange={(e) => handleChange('internalLinks', e.target.value)}
                  rows={3}
                  className="block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add related internal content links..."
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h2 className="text-lg font-medium text-gray-800 mb-2">External Links</h2>
                <textarea
                  value={formData.externalLinks}
                  onChange={(e) => handleChange('externalLinks', e.target.value)}
                  rows={3}
                  className="block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add authoritative external sources..."
                />
              </div>
            </div>

            {/* Advanced SEO Features - Collapsible */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('advancedSeo')}
              >
                <h2 className="text-lg font-medium text-blue-800">
                  Advanced SEO Features
                  <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                    NEW
                  </span>
                </h2>
                <svg
                  className={`w-5 h-5 text-blue-500 transform transition-transform ${
                    expandedSections.advancedSeo ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {expandedSections.advancedSeo && (
                <div className="mt-4 space-y-6">
                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <UserIntentSelector
                      primaryIntent={formData.primaryIntent}
                      secondaryIntent={formData.secondaryIntent}
                      onChange={handleUserIntentChange}
                    />
                  </div>

                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <SerpFeaturesSelector
                      selectedFeatures={formData.serpFeatures || []}
                      onChange={handleSerpFeaturesChange}
                    />
                  </div>

                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <EeatSignalsSelector
                      level={formData.eeatLevel}
                      onChange={handleEeatLevelChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Advanced Tab */}
        {activeTab === 'advanced' && (
          <div className="space-y-6">
            {/* Custom Instructions */}
            <div className="space-y-2">
              <label htmlFor="customInstructions" className="block text-sm font-medium text-gray-700">
                Custom Instructions
              </label>
              <textarea
                id="customInstructions"
                value={formData.customInstructions}
                onChange={(e) => handleChange('customInstructions', e.target.value)}
                rows={6}
                className="block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add any additional instructions or context here..."
              />
              <p className="text-xs text-gray-500">
                These instructions will be added to your prompt exactly as written
              </p>
            </div>

            {/* User Intent + SERP + EEAT - all advanced features together */}
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h2 className="text-lg font-medium text-gray-800 mb-3">User Intent Optimization</h2>
                <UserIntentSelector
                  primaryIntent={formData.primaryIntent}
                  secondaryIntent={formData.secondaryIntent}
                  onChange={handleUserIntentChange}
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h2 className="text-lg font-medium text-gray-800 mb-3">SERP Feature Targeting</h2>
                <SerpFeaturesSelector
                  selectedFeatures={formData.serpFeatures || []}
                  onChange={handleSerpFeaturesChange}
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h2 className="text-lg font-medium text-gray-800 mb-3">E-E-A-T Signal Level</h2>
                <EeatSignalsSelector level={formData.eeatLevel} onChange={handleEeatLevelChange} />
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h2 className="text-lg font-medium text-gray-800 mb-3">Chain-of-Thought Reasoning</h2>
                <ChainOfThoughtSelector
                  enabled={formData.enableChainOfThought || false}
                  steps={formData.chainOfThoughtSteps || 3}
                  onChange={handleChainOfThoughtChange}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Single Generate Button - Always visible at the bottom */}
      <div className="mt-8">
        <button
          onClick={generatePrompt}
          disabled={isGeneratingPrompt || !formData.focusKeyword}
          className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isGeneratingPrompt ? 'Generating...' : 'Generate Prompt'}
        </button>
      </div>

      {/* Generated Prompt - Always at the bottom */}
      <div className="mt-8 space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-800">Generated Prompt</h2>
          <button
            onClick={copyPrompt}
            disabled={!formData.generatedPrompt}
            className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 disabled:bg-gray-100 disabled:text-gray-400"
          >
            {isCopied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="p-4 bg-gray-800 text-gray-200 rounded-lg overflow-auto max-h-[400px]">
          {formData.generatedPrompt ? (
            <pre className="whitespace-pre-wrap font-mono text-sm">
              {formData.generatedPrompt}
            </pre>
          ) : (
            <div className="text-gray-400 italic">
              Configure your prompt settings and click "Generate Prompt" to see the result here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedPromptGenerator;