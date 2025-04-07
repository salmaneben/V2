// src/api/providers/claude.ts
import { ApiConfig, ApiResponse, ApiProviderInterface, ApiMessageContent, ContentGenerationOptions } from '../types';
import { API_ENDPOINTS, DEFAULT_MODELS } from '../config';

class ClaudeProvider implements ApiProviderInterface {
  async testConnection(config: ApiConfig): Promise<ApiResponse> {
    try {
      const response = await fetch(API_ENDPOINTS.CLAUDE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: config.model || DEFAULT_MODELS.CLAUDE,
          messages: [{ role: 'user', content: 'Test connection' }],
          max_tokens: 10,
        }),
      });

      if (!response.ok) {
        return {
          success: false,
          error: `API returned status ${response.status}: ${response.statusText}`
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error connecting to Claude API'
      };
    }
  }

  async generateContent(
    config: ApiConfig,
    prompt: string,
    options: ContentGenerationOptions = {}
  ): Promise<ApiResponse> {
    try {
      const messages = this.formatMessages(options.systemPrompt, prompt);

      const response = await fetch(API_ENDPOINTS.CLAUDE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: config.model || DEFAULT_MODELS.CLAUDE,
          messages: messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 4000
        })
      });

      if (!response.ok) {
        return {
          success: false,
          error: `API returned status ${response.status}: ${response.statusText}`
        };
      }

      const data = await response.json();
      const content = this.parseResponse(data);

      return { success: true, data: { content } };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred during Claude generation'
      };
    }
  }

  formatMessages(systemPrompt: string | undefined, userPrompt: string): ApiMessageContent[] {
    const messages: ApiMessageContent[] = [];
    
    // Claude uses a different system message format - handled through the system parameter
    // If needed, we can add the system message as a special format in the user prompt
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    
    messages.push({ role: 'user', content: userPrompt });
    
    return messages;
  }

  parseResponse(data: any): string {
    if (data.content && data.content.length > 0) {
      return data.content[0].text || '';
    }
    return '';
  }
}

export default ClaudeProvider;