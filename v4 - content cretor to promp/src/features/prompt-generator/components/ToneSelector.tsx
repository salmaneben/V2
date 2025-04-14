import React from 'react';

interface ToneSelectorProps {
  selectedTone: string;
  onToneChange: (tone: string) => void;
}

interface ToneOption {
  value: string;
  label: string;
  description: string;
}

const ToneSelector: React.FC<ToneSelectorProps> = ({
  selectedTone,
  onToneChange
}) => {
  // Define tone options with descriptions
  const toneOptions: ToneOption[] = [
    {
      value: 'professional',
      label: 'Professional',
      description: 'Polished, authoritative, and credible voice'
    },
    {
      value: 'casual',
      label: 'Casual & Friendly',
      description: 'Relaxed, approachable, and conversational'
    },
    {
      value: 'authoritative',
      label: 'Authoritative',
      description: 'Confident, expert voice with conviction'
    },
    {
      value: 'conversational',
      label: 'Conversational',
      description: 'Dialogue-like approach that engages readers'
    },
    {
      value: 'formal',
      label: 'Formal',
      description: 'Sophisticated, proper, and structured'
    },
    {
      value: 'humorous',
      label: 'Humorous',
      description: 'Witty, playful, and light-hearted'
    },
    {
      value: 'enthusiastic',
      label: 'Enthusiastic',
      description: 'Energetic, passionate, and positive'
    },
    {
      value: 'educational',
      label: 'Educational',
      description: 'Explanatory, teaching-oriented approach'
    }
  ];

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Content Tone:
      </label>
      
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {toneOptions.map((option) => (
          <div
            key={option.value}
            onClick={() => onToneChange(option.value)}
            className={`
              cursor-pointer rounded-lg border p-4
              ${selectedTone === option.value
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
              }
            `}
          >
            <div className="font-medium">{option.label}</div>
            <div className="mt-1 text-xs">{option.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToneSelector;