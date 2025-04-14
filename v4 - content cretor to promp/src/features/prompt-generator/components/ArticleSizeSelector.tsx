import React, { useState, useEffect } from 'react';
import { ArticleSizeType } from '../types';
import { ARTICLE_SIZES } from '../constants/articleSizes';

interface ArticleSizeSelectorProps {
  selected: ArticleSizeType;
  customWordCount?: number;
  onChange: (size: ArticleSizeType, customCount?: number) => void;
}

const ArticleSizeSelector: React.FC<ArticleSizeSelectorProps> = ({
  selected,
  customWordCount,
  onChange
}) => {
  const [tempCustomCount, setTempCustomCount] = useState<string>(
    customWordCount?.toString() || '1500'
  );

  useEffect(() => {
    if (customWordCount) {
      setTempCustomCount(customWordCount.toString());
    }
  }, [customWordCount]);

  const handleSizeChange = (size: ArticleSizeType) => {
    if (size === 'custom') {
      // Convert the temp value to number
      const customCount = parseInt(tempCustomCount, 10);
      if (!isNaN(customCount) && customCount > 0) {
        onChange(size, customCount);
      } else {
        // Default to 1500 if invalid
        onChange(size, 1500);
        setTempCustomCount('1500');
      }
    } else {
      onChange(size);
    }
  };

  const handleCustomCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempCustomCount(e.target.value);
  };

  const handleCustomCountBlur = () => {
    if (selected === 'custom') {
      const customCount = parseInt(tempCustomCount, 10);
      if (!isNaN(customCount) && customCount > 0) {
        onChange('custom', customCount);
      } else {
        // Default to 1500 if invalid
        setTempCustomCount('1500');
        onChange('custom', 1500);
      }
    }
  };

  const getSizeLabel = (size: ArticleSizeType): string => {
    if (size === 'custom') {
      return 'Custom';
    }
    
    const { totalWords } = ARTICLE_SIZES[size];
    return `${size.charAt(0).toUpperCase() + size.slice(1)} (${totalWords} words)`;
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Article Size
      </label>
      
      <div className="space-y-2">
        {Object.keys(ARTICLE_SIZES).map((size) => (
          <div key={size} className="flex items-center">
            <input
              id={`size-${size}`}
              name="article-size"
              type="radio"
              checked={selected === size}
              onChange={() => handleSizeChange(size as ArticleSizeType)}
              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
            />
            <label htmlFor={`size-${size}`} className="ml-3 block text-sm font-medium text-gray-700">
              {getSizeLabel(size as ArticleSizeType)}
            </label>
          </div>
        ))}
      </div>

      {selected === 'custom' && (
        <div className="mt-3">
          <label htmlFor="custom-word-count" className="block text-sm font-medium text-gray-700">
            Custom Word Count
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="number"
              name="custom-word-count"
              id="custom-word-count"
              className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
              placeholder="Enter word count"
              value={tempCustomCount}
              onChange={handleCustomCountChange}
              onBlur={handleCustomCountBlur}
              min="100"
              step="100"
            />
            <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
              words
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Recommended: Between 500 and 5000 words
          </p>
        </div>
      )}

      {selected !== 'custom' && (
        <div className="mt-3 bg-blue-50 p-3 rounded-md">
          <h4 className="text-xs font-medium text-blue-800">Structure Distribution</h4>
          <div className="mt-2 space-y-1 text-xs text-blue-700">
            <p>Introduction: {ARTICLE_SIZES[selected].sections.intro} words</p>
            <p>Main Body: {ARTICLE_SIZES[selected].sections.body} words</p>
            <p>Conclusion: {ARTICLE_SIZES[selected].sections.conclusion} words</p>
            <p className="mt-2">H2 Sections: {ARTICLE_SIZES[selected].h2Count}</p>
            <p>H3 Subsections: {ARTICLE_SIZES[selected].h2Count * ARTICLE_SIZES[selected].h3PerH2} (avg. {ARTICLE_SIZES[selected].h3PerH2} per H2)</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleSizeSelector;