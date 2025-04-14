import React, { useState, useEffect } from 'react';
import { generateTitles } from '../utils/articleGenerator';
import { ArticleGeneratorData } from '../types';
import { ApiButton } from './ApiButton';
import { RefreshCw, Check, ArrowRight } from 'lucide-react';

interface TitleStepProps {
  data: ArticleGeneratorData;
  updateData: (data: Partial<ArticleGeneratorData>) => void;
  onNextStep: () => void;
}

export const TitleStep: React.FC<TitleStepProps> = ({ 
  data, 
  updateData, 
  onNextStep 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusKeyword, setFocusKeyword] = useState(data.focusKeyword || '');
  const [customTitle, setCustomTitle] = useState(data.metaTitle || '');
  const [isCustomTitle, setIsCustomTitle] = useState(false);
  const [selectedTitleIndex, setSelectedTitleIndex] = useState<number | null>(null);

  // Generate titles when focus keyword changes or initially if we have one
  useEffect(() => {
    if (data.focusKeyword && !data.generatedTitles?.length && !isCustomTitle) {
      handleGenerateTitles();
    }
  }, []);

  // Handle focus keyword change
  const handleFocusKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFocusKeyword(e.target.value);
    // Clear any existing title selections when keyword changes
    setSelectedTitleIndex(null);
  };

  // Handle saving focus keyword
  const handleSaveFocusKeyword = () => {
    if (!focusKeyword.trim()) {
      setError('Please enter a focus keyword');
      return;
    }
    
    updateData({ focusKeyword });
    handleGenerateTitles();
  };

  // Handle title generation
  const handleGenerateTitles = async () => {
    if (!focusKeyword.trim()) {
      setError('Please enter a focus keyword');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await generateTitles({
        focusKeyword: focusKeyword,
        customPrompt: `
          You are an expert copywriter who writes catchy, SEO-friendly blog titles in a friendly
          tone. Follow these rules:
          1. Write 10 titles for "${focusKeyword}" using the exact phrase "${focusKeyword}"
          2. Keep titles under 65 characters.
          3. Make sure "${focusKeyword}" appears at the beginning of title
          4. Use hooks like "How," "Why," or "Best" to spark curiosity.
          5. Mix formats: listicles, questions, and how-tos.
          6. Avoid quotes, markdown, or self-references.
          7. Prioritize SEO keywords related to ${focusKeyword}.
          8. Title should contain a random number depending on the focus keyword.
        `,
        provider: data.apiSettings?.provider
      });
      
      if (result.error) {
        setError(result.error);
        return;
      }
      
      if (result.titles && result.titles.length > 0) {
        updateData({ 
          generatedTitles: result.titles,
          focusKeyword: focusKeyword // Save the focus keyword that was used
        });
        // Reset selection
        setSelectedTitleIndex(null);
        setCustomTitle('');
        setIsCustomTitle(false);
      } else {
        setError('No titles were generated. Please try again.');
      }
    } catch (err) {
      setError('Failed to generate titles. Please try again.');
      console.error('Error generating titles:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle selecting a title
  const handleSelectTitle = (index: number) => {
    setSelectedTitleIndex(index);
    setCustomTitle(data.generatedTitles[index]);
    setIsCustomTitle(false);
    updateData({ metaTitle: data.generatedTitles[index] });
  };

  // Handle using a custom title
  const handleUseCustomTitle = () => {
    setIsCustomTitle(true);
    setSelectedTitleIndex(null);
  };

  // Handle custom title change
  const handleCustomTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomTitle(e.target.value);
    updateData({ metaTitle: e.target.value });
  };

  // Handle proceeding to next step
  const handleNextStep = () => {
    if (!data.metaTitle) {
      setError('Please select or enter a title');
      return;
    }
    
    onNextStep();
  };

  // Calculate character count and limits for titles
  const getTitleFeedback = (title: string) => {
    const charCount = title.length;
    if (charCount > 65) {
      return { message: `Too long (${charCount}/65)`, color: 'text-red-500' };
    } else if (charCount > 55) {
      return { message: `Good length (${charCount}/65)`, color: 'text-green-500' };
    } else if (charCount > 30) {
      return { message: `Ideal length (${charCount}/65)`, color: 'text-green-600' };
    } else {
      return { message: `Too short (${charCount}/65)`, color: 'text-yellow-500' };
    }
  };

  // Check if title contains focus keyword
  const titleContainsKeyword = (title: string) => {
    return title.toLowerCase().includes(focusKeyword.toLowerCase());
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Step 1: Focus Keyword & Title</h2>
        <ApiButton />
      </div>
      
      <div className="bg-blue-50 p-4 rounded-md">
        <p className="text-sm text-blue-800">
          Start with your main focus keyword, then generate and select an SEO-optimized title for your article.
        </p>
      </div>
      
      {/* Focus Keyword Input */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-4">
        <h3 className="font-medium text-gray-700">1. Enter Your Focus Keyword</h3>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={focusKeyword}
            onChange={handleFocusKeywordChange}
            placeholder="e.g., vegan pasta recipe"
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSaveFocusKeyword}
            disabled={!focusKeyword.trim() || isGenerating}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {data.focusKeyword === focusKeyword ? 'Update Keyword' : 'Set Keyword & Generate Titles'}
          </button>
        </div>
        <p className="text-xs text-gray-500">
          Your focus keyword should represent the main topic of your article and what users might search for.
        </p>
      </div>
      
      {/* Generated Titles Section */}
      {data.focusKeyword && (
        <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-700">2. Select a Title</h3>
            <button
              onClick={handleGenerateTitles}
              disabled={isGenerating || !focusKeyword.trim()}
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
                  Regenerate Titles
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
          
          {/* Title Options */}
          {data.generatedTitles && data.generatedTitles.length > 0 ? (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {data.generatedTitles.map((title, index) => {
                const feedback = getTitleFeedback(title);
                const hasKeyword = titleContainsKeyword(title);
                
                return (
                  <div 
                    key={index}
                    onClick={() => handleSelectTitle(index)}
                    className={`p-3 border rounded-md cursor-pointer transition-colors ${
                      selectedTitleIndex === index 
                        ? 'bg-blue-50 border-blue-300' 
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-grow pr-2">
                        <p className="font-medium">{title}</p>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className={feedback.color}>{feedback.message}</span>
                          {!hasKeyword && (
                            <span className="text-red-500 text-xs">Missing keyword!</span>
                          )}
                        </div>
                      </div>
                      {selectedTitleIndex === index && (
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
              Generating title suggestions...
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              No titles generated yet. Click "Generate Titles" to create suggestions.
            </div>
          )}
          
          {/* Custom Title Option */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="use-custom-title"
                checked={isCustomTitle}
                onChange={() => handleUseCustomTitle()}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="use-custom-title" className="ml-2 text-sm text-gray-700">
                Write a custom title instead
              </label>
            </div>
            
            {(isCustomTitle || selectedTitleIndex !== null) && (
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={customTitle}
                    onChange={handleCustomTitleChange}
                    placeholder="Enter your custom title here"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="absolute right-2 bottom-0 transform translate-y-1/2">
                    <span className={`text-xs ${getTitleFeedback(customTitle).color}`}>
                      {customTitle.length}/65
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-1 text-xs">
                  <span className="text-gray-500">Tips:</span>
                  <ul className="text-gray-500 space-x-3 inline-flex">
                    <li>Include focus keyword</li>
                    <li>Use numbers</li>
                    <li>Be specific</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Next Step Button */}
      <div className="flex justify-end">
        <button
          onClick={handleNextStep}
          disabled={!data.metaTitle}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          Next: Meta Description
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};