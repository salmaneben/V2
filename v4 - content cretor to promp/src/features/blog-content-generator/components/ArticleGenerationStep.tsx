// src/features/blog-content-generator/components/ArticleGenerationStep.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Copy, CheckCircle, ArrowRight, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { StepProps, Provider } from '../types';
import { generateContent } from '../utils/blogContentGenerator';
import { getPreferredProvider, getApiKey } from '@/api/storage';

export const ArticleGenerationStep: React.FC<StepProps> = ({ data, updateData, onNextStep, onPrevStep }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const articleRef = useRef<HTMLDivElement>(null);

  // Store article content in state to ensure it's available
  const [articleContent, setArticleContent] = useState<string>(data.generatedArticle || data.content || '');

  // If content already exists, use it directly
  useEffect(() => {
    if (data.content && !data.generatedArticle) {
      // If we have content but no generatedArticle, update data to include it
      updateData({ generatedArticle: data.content });
      setArticleContent(data.content);
    } else if (data.generatedArticle) {
      // If generatedArticle already exists, just use it
      setArticleContent(data.generatedArticle);
    }
  }, [data.content, data.generatedArticle]);

  const handleGenerateArticle = async () => {
    if (!data.selectedTitle) {
      setError('Please complete previous steps to generate content');
      return;
    }

    // Check if API key exists
    const provider = data.apiSettings?.contentApiProvider || data.apiSettings?.titleApiProvider || getPreferredProvider();
    const key = getApiKey(provider);
    
    if (!key) {
      setError(`No API key found for ${provider}. Please enter your API key in the settings.`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      console.log(`Generating full article with provider: ${provider}`);
      
      // Get content settings from data
      const contentSettings = data.contentSettings || {};
      const seoSettings = data.seoSettings || {};
      
      // Prepare parameters for article generation
      const params = {
        metaTitle: data.selectedTitle,
        focusKeyword: data.focusKeyword,
        relatedTerm: data.relatedTerm,
        seoKeywords: seoSettings.seoKeywords || "",
        longTailKeywords: seoSettings.longTailKeywords || "",
        faqs: data.faqs || "",
        provider: provider as Provider,
        targetAudience: data.targetAudience || "General audience interested in this topic",
        wordCount: contentSettings.wordCount || "medium",
        tone: contentSettings.tone || "Professional",
        textReadability: contentSettings.textReadability || "8th & 9th grade",
        includeConclusion: contentSettings.includeConclusion !== false,
        includeTables: contentSettings.includeTables !== false,
        includeH3: contentSettings.includeH3 !== false,
        includeLists: contentSettings.includeLists !== false,
        includeItalics: contentSettings.includeItalics === true,
        includeQuotes: contentSettings.includeQuotes === true,
        includeBold: contentSettings.includeBold !== false,
        includeKeyTakeaways: contentSettings.includeKeyTakeaways !== false,
        includeFAQs: contentSettings.includeFAQs !== false,
        internalLinkingWebsite: seoSettings.internalLinkingWebsite || "",
        externalLinkType: seoSettings.externalLinkType || "",
        additionalInstructions: data.additionalInstructions || "",
        outputFormat: "blogPost"
      };

      const result = await generateContent(params);

      if (result.error) {
        setError(result.error || 'Failed to generate article content. Please try again.');
      } else if (result.content) {
        updateData({ 
          generatedArticle: result.content
        });
        
        setArticleContent(result.content);
        setSuccessMessage('Article generated successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        setError('No content was generated. Please try again.');
      }
    } catch (err) {
      console.error('Error details:', err);
      
      // Provide more detailed error message if possible
      if (err instanceof Error) {
        setError(`Failed to generate article: ${err.message}`);
      } else {
        setError('Failed to generate article. Please try again or try a different provider.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (articleContent) {
      navigator.clipboard.writeText(articleContent)
        .then(() => {
          setCopied(true);
          setSuccessMessage('Article copied to clipboard!');
          
          // Reset the copied status after 2 seconds
          setTimeout(() => {
            setCopied(false);
            setSuccessMessage(null);
          }, 2000);
        })
        .catch(() => {
          setError('Failed to copy article');
          
          // Clear error after 3 seconds
          setTimeout(() => {
            setError(null);
          }, 3000);
        });
    }
  };

  return (
    <div className="space-y-6">
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-md">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md">
          {error}
        </div>
      )}
      
      <div className="p-6 border rounded-md bg-white shadow-sm">
        <h2 className="text-xl font-bold mb-4">Full Article</h2>
        <p className="text-gray-600 mb-6">
          {articleContent ? 
            "Your article has been generated. You can copy it or regenerate if needed." : 
            "Generate a complete, SEO-optimized article based on your selected title and content settings."}
        </p>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium mb-2">Selected Title:</h3>
            <p className="text-gray-700">{data.selectedTitle || 'No title selected'}</p>
          </div>
          
          {!articleContent && (
            <>
              <div className="p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2">Meta Description:</h3>
                <p className="text-gray-700">{data.metaDescription || 'No meta description generated'}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2">Content Settings:</h3>
                <ul className="list-disc pl-5 text-gray-700">
                  <li>Word Count: {data.contentSettings?.wordCount || 'medium'}</li>
                  <li>Tone: {data.contentSettings?.tone || 'Professional'}</li>
                  <li>Readability: {data.contentSettings?.textReadability || '8th & 9th grade'}</li>
                </ul>
              </div>
            </>
          )}
          
          <button 
            onClick={handleGenerateArticle} 
            disabled={isLoading || !data.selectedTitle}
            className={`w-full p-3 rounded-md ${isLoading || !data.selectedTitle ? 'bg-amber-300' : 'bg-amber-600 hover:bg-amber-700'} text-white flex items-center justify-center`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating Article...</span>
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                <span>{articleContent ? 'Regenerate Article' : 'Generate Full Article'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {articleContent && (
        <div className="p-6 border rounded-md bg-white shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Article Content</h3>
            <button 
              className="flex items-center gap-1 px-4 py-2 border rounded-md bg-gray-100 hover:bg-gray-200"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy Article</span>
                </>
              )}
            </button>
          </div>
          
          <div 
            ref={articleRef}
            className="prose prose-lg max-w-none bg-gray-50 p-6 rounded-md overflow-auto"
            style={{maxHeight: '600px'}}
          >
            <div dangerouslySetInnerHTML={{ __html: articleContent }} />
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={onPrevStep}
          className="p-3 rounded-md bg-gray-500 hover:bg-gray-600 text-white flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous Step
        </button>

        <button
          onClick={onNextStep}
          disabled={!articleContent}
          className={`p-3 rounded-md ${!articleContent ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'} text-white flex items-center`}
        >
          Next Step: Schema Markup
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};