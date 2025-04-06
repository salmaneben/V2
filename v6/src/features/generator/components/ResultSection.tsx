import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FormData } from '../types';
import { Sparkles, Loader2 } from 'lucide-react';

interface ResultSectionProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string) => void;
  onGenerateKeywords: () => void;
  generateFAQs?: () => void;
  isLoading: boolean;
  isGeneratingFAQs?: boolean;
  isApiKeySaved?: boolean;
}

export const ResultSection: React.FC<ResultSectionProps> = ({
  formData,
  onInputChange,
  onGenerateKeywords,
  generateFAQs,
  isLoading,
  isGeneratingFAQs = false,
  isApiKeySaved = false,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Target Audience *
        </label>
        <Textarea
          placeholder="Describe your target audience"
          value={formData.targetAudience}
          onChange={(e) => onInputChange('targetAudience', e.target.value)}
          className="min-h-[100px] focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-semibold text-gray-700">
            FAQs *
          </label>
          {generateFAQs && (
            <Button
              type="button"
              onClick={generateFAQs}
              disabled={isGeneratingFAQs || !formData.mainKeyword || !isApiKeySaved}
              variant="outline"
              size="sm"
              className="h-8 text-xs"
            >
              {isGeneratingFAQs ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-3 w-3 mr-1" />
                  Generate FAQs
                </>
              )}
            </Button>
          )}
        </div>
        <Textarea
          placeholder="Enter FAQs (one per line)"
          value={formData.faqs}
          onChange={(e) => onInputChange('faqs', e.target.value)}
          className="min-h-[100px] focus:ring-2 focus:ring-blue-500"
          required
        />
        {!isApiKeySaved && generateFAQs && (
          <p className="text-xs text-gray-500 mt-1">
            Set your Perplexity API key to enable AI-generated FAQs
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          SEO Keywords
        </label>
        <div className="flex gap-2">
          <Textarea
            placeholder="Enter SEO keywords (one per line). You can use a tool like Perplexity.ai to generate relevant keywords based on your main keyword."
            value={formData.seoKeywords}
            onChange={(e) => onInputChange('seoKeywords', e.target.value)}
            className="min-h-[100px] focus:ring-2 focus:ring-blue-500 flex-1"
          />
          <Button
            type="button"
            onClick={onGenerateKeywords}
            className="bg-blue-600 hover:bg-blue-700 text-white self-start"
            disabled={isLoading || !formData.mainKeyword || !isApiKeySaved}
          >
            {isLoading ? 'Generating...' : 'Generate Keywords'}
          </Button>
        </div>
        {!isApiKeySaved && (
          <p className="text-xs text-gray-500 mt-1">
            Set your Perplexity API key to enable AI-generated keywords
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            External Links *
          </label>
          <Textarea
            placeholder="Enter reference links (one per line)"
            value={formData.links}
            onChange={(e) => onInputChange('links', e.target.value)}
            className="min-h-[100px] focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Internal Links
          </label>
          <Textarea
            placeholder="Enter internal links (one per line)"
            value={formData.internalLinks}
            onChange={(e) => onInputChange('internalLinks', e.target.value)}
            className="min-h-[100px] focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};