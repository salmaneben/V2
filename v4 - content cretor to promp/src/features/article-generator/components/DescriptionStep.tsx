import React, { useState, useEffect } from 'react';
import { generateDescriptions } from '../utils/articleGenerator';
import { ArticleGeneratorData } from '../types';
import { ApiButton } from './ApiButton';
import { RefreshCw, Check, ArrowLeft, ArrowRight } from 'lucide-react';

interface DescriptionStepProps {
  data: ArticleGeneratorData;
  updateData: (data: Partial<ArticleGeneratorData>) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
}

export const DescriptionStep: React.FC<DescriptionStepProps> = ({ 
  data, 
  updateData, 
  onNextStep,
  onPrevStep 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customDescription, setCustomDescription] = useState(data.metaDescription || '');
  const [isCustomDescription, setIsCustomDescription] = useState(false);
  const [selectedDescriptionIndex, setSelectedDescriptionIndex] = useState<number | null>(null);

  // Generate descriptions initially if we have title but no descriptions
  useEffect(() => {
    if (data.metaTitle && !data.generatedDescriptions?.length && !isCustomDescription) {
      handleGenerateDescriptions();
    }
  }, []);

  // Handle description generation
  const handleGenerateDescriptions = async () => {
    if (!data.metaTitle) {
      setError('Missing title. Please go back to step 1.');
      return;
    }
    
    if (!data.focusKeyword) {
      setError('Missing focus keyword. Please go back to step 1.');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await generateDescriptions({
        metaTitle: data.metaTitle,
        focusKeyword: data.focusKeyword,
        customPrompt: `
          You are an SEO content strategist who writes compelling blog descriptions. Follow these rules:
          1. Write 5 descriptions for the blog post titled "${data.metaTitle}".
          2. Use the exact phrase "${data.focusKeyword}" naturally in each description.
          3. Keep descriptions under 160 characters (ideal for SEO).
          4. Start with a hook: ask a question, use action verbs, or highlight a pain point.
          5. Include SEO keywords related to ${data.focusKeyword} and address user intent (e.g., tips, solutions).
          6. End with a subtle CTA like Discover, Learn, Try.
          7. Avoid quotes, markdown, or self-references.
          8. Maintain a friendly, conversational tone.
          
          Don't start or end with ** or * or " and Don't use ' – ' in the description.
          
          Return only a list of 5 descriptions, one per line, without any additional text, numbering, or formatting.
        `,
        provider: data.apiSettings?.provider
      });
      
      if (result.error) {
        setError(result.error);
        return;
      }
      
      if (result.descriptions && result.descriptions.length > 0) {
        updateData({ generatedDescriptions: result.descriptions });
        // Reset selection
        setSelectedDescriptionIndex(null);
        setCustomDescription('');
        setIsCustomDescription(false);
      } else {
        setError('No descriptions were generated. Please try again.');
      }
    } catch (err) {
      setError('Failed to generate descriptions. Please try again.');
      console.error('Error generating descriptions:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle selecting a description
  const handleSelectDescription = (index: number) => {
    setSelectedDescriptionIndex(index);
    setCustomDescription(data.generatedDescriptions[index]);
    setIsCustomDescription(false);
    updateData({ metaDescription: data.generatedDescriptions[index] });
  };

  // Handle using a custom description
  const handleUseCustomDescription = () => {
    setIsCustomDescription(true);
    setSelectedDescriptionIndex(null);
  };

  // Handle custom description change
  const handleCustomDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomDescription(e.target.value);
    updateData({ metaDescription: e.target.value });
  };

  // Calculate character count and limits for descriptions
  const getDescriptionFeedback = (description: string) => {
    const charCount = description.length;
    if (charCount > 160) {
      return { message: `Too long (${charCount}/160)`, color: 'text-red-500' };
    } else if (charCount > 150) {
      return { message: `Good length (${charCount}/160)`, color: 'text-green-500' };
    } else if (charCount > 100) {
      return { message: `Ideal length (${charCount}/160)`, color: 'text-green-600' };
    } else {
      return { message: `Too short (${charCount}/160)`, color: 'text-yellow-500' };
    }
  };

  // Check if description contains focus keyword
  const descriptionContainsKeyword = (description: string) => {
    return description.toLowerCase().includes(data.focusKeyword.toLowerCase());
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Step 2: Meta Description</h2>
        <ApiButton />
      </div>
      
      <div className="bg-blue-50 p-4 rounded-md">
        <p className="text-sm text-blue-800">
          Create an engaging meta description for your article. This is what appears in search results under your title.
        </p>
      </div>
      
      {/* Selected Title Display */}
      <div className="bg-white p-5 rounded-lg border border-gray-200">
        <h3 className="font-medium text-gray-700 mb-2">Selected Title</h3>
        <p className="text-lg font-semibold">{data.metaTitle || 'No title selected'}</p>
        <p className="text-sm text-gray-500 mt-1">Focus Keyword: {data.focusKeyword}</p>
      </div>
      
      {/* Generated Descriptions Section */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-700">Meta Description</h3>
          <button
            onClick={handleGenerateDescriptions}
            disabled={isGenerating || !data.metaTitle || !data.focusKeyword}
            className="inline-flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-1" />
                Generate Descriptions
              </>
            )}
          </button>
        </div>
        
        {/* Display error if any */}
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {/* Description Options */}
        {data.generatedDescriptions && data.generatedDescriptions.length > 0 ? (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {data.generatedDescriptions.map((description, index) => {
              const feedback = getDescriptionFeedback(description);
              const hasKeyword = descriptionContainsKeyword(description);
              
              return (
                <div 
                  key={index}
                  onClick={() => handleSelectDescription(index)}
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${
                    selectedDescriptionIndex === index 
                      ? 'bg-blue-50 border-blue-300' 
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-grow pr-2">
                      <p className="text-sm">{description}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className={`text-xs ${feedback.color}`}>{feedback.message}</span>
                        {!hasKeyword && (
                          <span className="text-red-500 text-xs">Missing keyword!</span>
                        )}
                      </div>
                    </div>
                    {selectedDescriptionIndex === index && (
                      <span className="bg-blue-100 text-blue-800 p-1 rounded-full">
                        <Check className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : isGenerating ? (
          <div className="py-8 text-center text-gray-500">
            Generating description suggestions...
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            No descriptions generated yet. Click "Generate Descriptions" to create suggestions.
          </div>
        )}
        
        {/* Custom Description Option */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="use-custom-description"
              checked={isCustomDescription}
              onChange={() => handleUseCustomDescription()}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="use-custom-description" className="ml-2 text-sm text-gray-700">
              Write a custom description instead
            </label>
          </div>
          
          {(isCustomDescription || selectedDescriptionIndex !== null) && (
            <div className="space-y-3">
              <div className="relative">
                <textarea
                  value={customDescription}
                  onChange={handleCustomDescriptionChange}
                  placeholder="Enter your custom meta description here"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  maxLength={200}
                />
                <div className="absolute right-2 bottom-2">
                  <span className={`text-xs ${getDescriptionFeedback(customDescription).color}`}>
                    {customDescription.length}/160
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-1 text-xs">
                <span className="text-gray-500">Tips:</span>
                <ul className="text-gray-500 space-x-3 inline-flex">
                  <li>Include focus keyword</li>
                  <li>Be specific</li>
                  <li>Add a call-to-action</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={onPrevStep}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Title
        </button>
        
        <button
          onClick={onNextStep}
          disabled={!data.metaDescription}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          Next: Tags
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};