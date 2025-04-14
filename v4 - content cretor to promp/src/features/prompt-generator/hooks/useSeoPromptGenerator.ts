import { useState, useEffect, useCallback } from 'react';
import { 
  EnhancedPromptGeneratorData, 
  UseSeoPromptGeneratorProps,
  SerptFeatureType,
  UserIntentType,
  EeatSignalLevel
} from '../types';
import { buildEnhancedPrompt } from '../utils/promptBuilder';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/storageUtils';

// Initial state with sensible defaults
const initialFormData: EnhancedPromptGeneratorData = {
  // Basic info
  focusKeyword: '',
  
  // Content parameters
  niche: 'technology',
  promptType: 'article',
  promptLevel: 'intermediate',
  targetProvider: 'any',
  tone: 'Professional',
  
  // SEO parameters
  seoKeywords: '',
  longTailKeywords: '',
  targetAudience: '',
  faqs: '',
  externalLinks: '',
  internalLinks: '',
  
  // Locale parameters
  country: 'United States',
  language: 'English (US)',
  
  // Structure parameters
  articleSize: 'medium',
  hookType: 'Question',
  hookDetails: '',
  
  // Feature flags
  includeStructure: true,
  includeSEO: true,
  includeExamples: true,
  includeFaqs: false,
  includeKeywords: true,
  
  // Advanced SEO features
  serpFeatures: [],
  primaryIntent: undefined,
  secondaryIntent: undefined,
  eeatLevel: undefined,
  
  // Advanced content features
  enableChainOfThought: false,
  chainOfThoughtSteps: 3,
  
  // Custom settings
  customInstructions: '',
  
  // Generated content
  generatedPrompt: ''
};

// Storage key for localStorage
const STORAGE_KEY = 'enhanced-prompt-generator-data';

export const useSeoPromptGenerator = (props?: UseSeoPromptGeneratorProps) => {
  const { apiConfig, onError } = props || {};
  
  // Load saved data from localStorage if available
  const savedData = loadFromLocalStorage<EnhancedPromptGeneratorData>(STORAGE_KEY);
  
  // State management
  const [formData, setFormData] = useState<EnhancedPromptGeneratorData>(
    savedData || initialFormData
  );
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Reset the "copied" state after 2 seconds
  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);
  
  // Effect to ensure default language matches the country
  useEffect(() => {
    if (formData.country) {
      // This is a simplified example - would need more robust mapping in production
      let defaultLanguage = 'English (US)';
      
      switch (formData.country) {
        case 'United States':
          defaultLanguage = 'English (US)';
          break;
        case 'United Kingdom':
          defaultLanguage = 'English (UK)';
          break;
        case 'France':
          defaultLanguage = 'French';
          break;
        case 'Germany':
          defaultLanguage = 'German';
          break;
        case 'Spain':
          defaultLanguage = 'Spanish';
          break;
        // Add more cases as needed
      }
      
      // Only update if language isn't already set
      if (!formData.language) {
        setFormData(prev => ({
          ...prev,
          language: defaultLanguage
        }));
      }
    }
  }, [formData.country]);
  
  // Generate the prompt
  const generatePrompt = useCallback(() => {
    setIsGeneratingPrompt(true);
    setError(null);
    
    try {
      // Build the prompt using the enhanced builder
      const generatedPrompt = buildEnhancedPrompt(formData);
      
      // Update state with the generated prompt
      setFormData(prev => ({
        ...prev,
        generatedPrompt
      }));
      
      // Save to localStorage
      saveToLocalStorage(STORAGE_KEY, {
        ...formData,
        generatedPrompt
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate prompt';
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsGeneratingPrompt(false);
    }
  }, [formData, onError]);
  
  // Copy the generated prompt to clipboard
  const copyPrompt = useCallback(() => {
    if (formData.generatedPrompt) {
      navigator.clipboard.writeText(formData.generatedPrompt)
        .then(() => {
          setIsCopied(true);
        })
        .catch(err => {
          setError('Failed to copy prompt to clipboard');
          if (onError) {
            onError('Failed to copy prompt to clipboard');
          }
        });
    }
  }, [formData.generatedPrompt, onError]);
  
  // Save current state to localStorage
  const savePrompt = useCallback(() => {
    saveToLocalStorage(STORAGE_KEY, formData);
    // Could add a success message here
  }, [formData]);
  
  // Load saved state from localStorage
  const loadPrompt = useCallback(() => {
    const saved = loadFromLocalStorage<EnhancedPromptGeneratorData>(STORAGE_KEY);
    if (saved) {
      setFormData(saved);
    } else {
      setError('No saved prompt found');
      if (onError) {
        onError('No saved prompt found');
      }
    }
  }, [onError]);
  
  // Reset form to initial state
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
  }, []);
  
  // API integration for generating SEO keywords (if needed)
  const generateSeoKeywords = useCallback(async (): Promise<boolean> => {
    // This would connect to an API in a real implementation
    // For now, we'll just return a mock response
    
    if (!formData.focusKeyword) {
      setError('Focus keyword is required to generate SEO keywords');
      if (onError) {
        onError('Focus keyword is required to generate SEO keywords');
      }
      return false;
    }
    
    setIsGeneratingKeywords(true);
    setError(null);
    
    try {
      // Mock API call - replace with actual API integration if available
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Sample keywords based on focus keyword
      const mockSecondaryKeywords = `${formData.focusKeyword} best practices
${formData.focusKeyword} examples
${formData.focusKeyword} benefits
${formData.focusKeyword} vs alternatives
${formData.focusKeyword} techniques`;
      
      const mockLongTailKeywords = `how to use ${formData.focusKeyword} effectively
best ${formData.focusKeyword} tools for beginners
why is ${formData.focusKeyword} important for businesses
when to implement ${formData.focusKeyword} strategy
top ${formData.focusKeyword} trends in 2025`;
      
      // Update state with the generated keywords
      setFormData(prev => ({
        ...prev,
        seoKeywords: mockSecondaryKeywords,
        longTailKeywords: mockLongTailKeywords
      }));
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate SEO keywords';
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
      
      return false;
    } finally {
      setIsGeneratingKeywords(false);
    }
  }, [formData.focusKeyword, onError]);
  
  // Generate sample FAQs
  const generateFaqs = useCallback(async (): Promise<boolean> => {
    if (!formData.focusKeyword) {
      setError('Focus keyword is required to generate FAQs');
      if (onError) {
        onError('Focus keyword is required to generate FAQs');
      }
      return false;
    }
    
    // Mock API call - replace with actual API integration if available
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Sample FAQs based on focus keyword
    const mockFaqs = `Q1: What is ${formData.focusKeyword}?
A1: ${formData.focusKeyword} is a powerful approach that helps businesses improve their performance by focusing on key metrics and optimization strategies.

Q2: How does ${formData.focusKeyword} work?
A2: ${formData.focusKeyword} works by analyzing user behavior, optimizing content structure, and implementing best practices tailored to your specific goals and audience.

Q3: What are the benefits of ${formData.focusKeyword}?
A3: The key benefits include improved visibility, higher engagement, better conversion rates, and stronger long-term growth in your target market.

Q4: How much does implementing ${formData.focusKeyword} typically cost?
A4: Costs vary widely depending on scope and complexity, ranging from basic implementations to comprehensive enterprise solutions with ongoing optimization.

Q5: How long does it take to see results from ${formData.focusKeyword}?
A5: Initial results are often visible within 1-3 months, with significant improvements typically appearing around the 6-month mark when implemented correctly.`;
    
    // Update state with the generated FAQs
    setFormData(prev => ({
      ...prev,
      faqs: mockFaqs
    }));
    
    return true;
  }, [formData.focusKeyword, onError]);
  
  return {
    formData,
    setFormData,
    isGeneratingPrompt,
    isGeneratingKeywords,
    isCopied,
    error,
    generatePrompt,
    copyPrompt,
    savePrompt,
    loadPrompt,
    resetForm,
    generateSeoKeywords,
    generateFaqs
  };
};

export default useSeoPromptGenerator;