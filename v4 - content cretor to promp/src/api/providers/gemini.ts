import BaseProvider from './base';
import { ApiConfig, ApiResponse, ApiMessageContent, ContentGenerationOptions } from '../types';

class GeminiProvider extends BaseProvider {
  async testConnection(config: ApiConfig): Promise<ApiResponse> {
    // Validate the config
    const validationResult = this.validateConfig(config);
    if (validationResult) return validationResult;

    try {
      // Use a simple prompt to test the connection
      const model = config.model || 'gemini-2.0-flash';
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: 'Test connection' }]
            }
          ],
          generationConfig: {
            maxOutputTokens: 10
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: `Gemini API error: ${response.status} - ${errorData.error?.message || response.statusText}`
        };
      }

      return { success: true };
    } catch (error) {
      return this.handleError(error, 'Gemini test connection');
    }
  }

  async generateContent(
    config: ApiConfig,
    prompt: string,
    options: ContentGenerationOptions = {}
  ): Promise<ApiResponse> {
    // Validate the config
    const validationResult = this.validateConfig(config);
    if (validationResult) return validationResult;

    try {
      const model = config.model || 'gemini-2.0-flash';
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey}`;

      // Format the request based on whether we have system prompt or not
      let requestBody: any = {
        contents: [],
        generationConfig: {
          temperature: options.temperature || 0.7,
          maxOutputTokens: options.maxTokens || 4000
        }
      };

      // Handle system prompt if provided
      if (options.systemPrompt) {
        requestBody.systemInstruction = {
          parts: [{ text: options.systemPrompt }]
        };
      }

      // Add user prompt
      requestBody.contents.push({
        parts: [{ text: prompt }]
      });

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: `Gemini API error: ${response.status} - ${errorData.error?.message || response.statusText}`
        };
      }

      const data = await response.json();
      const content = this.parseResponse(data);

      return { success: true, data: { content } };
    } catch (error) {
      return this.handleError(error, 'Gemini content generation');
    }
  }

  parseResponse(data: any): string {
    if (data.candidates && data.candidates[0]?.content?.parts) {
      return data.candidates[0].content.parts.map((part: any) => part.text).join('');
    }
    return '';
  }
}

export default GeminiProvider;