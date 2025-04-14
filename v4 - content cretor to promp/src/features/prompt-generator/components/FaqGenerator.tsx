import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';

interface FaqGeneratorProps {
  focusKeyword: string;
  faqs: string;
  onFaqsChange: (faqs: string) => void;
  onGenerate: () => Promise<boolean>;
  isGenerating: boolean;
  isApiAvailable: boolean;
}

const FaqGenerator: React.FC<FaqGeneratorProps> = ({
  focusKeyword,
  faqs,
  onFaqsChange,
  onGenerate,
  isGenerating,
  isApiAvailable
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

  const handleFaqsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onFaqsChange(e.target.value);
  };

  return (
    <div className="space-y-3 bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex justify-between items-center">
        <h3 className="text-md font-medium text-gray-700">Frequently Asked Questions</h3>
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
                Generate FAQs
              </>
            )}
          </button>
        )}
      </div>
      
      <p className="text-xs text-gray-500">
        Include FAQs to address common questions about your topic. Format as Q1: [Question] A1: [Answer]
      </p>
      
      <textarea
        value={faqs}
        onChange={handleFaqsChange}
        placeholder="Q1: What is the best way to...?\nA1: The best approach is to...\n\nQ2: How much does it cost...?\nA2: Typical costs range from..."
        rows={8}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
      
      {localError && (
        <div className="mt-1 text-xs text-red-600">
          {localError}
        </div>
      )}
      
      {!isApiAvailable && (
        <div className="mt-1 text-xs text-gray-600 italic">
          API-assisted generation is not available. You can manually enter FAQs.
        </div>
      )}
      
      <div className="text-xs text-gray-500">
        <p>Tips for effective FAQs:</p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>Focus on real questions your audience would ask</li>
          <li>Keep questions concise and clear</li>
          <li>Provide valuable, informative answers</li>
          <li>Include 4-6 questions for comprehensive coverage</li>
          <li>Address both basic and advanced concerns</li>
        </ul>
      </div>
    </div>
  );
};

export default FaqGenerator;