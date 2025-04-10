import { ApiConfig, ApiResponse, Provider, ContentGenerationOptions } from './types';
import PerplexityProvider from './providers/perplexity';
import OpenAIProvider from './providers/openai';
import ClaudeProvider from './providers/claude';
import DeepSeekProvider from './providers/deepseek';
import GeminiProvider from './providers/gemini';
import CustomProvider from './providers/custom';
import { MODEL_OPTIONS } from './config';

// Factory function to get the appropriate provider implementation
export const getApiProvider = (provider: Provider) => {
  switch (provider) {
    case 'perplexity':
      return new PerplexityProvider();
    case 'openai':
      return new OpenAIProvider();
    case 'claude':
      return new ClaudeProvider();
    case 'deepseek':
      return new DeepSeekProvider();
    case 'gemini':
      return new GeminiProvider();
    case 'custom':
      return new CustomProvider();
    default:
      throw new Error(`Unknown API provider: ${provider}`);
  }
};

// Test API connection
export const testConnection = async (config: ApiConfig): Promise<ApiResponse> => {
  try {
    // Basic validation
    if (!config.apiKey) {
      return { success: false, error: 'API key is required' };
    }

    if (config.provider === 'custom' && !config.endpoint) {
      return { success: false, error: 'API endpoint is required for custom API' };
    }

    const provider = getApiProvider(config.provider);
    return await provider.testConnection(config);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Generate content using the specified provider
export const generateContent = async (
  config: ApiConfig,
  prompt: string,
  options: ContentGenerationOptions = {}
): Promise<ApiResponse> => {
  try {
    // Basic validation
    if (!config.apiKey) {
      return { success: false, error: 'API key is required' };
    }

    if (config.provider === 'custom' && !config.endpoint) {
      return { success: false, error: 'API endpoint is required for custom API' };
    }

    const provider = getApiProvider(config.provider);
    return await provider.generateContent(config, prompt, options);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred during generation'
    };
  }
};

// Get available models for a provider
export const getModelsForProvider = (provider: Provider) => {
  return MODEL_OPTIONS.filter(model => model.provider === provider);
};

// Get all available providers
export const getProviders = () => {
  return [
    { value: 'perplexity', label: 'Perplexity' },
    { value: 'openai', label: 'OpenAI' },
    { value: 'claude', label: 'Claude' },
    { value: 'deepseek', label: 'DeepSeek' },
    { value: 'gemini', label: 'Gemini' },
    { value: 'custom', label: 'Custom API' }
  ];
};