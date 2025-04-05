// src/features/blog-content-generator/components/AdvancedContentSettings.tsx
import React, { useState, useEffect } from 'react';
import { BlogContentFormData, ImageSettings, OptInSettings } from '../types';

interface AdvancedContentSettingsProps {
  data: BlogContentFormData;
  updateData: (newData: Partial<BlogContentFormData>) => void;
}

const AdvancedContentSettings: React.FC<AdvancedContentSettingsProps> = ({ 
  data, 
  updateData 
}) => {
  const [activeTab, setActiveTab] = useState('content');
  
  // Initialize settings on first render
  useEffect(() => {
    if (!data.imageSettings) {
      updateData({
        imageSettings: {
          numberOfImagePrompts: 5,
          imagePromptStyle: 'detailed',
          imageDistribution: 'balanced',
          customImagePrompts: ''
        }
      });
    }
    
    if (!data.optInSettings) {
      updateData({
        optInSettings: {
          enableOptIn: false,
          optInText: 'Subscribe to our newsletter for more content like this',
          optInRequired: false,
          optInPlacement: 'bottom',
          optInDesign: 'standard'
        }
      });
    }
  }, []);
  
  // Update image settings
  const updateImageSettings = (newSettings: Partial<ImageSettings>) => {
    updateData({
      imageSettings: {
        ...data.imageSettings,
        ...newSettings
      }
    });
  };
  
  // Update opt-in settings
  const updateOptInSettings = (newSettings: Partial<OptInSettings>) => {
    updateData({
      optInSettings: {
        ...data.optInSettings,
        ...newSettings
      }
    });
  };
  
  return (
    <div className="bg-gray-50 p-4 rounded-md border">
      <div className="mb-4 border-b">
        <div className="flex space-x-2">
          <button 
            className={`py-2 px-4 ${activeTab === 'content' ? 'bg-blue-100 border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            Content Settings
          </button>
          <button 
            className={`py-2 px-4 ${activeTab === 'images' ? 'bg-blue-100 border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('images')}
          >
            Image Prompts
          </button>
          <button 
            className={`py-2 px-4 ${activeTab === 'optin' ? 'bg-blue-100 border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('optin')}
          >
            Opt-In Form
          </button>
          <button 
            className={`py-2 px-4 ${activeTab === 'seo' ? 'bg-blue-100 border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('seo')}
          >
            SEO Options
          </button>
        </div>
      </div>
      
      {/* Content Settings Tab */}
      {activeTab === 'content' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="word-count">Word Count</label>
              <select
                id="word-count"
                value={data.wordCount || 'medium'}
                onChange={(e) => updateData({ wordCount: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="small">Small (~800 words)</option>
                <option value="medium">Medium (~1200 words)</option>
                <option value="large">Large (~2000 words)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="tone">Tone</label>
              <select
                id="tone"
                value={data.tone || 'Professional'}
                onChange={(e) => updateData({ tone: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="Professional">Professional</option>
                <option value="Conversational">Conversational</option>
                <option value="Friendly">Friendly</option>
                <option value="Authoritative">Authoritative</option>
                <option value="Humorous">Humorous</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="readability">Readability Level</label>
              <select
                id="readability"
                value={data.textReadability || '8th & 9th grade'}
                onChange={(e) => updateData({ textReadability: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="8th & 9th grade">8th & 9th grade (Standard)</option>
                <option value="6th & 7th grade">Simple (6th & 7th grade)</option>
                <option value="10th & 11th grade">Advanced (10th & 11th grade)</option>
                <option value="College">Expert (College level)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="output-format">Output Format</label>
              <select
                id="output-format"
                value={data.outputFormat || 'blogPost'}
                onChange={(e) => updateData({ outputFormat: e.target.value as 'standard' | 'blogPost' })}
                className="w-full p-2 border rounded-md"
              >
                <option value="blogPost">Blog Post (Rich Format)</option>
                <option value="standard">Standard Content</option>
              </select>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Content Elements</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
              <div className="flex items-start space-x-2">
                <input 
                  type="checkbox"
                  id="include-conclusion" 
                  checked={data.includeConclusion !== false}
                  onChange={(e) => updateData({ includeConclusion: e.target.checked })}
                  className="mt-1"
                />
                <label htmlFor="include-conclusion" className="text-sm font-normal cursor-pointer">Conclusion</label>
              </div>
              <div className="flex items-start space-x-2">
                <input 
                  type="checkbox"
                  id="include-tables" 
                  checked={data.includeTables !== false}
                  onChange={(e) => updateData({ includeTables: e.target.checked })}
                  className="mt-1"
                />
                <label htmlFor="include-tables" className="text-sm font-normal cursor-pointer">Tables</label>
              </div>
              <div className="flex items-start space-x-2">
                <input 
                  type="checkbox"
                  id="include-h3" 
                  checked={data.includeH3 !== false}
                  onChange={(e) => updateData({ includeH3: e.target.checked })}
                  className="mt-1"
                />
                <label htmlFor="include-h3" className="text-sm font-normal cursor-pointer">H3 Subheadings</label>
              </div>
              <div className="flex items-start space-x-2">
                <input 
                  type="checkbox"
                  id="include-lists" 
                  checked={data.includeLists !== false}
                  onChange={(e) => updateData({ includeLists: e.target.checked })}
                  className="mt-1"
                />
                <label htmlFor="include-lists" className="text-sm font-normal cursor-pointer">Lists</label>
              </div>
              <div className="flex items-start space-x-2">
                <input 
                  type="checkbox"
                  id="include-italics" 
                  checked={data.includeItalics === true}
                  onChange={(e) => updateData({ includeItalics: e.target.checked })}
                  className="mt-1"
                />
                <label htmlFor="include-italics" className="text-sm font-normal cursor-pointer">Italics</label>
              </div>
              <div className="flex items-start space-x-2">
                <input 
                  type="checkbox"
                  id="include-quotes" 
                  checked={data.includeQuotes === true}
                  onChange={(e) => updateData({ includeQuotes: e.target.checked })}
                  className="mt-1"
                />
                <label htmlFor="include-quotes" className="text-sm font-normal cursor-pointer">Quotes</label>
              </div>
              <div className="flex items-start space-x-2">
                <input 
                  type="checkbox"
                  id="include-key-takeaways" 
                  checked={data.includeKeyTakeaways !== false}
                  onChange={(e) => updateData({ includeKeyTakeaways: e.target.checked })}
                  className="mt-1"
                />
                <label htmlFor="include-key-takeaways" className="text-sm font-normal cursor-pointer">Key Takeaways</label>
              </div>
              <div className="flex items-start space-x-2">
                <input 
                  type="checkbox"
                  id="include-faqs" 
                  checked={data.includeFAQs !== false}
                  onChange={(e) => updateData({ includeFAQs: e.target.checked })}
                  className="mt-1"
                />
                <label htmlFor="include-faqs" className="text-sm font-normal cursor-pointer">FAQ Section</label>
              </div>
              <div className="flex items-start space-x-2">
                <input 
                  type="checkbox"
                  id="include-bold" 
                  checked={data.includeBold !== false}
                  onChange={(e) => updateData({ includeBold: e.target.checked })}
                  className="mt-1"
                />
                <label htmlFor="include-bold" className="text-sm font-normal cursor-pointer">Bold Keywords</label>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="additional-instructions">Additional Instructions</label>
            <textarea
              id="additional-instructions"
              value={data.additionalInstructions || ''}
              onChange={(e) => updateData({ additionalInstructions: e.target.value })}
              placeholder="Any specific instructions for content generation..."
              className="w-full p-2 border rounded-md min-h-[100px]"
            ></textarea>
          </div>
        </div>
      )}
      
      {/* Image Prompts Tab */}
      {activeTab === 'images' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="number-of-image-prompts">Number of Image Suggestions</label>
            <select
              id="number-of-image-prompts"
              value={data.imageSettings?.numberOfImagePrompts?.toString() || '5'}
              onChange={(e) => updateImageSettings({ numberOfImagePrompts: parseInt(e.target.value) })}
              className="w-full p-2 border rounded-md"
            >
              <option value="3">3 Images</option>
              <option value="5">5 Images</option>
              <option value="7">7 Images</option>
              <option value="10">10 Images</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="image-prompt-style">Image Prompt Style</label>
            <select
              id="image-prompt-style"
              value={data.imageSettings?.imagePromptStyle || 'detailed'}
              onChange={(e) => updateImageSettings({ imagePromptStyle: e.target.value as any })}
              className="w-full p-2 border rounded-md"
            >
              <option value="simple">Simple (Brief descriptions)</option>
              <option value="detailed">Detailed (Comprehensive descriptions)</option>
              <option value="creative">Creative (Imaginative concepts)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="image-distribution">Image Distribution</label>
            <select
              id="image-distribution"
              value={data.imageSettings?.imageDistribution || 'balanced'}
              onChange={(e) => updateImageSettings({ imageDistribution: e.target.value as any })}
              className="w-full p-2 border rounded-md"
            >
              <option value="header-only">Header Focus (Beginning of sections)</option>
              <option value="balanced">Balanced (Evenly throughout)</option>
              <option value="throughout">Throughout (Including subsections)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="custom-image-prompts">Custom Image Instructions</label>
            <textarea
              id="custom-image-prompts"
              value={data.imageSettings?.customImagePrompts || ''}
              onChange={(e) => updateImageSettings({ customImagePrompts: e.target.value })}
              placeholder="Any specific instructions for image generation..."
              className="w-full p-2 border rounded-md min-h-[100px]"
            ></textarea>
          </div>
        </div>
      )}
      
      {/* Opt-In Tab */}
      {activeTab === 'optin' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium" htmlFor="enable-optin">Enable Email Opt-In Form</label>
            <input
              type="checkbox"
              id="enable-optin"
              checked={data.optInSettings?.enableOptIn === true}
              onChange={(e) => updateOptInSettings({ enableOptIn: e.target.checked })}
              className="h-4 w-4"
            />
          </div>
          
          {data.optInSettings?.enableOptIn && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="optin-text">Opt-In Text</label>
                <input
                  type="text"
                  id="optin-text"
                  value={data.optInSettings?.optInText || 'Subscribe to our newsletter for more content like this'}
                  onChange={(e) => updateOptInSettings({ optInText: e.target.value })}
                  placeholder="Enter opt-in text prompt"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="optin-placement">Placement</label>
                <select
                  id="optin-placement"
                  value={data.optInSettings?.optInPlacement || 'bottom'}
                  onChange={(e) => updateOptInSettings({ optInPlacement: e.target.value as any })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="top">Top of Content</option>
                  <option value="bottom">Bottom of Content</option>
                  <option value="after-content">After Main Content (Before Conclusion)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="optin-design">Design Style</label>
                <select
                  id="optin-design"
                  value={data.optInSettings?.optInDesign || 'standard'}
                  onChange={(e) => updateOptInSettings({ optInDesign: e.target.value as any })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="standard">Standard</option>
                  <option value="minimalist">Minimalist</option>
                  <option value="prominent">Prominent</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium" htmlFor="optin-required">Make Opt-In Required</label>
                <input
                  type="checkbox"
                  id="optin-required"
                  checked={data.optInSettings?.optInRequired === true}
                  onChange={(e) => updateOptInSettings({ optInRequired: e.target.checked })}
                  className="h-4 w-4"
                />
              </div>
            </>
          )}
        </div>
      )}
      
      {/* SEO Options Tab */}
      {activeTab === 'seo' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="seo-keywords">SEO Keywords</label>
            <textarea
              id="seo-keywords"
              value={data.seoKeywords || ''}
              onChange={(e) => updateData({ seoKeywords: e.target.value })}
              placeholder="Enter secondary keywords (separated by commas)"
              className="w-full p-2 border rounded-md"
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="long-tail-keywords">Long Tail Keywords</label>
            <textarea
              id="long-tail-keywords"
              value={data.longTailKeywords || ''}
              onChange={(e) => updateData({ longTailKeywords: e.target.value })}
              placeholder="Enter long-tail keyword variations"
              className="w-full p-2 border rounded-md"
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="internal-links">Internal Linking</label>
            <textarea
              id="internal-links"
              value={data.internalLinkingWebsite || ''}
              onChange={(e) => updateData({ internalLinkingWebsite: e.target.value })}
              placeholder="URLs to internal pages for linking"
              className="w-full p-2 border rounded-md"
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="external-links">External Linking</label>
            <textarea
              id="external-links"
              value={data.externalLinkType || ''}
              onChange={(e) => updateData({ externalLinkType: e.target.value })}
              placeholder="Suggested external resources to reference"
              className="w-full p-2 border rounded-md"
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="faqs">FAQ Content</label>
            <textarea
              id="faqs"
              value={data.faqs || ''}
              onChange={(e) => updateData({ faqs: e.target.value })}
              placeholder="Questions to address in the FAQ section"
              className="w-full p-2 border rounded-md"
            ></textarea>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedContentSettings;