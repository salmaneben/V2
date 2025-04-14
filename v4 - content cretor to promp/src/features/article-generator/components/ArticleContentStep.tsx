import React, { useState, useRef, useEffect } from 'react';
import { generateArticleContent } from '../utils/articleGenerator';
import { generateSchemaMarkup } from '../utils/schemaGenerator';
import { ArticleGeneratorData, NicheType } from '../types';
import { ApiButton } from './ApiButton';
import { NicheSelector } from './NicheSelector';
import { SeoSettings } from './SeoSettings';

interface ArticleContentStepProps {
  data: ArticleGeneratorData;
  updateData: (data: Partial<ArticleGeneratorData>) => void;
  onNextStep: (() => void) | null;
  onPrevStep: () => void;
}

export const ArticleContentStep: React.FC<ArticleContentStepProps> = ({ 
  data, 
  updateData, 
  onNextStep, 
  onPrevStep 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const contentEditorRef = useRef<HTMLDivElement>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [promptType, setPromptType] = useState<'standard' | 'advanced'>('standard');
  const [seoLevel, setSeoLevel] = useState<'basic' | 'intermediate' | 'advanced'>('intermediate');
  const [schemaMarkup, setSchemaMarkup] = useState<string>('');
  const [showSchema, setShowSchema] = useState<boolean>(false);
  
  // Generate schema markup when article is generated
  useEffect(() => {
    if (data.generatedArticle && data.niche && data.metaTitle && data.metaDescription && data.tags) {
      try {
        const schema = generateSchemaMarkup(
          data.niche,
          data.metaTitle,
          data.metaDescription,
          data.tags
        );
        setSchemaMarkup(schema);
      } catch (err) {
        console.error('Error generating schema markup:', err);
      }
    }
  }, [data.generatedArticle, data.niche, data.metaTitle, data.metaDescription, data.tags]);
  
  // Handle niche change
  const handleNicheChange = (niche: NicheType) => {
    updateData({ niche });
  };
  
  // Handle SEO level change
  const handleSeoLevelChange = (level: 'basic' | 'intermediate' | 'advanced') => {
    setSeoLevel(level);
  };

  // Handle toggling advanced settings
  const handleToggleAdvancedSettings = () => {
    setPromptType(promptType === 'standard' ? 'advanced' : 'standard');
  };

  // Handle updating advanced fields
  const handleRelatedKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData({ relatedKeywords: e.target.value });
  };

  const handleInternalLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData({ internalLink: e.target.value });
  };

  const handleExternalLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData({ externalLink: e.target.value });
  };

  // Handle article content generation
  const handleGenerateArticle = async () => {
    if (!data.metaTitle || !data.focusKeyword || !data.metaDescription) {
      setError('Required information is incomplete. Please complete the previous steps.');
      return;
    }

    // Check niche
    if (!data.niche) {
      setError('Please select a niche before generating the article.');
      return;
    }

    // Check advanced settings fields if advanced prompt type is selected
    if (promptType === 'advanced' && (!data.relatedKeywords || !data.internalLink || !data.externalLink)) {
      setError('When using advanced settings, all fields must be filled (Related Keywords, Internal Link, External Link).');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Call API to generate article content
      const result = await generateArticleContent({
        metaTitle: data.metaTitle,
        focusKeyword: data.focusKeyword,
        metaDescription: data.metaDescription,
        niche: data.niche,
        relatedKeywords: data.relatedKeywords,
        internalLink: data.internalLink,
        externalLink: data.externalLink,
        promptType: promptType,
        seoLevel: seoLevel,
        provider: data.apiSettings?.provider
      });

      // Check for API errors
      if (result.error) {
        setError(result.error);
        return;
      }

      // Update generated article state
      updateData({ generatedArticle: result.content });
      
      // Scroll to top of content
      if (contentEditorRef.current) {
        contentEditorRef.current.scrollTop = 0;
      }
    } catch (err) {
      setError('Failed to generate article content. Please try again.');
      console.error('Error generating article:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle copying content to clipboard with schema markup
  const handleCopyContent = () => {
    if (data.generatedArticle) {
      let contentToCopy = data.generatedArticle;
      
      // Add schema markup if available
      if (schemaMarkup && showSchema) {
        contentToCopy += '\n\n<!-- Schema Markup -->\n<script type="application/ld+json">\n' + schemaMarkup + '\n</script>';
      }
      
      navigator.clipboard.writeText(contentToCopy)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy content:', err);
          setError('Failed to copy content to clipboard.');
        });
    }
  };

  // Handle copying schema markup only
  const handleCopySchema = () => {
    if (schemaMarkup) {
      const schemaToCopy = '<script type="application/ld+json">\n' + schemaMarkup + '\n</script>';
      
      navigator.clipboard.writeText(schemaToCopy)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy schema:', err);
          setError('Failed to copy schema to clipboard.');
        });
    }
  };

  // Handle editing generated content
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateData({ generatedArticle: e.target.value });
  };

  // Handle saving content
  const handleSaveContent = () => {
    // Add save functionality here (e.g., save to database, download as file)
    // For now, just a notification that it was saved
    alert('Content saved successfully!');
    
    // If there's a next step, navigate to it
    if (onNextStep) {
      onNextStep();
    }
  };

  // Toggle schema display
  const toggleSchemaDisplay = () => {
    setShowSchema(!showSchema);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Step 4: Generate Article Content</h2>
        <ApiButton />
      </div>
      
      <div className="bg-blue-50 p-4 rounded-md">
        <p className="text-sm text-blue-800">
          Create a structured, SEO-optimized article based on the title, description, and tags you've entered.
        </p>
      </div>
      
      {/* Previous selections summary */}
      <div className="bg-gray-100 p-4 rounded-md space-y-3">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-1">Title:</h3>
          <p className="text-base font-semibold text-gray-900">{data.metaTitle}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-1">Description:</h3>
          <p className="text-sm text-gray-900">{data.metaDescription}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-1">Tags:</h3>
          <p className="text-sm text-gray-900">{data.tags}</p>
        </div>
      </div>
      
      {/* Niche selection */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <NicheSelector 
          selectedNiche={data.niche || 'recipes'} 
          onNicheChange={handleNicheChange}
        />
      </div>
      
      {/* SEO optimization settings */}
      <SeoSettings 
        seoLevel={seoLevel}
        onSeoLevelChange={handleSeoLevelChange}
      />
      
      {/* Settings type selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Settings Type:
        </label>
        <div className="flex space-x-4">
          <div className="flex items-center">
            <input
              id="standard-prompt"
              type="radio"
              name="promptType"
              value="standard"
              checked={promptType === 'standard'}
              onChange={() => setPromptType('standard')}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="standard-prompt" className="ml-2 text-sm text-gray-700">
              Basic Settings
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="advanced-prompt"
              type="radio"
              name="promptType"
              value="advanced"
              checked={promptType === 'advanced'}
              onChange={() => setPromptType('advanced')}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="advanced-prompt" className="ml-2 text-sm text-gray-700">
              Advanced Settings (with links)
            </label>
          </div>
        </div>
      </div>
      
      {/* Advanced settings (conditionally shown) */}
      {promptType === 'advanced' && (
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 space-y-4">
          <h3 className="text-md font-medium text-gray-700">Advanced Settings</h3>
          
          <div className="space-y-2">
            <label htmlFor="relatedKeywords" className="block text-sm font-medium text-gray-700">
              Related Keywords:
            </label>
            <input
              id="relatedKeywords"
              type="text"
              value={data.relatedKeywords || ''}
              onChange={handleRelatedKeywordsChange}
              placeholder="Example: vegetarian recipes, healthy cooking"
              className="block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="internalLink" className="block text-sm font-medium text-gray-700">
              Internal Link:
            </label>
            <input
              id="internalLink"
              type="text"
              value={data.internalLink || ''}
              onChange={handleInternalLinkChange}
              placeholder="Example: https://yoursite.com/related-page"
              className="block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="externalLink" className="block text-sm font-medium text-gray-700">
              External Link:
            </label>
            <input
              id="externalLink"
              type="text"
              value={data.externalLink || ''}
              onChange={handleExternalLinkChange}
              placeholder="Example: https://trusted-site.com/related-page"
              className="block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      )}
      
      {/* Generate article button */}
      <div className="flex justify-center">
        <button
          onClick={handleGenerateArticle}
          disabled={isGenerating || !data.metaTitle || !data.metaDescription || !data.tags || !data.niche || (promptType === 'advanced' && (!data.relatedKeywords || !data.internalLink || !data.externalLink))}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Article...
            </>
          ) : (
            'Generate Full Article'
          )}
        </button>
      </div>
      
      {/* Display generated content */}
      {data.generatedArticle && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Generated Article:</h3>
            <div className="flex space-x-2">
              <button
                onClick={handleCopyContent}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isCopied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={handleSaveContent}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Save Content
              </button>
            </div>
          </div>
          
          {/* HTML preview */}
          <div className="border border-gray-300 rounded-md p-4 max-h-96 overflow-y-auto bg-white" ref={contentEditorRef}>
            <div dangerouslySetInnerHTML={{ __html: data.generatedArticle }} />
          </div>
          
          {/* Editable HTML content textbox */}
          <div className="space-y-2">
            <label htmlFor="contentEditor" className="block text-sm font-medium text-gray-700">
              Edit HTML Content:
            </label>
            <textarea
              id="contentEditor"
              rows={15}
              value={data.generatedArticle}
              onChange={handleContentChange}
              className="block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono"
            />
          </div>
          
          {/* Schema Markup Section */}
          {schemaMarkup && (
            <div className="space-y-2 mt-6">
              <div className="flex justify-between items-center">
                <button
                  onClick={toggleSchemaDisplay}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none"
                >
                  {showSchema ? 'Hide Schema Markup' : 'Show Schema Markup'}
                </button>
                {showSchema && (
                  <button
                    onClick={handleCopySchema}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Copy Schema
                  </button>
                )}
              </div>
              
              {showSchema && (
                <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
                  <h4 className="text-md font-medium text-gray-900 mb-2">Generated Schema Markup:</h4>
                  <pre className="bg-gray-100 p-2 rounded-md text-xs overflow-x-auto">
                    <code>{schemaMarkup}</code>
                  </pre>
                  <p className="text-xs text-gray-500 mt-2">
                    Add this schema markup to your page's HTML to improve SEO. It should be placed in the &lt;head&gt; section or just before the closing &lt;/body&gt; tag.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {/* Navigation buttons */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onPrevStep}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Previous
        </button>
        
        {onNextStep && (
          <button
            onClick={onNextStep}
            disabled={!data.generatedArticle}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};