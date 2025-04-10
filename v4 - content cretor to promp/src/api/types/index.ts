// Update the Provider type to include 'gemini'
export type Provider = 'perplexity' | 'openai' | 'claude' | 'deepseek' | 'gemini' | 'custom';

export interface ApiConfig {
  provider: Provider;
  apiKey: string;
  model?: string;
  endpoint?: string;
  verifySSL?: boolean;
}

export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface ApiMessageContent {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ContentGenerationOptions {
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ApiProviderInterface {
  testConnection(config: ApiConfig): Promise<ApiResponse>;
  generateContent(config: ApiConfig, prompt: string, options?: ContentGenerationOptions): Promise<ApiResponse>;
  formatMessages(systemPrompt: string | undefined, userPrompt: string): ApiMessageContent[];
  parseResponse(data: any): string;
}

export interface ApiModelOption {
  value: string;
  label: string;
  provider: Provider;
}

// Add more specific request/response types as needed for different services