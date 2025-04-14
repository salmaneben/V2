import React from 'react';
import { NicheType } from '../types';

// Import icons from lucide-react instead of heroicons
import {
  Cake,
  Cpu,
  Heart,
  DollarSign,
  Globe,
  GraduationCap,
  ShoppingBag,
  Zap,
  Sparkles,
  Briefcase
} from 'lucide-react';

interface NicheSelectorProps {
  selectedNiche: NicheType;
  onNicheChange: (niche: NicheType) => void;
}

interface NicheOption {
  value: NicheType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const NicheSelector: React.FC<NicheSelectorProps> = ({ 
  selectedNiche, 
  onNicheChange 
}) => {
  // Define niche options with icons and descriptions
  const nicheOptions: NicheOption[] = [
    {
      value: 'recipes',
      label: 'Recipes & Food',
      icon: <Cake className="w-8 h-8" />,
      description: 'Cooking, baking, and food content'
    },
    {
      value: 'technology',
      label: 'Technology',
      icon: <Cpu className="w-8 h-8" />,
      description: 'Tech products, software, and digital trends'
    },
    {
      value: 'health',
      label: 'Health & Wellness',
      icon: <Heart className="w-8 h-8" />,
      description: 'Fitness, wellness, and medical information'
    },
    {
      value: 'finance',
      label: 'Finance',
      icon: <DollarSign className="w-8 h-8" />,
      description: 'Money management, investing, and financial advice'
    },
    {
      value: 'travel',
      label: 'Travel',
      icon: <Globe className="w-8 h-8" />,
      description: 'Destinations, travel tips, and experiences'
    },
    {
      value: 'education',
      label: 'Education',
      icon: <GraduationCap className="w-8 h-8" />,
      description: 'Learning, teaching, and educational content'
    },
    {
      value: 'fashion',
      label: 'Fashion',
      icon: <ShoppingBag className="w-8 h-8" />,
      description: 'Clothing, style, and fashion trends'
    },
    {
      value: 'sports',
      label: 'Sports',
      icon: <Zap className="w-8 h-8" />,
      description: 'Sports news, training, and athletic content'
    },
    {
      value: 'beauty',
      label: 'Beauty',
      icon: <Sparkles className="w-8 h-8" />,
      description: 'Skincare, makeup, and beauty products'
    },
    {
      value: 'business',
      label: 'Business',
      icon: <Briefcase className="w-8 h-8" />,
      description: 'Entrepreneurship, marketing, and business strategy'
    },
  ];

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Content Niche:
      </label>
      
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {nicheOptions.map((option) => (
          <div
            key={option.value}
            onClick={() => onNicheChange(option.value)}
            className={`
              cursor-pointer rounded-lg border p-4 text-center
              ${selectedNiche === option.value
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
              }
            `}
          >
            <div className="flex justify-center">{option.icon}</div>
            <div className="mt-2 font-medium text-sm">{option.label}</div>
            <div className="mt-1 text-xs">{option.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NicheSelector;