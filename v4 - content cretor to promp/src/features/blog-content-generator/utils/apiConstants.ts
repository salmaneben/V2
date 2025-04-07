// src/features/blog-content-generator/utils/apiConstants.ts
// Re-export constants from the centralized API config
import { 
  API_ENDPOINTS, 
  DEFAULT_MODELS, 
  MODEL_OPTIONS,
  getModelsForProvider,
  getProviders 
} from '@/api';

// Re-export for backward compatibility
export { 
  API_ENDPOINTS, 
  DEFAULT_MODELS,
  MODEL_OPTIONS
};

// Legacy functions for backward compatibility
export const getApiProviderOptions = () => {
  return getProviders();
};

export const getApiModelOptions = (provider: string) => {
  return getModelsForProvider(provider as any);
};