import EnhancedPromptGenerator from './components/EnhancedPromptGenerator';

// Re-export the enhanced generator as the default export
export default EnhancedPromptGenerator;

// Also export other components for potential direct usage
export * from './components';
export * from './hooks/useSeoPromptGenerator';
export * from './types';

// Re-export utility functions that might be useful externally
export { buildEnhancedPrompt } from './utils/promptBuilder';
export { ARTICLE_SIZES } from './constants/articleSizes';