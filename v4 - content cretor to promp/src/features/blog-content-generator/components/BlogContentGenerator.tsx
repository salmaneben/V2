// src/features/blog-content-generator/components/BlogContentGenerator.tsx

import React, { useState, useEffect } from 'react';
import { MetaTitleStep } from './MetaTitleStep';
import { MetaDescriptionStep } from './MetaDescriptionStep';
import { ContentSettingsStep } from './ContentSettingsStep';
import { ContentStep } from './ContentStep';
import { ArticleGenerationStep } from './ArticleGenerationStep';
import { SchemaMarkupStep } from './SchemaMarkupStep';
import { StepIndicator } from './StepIndicator';

interface BlogContentGeneratorProps {
  initialStep?: number;
  onSave?: () => void;
}

export const BlogContentGenerator: React.FC<BlogContentGeneratorProps> = ({ 
  initialStep = 1,
  onSave
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [data, setData] = useState<any>({
    focusKeyword: '',
    relatedTerm: '',
    selectedTitle: '',
    metaDescription: '',
    content: '',
    generatedTitles: [],
    generatedDescriptions: [],
    apiSettings: null,
    contentSettings: {
      wordCount: 'medium',
      tone: 'Professional',
      textReadability: '8th & 9th grade',
      includeConclusion: true,
      includeTables: true,
      includeH3: true,
      includeLists: true,
      includeItalics: false,
      includeQuotes: false,
      includeBold: true,
      includeKeyTakeaways: true,
      includeFAQs: true
    },
    seoSettings: {
      seoKeywords: '',
      longTailKeywords: '',
      internalLinkingWebsite: '',
      externalLinkType: ''
    },
    schemaMarkup: '',
    generatedArticle: '' // Add this for storing the full generated article
  });

  // Update completed steps based on data
  useEffect(() => {
    const newCompletedSteps = [];
    
    // Check step 1 - Meta Title
    if (data.selectedTitle) {
      newCompletedSteps.push(1);
    }
    
    // Check step 2 - Meta Description
    if (data.metaDescription) {
      newCompletedSteps.push(2);
    }
    
    // Step 3 - Content Settings is always considered completed once visited
    if (completedSteps.includes(3)) {
      newCompletedSteps.push(3);
    }
    
    // Check step 4 - Content
    if (data.content) {
      newCompletedSteps.push(4);
    }
    
    // Check step 5 - Full Article
    if (data.generatedArticle) {
      newCompletedSteps.push(5);
    }
    
    // Check step 6 - Schema Markup
    if (data.schemaMarkup) {
      newCompletedSteps.push(6);
    }
    
    // Only update if the array has changed
    if (JSON.stringify(newCompletedSteps) !== JSON.stringify(completedSteps)) {
      setCompletedSteps(newCompletedSteps);
    }
  }, [data]);

  // Trigger onSave when content or schema is generated
  useEffect(() => {
    // Call onSave only when generatedArticle is first set
    if (data.generatedArticle && onSave && !completedSteps.includes(5)) {
      // Call onSave when content is generated
      onSave();
      // Also dispatch a custom event for tracking
      document.dispatchEvent(new CustomEvent('content-saved'));
    }
  }, [data.generatedArticle, completedSteps, onSave]);

  // Update data and local storage for persistence
  const updateData = (newData: Partial<typeof data>) => {
    // Update state
    setData(prevData => {
      const updatedData = {
        ...prevData,
        ...newData
      };
      
      // Persist to localStorage
      try {
        localStorage.setItem('blogContentGeneratorData', JSON.stringify(updatedData));
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      }
      
      return updatedData;
    });
  };

  // Load saved data from localStorage on initial mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('blogContentGeneratorData');
      if (savedData) {
        setData(JSON.parse(savedData));
      }
    } catch (e) {
      console.error('Failed to load from localStorage:', e);
    }
  }, []);

  const handleNextStep = () => {
    // Add current step to completed steps if not already there
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleStepClick = (step: number) => {
    // Only allow clicking on completed steps or the next available step
    if (completedSteps.includes(step) || step === currentStep || step === currentStep + 1) {
      setCurrentStep(step);
    }
  };

  // Define steps titles
  const steps = [
    "Meta Title",
    "Meta Description",
    "Content Settings",
    "Content",
    "Full Article",
    "Schema Markup"
  ];

  // Render the appropriate step component based on currentStep
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <MetaTitleStep 
          data={data} 
          updateData={updateData} 
          onNextStep={handleNextStep} 
        />;
      case 2:
        return <MetaDescriptionStep 
          data={data} 
          updateData={updateData} 
          onNextStep={handleNextStep} 
          onPrevStep={handlePrevStep}
        />;
      case 3:
        return <ContentSettingsStep 
          data={data} 
          updateData={updateData} 
          onNextStep={handleNextStep} 
          onPrevStep={handlePrevStep}
        />;
      case 4:
        return <ContentStep 
          data={data} 
          updateData={updateData} 
          onNextStep={handleNextStep} 
          onPrevStep={handlePrevStep}
        />;
      case 5:
        return <ArticleGenerationStep 
          data={data} 
          updateData={updateData} 
          onNextStep={handleNextStep} 
          onPrevStep={handlePrevStep}
        />;
      case 6:
        return <SchemaMarkupStep 
          data={data} 
          updateData={updateData} 
          onPrevStep={handlePrevStep}
        />;
      default:
        return <MetaTitleStep 
          data={data} 
          updateData={updateData} 
          onNextStep={handleNextStep} 
        />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Pass completedSteps to StepIndicator */}
      <StepIndicator 
        steps={steps}
        currentStep={currentStep}
        onStepClick={handleStepClick}
        completedSteps={completedSteps}
      />
      
      <div className="mt-8">
        {renderStep()}
      </div>
    </div>
  );
};