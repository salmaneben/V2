// src/api/providers/perplexity.ts
import { ApiConfig, ApiResponse, ContentGenerationOptions } from '../types';
import { API_ENDPOINTS, DEFAULT_MODELS } from '../config';
import BaseProvider from './base';

class PerplexityProvider extends BaseProvider {
  async testConnection(config: ApiConfig): Promise<ApiResponse> {
    // Validate config
    const validationError = this.validateConfig(config);
    if (validationError) return validationError;
    
    try {
      const response = await fetch(API_ENDPOINTS.PERPLEXITY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          model: config.model || DEFAULT_MODELS.PERPLEXITY,
          messages: [
            { role: 'system', content: 'This is a connection test.' },
            { role: 'user', content: 'Test connection' }
          ],
          max_tokens: 10,
        }),
      });

      if (!response.ok) {
        return this.handleApiError(response);
      }

      return { success: true };
    } catch (error) {
      return this.handleError(error, 'connecting to Perplexity API');
    }
  }

  async generateContent(
    config: ApiConfig,
    prompt: string,
    options: ContentGenerationOptions = {}
  ): Promise<ApiResponse> {
    // Validate config
    const validationError = this.validateConfig(config);
    if (validationError) return validationError;
    
    try {
      const messages = this.formatMessages(options.systemPrompt, prompt);

      const response = await fetch(API_ENDPOINTS.PERPLEXITY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          model: config.model || DEFAULT_MODELS.PERPLEXITY,
          messages: messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 4000
        })
      });

      if (!response.ok) {
        return this.handleApiError(response);
      }

      const data = await response.json();
      const content = this.parseResponse(data);

      return { success: true, data: { content } };
    } catch (error) {
      return this.handleError(error, 'generating content with Perplexity');
    }
  }

  parseResponse(data: any): string {
    if (data.choices && data.choices[0]) {
      return data.choices[0].message?.content || data.choices[0].text || '';
    }
    return '';
  }
}

export default PerplexityProvider;