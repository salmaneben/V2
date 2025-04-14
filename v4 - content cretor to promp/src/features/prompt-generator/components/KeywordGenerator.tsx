import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';

interface KeywordGeneratorProps {
  focusKeyword: string;
  seoKeywords: string;
  onSeoKeywordsChange: (keywords: string) => void;
  onGenerate: () => Promise<boolean>;
  isGenerating: boolean;
  isApiAvailable: boolean;
  title?: string;
  description?: string;
  placeholder?: string;
}

const KeywordGenerator: React.FC<KeywordGeneratorProps> = ({
  focusKeyword,
  seoKeywords,
  onSeoKeywordsChange,
  onGenerate,
  isGenerating,
  isApiAvailable,
  title = "SEO Keywords",
  description = "Include relevant SEO keywords to optimize your content",
  placeholder = "Enter secondary keywords, one per line"
}) => {
  const [localError, setLocalError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!focusKeyword) {
      setLocalError('Please enter a focus keyword first');
      return;
    }
    
    setLocalError(null);
    try {
      await onGenerate();
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onSeoKeywordsChange(e.target.value);
  };

  return (
    <div className="space-y-3 bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex justify-between items-center">
        <h3 className="text-md font-medium text-gray-700">{title}</h3>
        {isApiAvailable && (
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !focusKeyword}
            className="inline-flex items-center py-1.5 px-3 text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
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
      
      <p className="text-xs text-gray-500">{description}</p>
      
      <textarea
        value={seoKeywords}
        onChange={handleKeywordsChange}
        placeholder={placeholder}
        rows={5}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
      
      {localError && (
        <div className="mt-1 text-xs text-red-600">
          {localError}
        </div>
      )}
      
      {!isApiAvailable && (
        <div className="mt-1 text-xs text-gray-600 italic">
          API-assisted generation is not available. You can manually enter keywords.
        </div>
      )}
    </div>
  );
};

export default KeywordGenerator;