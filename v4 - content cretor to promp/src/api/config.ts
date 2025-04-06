import { ApiModelOption } from './types';

// API endpoint constants
export const API_ENDPOINTS = {
  PERPLEXITY: 'https://api.perplexity.ai/chat/completions',
  OPENAI: 'https://api.openai.com/v1/chat/completions',
  CLAUDE: 'https://api.anthropic.com/v1/messages',
  DEEPSEEK: 'https://api.deepseek.ai/v1/chat/completions'
};

// Default models for each provider
export const DEFAULT_MODELS = {
  PERPLEXITY: 'llama-3.1-sonar-small-128k-online',
  OPENAI: 'gpt-4o',
  CLAUDE: 'claude-3-5-sonnet',
  DEEPSEEK: 'deepseek-llm-67b-chat'
};

// Default request timeout in milliseconds
export const DEFAULT_TIMEOUT = 60000;

// Default max retries for failed requests
export const MAX_RETRIES = 2;

// Available model options by provider
export const MODEL_OPTIONS: ApiModelOption[] = [
  // Perplexity models
  { label: 'Llama 3.1 Sonar Small 128K', value: 'llama-3.1-sonar-small-128k-online', provider: 'perplexity' },
  { label: 'Llama 3.1 Sonar Medium 128K', value: 'llama-3.1-sonar-medium-128k-online', provider: 'perplexity' },
  { label: 'Sonar Small Online', value: 'sonar-small-online', provider: 'perplexity' },
  { label: 'Sonar Medium Online', value: 'sonar-medium-online', provider: 'perplexity' },
  
  // OpenAI models
  { label: 'GPT-4o', value: 'gpt-4o', provider: 'openai' },
  { label: 'GPT-4o Mini', value: 'gpt-4o-mini', provider: 'openai' },
  { label: 'GPT-4 Turbo', value: 'gpt-4-turbo', provider: 'openai' },
  { label: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo', provider: 'openai' },
  
  // Claude models
  { label: 'Claude 3.5 Sonnet', value: 'claude-3-5-sonnet', provider: 'claude' },
  { label: 'Claude 3 Opus', value: 'claude-3-opus', provider: 'claude' },
  { label: 'Claude 3 Sonnet', value: 'claude-3-sonnet', provider: 'claude' },
  { label: 'Claude 3 Haiku', value: 'claude-3-haiku', provider: 'claude' },
  
  // DeepSeek models
  { label: 'DeepSeek LLM 67B Chat', value: 'deepseek-llm-67b-chat', provider: 'deepseek' },
  { label: 'DeepSeek Coder 33B', value: 'deepseek-coder-33b-instruct', provider: 'deepseek' },
  { label: 'DeepSeek Math 7B', value: 'deepseek-math-7b-instruct', provider: 'deepseek' },
  { label: 'DeepSeek LLM 7B Chat', value: 'deepseek-llm-7b-chat', provider: 'deepseek' },
];