// src/features/blog-content-generator/utils/apiConstants.ts
// Re-export constants from the centralized API config
import { 
  API_ENDPOINTS, 
  DEFAULT_MODELS, 
  MODEL_OPTIONS,
  getModelsForProvider,
  getProviders 
} from '@/api';
import { Provider } from '../types';

// Re-export for backward compatibility
export { 
  API_ENDPOINTS, 
  DEFAULT_MODELS,
  MODEL_OPTIONS
};

// API Configuration function
export const getApiConfig = (provider: Provider = 'perplexity') => {
  let apiKey = '';
  let model = '';
  let endpoint = '';

  switch (provider) {
    case 'perplexity':
      apiKey = localStorage.getItem('perplexity_api_key') || '';
      model = 'llama-3.1-sonar-small-128k-online';
      endpoint = 'https://api.perplexity.ai/chat/completions';
      break;

    case 'openai':
      apiKey = localStorage.getItem('openai_api_key') || '';
      model = localStorage.getItem('openai_model') || 'gpt-4-turbo';
      endpoint = 'https://api.openai.com/v1/chat/completions';
      break;

    case 'claude':
      apiKey = localStorage.getItem('claude_api_key') || '';
      model = localStorage.getItem('claude_model') || 'claude-3-5-sonnet';
      endpoint = 'https://api.anthropic.com/v1/messages';
      break;
      
    case 'deepseek':
      apiKey = localStorage.getItem('deepseek_api_key') || '';
      model = localStorage.getItem('deepseek_model') || 'deepseek-llm-67b-chat';
      endpoint = 'https://api.deepseek.ai/v1/chat/completions';
      break;

    case 'custom':
      apiKey = localStorage.getItem('custom_api_key') || '';
      model = localStorage.getItem('custom_api_model') || '';
      endpoint = localStorage.getItem('custom_api_endpoint') || '';
      break;

    default:
      throw new Error('Invalid provider selected');
  }

  return { apiKey, model, endpoint, provider };
};

// Legacy functions for backward compatibility
export const getApiProviderOptions = () => {
  return getProviders();
};

export const getApiModelOptions = (provider: string) => {
  return getModelsForProvider(provider as any);
};