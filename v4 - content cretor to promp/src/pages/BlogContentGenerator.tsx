// src/pages/BlogContentGenerator.tsx

import React, { useEffect } from 'react';
import { Edit3 } from 'lucide-react';
import { BlogContentGenerator } from '../features/blog-content-generator';
import { incrementStat } from '../lib/appStats';

interface BlogContentGeneratorPageProps {
  sidebarState: string;
}

const BlogContentGeneratorPage: React.FC<BlogContentGeneratorPageProps> = ({ sidebarState }) => {
  useEffect(() => {
    // Update document title
    document.title = 'Blog Content Generator | Content Tool';
    
    // Log page view if you have analytics
    try {
      const statsModule = require('../lib/statsUtils');
      if (statsModule && typeof statsModule.logPageView === 'function') {
        statsModule.logPageView('blog-content-generator');
      }
    } catch (e) {
      console.error('Failed to log page view:', e);
    }
  }, []);

  const handleSaveContent = () => {
    // Increment the usage stat
    incrementStat('blogContentGenerator');
  };

  return (
    <div className={`
      p-4 sm:p-6 transition-all duration-300
      ${sidebarState === 'expanded' ? 'max-w-5xl' : 'max-w-7xl'} 
      mx-auto
    `}>
      <div className="flex items-start mb-8">
        <div className="bg-purple-100 p-4 rounded-lg mr-4">
          <Edit3 className="h-7 w-7 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Blog Content Generator</h1>
          <p className="text-gray-600">
            Create complete blog content from meta titles to detailed posts in one streamlined process.
            Our tool guides you through each step to create SEO-optimized content ready for publishing.
          </p>
        </div>
      </div>
      
      <BlogContentGenerator onSave={handleSaveContent} />
    </div>
  );
};

export default BlogContentGeneratorPage;