// src/features/blog-content-generator/utils/apiConstants.ts

/**
 * API endpoint constants for various LLM providers
 * Centralized to ensure consistency across the application
 */
export const API_ENDPOINTS = {
    PERPLEXITY: 'https://api.perplexity.ai/v2/chat/completions',
    OPENAI: 'https://api.openai.com/v1/chat/completions',
    CLAUDE: 'https://api.anthropic.com/v1/messages',
    DEEPSEEK: 'https://api.deepseek.ai/v1/chat/completions'
  };
  
  /**
   * Default models for each provider
   */
  export const DEFAULT_MODELS = {
    PERPLEXITY: 'llama-3.1-sonar-small-128k-online',
    OPENAI: 'gpt-4o',
    CLAUDE: 'claude-3-5-sonnet',
    DEEPSEEK: 'deepseek-llm-67b-chat'
  };
  
  /**
   * Get API configuration based on provider
   * @param provider The LLM provider name
   * @returns Configuration object with apiKey, model, and endpoint
   */
  export function getApiConfig(provider: string) {
    let apiKey = '';
    let model = '';
    let endpoint = '';
  
    switch (provider) {
      case 'perplexity':
        apiKey = localStorage.getItem('perplexity_api_key') || '';
        model = localStorage.getItem('perplexity_model') || DEFAULT_MODELS.PERPLEXITY;
        endpoint = API_ENDPOINTS.PERPLEXITY;
        break;
  
      case 'openai':
        apiKey = localStorage.getItem('openai_api_key') || '';
        model = localStorage.getItem('openai_model') || DEFAULT_MODELS.OPENAI;
        endpoint = API_ENDPOINTS.OPENAI;
        break;
  
      case 'claude':
        apiKey = localStorage.getItem('claude_api_key') || '';
        model = localStorage.getItem('claude_model') || DEFAULT_MODELS.CLAUDE;
        endpoint = API_ENDPOINTS.CLAUDE;
        break;
        
      case 'deepseek':
        apiKey = localStorage.getItem('deepseek_api_key') || '';
        model = localStorage.getItem('deepseek_model') || DEFAULT_MODELS.DEEPSEEK;
        endpoint = API_ENDPOINTS.DEEPSEEK;
        break;
  
      case 'custom':
        apiKey = localStorage.getItem('custom_api_key') || '';
        model = localStorage.getItem('custom_api_model') || '';
        endpoint = localStorage.getItem('custom_api_endpoint') || '';
        break;
  
      default:
        console.warn(`Unknown provider: ${provider}, defaulting to Perplexity`);
        apiKey = localStorage.getItem('perplexity_api_key') || '';
        model = DEFAULT_MODELS.PERPLEXITY;
        endpoint = API_ENDPOINTS.PERPLEXITY;
    }
  
    return { apiKey, model, endpoint, provider };
  }