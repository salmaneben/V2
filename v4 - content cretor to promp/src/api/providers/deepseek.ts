// src/api/providers/deepseek.ts
import { ApiConfig, ApiResponse, ApiProviderInterface, ApiMessageContent, ContentGenerationOptions } from '../types';
import { API_ENDPOINTS, DEFAULT_MODELS } from '../config';

class DeepSeekProvider implements ApiProviderInterface {
  async testConnection(config: ApiConfig): Promise<ApiResponse> {
    try {
      const response = await fetch(API_ENDPOINTS.DEEPSEEK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          model: config.model || DEFAULT_MODELS.DEEPSEEK,
          messages: [
            { role: 'system', content: 'This is a connection test.' },
            { role: 'user', content: 'Test connection' }
          ],
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
        error: error instanceof Error ? error.message : 'Unknown error connecting to DeepSeek API'
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

      const response = await fetch(API_ENDPOINTS.DEEPSEEK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          model: config.model || DEFAULT_MODELS.DEEPSEEK,
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
        error: error instanceof Error ? error.message : 'Unknown error occurred during DeepSeek generation'
      };
    }
  }

  formatMessages(systemPrompt: string | undefined, userPrompt: string): ApiMessageContent[] {
    const messages: ApiMessageContent[] = [];
    
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    
    messages.push({ role: 'user', content: userPrompt });
    
    return messages;
  }

  parseResponse(data: any): string {
    if (data.choices && data.choices[0]) {
      return data.choices[0].message?.content || '';
    }
    return '';
  }
}

export default DeepSeekProvider;