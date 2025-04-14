import React from 'react';
import { UserIntentType } from '../types';

interface UserIntentSelectorProps {
  primaryIntent: UserIntentType | undefined;
  secondaryIntent: UserIntentType | undefined;
  onChange: (primary: UserIntentType, secondary?: UserIntentType) => void;
  disabled?: boolean;
}

const USER_INTENTS: { value: UserIntentType; label: string; description: string; icon: string; color: string }[] = [
  {
    value: 'informational',
    label: 'Informational',
    description: 'Users looking for information or answers to questions',
    icon: '🔍',
    color: 'blue'
  },
  {
    value: 'commercial',
    label: 'Commercial',
    description: 'Users researching products or services before making a purchase',
    icon: '🛒',
    color: 'green'
  },
  {
    value: 'transactional',
    label: 'Transactional',
    description: 'Users ready to complete a specific action or purchase',
    icon: '💳',
    color: 'purple'
  },
  {
    value: 'navigational',
    label: 'Navigational',
    description: 'Users searching for a specific website or page',
    icon: '🧭',
    color: 'orange'
  }
];

const UserIntentSelector: React.FC<UserIntentSelectorProps> = ({
  primaryIntent,
  secondaryIntent,
  onChange,
  disabled = false
}) => {
  const handlePrimaryIntentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPrimary = e.target.value as UserIntentType;
    // Reset secondary if it matches the new primary
    const newSecondary = secondaryIntent === newPrimary ? undefined : secondaryIntent;
    onChange(newPrimary, newSecondary);
  };

  const handleSecondaryIntentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onChange(primaryIntent as UserIntentType, value ? value as UserIntentType : undefined);
  };

  const getIntentColor = (intent: UserIntentType): string => {
    const intentData = USER_INTENTS.find(i => i.value === intent);
    return intentData?.color || 'gray';
  };

  const getIntentTips = (intent: UserIntentType): React.ReactNode => {
    switch(intent) {
      case 'informational':
        return (
          <ul className="list-disc list-inside text-xs space-y-1 mt-2">
            <li>Include clear definitions and explanations</li>
            <li>Answer common questions thoroughly</li>
            <li>Use examples to illustrate concepts</li>
            <li>Provide educational and helpful content</li>
          </ul>
        );
      case 'commercial':
        return (
          <ul className="list-disc list-inside text-xs space-y-1 mt-2">
            <li>Compare options and alternatives</li>
            <li>Provide evaluation criteria</li>
            <li>Include pros and cons analysis</li>
            <li>Help users make informed decisions</li>
          </ul>
        );
      case 'transactional':
        return (
          <ul className="list-disc list-inside text-xs space-y-1 mt-2">
            <li>Focus on benefits and value propositions</li>
            <li>Include strong calls-to-action</li>
            <li>Address objections and concerns</li>
            <li>Make the conversion path clear</li>
          </ul>
        );
      case 'navigational':
        return (
          <ul className="list-disc list-inside text-xs space-y-1 mt-2">
            <li>Provide clear, structured organization</li>
            <li>Include entity-specific information</li>
            <li>Make navigation intuitive</li>
            <li>Highlight key information users seek</li>
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`space-y-4 ${disabled ? 'opacity-60 pointer-events-none' : ''}`}>
      <div>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Primary Search Intent
            <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">NEW</span>
          </label>
          
          {primaryIntent && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getIntentColor(primaryIntent)}-100 text-${getIntentColor(primaryIntent)}-800`}>
              {USER_INTENTS.find(i => i.value === primaryIntent)?.icon} {primaryIntent}
            </span>
          )}
        </div>
        
        <select
          value={primaryIntent || ''}
          onChange={handlePrimaryIntentChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          disabled={disabled}
        >
          <option value="" disabled>Select primary intent</option>
          {USER_INTENTS.map((intent) => (
            <option key={intent.value} value={intent.value}>
              {intent.icon} {intent.label} - {intent.description}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">
          Select the main user intent your content should target
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Secondary Search Intent (Optional)
          </label>
          
          {secondaryIntent && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getIntentColor(secondaryIntent)}-100 text-${getIntentColor(secondaryIntent)}-800`}>
              {USER_INTENTS.find(i => i.value === secondaryIntent)?.icon} {secondaryIntent}
            </span>
          )}
        </div>
        
        <select
          value={secondaryIntent || ''}
          onChange={handleSecondaryIntentChange}
          disabled={!primaryIntent || disabled}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md disabled:bg-gray-100 disabled:text-gray-500"
        >
          <option value="">None (optional)</option>
          {USER_INTENTS
            .filter(intent => intent.value !== primaryIntent)
            .map((intent) => (
              <option key={intent.value} value={intent.value}>
                {intent.icon} {intent.label} - {intent.description}
              </option>
            ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">
          Add a secondary intent to create more balanced content
        </p>
      </div>

      {primaryIntent && (
        <div className={`p-3 bg-${getIntentColor(primaryIntent)}-50 rounded-md border border-${getIntentColor(primaryIntent)}-100`}>
          <h4 className={`text-sm font-medium text-${getIntentColor(primaryIntent)}-800 mb-1`}>
            Content Optimization for {USER_INTENTS.find(i => i.value === primaryIntent)?.label} Intent
          </h4>
          
          <p className={`text-xs text-${getIntentColor(primaryIntent)}-700 mb-2`}>
            {primaryIntent === 'informational' && 'Focus on educating and informing the reader with comprehensive, helpful content.'}
            {primaryIntent === 'commercial' && 'Help users research and compare options to make an informed purchase decision.'}
            {primaryIntent === 'transactional' && 'Focus on converting users with compelling reasons to take immediate action.'}
            {primaryIntent === 'navigational' && 'Provide clear, structured information about your entity or brand.'}
          </p>
          
          {getIntentTips(primaryIntent)}
          
          {secondaryIntent && (
            <div className="mt-3 pt-2 border-t border-gray-200">
              <p className={`text-xs font-medium text-${getIntentColor(secondaryIntent)}-700`}>
                Secondary {USER_INTENTS.find(i => i.value === secondaryIntent)?.label} elements:
                {secondaryIntent === 'informational' && ' Include educational content to support the primary intent.'}
                {secondaryIntent === 'commercial' && ' Include comparison elements to support the primary intent.'}
                {secondaryIntent === 'transactional' && ' Include conversion elements to support the primary intent.'}
                {secondaryIntent === 'navigational' && ' Include clear navigation elements to support the primary intent.'}
              </p>
            </div>
          )}
        </div>
      )}
      
      <div className="bg-yellow-50 border border-yellow-100 rounded-md p-3 text-xs text-yellow-800">
        <h4 className="font-medium mb-1">PRO TIP: Intent Matching</h4>
        <p>
          Matching your content to user search intent is one of the most powerful ways to improve rankings.
          Google prioritizes content that best satisfies the specific intent behind a search query.
        </p>
      </div>
    </div>
  );
};

export default UserIntentSelector;