import React from 'react';
import { PromptLevel } from '../types';

interface DetailLevelSelectorProps {
  selectedLevel: PromptLevel;
  onLevelChange: (level: PromptLevel) => void;
}

interface LevelOption {
  value: PromptLevel;
  label: string;
  description: string;
  features: string[];
}

const DetailLevelSelector: React.FC<DetailLevelSelectorProps> = ({
  selectedLevel,
  onLevelChange
}) => {
  // Define detail level options with descriptions and features
  const levelOptions: LevelOption[] = [
    {
      value: 'basic',
      label: 'Basic',
      description: 'Simple structure with essential information',
      features: [
        'Core concepts only',
        'Minimal technical terms',
        'Shorter content length',
        'Perfect for beginners'
      ]
    },
    {
      value: 'intermediate',
      label: 'Intermediate',
      description: 'Balanced detail with examples and structure',
      features: [
        'In-depth explanations',
        'Practical examples',
        'Comprehensive coverage',
        'Suitable for most audiences'
      ]
    },
    {
      value: 'advanced',
      label: 'Advanced',
      description: 'Comprehensive with detailed guidelines',
      features: [
        'Expert-level insights',
        'Technical terminology',
        'Nuanced analysis',
        'For knowledgeable audience'
      ]
    }
  ];

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Detail Level:
      </label>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {levelOptions.map((option) => (
          <div
            key={option.value}
            onClick={() => onLevelChange(option.value)}
            className={`
              cursor-pointer rounded-lg border p-4
              ${selectedLevel === option.value
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
              }
            `}
          >
            <div className="font-medium text-lg">{option.label}</div>
            <div className="mt-1 text-sm">{option.description}</div>
            
            <ul className="mt-3 space-y-1">
              {option.features.map((feature, index) => (
                <li key={index} className="flex items-start text-xs">
                  <span className="mr-1">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailLevelSelector;