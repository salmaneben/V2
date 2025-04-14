import React from 'react';
import { ArticleGenerator } from '../features/article-generator';

interface ArticleGeneratorPageProps {
  sidebarState?: string;
}

const ArticleGeneratorPage: React.FC<ArticleGeneratorPageProps> = ({ sidebarState }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className={`
        mx-auto px-4 sm:px-6 lg:px-8
        ${sidebarState === 'expanded' ? 'max-w-5xl' : 'max-w-7xl'}
        transition-all duration-300
      `}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            منشئ المقالات الاحترافي
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500">
            إنشاء مقالات متوافقة مع SEO ومخصصة حسب النيش في خطوات بسيطة
          </p>
        </div>
        
        <ArticleGenerator />
      </div>
    </div>
  );
};

export default ArticleGeneratorPage;