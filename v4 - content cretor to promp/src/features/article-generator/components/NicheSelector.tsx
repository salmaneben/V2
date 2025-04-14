import React from 'react';
import { NicheType } from '../types';
import { 
  Utensils, 
  Cpu, 
  Heart, 
  DollarSign, 
  Plane, 
  GraduationCap,
  Shirt,
  Trophy,
  Gem,
  Briefcase
} from 'lucide-react';

interface NicheSelectorProps {
  selectedNiche: NicheType;
  onNicheChange: (niche: NicheType) => void;
}

export const NicheSelector: React.FC<NicheSelectorProps> = ({ 
  selectedNiche, 
  onNicheChange 
}) => {
  // Define niche options with icons and descriptions
  const nicheOptions: {
    id: NicheType;
    name: string;
    icon: React.ReactNode;
    description: string;
  }[] = [
    {
      id: 'recipes',
      name: 'Recipes',
      icon: <Utensils className="h-6 w-6" />,
      description: 'Food recipes, cooking techniques, and meal preparation'
    },
    {
      id: 'technology',
      name: 'Technology',
      icon: <Cpu className="h-6 w-6" />,
      description: 'Gadgets, software, and digital trends'
    },
    {
      id: 'health',
      name: 'Health',
      icon: <Heart className="h-6 w-6" />,
      description: 'Wellness, medicine, fitness, and mental health'
    },
    {
      id: 'finance',
      name: 'Finance',
      icon: <DollarSign className="h-6 w-6" />,
      description: 'Money management, investing, and economic topics'
    },
    {
      id: 'travel',
      name: 'Travel',
      icon: <Plane className="h-6 w-6" />,
      description: 'Destinations, travel tips, and experiences'
    },
    {
      id: 'education',
      name: 'Education',
      icon: <GraduationCap className="h-6 w-6" />,
      description: 'Learning, teaching methods, and academic topics'
    },
    {
      id: 'fashion',
      name: 'Fashion',
      icon: <Shirt className="h-6 w-6" />,
      description: 'Clothing, style trends, and fashion advice'
    },
    {
      id: 'sports',
      name: 'Sports',
      icon: <Trophy className="h-6 w-6" />,
      description: 'Athletic events, teams, players, and fitness routines'
    },
    {
      id: 'beauty',
      name: 'Beauty',
      icon: <Gem className="h-6 w-6" />,
      description: 'Skincare, makeup, and personal care products'
    },
    {
      id: 'business',
      name: 'Business',
      icon: <Briefcase className="h-6 w-6" />,
      description: 'Entrepreneurship, management, and corporate topics'
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Select Article Niche</h3>
        <p className="text-sm text-gray-500">
          Choose the content niche that best matches your article. This will optimize the content structure and SEO.
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {nicheOptions.map((niche) => (
          <div 
            key={niche.id}
            onClick={() => onNicheChange(niche.id)}
            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
              selectedNiche === niche.id 
                ? 'bg-blue-50 border-blue-300' 
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className={`p-2 rounded-full ${
                selectedNiche === niche.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {niche.icon}
              </div>
              <h4 className="font-medium">{niche.name}</h4>
              <p className="text-xs text-gray-500 line-clamp-2">{niche.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};