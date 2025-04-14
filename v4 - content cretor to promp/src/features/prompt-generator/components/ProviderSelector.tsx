import React from 'react';
import { Provider } from '../types';

interface ProviderSelectorProps {
  selectedProvider: Provider;
  onProviderChange: (provider: Provider) => void;
}

interface ProviderOption {
  value: Provider;
  label: string;
  description: string;
}

const ProviderSelector: React.FC<ProviderSelectorProps> = ({
  selectedProvider,
  onProviderChange
}) => {
  // Define provider options with descriptions
  const providerOptions: ProviderOption[] = [
    {
      value: 'any',
      label: 'Any Provider',
      description: 'General prompt suitable for any AI service'
    },
    {
      value: 'claude',
      label: 'Claude',
      description: 'Optimized for Anthropic\'s Claude models'
    },
    {
      value: 'openai',
      label: 'OpenAI',
      description: 'Tailored for ChatGPT and GPT models'
    },
    {
      value: 'gemini',
      label: 'Gemini',
      description: 'Specialized for Google\'s Gemini models'
    },
    {
      value: 'mistral',
      label: 'Mistral',
      description: 'Formatted for Mistral AI models'
    },
    {
      value: 'llama',
      label: 'Llama',
      description: 'Optimized for Meta\'s Llama models'
    }
  ];

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Target AI Provider:
      </label>
      
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-6">
        {providerOptions.map((option) => (
          <div
            key={option.value}
            onClick={() => onProviderChange(option.value)}
            className={`
              cursor-pointer rounded-lg border p-3 text-center
              ${selectedProvider === option.value
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
              }
            `}
          >
            <div className="font-medium text-sm">{option.label}</div>
            <div className="mt-1 text-xs hidden sm:block">{option.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProviderSelector;