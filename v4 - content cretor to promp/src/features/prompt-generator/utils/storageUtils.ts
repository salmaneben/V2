import { PromptGeneratorData, EnhancedPromptGeneratorData } from '../types';

// Original storage key
const STORAGE_KEY = 'promptGeneratorData';
// New enhanced storage key
const ENHANCED_STORAGE_KEY = 'enhanced-prompt-generator-data';

// ===== ORIGINAL FUNCTIONS (KEPT FOR BACKWARD COMPATIBILITY) =====

/**
 * Saves prompt generator data to localStorage
 * @param data The prompt generator data to save
 */
export const savePromptData = (data: PromptGeneratorData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving prompt data:', err);
  }
};

/**
 * Loads prompt generator data from localStorage
 * @returns The saved prompt generator data or null if none exists
 */
export const loadPromptData = (): PromptGeneratorData | null => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      return JSON.parse(savedData);
    }
    return null;
  } catch (err) {
    console.error('Error loading saved prompt data:', err);
    return null;
  }
};

/**
 * Clears saved prompt generator data from localStorage
 */
export const clearPromptData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing prompt data:', err);
  }
};

/**
 * Gets the default prompt generator data
 * @returns Default prompt generator data
 */
export const getDefaultPromptData = (): PromptGeneratorData => {
  return {
    focusKeyword: '',
    niche: 'recipes',
    promptType: 'article',
    promptLevel: 'intermediate',
    targetProvider: 'any',
    tone: 'professional',
    includeStructure: true,
    includeSEO: true,
    includeExamples: false,
    customInstructions: '',
    generatedPrompt: ''
  };
};

// ===== NEW GENERALIZED FUNCTIONS =====

/**
 * Save data to localStorage with specified key
 * @param key Storage key
 * @param data Data to save
 */
export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Load data from localStorage with specified key
 * @param key Storage key
 * @returns Parsed data or null if not found
 */
export const loadFromLocalStorage = <T>(key: string): T | null => {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return null;
    }
    return JSON.parse(serializedData) as T;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

/**
 * Gets the default enhanced prompt generator data
 * @returns Default enhanced prompt generator data
 */
export const getDefaultEnhancedPromptData = (): EnhancedPromptGeneratorData => {
  return {
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
    
    // Custom settings
    customInstructions: '',
    
    // Generated content
    generatedPrompt: ''
  };
};