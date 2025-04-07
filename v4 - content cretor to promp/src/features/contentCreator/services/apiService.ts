// src/features/contentCreator/services/apiService.ts
import { 
  generateContent,
  generateBlogContent,
  generateOutline,
  generateContentFromOutline,
  generateMetaTitle,
  generateMetaDescription,
  generateArticleSchema,
  generateRecipeSchema,
  testConnection,
  getApiConfigFromSettings
} from '@/api';

// Backward compatibility functions

// Test API connection - Bridge for legacy code
export const testApiConnection = async (config: any = {}) => {
  // Convert old config format to new format if needed
  if (!config.provider) {
    return testConnection(getApiConfigFromSettings());
  }
  
  return testConnection({
    provider: config.provider || 'perplexity',
    apiKey: config.apiKey || '',
    model: config.model || '',
    endpoint: config.endpoint || '',
    verifySSL: config.verifySSL !== false
  });
};

// Generate content - Bridge for legacy code
export const generateApiContent = async (prompt: string, options: any = {}) => {
  // Map old options to new format
  return generateContent(getApiConfigFromSettings(), prompt, {
    systemPrompt: options.systemPrompt || options.system,
    temperature: options.temperature,
    maxTokens: options.maxTokens || options.max_tokens
  });
};

// Blog content generation - Bridge for legacy code
export const generateBlogPost = async (content: any, options: any = {}) => {
  return generateBlogContent(content.prompt || content, {
    systemPrompt: options.systemPrompt,
    temperature: options.temperature,
    maxTokens: options.maxTokens
  });
};

// Export all new API functions for gradual migration
export {
  generateContent,
  generateBlogContent,
  generateOutline,
  generateContentFromOutline,
  generateMetaTitle,
  generateMetaDescription,
  generateArticleSchema,
  generateRecipeSchema
} from '@/api';