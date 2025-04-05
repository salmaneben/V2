// src/pages/MetaTitleGenerator.tsx

import React, { useEffect } from 'react';
import { Type } from 'lucide-react';
import { MetaTitleGenerator } from '../features/meta-title-generator';
import { incrementStat } from '../lib/appStats';

interface MetaTitleGeneratorPageProps {
  sidebarState: string;
}

const MetaTitleGeneratorPage: React.FC<MetaTitleGeneratorPageProps> = ({ sidebarState }) => {
  useEffect(() => {
    // Update document title
    document.title = 'Meta Title Generator | Content Tool';
    
    // Log page view if you have analytics
    try {
      const statsModule = require('../lib/statsUtils');
      if (statsModule && typeof statsModule.logPageView === 'function') {
        statsModule.logPageView('meta-title-generator');
      }
    } catch (e) {
      console.error('Failed to log page view:', e);
    }
  }, []);

  const handleSaveTitles = () => {
    // Increment the usage stat
    incrementStat('metaTitleGenerator');
  };

  return (
    <div className={`
      p-4 sm:p-6 transition-all duration-300
      ${sidebarState === 'expanded' ? 'max-w-5xl' : 'max-w-7xl'} 
      mx-auto
    `}>
      <div className="flex items-start mb-8">
        <div className="bg-amber-100 p-4 rounded-lg mr-4">
          <Type className="h-7 w-7 text-amber-600" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Meta Title Generator</h1>
          <p className="text-gray-600">
            Create SEO-friendly blog titles that drive clicks using your focus keywords.
            This tool generates 10 titles following SEO best practices.
          </p>
        </div>
      </div>
      
      <MetaTitleGenerator onSave={handleSaveTitles} />
    </div>
  );
};

export default MetaTitleGeneratorPage;