import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wand, Loader2 } from 'lucide-react';

interface MainInfoSectionProps {
  formData: {
    mainKeyword: string;
    seoKeywords: string;
    faqs: string;
    targetAudience: string;
  };
  handleInputChange: (field: string, value: string) => void;
  generateSEOKeywords: () => void;
  generateFAQs: () => void;
  generateTargetAudience: () => void;
  isGeneratingKeywords: boolean;
  isGeneratingFAQs: boolean;
  isGeneratingTargetAudience: boolean;
  sidebarState?: string;
}

const MainInfoSection: React.FC<MainInfoSectionProps> = ({
  formData,
  handleInputChange,
  generateSEOKeywords,
  generateFAQs,
  generateTargetAudience,
  isGeneratingKeywords,
  isGeneratingFAQs,
  isGeneratingTargetAudience,
}) => {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Main Information</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Main Keyword or Question
          </label>
          <input
            type="text"
            value={formData.mainKeyword}
            onChange={(e) => handleInputChange('mainKeyword', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="e.g., Best hiking trails in Colorado"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            The primary topic or question the content will focus on
          </p>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-gray-700 text-sm font-medium">
              SEO Keywords
            </label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="text-xs py-1 px-2"
              onClick={generateSEOKeywords}
              disabled={isGeneratingKeywords || !formData.mainKeyword}
            >
              {isGeneratingKeywords ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand className="mr-1 h-3 w-3" />
                  Generate Keywords
                </>
              )}
            </Button>
          </div>
          <textarea
            value={formData.seoKeywords}
            onChange={(e) => handleInputChange('seoKeywords', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md h-24"
            placeholder="• keyword 1&#10;• keyword 2&#10;• keyword 3"
          />
          <p className="text-xs text-gray-500 mt-1">
            Secondary keywords to include in the content
          </p>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-gray-700 text-sm font-medium">
              Frequently Asked Questions
            </label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="text-xs py-1 px-2"
              onClick={generateFAQs}
              disabled={isGeneratingFAQs || !formData.mainKeyword}
            >
              {isGeneratingFAQs ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand className="mr-1 h-3 w-3" />
                  Generate FAQs
                </>
              )}
            </Button>
          </div>
          <textarea
            value={formData.faqs}
            onChange={(e) => handleInputChange('faqs', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md h-32"
            placeholder="1. Q: What are the best hiking trails in Colorado?&#10;A: The best hiking trails include..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Questions and answers that should be addressed in the content
          </p>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-gray-700 text-sm font-medium">
              Target Audience
            </label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="text-xs py-1 px-2"
              onClick={generateTargetAudience}
              disabled={isGeneratingTargetAudience || !formData.mainKeyword}
            >
              {isGeneratingTargetAudience ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand className="mr-1 h-3 w-3" />
                  Generate Audience
                </>
              )}
            </Button>
          </div>
          <textarea
            value={formData.targetAudience}
            onChange={(e) => handleInputChange('targetAudience', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md h-24"
            placeholder="Describe the target audience for this content..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Demographic and psychographic details of the intended audience
          </p>
        </div>
      </div>
    </Card>
  );
};

export default MainInfoSection;