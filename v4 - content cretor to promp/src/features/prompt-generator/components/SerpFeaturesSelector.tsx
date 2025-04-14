import React from 'react';
import { SerptFeatureType } from '../types';

interface SerpFeaturesSelectorProps {
  selectedFeatures: SerptFeatureType[];
  onChange: (features: SerptFeatureType[]) => void;
}

const SERP_FEATURES: { value: SerptFeatureType; label: string; description: string }[] = [
  {
    value: 'featuredSnippet',
    label: 'Featured Snippet',
    description: 'The highlighted box at the top of search results that directly answers a query'
  },
  {
    value: 'peopleAlsoAsk',
    label: 'People Also Ask',
    description: 'Expandable questions related to the original search query'
  },
  {
    value: 'knowledgePanel',
    label: 'Knowledge Panel',
    description: 'Information box that appears on the right side of search results for entities'
  },
  {
    value: 'videoFeature',
    label: 'Video Feature',
    description: 'Video results that appear in the main search results'
  },
  {
    value: 'localPack',
    label: 'Local Pack',
    description: 'Map with local business listings for location-specific searches'
  },
  {
    value: 'imageCarousel',
    label: 'Image Carousel',
    description: 'Horizontal scrollable list of images in search results'
  },
  {
    value: 'relatedSearches',
    label: 'Related Searches',
    description: 'Search terms related to the original query'
  }
];

const SerpFeaturesSelector: React.FC<SerpFeaturesSelectorProps> = ({
  selectedFeatures,
  onChange
}) => {
  const handleFeatureToggle = (feature: SerptFeatureType) => {
    if (selectedFeatures.includes(feature)) {
      onChange(selectedFeatures.filter(f => f !== feature));
    } else {
      onChange([...selectedFeatures, feature]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-gray-700 mb-2">
        Target SERP Features
        <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">NEW</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {SERP_FEATURES.map((feature) => (
          <div key={feature.value} className="flex items-start space-x-2">
            <div className="flex items-center h-5">
              <input
                id={`feature-${feature.value}`}
                type="checkbox"
                checked={selectedFeatures.includes(feature.value)}
                onChange={() => handleFeatureToggle(feature.value)}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-2 text-sm">
              <label htmlFor={`feature-${feature.value}`} className="font-medium text-gray-700">
                {feature.label}
              </label>
              <p className="text-gray-500 text-xs mt-0.5">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-xs text-gray-500 mt-2 italic">
        Select SERP features to optimize your content for specific Google search result elements
      </div>
    </div>
  );
};

export default SerpFeaturesSelector;