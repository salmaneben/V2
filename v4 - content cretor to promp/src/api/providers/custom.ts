// src/api/providers/custom.ts
import { ApiConfig, ApiResponse, ApiProviderInterface, ApiMessageContent, ContentGenerationOptions } from '../types';
import { isOpenAICompatibleEndpoint, formatApiEndpoint, createErrorResponse } from '../utils';

class CustomProvider implements ApiProviderInterface {
  async testConnection(config: ApiConfig): Promise<ApiResponse> {
    try {
      // Validate required fields
      if (!config.endpoint) {
        return { success: false, error: 'API endpoint is required for custom API' };
      }

      const isOpenAICompatible = isOpenAICompatibleEndpoint(config.endpoint);
      const formattedEndpoint = formatApiEndpoint(config.endpoint, isOpenAICompatible);
      
      // Request options with SSL verification control
      const requestOptions: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify(
          isOpenAICompatible ? {
            model: config.model || 'default',
            messages: [
              { role: 'system', content: 'This is a connection test.' },
              { role: 'user', content: 'Test connection' }
            ],
            max_tokens: 10,
          } : {
            // Generic format for non-OpenAI compatible APIs
            prompt: 'Test connection',
            max_tokens: 10,
            model: config.model || 'default'
          }
        ),
      };

      // Add option to ignore SSL certificate errors if verifySSL is false
      if (config.verifySSL === false) {
        // @ts-ignore - This is a Node.js specific option, will need a different approach in browser
        requestOptions.agent = new (require('https').Agent)({ rejectUnauthorized: false });
      }

      const response = await fetch(formattedEndpoint, requestOptions);

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
        error: error instanceof Error ? error.message : 'Unknown error connecting to custom API'
      };
    }
  }

  async generateContent(
    config: ApiConfig,
    prompt: string,
    options: ContentGenerationOptions = {}
  ): Promise<ApiResponse> {
    try {
      // Validate required fields
      if (!config.endpoint) {
        return { success: false, error: 'API endpoint is required for custom API' };
      }

      const isOpenAICompatible = isOpenAICompatibleEndpoint(config.endpoint);
      const formattedEndpoint = formatApiEndpoint(config.endpoint, isOpenAICompatible);
      const messages = this.formatMessages(options.systemPrompt, prompt);
      
      // Request body based on API compatibility
      const body = isOpenAICompatible ? {
        model: config.model || 'default',
        messages: messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 4000
      } : {
        // Generic format for non-OpenAI compatible APIs
        prompt: options.systemPrompt ? `${options.systemPrompt}\n\n${prompt}` : prompt,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 4000,
        model: config.model || 'default'
      };

      // Request options with SSL verification control
      const requestOptions: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify(body),
      };

      // Add option to ignore SSL certificate errors if verifySSL is false
      if (config.verifySSL === false) {
        // @ts-ignore - This is a Node.js specific option, will need a different approach in browser
        requestOptions.agent = new (require('https').Agent)({ rejectUnauthorized: false });
      }

      const response = await fetch(formattedEndpoint, requestOptions);

      if (!response.ok) {
        return {
          success: false,
          error: `API returned status ${response.status}: ${response.statusText}`
        };
      }

      const data = await response.json();
      const content = this.parseResponse(data, isOpenAICompatible);

      return { success: true, data: { content } };
    } catch (error) {
      return createErrorResponse(error);
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

  parseResponse(data: any, isOpenAICompatible: boolean): string {
    if (isOpenAICompatible) {
      // Parse OpenAI compatible format
      if (data.choices && data.choices[0]) {
        return data.choices[0].message?.content || data.choices[0].text || '';
      }
    } else {
      // Try to extract content from various possible formats
      if (data.choices && data.choices[0]) {
        return data.choices[0].text || data.choices[0].message?.content || '';
      } else if (data.response) {
        return data.response;
      } else if (data.output) {
        return data.output;
      } else if (data.result) {
        return data.result;
      } else if (data.content) {
        return data.content;
      } else if (data.text) {
        return data.text;
      }
    }
    // If we can't parse it, return the stringified JSON as a fallback
    return typeof data === 'string' ? data : JSON.stringify(data);
  }
}

export default CustomProvider;