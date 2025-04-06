// src/pages/MetaDescriptionGenerator.tsx

import React, { useEffect } from 'react';
import { FileText } from 'lucide-react';
import { MetaDescriptionGenerator } from '../features/meta-description-generator';
import { incrementStat } from '../lib/appStats';

interface MetaDescriptionGeneratorPageProps {
  sidebarState: string;
}

const MetaDescriptionGeneratorPage: React.FC<MetaDescriptionGeneratorPageProps> = ({ sidebarState }) => {
  useEffect(() => {
    // Update document title
    document.title = 'Meta Description Generator | Content Tool';
    
    // Log page view if you have analytics
    try {
      const statsModule = require('../lib/statsUtils');
      if (statsModule && typeof statsModule.logPageView === 'function') {
        statsModule.logPageView('meta-description-generator');
      }
    } catch (e) {
      console.error('Failed to log page view:', e);
    }
  }, []);

  const handleSaveDescription = () => {
    // Increment the usage stat
    incrementStat('metaDescriptionGenerator');
  };

  return (
    <div className={`
      p-4 sm:p-6 transition-all duration-300
      ${sidebarState === 'expanded' ? 'max-w-5xl' : 'max-w-7xl'} 
      mx-auto
    `}>
      <div className="flex items-start mb-8">
        <div className="bg-orange-100 p-4 rounded-lg mr-4">
          <FileText className="h-7 w-7 text-orange-600" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Meta Description Generator</h1>
          <p className="text-gray-600">
            Create compelling meta descriptions for your blog posts that improve click-through rates and SEO.
            Each description is optimized to include your focus keyword and stay under 160 characters.
          </p>
        </div>
      </div>
      
      <MetaDescriptionGenerator onSave={handleSaveDescription} />
    </div>
  );
};

export default MetaDescriptionGeneratorPage;