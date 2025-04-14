import React from 'react';
import PromptGeneratorComponent from '../features/prompt-generator';

interface PromptGeneratorPageProps {
  sidebarState: string;
}

const PromptGeneratorPage: React.FC<PromptGeneratorPageProps> = ({ sidebarState }) => {
  return (
    <div className={`
      p-6 transition-all duration-300
      ${sidebarState === 'expanded' ? 'max-w-5xl' : 'max-w-7xl'} 
      mx-auto
    `}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">
          Prompt Generator
        </h1>
        <p className="text-purple-600/70 mt-1 font-medium">
          Create powerful, structured prompts for any AI service
        </p>
      </div>
      
      <PromptGeneratorComponent />
    </div>
  );
};

export default PromptGeneratorPage;