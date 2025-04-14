import React from 'react';
import { PromptType } from '../types';

// Import icons from lucide-react instead of heroicons
import {
  FileText,
  PenTool,
  MessageCircle,
  Video,
  Mail
} from 'lucide-react';

interface PromptTypeSelectorProps {
  selectedType: PromptType;
  onTypeChange: (type: PromptType) => void;
}

interface TypeOption {
  value: PromptType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const PromptTypeSelector: React.FC<PromptTypeSelectorProps> = ({
  selectedType,
  onTypeChange
}) => {
  // Define content type options with icons and descriptions
  const typeOptions: TypeOption[] = [
    {
      value: 'article',
      label: 'Article',
      icon: <FileText className="w-6 h-6" />,
      description: 'In-depth, informative content with structure'
    },
    {
      value: 'blog',
      label: 'Blog Post',
      icon: <PenTool className="w-6 h-6" />,
      description: 'Conversational, engaging content with personality'
    },
    {
      value: 'social',
      label: 'Social Media',
      icon: <MessageCircle className="w-6 h-6" />,
      description: 'Short, engaging content for social platforms'
    },
    {
      value: 'script',
      label: 'Video Script',
      icon: <Video className="w-6 h-6" />,
      description: 'Structured content for videos or podcasts'
    },
    {
      value: 'email',
      label: 'Email',
      icon: <Mail className="w-6 h-6" />,
      description: 'Professional or marketing email content'
    }
  ];

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Content Type:
      </label>
      
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {typeOptions.map((option) => (
          <div
            key={option.value}
            onClick={() => onTypeChange(option.value)}
            className={`
              cursor-pointer rounded-lg border p-4 text-center
              ${selectedType === option.value
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
              }
            `}
          >
            <div className="flex justify-center">{option.icon}</div>
            <div className="mt-2 font-medium">{option.label}</div>
            <div className="mt-1 text-xs">{option.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromptTypeSelector;