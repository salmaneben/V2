// src/api/providers/base.ts
import { ApiConfig, ApiResponse, ApiProviderInterface, ApiMessageContent, ContentGenerationOptions } from '../types';
import { createErrorResponse } from '../utils';

abstract class BaseProvider implements ApiProviderInterface {
  // Abstract methods that must be implemented by child classes
  abstract testConnection(config: ApiConfig): Promise<ApiResponse>;
  abstract generateContent(config: ApiConfig, prompt: string, options?: ContentGenerationOptions): Promise<ApiResponse>;
  abstract parseResponse(data: any): string;
  
  // Common implementation shared by most providers
  formatMessages(systemPrompt: string | undefined, userPrompt: string): ApiMessageContent[] {
    const messages: ApiMessageContent[] = [];
    
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    
    messages.push({ role: 'user', content: userPrompt });
    
    return messages;
  }
  
  // Helper methods for derived classes
  protected handleApiError(response: Response): ApiResponse {
    return {
      success: false,
      error: `API returned status ${response.status}: ${response.statusText}`
    };
  }
  
  protected handleError(error: unknown, operation: string): ApiResponse {
    return createErrorResponse(
      error instanceof Error 
        ? `${operation}: ${error.message}` 
        : `Unknown error during ${operation}`
    );
  }
  
  // Validation helper
  protected validateConfig(config: ApiConfig, requiresEndpoint = false): ApiResponse | null {
    if (!config.apiKey) {
      return { success: false, error: 'API key is required' };
    }
    
    if (requiresEndpoint && !config.endpoint) {
      return { success: false, error: 'API endpoint is required' };
    }
    
    return null; // Config is valid
  }
}

export default BaseProvider;