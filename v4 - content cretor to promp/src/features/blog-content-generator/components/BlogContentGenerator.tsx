import React, { useState, useEffect } from 'react';
// Import necessary step components
import { MetaTitleStep } from './MetaTitleStep';
import { MetaDescriptionStep } from './MetaDescriptionStep';
import { ContentSettingsStep } from './ContentSettingsStep';
import { ContentStep } from './ContentStep';
import { ArticleGenerationStep } from './ArticleGenerationStep';
// REMOVED: SchemaMarkupStep import is no longer needed
// import { SchemaMarkupStep } from './SchemaMarkupStep'; 
import { StepIndicator } from './StepIndicator';

// Define proper interfaces for better type safety
interface ContentSettings {
  wordCount: 'short' | 'medium' | 'long';
  tone: string;
  textReadability: string;
  includeConclusion: boolean;
  includeTables: boolean;
  includeH3: boolean;
  includeLists: boolean;
  includeItalics: boolean;
  includeQuotes: boolean;
  includeBold: boolean;
  includeKeyTakeaways: boolean;
  includeFAQs: boolean;
}

interface SeoSettings {
  seoKeywords: string;
  longTailKeywords: string;
  internalLinkingWebsite: string;
  externalLinkType: string;
}

interface ApiSettings {
  provider: string;
  model: string;
  keyStatus: 'valid' | 'invalid' | 'unverified';
  [key: string]: any; // For any additional settings
}

interface BlogGeneratorData {
  focusKeyword: string;
  relatedTerm: string;
  selectedTitle: string;
  metaDescription: string;
  content: string;
  generatedTitles: string[];
  generatedDescriptions: string[];
  apiSettings: ApiSettings | null;
  contentSettings: ContentSettings;
  seoSettings: SeoSettings;
  generatedArticle: string;
  version?: string; // For future migrations
}

interface BlogContentGeneratorProps {
  initialStep?: number;
  onSave?: () => void; // Optional callback when final content is ready
}

// Main component managing the blog content generation workflow
export const BlogContentGenerator: React.FC<BlogContentGeneratorProps> = ({ 
  initialStep = 1, // Default to starting at step 1
  onSave 
}) => {
  // State for the current active step
  const [currentStep, setCurrentStep] = useState(initialStep);
  // State to track which steps have been successfully completed
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  // State to hold all the data gathered and generated across steps
  const [data, setData] = useState<BlogGeneratorData>({
    focusKeyword: '',
    relatedTerm: '',
    selectedTitle: '',
    metaDescription: '',
    content: '', // Content generated in ContentStep (might be partial or full depending on flow)
    generatedTitles: [],
    generatedDescriptions: [],
    apiSettings: null, // Stores API provider, model, key status etc.
    // Default content structure settings
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
    // Default SEO related settings
    seoSettings: {
      seoKeywords: '',
      longTailKeywords: '',
      internalLinkingWebsite: '',
      externalLinkType: ''
    },
    generatedArticle: '', // Stores the final, fully generated article from ArticleGenerationStep
    version: '1.0.0' // For future migrations
  });

  // Create a separate function to determine step completion status
  const calculateCompletedSteps = (): number[] => {
    const newCompletedSteps: number[] = [];
    
    // Step 1 - Meta Title completion: Requires actual data
    if (data.selectedTitle) {
      newCompletedSteps.push(1);
    }
    
    // Step 2 - Meta Description completion: Complete if data exists OR user moved past it
    if (data.metaDescription || currentStep > 2) {
      newCompletedSteps.push(2);
    }
    
    // Step 3 - Content Settings: Complete once visited or passed
    if ((completedSteps.includes(3) || currentStep > 3) && !newCompletedSteps.includes(3)) {
       newCompletedSteps.push(3);
    }
    
    // Step 4 - Content generation: Requires actual content
    if (data.content) {
      newCompletedSteps.push(4);
    }
    
    // Step 5 - Full Article generation: Requires generated article
    if (data.generatedArticle) {
      newCompletedSteps.push(5);
    }
    
    return [...new Set(newCompletedSteps)].sort((a, b) => a - b);
  };

  // Effect to update the list of completed steps based on available data
  useEffect(() => {
    const newCompletedSteps = calculateCompletedSteps();
    
    // Only update state if the array content actually changes to prevent infinite loops
    const sortedOldSteps = [...completedSteps].sort((a, b) => a - b);
    if (JSON.stringify(newCompletedSteps) !== JSON.stringify(sortedOldSteps)) {
      setCompletedSteps(newCompletedSteps);
    }
  }, [data.selectedTitle, data.metaDescription, data.content, data.generatedArticle, currentStep, completedSteps]);

  // Effect to trigger the onSave callback when the final article is generated
  useEffect(() => {
    const isStep5Completed = completedSteps.includes(5);
    const shouldTriggerSave = data.generatedArticle && onSave && isStep5Completed;
    
    if (shouldTriggerSave) {
      // Trigger the save callback
      onSave();
      
      // Dispatch a custom event for potential external listeners (e.g., analytics)
      document.dispatchEvent(new CustomEvent('content-saved', { 
        detail: { timestamp: new Date().toISOString() } 
      }));
    }
  }, [data.generatedArticle, completedSteps, onSave]);

  // Improved localStorage handling with version checking
  const saveDataToLocalStorage = (dataToSave: BlogGeneratorData) => {
    try {
      localStorage.setItem('blogContentGeneratorData', JSON.stringify({
        ...dataToSave,
        lastUpdated: new Date().toISOString()
      }));
    } catch (e) {
      console.error('Failed to save blog generator data to localStorage:', e);
      // Optionally implement fallback storage or notify user
    }
  };

  // Function to update the central data state and persist to localStorage
  const updateData = (newData: Partial<BlogGeneratorData>) => {
    setData(prevData => {
      const updatedData = {
        ...prevData,
        ...newData
      };
      
      // Save the updated data to localStorage for persistence
      saveDataToLocalStorage(updatedData);
      
      return updatedData;
    });
  };

  // Improved localStorage loading with error handling and version checking
  const loadDataFromLocalStorage = () => {
    try {
      const savedData = localStorage.getItem('blogContentGeneratorData');
      if (!savedData) return null;
      
      const parsedData = JSON.parse(savedData) as BlogGeneratorData & { lastUpdated?: string };
      
      // Version checking for future migrations
      if (parsedData.version !== '1.0.0') {
        console.log('Data version mismatch, migration might be needed');
        // Implement data migration logic here if needed
      }
      
      return parsedData;
    } catch (e) {
      console.error('Failed to load blog generator data from localStorage:', e);
      // Clear potentially corrupted data
      localStorage.removeItem('blogContentGeneratorData');
      return null;
    }
  };

  // Effect to load saved data from localStorage when the component mounts
  useEffect(() => {
    const savedData = loadDataFromLocalStorage();
    
    if (savedData) {
      // Update state with the loaded data
      setData(prevData => ({
        ...prevData,
        ...savedData
      }));
      
      // Initialize completedSteps based on loaded data
      const initialCompletedSteps: number[] = [];
      if (savedData.selectedTitle) initialCompletedSteps.push(1);
      if (savedData.metaDescription) initialCompletedSteps.push(2);
      if (savedData.content || savedData.generatedArticle) initialCompletedSteps.push(3); 
      if (savedData.content) initialCompletedSteps.push(4);
      if (savedData.generatedArticle) initialCompletedSteps.push(5);
      
      setCompletedSteps([...new Set(initialCompletedSteps)].sort((a, b) => a - b));
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Handler to move to the next step with unsaved changes warning
  const handleNextStep = () => {
    // Optional: Add unsaved changes warning logic here
    setCurrentStep(prev => prev + 1);
  };

  // Handler to move to the previous step
  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  // Handler for clicking on a step in the StepIndicator
  const handleStepClick = (step: number) => {
    const canNavigateToStep = 
      completedSteps.includes(step) || 
      step === currentStep || 
      (completedSteps.includes(currentStep) && step === currentStep + 1);
    
    if (canNavigateToStep) {
      setCurrentStep(step);
    } else {
      console.warn(`Navigation to step ${step} blocked. Current step ${currentStep} not completed or target step too far ahead.`);
      // Optionally show a user notification here
    }
  };

  // Define the titles for each step in the workflow
  const steps = [
    "Meta Title",       // Step 1
    "Meta Description", // Step 2
    "Content Settings", // Step 3
    "Content",          // Step 4
    "Full Article"      // Step 5 
  ];

  // Function to render the component for the currently active step
  const renderStep = () => {
    const commonProps = {
        data: data,
        updateData: updateData,
        onPrevStep: handlePrevStep // Most steps need a way back
    };

    switch (currentStep) {
      case 1:
        return <MetaTitleStep 
          {...commonProps} 
          onNextStep={handleNextStep} 
          onPrevStep={null} // No previous step from step 1
        />;
      case 2:
        return <MetaDescriptionStep 
          {...commonProps} 
          onNextStep={handleNextStep} 
        />;
      case 3:
        return <ContentSettingsStep 
          {...commonProps} 
          onNextStep={handleNextStep} 
        />;
      case 4:
        return <ContentStep 
          {...commonProps} 
          onNextStep={handleNextStep} 
        />;
      case 5:
        return <ArticleGenerationStep 
          {...commonProps} 
          onNextStep={null} // Indicate this is the last step
        />;
      default:
        // Fallback to the first step if currentStep is invalid
        console.warn(`Invalid step number: ${currentStep}. Defaulting to step 1.`);
        setCurrentStep(1); // Reset to step 1
        return <MetaTitleStep 
            {...commonProps} 
            onNextStep={handleNextStep} 
            onPrevStep={null} 
        />;
    }
  };

  // Main render method for the component
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Render the visual step indicator */}
      <StepIndicator 
        steps={steps}
        currentStep={currentStep}
        onStepClick={handleStepClick}
        completedSteps={completedSteps}
      />
      
      {/* Render the component for the active step */}
      <div className="mt-8 bg-white shadow-md rounded-lg p-6"> 
        {renderStep()}
      </div>
    </div>
  );
};