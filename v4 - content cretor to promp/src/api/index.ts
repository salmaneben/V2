// src/api/index.ts
// Core client exports
export { 
  testConnection,
  generateContent,
  getApiProvider,
  getModelsForProvider,
  getProviders
} from './client';

// Storage exports
export {
  getApiKey,
  setApiKey,
  getPreferredProvider,
  setPreferredProvider,
  getModelForProvider,
  setModelForProvider,
  getCustomApiSettings,
  setCustomApiSettings,
  getApiConfig,
  getApiConfigFromSettings
} from './storage';

// Content service exports
export {
  generateBlogContent,
  generateOutline,
  generateContentFromOutline
} from './services/content';

// Metadata service exports
export {
  generateMetaTitle,
  generateMetaDescription
} from './services/metadata';

// Outline service exports
export {
  generateOutline as generateArticleOutline,
  generateSectionContent
} from './services/outline';

// Schema service exports
export {
  generateArticleSchema,
  generateRecipeSchema
} from './services/schema';

// Hook exports
export { useApiConnection } from './hooks/useApiConnection';
export { useContentGeneration } from './hooks/useContentGeneration';

// Type exports
export type {
  Provider,
  ApiConfig,
  ApiResponse,
  ApiMessageContent,
  ContentGenerationOptions,
  ApiProviderInterface,
  ApiModelOption
} from './types';

// Config exports
export { API_ENDPOINTS, DEFAULT_MODELS, MODEL_OPTIONS } from './config';