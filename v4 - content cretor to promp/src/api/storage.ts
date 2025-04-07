import { ApiConfig, Provider } from './types';
import { DEFAULT_MODELS } from './config';

// Get API key for a specific provider
export const getApiKey = (provider: Provider): string => {
  return localStorage.getItem(`${provider}_api_key`) || '';
};

// Set API key for a specific provider
export const setApiKey = (provider: Provider, key: string): void => {
  localStorage.setItem(`${provider}_api_key`, key);
  
  // If this is the preferred provider, also set as global key for backward compatibility
  if (provider === getPreferredProvider()) {
    localStorage.setItem('api_key', key);
  }
};

// Get the preferred provider
export const getPreferredProvider = (): Provider => {
  return (localStorage.getItem('preferred_provider') as Provider) || 'perplexity';
};

// Set the preferred provider
export const setPreferredProvider = (provider: Provider): void => {
  localStorage.setItem('preferred_provider', provider);
};

// Get the model for a specific provider
export const getModelForProvider = (provider: Provider): string => {
  const model = localStorage.getItem(`${provider}_model`);
  
  if (model) {
    return model;
  }
  
  // Return default model if not set
  switch (provider) {
    case 'perplexity':
      return DEFAULT_MODELS.PERPLEXITY;
    case 'openai':
      return DEFAULT_MODELS.OPENAI;
    case 'claude':
      return DEFAULT_MODELS.CLAUDE;
    case 'deepseek':
      return DEFAULT_MODELS.DEEPSEEK;
    case 'custom':
      return localStorage.getItem('custom_api_model') || '';
    default:
      return '';
  }
};

// Set the model for a specific provider
export const setModelForProvider = (provider: Provider, model: string): void => {
  localStorage.setItem(`${provider}_model`, model);
};

// Get custom API settings
export const getCustomApiSettings = () => {
  return {
    endpoint: localStorage.getItem('custom_api_endpoint') || '',
    apiKey: localStorage.getItem('custom_api_key') || '',
    model: localStorage.getItem('custom_api_model') || '',
    verifySSL: localStorage.getItem('custom_api_verify') !== 'false',
  };
};

// Set custom API settings
export const setCustomApiSettings = (settings: {
  endpoint: string;
  apiKey: string;
  model: string;
  verifySSL: boolean;
}): void => {
  localStorage.setItem('custom_api_endpoint', settings.endpoint);
  localStorage.setItem('custom_api_key', settings.apiKey);
  localStorage.setItem('custom_api_model', settings.model);
  localStorage.setItem('custom_api_verify', settings.verifySSL.toString());
};

import { MODEL_OPTIONS } from './config';

// Get available models for a provider
export const getModelsForProvider = (provider: Provider): ApiModelOption[] => {
  return MODEL_OPTIONS.filter(model => model.provider === provider);
};

// Get complete API configuration for a provider
export const getApiConfig = (provider: Provider): ApiConfig => {
  const config: ApiConfig = {
    provider,
    apiKey: getApiKey(provider),
    model: getModelForProvider(provider)
  };
  
  if (provider === 'custom') {
    const customSettings = getCustomApiSettings();
    config.endpoint = customSettings.endpoint;
    config.verifySSL = customSettings.verifySSL;
  }
  
  return config;
};

// Get API configuration based on user settings (for backward compatibility)
export const getApiConfigFromSettings = (): ApiConfig => {
  const provider = getPreferredProvider();
  return getApiConfig(provider);
};