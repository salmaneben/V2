import React, { useState } from 'react';
import { generateTags } from '../utils/articleGenerator';
import { ArticleGeneratorData } from '../types';
import { ApiButton } from './ApiButton';

interface TagsStepProps {
  data: ArticleGeneratorData;
  updateData: (data: Partial<ArticleGeneratorData>) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
}

export const TagsStep: React.FC<TagsStepProps> = ({ 
  data, 
  updateData, 
  onNextStep, 
  onPrevStep 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    data.tags ? data.tags.split(',').map(tag => tag.trim()) : []
  );

  // Handler for generating tags
  const handleGenerateTags = async () => {
    if (!data.focusKeyword || !data.metaDescription) {
      setError('Missing required information. Please complete previous steps.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Call the API to generate tags
      const result = await generateTags({
        focusKeyword: data.focusKeyword,
        metaDescription: data.metaDescription,
        provider: data.apiSettings?.provider
      });

      // Check for API errors
      if (result.error) {
        setError(result.error);
        return;
      }

      // Update the global state with the generated tags
      updateData({ 
        generatedTags: result.tags,
        tags: result.tags.join(', ')
      });
      
      // Set selected tags
      setSelectedTags(result.tags);
    } catch (err) {
      setError('Failed to generate tags. Please try again.');
      console.error('Tags generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handler for toggling a tag selection
  const handleTagToggle = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(newSelectedTags);
    updateData({ tags: newSelectedTags.join(', ') });
  };

  // Handler for adding a custom tag
  const handleAddCustomTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const value = input.value.trim();
    
    if (e.key === 'Enter' && value) {
      if (!selectedTags.includes(value)) {
        const newTags = [...selectedTags, value];
        setSelectedTags(newTags);
        updateData({ tags: newTags.join(', ') });
      }
      input.value = '';
    }
  };

  // Handler for removing a tag
  const handleRemoveTag = (tag: string) => {
    const newTags = selectedTags.filter(t => t !== tag);
    setSelectedTags(newTags);
    updateData({ tags: newTags.join(', ') });
  };

  // Handler for continuing to the next step
  const handleContinue = () => {
    // Validate that at least one tag is selected
    if (selectedTags.length === 0) {
      setError('Please add at least one tag before continuing.');
      return;
    }

    // Clear any existing errors
    setError(null);
    
    // Proceed to the next step
    onNextStep();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Step 3: Add WordPress Tags</h2>
        <ApiButton />
      </div>
      
      <div className="bg-blue-50 p-4 rounded-md">
        <p className="text-sm text-blue-800">
          Add relevant tags to help categorize your article and improve its discoverability.
        </p>
      </div>
      
      {/* Title and Description Preview */}
      <div className="bg-gray-100 p-4 rounded-md space-y-3">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-1">Title:</h3>
          <p className="text-base font-semibold text-gray-900">{data.metaTitle}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-1">Description:</h3>
          <p className="text-sm text-gray-900">{data.metaDescription}</p>
        </div>
      </div>
      
      {/* Generate Tags Button */}
      <div className="flex justify-center">
        <button
          onClick={handleGenerateTags}
          disabled={isGenerating || !data.metaTitle || !data.metaDescription}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isGenerating ? 'Generating...' : 'Generate Tags'}
        </button>
      </div>
      
      {/* Selected Tags */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Selected Tags:
        </label>
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag, index) => (
            <div 
              key={index}
              className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              {tag}
              <button 
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none"
              >
                &times;
              </button>
            </div>
          ))}
          {selectedTags.length === 0 && (
            <p className="text-sm text-gray-500 italic">No tags selected yet.</p>
          )}
        </div>
      </div>
      
      {/* Generated Tags */}
      {data.generatedTags && data.generatedTags.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Suggested Tags (click to add/remove):
          </label>
          <div className="flex flex-wrap gap-2">
            {data.generatedTags.map((tag, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Custom Tag Input */}
      <div className="space-y-2">
        <label htmlFor="customTag" className="block text-sm font-medium text-gray-700">
          Add Custom Tag:
        </label>
        <input
          id="customTag"
          type="text"
          placeholder="Type a tag and press Enter"
          onKeyDown={handleAddCustomTag}
          className="block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onPrevStep}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back
        </button>
        
        <button
          onClick={handleContinue}
          disabled={selectedTags.length === 0}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
};