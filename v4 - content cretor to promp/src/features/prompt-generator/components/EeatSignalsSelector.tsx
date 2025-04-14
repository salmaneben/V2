import React from 'react';
import { EeatSignalLevel } from '../types';

interface EeatSignalsSelectorProps {
  level: EeatSignalLevel | undefined;
  onChange: (level: EeatSignalLevel) => void;
}

const EEAT_LEVELS: { value: EeatSignalLevel; label: string; description: string }[] = [
  {
    value: 'basic',
    label: 'Basic',
    description: 'Fundamental E-E-A-T signals for general content'
  },
  {
    value: 'standard',
    label: 'Standard',
    description: 'Strong E-E-A-T signals suitable for most content types'
  },
  {
    value: 'advanced',
    label: 'Advanced',
    description: 'Comprehensive E-E-A-T signals for YMYL (Your Money, Your Life) content'
  }
];

const EeatSignalsSelector: React.FC<EeatSignalsSelectorProps> = ({
  level,
  onChange
}) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-baseline">
        <label className="block text-sm font-medium text-gray-700">
          E-E-A-T Signal Level
          <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">NEW</span>
        </label>
        
        <a 
          href="https://developers.google.com/search/blog/2023/12/google-search-helpful-content-update" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline"
        >
          What is E-E-A-T?
        </a>
      </div>
      
      <div className="space-y-2">
        {EEAT_LEVELS.map((eeatLevel) => (
          <div 
            key={eeatLevel.value}
            className={`
              relative p-3 rounded-lg border cursor-pointer transition-all
              ${level === eeatLevel.value 
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-opacity-30' 
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/30'}
            `}
            onClick={() => onChange(eeatLevel.value)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`
                  h-4 w-4 rounded-full mr-3 
                  ${level === eeatLevel.value ? 'bg-blue-500' : 'bg-gray-200'}
                `}/>
                <div>
                  <h4 className="font-medium text-sm">{eeatLevel.label}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{eeatLevel.description}</p>
                </div>
              </div>
            </div>
            
            {level === eeatLevel.value && eeatLevel.value === 'basic' && (
              <div className="mt-2 text-xs text-gray-600 border-t border-blue-100 pt-2">
                <p>Includes basic demonstration of experience, expertise, authoritativeness, and trustworthiness</p>
              </div>
            )}
            
            {level === eeatLevel.value && eeatLevel.value === 'standard' && (
              <div className="mt-2 text-xs text-gray-600 border-t border-blue-100 pt-2">
                <p>Includes real-world examples, clear expertise signals, authoritative sources, and balanced information</p>
              </div>
            )}
            
            {level === eeatLevel.value && eeatLevel.value === 'advanced' && (
              <div className="mt-2 text-xs text-gray-600 border-t border-blue-100 pt-2">
                <p>Includes detailed first-hand experience, professional-level expertise signals, comprehensive source citations, and explicit trustworthiness markers</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="text-xs text-gray-500 mt-1">
        E-E-A-T stands for Experience, Expertise, Authoritativeness, and Trustworthiness - key quality signals for Google's ranking algorithms
      </div>
    </div>
  );
};

export default EeatSignalsSelector;