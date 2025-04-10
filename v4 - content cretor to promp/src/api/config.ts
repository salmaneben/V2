import { ApiModelOption } from './types';

// API endpoint constants
export const API_ENDPOINTS = {
  PERPLEXITY: 'https://api.perplexity.ai/chat/completions',
  OPENAI: 'https://api.openai.com/v1/chat/completions',
  CLAUDE: 'https://api.anthropic.com/v1/messages',
  DEEPSEEK: 'https://api.deepseek.com/v1/chat/completions',
  GEMINI: 'https://generativelanguage.googleapis.com/v1beta/models'
};

// Default models for each provider
export const DEFAULT_MODELS = {
  PERPLEXITY: 'llama-3.1-sonar-small-128k-online',
  OPENAI: 'gpt-4-turbo',
  CLAUDE: 'claude-3-5-sonnet',
  DEEPSEEK: 'deepseek-chat',
  GEMINI: 'gemini-2.0-flash'
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
  { label: 'DeepSeek Chat', value: 'deepseek-chat', provider: 'deepseek' },
  { label: 'DeepSeek Reasoner', value: 'deepseek-reasoner', provider: 'deepseek' },
  
  // Gemini models
  { label: 'Gemini 2.0 Flash', value: 'gemini-2.0-flash', provider: 'gemini' },
  { label: 'Gemini 2.0 Pro', value: 'gemini-2.0-pro', provider: 'gemini' },
  { label: 'Gemini 1.5 Pro', value: 'gemini-1.5-pro', provider: 'gemini' },
  { label: 'Gemini 1.5 Flash', value: 'gemini-1.5-flash', provider: 'gemini' },
];