import React, { useState, useEffect, useRef } from 'react';
import { PromptGeneratorData, NicheType, PromptType, PromptLevel, Provider } from '../types';
import { buildPrompt } from '../utils/promptBuilder';
import { savePromptData, loadPromptData, getDefaultPromptData } from '../utils/storageUtils';

// Import subcomponents - note the .tsx extension is implicit
import NicheSelector from './NicheSelector';
import PromptTypeSelector from './PromptTypeSelector';
import DetailLevelSelector from './DetailLevelSelector';
import ToneSelector from './ToneSelector'; // This should be implicit without file extension
import ProviderSelector from './ProviderSelector';
import OptionsSelector from './OptionsSelector';

const PromptGenerator: React.FC = () => {
  // Initialize state with default or saved data
  const [data, setData] = useState<PromptGeneratorData>(getDefaultPromptData());
  const [isCopied, setIsCopied] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const promptPreviewRef = useRef<HTMLDivElement>(null);

  // Load saved data on initial render
  useEffect(() => {
    const savedData = loadPromptData();
    if (savedData) {
      setData(prevData => ({ ...prevData, ...savedData }));
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    savePromptData(data);
  }, [data]);

  // Handle data updates
  const updateData = (newData: Partial<PromptGeneratorData>) => {
    setData(prevData => ({ ...prevData, ...newData }));
  };

  // Handle focus keyword change
  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData({ focusKeyword: e.target.value });
  };

  // Handle niche change
  const handleNicheChange = (niche: NicheType) => {
    updateData({ niche });
  };

  // Handle prompt type change
  const handlePromptTypeChange = (promptType: PromptType) => {
    updateData({ promptType });
  };

  // Handle prompt level change
  const handlePromptLevelChange = (promptLevel: PromptLevel) => {
    updateData({ promptLevel });
  };

  // Handle provider change
  const handleProviderChange = (targetProvider: Provider) => {
    updateData({ targetProvider });
  };

  // Handle tone change
  const handleToneChange = (tone: string) => {
    updateData({ tone });
  };

  // Handle option changes
  const handleOptionChange = (option: string, value: boolean) => {
    updateData({ [option]: value } as any);
  };

  // Handle custom instructions change
  const handleCustomInstructionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateData({ customInstructions: e.target.value });
  };

  // Handle prompt generation
  const handleGeneratePrompt = () => {
    const generatedPrompt = buildPrompt(data);
    updateData({ generatedPrompt });
    
    // Open preview and scroll to it
    setIsPreviewOpen(true);
    setTimeout(() => {
      if (promptPreviewRef.current) {
        promptPreviewRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Handle copying the prompt to clipboard
  const handleCopyPrompt = () => {
    if (data.generatedPrompt) {
      navigator.clipboard.writeText(data.generatedPrompt)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy prompt:', err);
        });
    }
  };

  // Handle resetting the form
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all fields?')) {
      setData(getDefaultPromptData());
      setIsPreviewOpen(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Prompt Generator Tool</h1>
        <p className="text-gray-600 mt-2">Create effective prompts for AI content generation</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-8">
        {/* Keyword Input */}
        <div className="mb-6">
          <label htmlFor="focusKeyword" className="block text-sm font-medium text-gray-700 mb-2">
            Focus Keyword / Topic:
          </label>
          <input
            id="focusKeyword"
            type="text"
            value={data.focusKeyword}
            onChange={handleKeywordChange}
            placeholder="Enter your main topic or keyword"
            className="block w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            This is the primary topic your content will focus on
          </p>
        </div>

        {/* Niche Selection */}
        <NicheSelector 
          selectedNiche={data.niche}
          onNicheChange={handleNicheChange}
        />

        {/* Prompt Type */}
        <PromptTypeSelector
          selectedType={data.promptType}
          onTypeChange={handlePromptTypeChange}
        />

        {/* Detail Level */}
        <DetailLevelSelector
          selectedLevel={data.promptLevel}
          onLevelChange={handlePromptLevelChange}
        />

        {/* Tone Selection */}
        <ToneSelector
          selectedTone={data.tone}
          onToneChange={handleToneChange}
        />

        {/* Provider Selection */}
        <ProviderSelector
          selectedProvider={data.targetProvider}
          onProviderChange={handleProviderChange}
        />

        {/* Options Checkboxes */}
        <OptionsSelector
          options={{
            includeStructure: data.includeStructure,
            includeSEO: data.includeSEO,
            includeExamples: data.includeExamples
          }}
          onOptionChange={handleOptionChange}
        />

        {/* Custom Instructions */}
        <div className="mb-6">
          <label htmlFor="customInstructions" className="block text-sm font-medium text-gray-700 mb-2">
            Custom Instructions (Optional):
          </label>
          <textarea
            id="customInstructions"
            value={data.customInstructions}
            onChange={handleCustomInstructionsChange}
            placeholder="Add any specific instructions or requirements..."
            rows={3}
            className="block w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            These will be added verbatim to your prompt
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Reset Form
          </button>
          <button
            onClick={handleGeneratePrompt}
            disabled={!data.focusKeyword}
            className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            Generate Prompt
          </button>
        </div>
      </div>

      {/* Generated Prompt Display */}
      {data.generatedPrompt && isPreviewOpen && (
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
                onClick={() => setIsPreviewOpen(false)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Hide
              </button>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200 overflow-auto max-h-96">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
              {data.generatedPrompt}
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

export default PromptGenerator;