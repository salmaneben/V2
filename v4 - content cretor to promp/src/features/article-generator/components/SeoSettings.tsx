import React, { useState } from 'react';
import { Search, Award, Zap, ChevronDown, ChevronUp, HelpCircle, Sparkles, Link, List, Bold, AlignJustify, TableProperties } from 'lucide-react';

interface SeoSettingsProps {
  seoLevel: 'basic' | 'intermediate' | 'advanced';
  onSeoLevelChange: (level: 'basic' | 'intermediate' | 'advanced') => void;
  data?: any; // For accessing any additional data if needed
  updateData?: (data: any) => void; // For updating data if needed
}

export const SeoSettings: React.FC<SeoSettingsProps> = ({ 
  seoLevel, 
  onSeoLevelChange,
  data,
  updateData
}) => {
  const [expandedSections, setExpandedSections] = useState({
    seoLevel: true,
    seoElements: false,
    seoAdvanced: false
  });

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  // Handle updating SEO elements if updateData is provided
  const handleSeoElementToggle = (element: string, checked: boolean) => {
    if (updateData) {
      updateData({ [element]: checked });
    }
  };

  // SEO level options with descriptions and features
  const seoLevels = [
    {
      id: 'basic',
      name: 'Basic SEO',
      icon: <Search className="h-5 w-5" />,
      description: 'Essential on-page SEO optimizations for visibility in search engines',
      features: [
        'Primary keyword in title and headings',
        'Proper HTML structure and formatting',
        'Reader-friendly content organization',
        'Basic meta elements',
        'Simple internal linking'
      ]
    },
    {
      id: 'intermediate',
      name: 'Intermediate SEO',
      icon: <Award className="h-5 w-5" />,
      description: 'Enhanced optimizations for better rankings and featured snippets',
      features: [
        'Everything in Basic SEO',
        'Semantic keyword variations',
        'Strategic internal & external linking',
        'FAQ section with structured data',
        'Enhanced content formatting',
        'Media optimization',
        'Featured snippet optimization',
        'Table of contents for longer articles'
      ]
    },
    {
      id: 'advanced',
      name: 'Advanced SEO',
      icon: <Zap className="h-5 w-5" />,
      description: 'Comprehensive optimization for maximum visibility and conversions',
      features: [
        'Everything in Intermediate SEO',
        'Optimal keyword density (1-2%)',
        'Rich schema markup implementation',
        'LSI keyword integration',
        'Enhanced structured data',
        'People Also Ask optimization',
        'Content clusters & topic authority',
        'E-E-A-T signal enhancement',
        'User intent optimization',
        'Mobile optimization guidelines'
      ]
    }
  ];

  // SEO elements options
  const seoElements = [
    { id: 'includeBold', name: 'Bold Keywords', icon: <Bold className="h-4 w-4" />, description: 'Bold primary and secondary keywords throughout the content' },
    { id: 'includeH3', name: 'H3 Subheadings', icon: <AlignJustify className="h-4 w-4" />, description: 'Include H3 subheadings with keywords for better structure' },
    { id: 'includeLists', name: 'Bullet Lists', icon: <List className="h-4 w-4" />, description: 'Include bulleted and numbered lists for better readability' },
    { id: 'includeTables', name: 'Data Tables', icon: <TableProperties className="h-4 w-4" />, description: 'Include data tables for snippet opportunities' },
    { id: 'includeInternalLinks', name: 'Internal Links', icon: <Link className="h-4 w-4" />, description: 'Include internal links to related content on your site' },
    { id: 'includeExternalLinks', name: 'External Links', icon: <Link className="h-4 w-4" />, description: 'Include external links to authoritative sources' },
    { id: 'includeFAQs', name: 'FAQ Section', icon: <HelpCircle className="h-4 w-4" />, description: 'Include FAQ section for "People Also Ask" optimization' },
    { id: 'includeKeyTakeaways', name: 'Key Takeaways', icon: <Sparkles className="h-4 w-4" />, description: 'Include key takeaways sections for easy scanning' }
  ];

  return (
    <div className="space-y-4">
      {/* SEO Level Selection Section */}
      <div className="w-full border rounded-md p-4 mb-4">
        <button 
          className="flex items-center gap-2 w-full text-left"
          onClick={() => toggleSection('seoLevel')}
        >
          <Search className="h-4 w-4" />
          <span className="font-medium">SEO Optimization Level</span>
          <span className="ml-auto">{expandedSections.seoLevel ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}</span>
        </button>
        
        {expandedSections.seoLevel && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-4">
              Select the level of SEO optimization for your article. Higher levels include more advanced SEO techniques that can help your content rank better in search results.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {seoLevels.map((level) => (
                <div 
                  key={level.id}
                  onClick={() => onSeoLevelChange(level.id as 'basic' | 'intermediate' | 'advanced')}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    seoLevel === level.id 
                      ? 'bg-blue-50 border-blue-300' 
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center mb-3">
                    <div className={`p-1.5 rounded-full mr-2 ${
                      seoLevel === level.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {level.icon}
                    </div>
                    <h4 className="font-medium">{level.name}</h4>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{level.description}</p>
                  
                  <ul className="text-xs text-gray-500 space-y-1">
                    {level.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-1">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* SEO Elements Section */}
      <div className="w-full border rounded-md p-4 mb-4">
        <button 
          className="flex items-center gap-2 w-full text-left"
          onClick={() => toggleSection('seoElements')}
        >
          <Sparkles className="h-4 w-4" />
          <span className="font-medium">SEO Content Elements</span>
          <span className="ml-auto">{expandedSections.seoElements ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}</span>
        </button>
        
        {expandedSections.seoElements && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-4">
              Select specific SEO elements to include in your article. These elements can help improve readability, user engagement, and search engine rankings.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {seoElements.map((element) => (
                <div key={element.id} className="flex items-start space-x-2 p-3 border rounded-md">
                  <input
                    type="checkbox" 
                    id={element.id}
                    checked={data?.[element.id] !== false}
                    onChange={(e) => handleSeoElementToggle(element.id, e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <label htmlFor={element.id} className="flex items-center cursor-pointer">
                      <span className="mr-2">{element.icon}</span>
                      <span className="font-medium">{element.name}</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">{element.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Advanced SEO Settings */}
      {seoLevel === 'advanced' && (
        <div className="w-full border rounded-md p-4 mb-4">
          <button 
            className="flex items-center gap-2 w-full text-left"
            onClick={() => toggleSection('seoAdvanced')}
          >
            <Zap className="h-4 w-4" />
            <span className="font-medium">Advanced SEO Options</span>
            <span className="ml-auto">{expandedSections.seoAdvanced ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}</span>
          </button>
          
          {expandedSections.seoAdvanced && (
            <div className="mt-4 space-y-4">
              <p className="text-sm text-gray-600 mb-2">
                Configure advanced SEO settings for optimal search engine performance.
              </p>
              
              {/* Keyword Density */}
              <div>
                <label className="block text-sm font-medium mb-1">Keyword Density</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={data?.keywordDensity || 'optimal'}
                  onChange={(e) => updateData?.({ keywordDensity: e.target.value })}
                >
                  <option value="low">Low (0.5-1%)</option>
                  <option value="optimal">Optimal (1-2%)</option>
                  <option value="high">High (2-3%)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Optimal keyword density helps avoid keyword stuffing while maintaining relevance.
                </p>
              </div>
              
              {/* Schema Markup */}
              <div>
                <label className="block text-sm font-medium mb-1">Schema Markup</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={data?.schemaType || 'auto'}
                  onChange={(e) => updateData?.({ schemaType: e.target.value })}
                >
                  <option value="auto">Auto-detect based on content</option>
                  <option value="article">Article</option>
                  <option value="blogPosting">Blog Posting</option>
                  <option value="howTo">How-To</option>
                  <option value="faq">FAQ Page</option>
                  <option value="product">Product</option>
                  <option value="recipe">Recipe</option>
                  <option value="review">Review</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Schema markup helps search engines understand your content better and can enable rich results.
                </p>
              </div>
              
              {/* Featured Snippet Optimization */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox" 
                  id="optimizeForFeaturedSnippet"
                  checked={data?.optimizeForFeaturedSnippet !== false}
                  onChange={(e) => updateData?.({ optimizeForFeaturedSnippet: e.target.checked })}
                  className="mt-1"
                />
                <div>
                  <label htmlFor="optimizeForFeaturedSnippet" className="text-sm font-medium cursor-pointer">
                    Optimize for Featured Snippets
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Structures content to increase chances of appearing in Google's featured snippets.
                  </p>
                </div>
              </div>
              
              {/* Entity Optimization */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox" 
                  id="enhanceEntityOptimization"
                  checked={data?.enhanceEntityOptimization !== false}
                  onChange={(e) => updateData?.({ enhanceEntityOptimization: e.target.checked })}
                  className="mt-1"
                />
                <div>
                  <label htmlFor="enhanceEntityOptimization" className="text-sm font-medium cursor-pointer">
                    Enhance Entity Optimization
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Strengthens entity relationships to improve topical authority and semantic SEO.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};