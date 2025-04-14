import { EnhancedPromptGeneratorData, PromptGeneratorData } from '../types';
import { buildMasterPrompt } from './promptTemplates';

/**
 * Build a complete prompt from the provided data
 * @param data Enhanced prompt generator data
 * @returns Complete prompt string
 */
export const buildEnhancedPrompt = (data: EnhancedPromptGeneratorData): string => {
  // Use the new master template builder from promptTemplates.ts
  return buildMasterPrompt({
    focusKeyword: data.focusKeyword,
    niche: data.niche,
    promptType: data.promptType,
    promptLevel: data.promptLevel,
    tone: data.tone,
    targetProvider: data.targetProvider,
    articleSize: data.articleSize,
    customWordCount: data.customWordCount,
    hookType: data.hookType,
    hookDetails: data.hookDetails,
    country: data.country,
    language: data.language,
    targetAudience: data.targetAudience,
    seoKeywords: data.seoKeywords,
    longTailKeywords: data.longTailKeywords,
    faqs: data.faqs,
    externalLinks: data.externalLinks,
    internalLinks: data.internalLinks,
    includeStructure: data.includeStructure,
    includeSEO: data.includeSEO,
    includeExamples: data.includeExamples,
    includeFaqs: data.includeFaqs,
    includeKeywords: data.includeKeywords,
    customInstructions: data.customInstructions,
    // New advanced parameters
    serpFeatures: data.serpFeatures,
    primaryIntent: data.primaryIntent,
    secondaryIntent: data.secondaryIntent,
    eeatLevel: data.eeatLevel,
    enableChainOfThought: data.enableChainOfThought,
    chainOfThoughtSteps: data.chainOfThoughtSteps
  });
};

/**
 * Legacy function for backward compatibility
 * @param data Prompt generator data
 * @returns Prompt string
 */
export const buildBasicPrompt = (data: EnhancedPromptGeneratorData): string => {
  return buildEnhancedPrompt(data);
};

/**
 * Original buildPrompt function for backward compatibility
 * This ensures existing components that import buildPrompt continue to work
 * @param data Prompt generator data
 * @returns Prompt string
 */
export const buildPrompt = (data: PromptGeneratorData | EnhancedPromptGeneratorData): string => {
  // Convert legacy data format if needed
  if (!('seoKeywords' in data)) {
    const legacyData = data as PromptGeneratorData;
    const enhancedData: EnhancedPromptGeneratorData = {
      ...legacyData,
      seoKeywords: '',
      longTailKeywords: '',
      targetAudience: '',
      faqs: '',
      externalLinks: '',
      internalLinks: '',
      country: 'United States',
      language: 'English (US)',
      articleSize: 'medium',
      hookType: 'Question',
      hookDetails: '',
      includeFaqs: false,
      includeKeywords: false
    };
    return buildEnhancedPrompt(enhancedData);
  }
  
  // Otherwise use the enhanced builder
  return buildEnhancedPrompt(data as EnhancedPromptGeneratorData);
};