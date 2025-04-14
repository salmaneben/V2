// src/features/prompt-generator/utils/apiAdapter.ts
import { ApiConfig, ApiResponse } from '../types';

export const callApiService = async (
  apiConfig: ApiConfig,
  prompt: string,
  options: {
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
  }
): Promise<ApiResponse<{ content: string }>> => {
  // Adapter logic to connect with your existing API service
}