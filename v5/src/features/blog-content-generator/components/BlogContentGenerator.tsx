// src/features/blog-content-generator/components/BlogContentGenerator.tsx

import React, { useState, useEffect } from 'react';
import { StepIndicator } from './StepIndicator';
import { MetaTitleStep } from './MetaTitleStep';
import { MetaDescriptionStep } from './MetaDescriptionStep';
import { ContentSettingsStep } from './ContentSettingsStep'; // Import ContentSettingsStep, not OutlineStep
import { ContentStep } from './ContentStep';
import { SchemaMarkupStep } from './SchemaMarkupStep';
import { BlogContentGeneratorProps, BlogContentFormData, Provider, ImageSettings, OptInSettings } from '../types';
import { Alert } from '@/components/ui/alert';

export const BlogContentGenerator: React.FC<BlogContentGeneratorProps> = ({ onSave }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [formData, setFormData] = useState<BlogContentFormData>({
    // Common fields
    focusKeyword: '',
    relatedTerm: '',
    provider: localStorage.getItem('preferred_provider') as Provider || 'deepseek',
    
    // Initialize API settings with empty object, will be populated in useEffect
    apiSettings: {},
    
    // Step 1: Meta Title
    selectedTitle: '',
    generatedTitles: [],
    
    // Step 2: Meta Description
    selectedDescription: '',
    generatedDescriptions: [],
    
    // Step 3: Content Settings (replacing Outline)
    outline: '', // Keep this for backward compatibility
    
    // Step 4: Content
    content: '',
    contentLength: 1200,
    targetAudience: '',
    
    // Step 5: Recipe Content (optional)
    isRecipe: false,
    recipeName: '',
    recipeContent: '',
    
    // Step 6: Recipe Schema (optional)
    prepTime: 'PT30M',
    cookTime: 'PT1H',
    totalTime: 'PT1H30M',
    recipeType: 'Main Course',
    cuisine: 'American',
    keywords: '',
    recipeYield: '4 servings',
    calories: '350 calories',
    ingredients: [],
    instructions: [],
    pros: [],
    cons: [],
    schemaMarkup: '',
    
    // Initialize enhanced settings
    imageSettings: {
      numberOfImagePrompts: 5,
      imagePromptStyle: 'detailed',
      imageDistribution: 'balanced',
      customImagePrompts: ''
    },
    
    optInSettings: {
      enableOptIn: false,
      optInText: 'Subscribe to our newsletter for more content like this',
      optInRequired: false,
      optInPlacement: 'bottom',
      optInDesign: 'standard'
    },
    
    // Additional content settings with defaults
    wordCount: 'medium',
    language: 'English (US)',
    country: 'United States',
    tone: 'Professional',
    textReadability: '8th & 9th grade',
    includeConclusion: true,
    includeTables: true,
    includeH3: true,
    includeLists: true,
    includeItalics: false,
    includeQuotes: false,
    includeKeyTakeaways: true,
    includeFAQs: true,
    includeBold: true,
    outputFormat: 'blogPost',
    
    // SEO options
    seoKeywords: '',
    longTailKeywords: '',
    internalLinkingWebsite: '',
    externalLinkType: '',
    faqs: ''
  });
  
  const [error, setError] = useState<string | null>(null);
  
  // Initialize API settings from localStorage
  useEffect(() => {
    const initializeApiSettings = () => {
      // Initialize API settings from localStorage or with defaults
      const apiSettings = {
        titleApiProvider: localStorage.getItem('preferred_provider_titleApiProvider') as Provider || formData.provider || 'deepseek',
        titleApiModel: localStorage.getItem('preferred_model_titleApiModel') || getDefaultModel('titleApiProvider'),
        
        descriptionApiProvider: localStorage.getItem('preferred_provider_descriptionApiProvider') as Provider || formData.provider || 'deepseek',
        descriptionApiModel: localStorage.getItem('preferred_model_descriptionApiModel') || getDefaultModel('descriptionApiProvider'),
        
        // No longer need outlineApiProvider since we removed that step
        seoApiProvider: localStorage.getItem('preferred_provider_seoApiProvider') as Provider || formData.provider || 'deepseek',
        seoApiModel: localStorage.getItem('preferred_model_seoApiModel') || getDefaultModel('seoApiProvider'),
        
        contentApiProvider: localStorage.getItem('preferred_provider_contentApiProvider') as Provider || formData.provider || 'deepseek',
        contentApiModel: localStorage.getItem('preferred_model_contentApiModel') || getDefaultModel('contentApiProvider'),
        
        recipeApiProvider: localStorage.getItem('preferred_provider_recipeApiProvider') as Provider || formData.provider || 'deepseek',
        recipeApiModel: localStorage.getItem('preferred_model_recipeApiModel') || getDefaultModel('recipeApiProvider'),
        
        schemaApiProvider: localStorage.getItem('preferred_provider_schemaApiProvider') as Provider || formData.provider || 'deepseek',
        schemaApiModel: localStorage.getItem('preferred_model_schemaApiModel') || getDefaultModel('schemaApiProvider'),
        
        // Custom API settings
        customApiEndpoint: localStorage.getItem('custom_api_endpoint') || '',
        customApiKey: localStorage.getItem('custom_api_key') || '',
        customApiModel: localStorage.getItem('custom_api_model') || '',
        customApiVerify: localStorage.getItem('custom_api_verify') !== 'false'
      };
      
      // Initialize image settings from localStorage
      let imageSettings: ImageSettings = {
        numberOfImagePrompts: 5,
        imagePromptStyle: 'detailed',
        imageDistribution: 'balanced',
        customImagePrompts: ''
      };
      
      try {
        const savedImageSettings = localStorage.getItem('image_settings');
        if (savedImageSettings) {
          imageSettings = {...imageSettings, ...JSON.parse(savedImageSettings)};
        }
      } catch (e) {
        console.error('Error loading image settings:', e);
      }
      
      // Initialize opt-in settings from localStorage
      let optInSettings: OptInSettings = {
        enableOptIn: false,
        optInText: 'Subscribe to our newsletter for more content like this',
        optInRequired: false,
        optInPlacement: 'bottom',
        optInDesign: 'standard'
      };
      
      try {
        const savedOptInSettings = localStorage.getItem('opt_in_settings');
        if (savedOptInSettings) {
          optInSettings = {...optInSettings, ...JSON.parse(savedOptInSettings)};
        }
      } catch (e) {
        console.error('Error loading opt-in settings:', e);
      }
      
      updateFormData({ 
        apiSettings,
        imageSettings,
        optInSettings
      });
    };
    
    initializeApiSettings();
  }, []);
  
  // Helper function to get default model for a provider
  const getDefaultModel = (providerId: string): string => {
    const provider = localStorage.getItem(`preferred_provider_${providerId}`) as Provider || formData.provider || 'deepseek';
    
    switch (provider) {
      case 'openai': return 'gpt-4';
      case 'claude': return 'claude-3-sonnet-20240229';
      case 'perplexity': return 'llama-3.1-sonar-small-128k-online';
      case 'deepseek': return 'deepseek-chat';
      case 'custom': return localStorage.getItem('custom_api_model') || '';
      default: return '';
    }
  };
  
  // Save preferred provider to localStorage
  useEffect(() => {
    if (formData.provider) {
      localStorage.setItem('preferred_provider', formData.provider);
    }
  }, [formData.provider]);

  // Update form data
  const updateFormData = (newData: Partial<BlogContentFormData>) => {
    setFormData(prev => {
      const updated = { ...prev, ...newData };
      
      // When updating image settings, save to localStorage
      if (newData.imageSettings) {
        localStorage.setItem('image_settings', JSON.stringify({
          ...prev.imageSettings,
          ...newData.imageSettings
        }));
      }
      
      // When updating opt-in settings, save to localStorage
      if (newData.optInSettings) {
        localStorage.setItem('opt_in_settings', JSON.stringify({
          ...prev.optInSettings,
          ...newData.optInSettings
        }));
      }
      
      return updated;
    });
  };

  // Navigate to next step
  const handleNextStep = () => {
    console.log("handleNextStep called, current step:", currentStep);
    
    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }
    
    // Calculate next step
    const totalSteps = formData.isRecipe ? 4 : 3; // Reduced by 1 since we removed Outline
    const nextStep = currentStep + 1;
    
    console.log("Moving to step:", nextStep);
    
    // Check if we're at the end
    if (nextStep >= totalSteps) {
      console.log("Reached the end of steps");
      // We're done, maybe call onSave callback
      if (onSave) {
        onSave(formData);
      }
      return;
    }
    
    // Set the next step
    setCurrentStep(nextStep);
  };

  // Navigate to previous step
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Jump to a specific step (only if completed or current)
  const handleStepClick = (step: number) => {
    if (completedSteps.includes(step) || step <= currentStep) {
      setCurrentStep(step);
    }
  };

  // Get total number of steps based on whether it's a recipe or not
  const getTotalSteps = () => formData.isRecipe ? 4 : 3; // Reduced by 1 due to Outline removal

  // Render the current step
  const renderCurrentStep = () => {
    console.log("Rendering step:", currentStep);
    switch (currentStep) {
      case 0:
        return (
          <MetaTitleStep 
            data={formData} 
            updateData={updateFormData} 
            onNextStep={handleNextStep} 
          />
        );
      case 1:
        return (
          <MetaDescriptionStep 
            data={formData} 
            updateData={updateFormData} 
            onNextStep={handleNextStep} 
            onPrevStep={handlePrevStep}
          />
        );
      case 2:
        return (
          <ContentSettingsStep // Using ContentSettingsStep instead of OutlineStep
            data={formData} 
            updateData={updateFormData} 
            onNextStep={handleNextStep} 
            onPrevStep={handlePrevStep}
          />
        );
      case 3:
        return (
          <ContentStep 
            data={formData} 
            updateData={updateFormData} 
            onNextStep={handleNextStep} 
            onPrevStep={handlePrevStep}
          />
        );
      case 4:
        if (formData.isRecipe) {
          return (
            <SchemaMarkupStep 
              data={formData} 
              updateData={updateFormData} 
              onNextStep={handleNextStep} 
              onPrevStep={handlePrevStep}
            />
          );
        }
        return null;
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive" className="mb-4">
          {error}
        </Alert>
      )}
      
      <StepIndicator 
        currentStep={currentStep} 
        totalSteps={getTotalSteps()} 
        isRecipe={formData.isRecipe}
        onStepClick={handleStepClick}
        completedSteps={completedSteps}
      />
      
      {renderCurrentStep()}
    </div>
  );
};