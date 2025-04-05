/**
 * Tests the connection to an API endpoint
 */
export const testApiConnection = async (config: ApiConfig): Promise<ApiResponse> => {
  try {
    // Basic validation
    if (!config.apiKey) {
      return { success: false, error: 'API key is required' };
    }

    let response;
    let body;

    switch (config.provider) {
      case 'perplexity':
        response = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
          },
          body: JSON.stringify({
            model: 'llama-3.1-sonar-small-128k-online',
            messages: [
              { role: 'system', content: 'This is a connection test.' },
              { role: 'user', content: 'Test connection' }
            ],
            max_tokens: 10,
          }),
        });
        break;

      case 'openai':
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
          },
          body: JSON.stringify({
            model: config.model || 'gpt-4o',
            messages: [
              { role: 'system', content: 'This is a connection test.' },
              { role: 'user', content: 'Test connection' }
            ],
            max_tokens: 10,
          }),
        });
        break;

      case 'claude':
        response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': config.apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: config.model || 'claude-3-5-sonnet',
            messages: [
              { role: 'user', content: 'Test connection' }
            ],
            max_tokens: 10,
          }),
        });
        break;

      case 'custom':
        if (!config.endpoint) {
          return { success: false, error: 'API endpoint is required for custom API' };
        }

        // Determine if this is likely an OpenAI-compatible API
        const isOpenAICompatible = config.endpoint.includes('openai') || 
          config.endpoint.includes('api.together.xyz') || 
          config.endpoint.toLowerCase().includes('completion');
        
        let url = config.endpoint;
        
        if (isOpenAICompatible) {
          // OpenAI-compatible endpoints
          url = config.endpoint.endsWith('/chat/completions') ? config.endpoint : 
            `${config.endpoint.replace(/\/$/, '')}/chat/completions`;
          
          body = {
            model: config.model || 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: 'This is a connection test. Respond with "Connected successfully."',
              },
              {
                role: 'user',
                content: 'Test connection',
              }
            ],
            max_tokens: 10
          };
        } else {
          // Generic API - make a minimal request
          body = {
            prompt: 'Test connection',
            max_tokens: 5
          };
          
          // Add model if provided
          if (config.model) {
            body.model = config.model;
          }
        }

        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
          },
          body: JSON.stringify(body)
        });
        break;

      default:
        return { success: false, error: `Unknown API provider: ${config.provider}` };
    }

    if (!response || !response.ok) {
      return {
        success: false,
        error: `API returned status ${response?.status || 'unknown'}: ${response?.statusText || 'Error connecting to the API'}`
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Sends a content generation request to the selected API
 */
export const generateContent = async (
  config: ApiConfig,
  prompt: string,
  options: {
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<ApiResponse> => {
  try {
    // Ensure required fields are provided
    if (!config.apiKey) {
      return { success: false, error: 'API key is required' };
    }

    // Prepare the messages array
    const messages = [];
    
    // Add system prompt if provided
    if (options.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }
    
    // Add the main user prompt
    messages.push({ role: 'user', content: prompt });

    let response;
    let body;

    switch (config.provider) {
      case 'perplexity':
        response = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
          },
          body: JSON.stringify({
            model: config.model || 'llama-3.1-sonar-small-128k-online',
            messages: messages,
            temperature: options.temperature || 0.7,
            max_tokens: options.maxTokens || 4000
          })
        });
        break;

      case 'openai':
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
          },
          body: JSON.stringify({
            model: config.model || 'gpt-4o',
            messages: messages,
            temperature: options.temperature || 0.7,
            max_tokens: options.maxTokens || 4000
          })
        });
        break;

      case 'claude':
        // Claude doesn't use system messages the same way, prepend it to the user message if present
        let userMessage = prompt;
        if (options.systemPrompt) {
          userMessage = `${options.systemPrompt}\n\n${prompt}`;
        }

        response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': config.apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: config.model || 'claude-3-5-sonnet',
            messages: [{ role: 'user', content: userMessage }],
            temperature: options.temperature || 0.7,
            max_tokens: options.maxTokens || 4000
          })
        });
        break;

      case 'custom':
        if (!config.endpoint) {
          return { success: false, error: 'API endpoint is required for custom API' };
        }

        // Determine if this is likely an OpenAI-compatible API
        const isOpenAICompatible = config.endpoint.includes('openai') || 
          config.endpoint.includes('api.together.xyz') || 
          config.endpoint.toLowerCase().includes('completion');
        
        let url = config.endpoint;
        
        if (isOpenAICompatible) {
          // OpenAI-compatible endpoints
          url = config.endpoint.endsWith('/chat/completions') ? config.endpoint : 
            `${config.endpoint.replace(/\/$/, '')}/chat/completions`;
          
          body = {
            model: config.model || '',
            messages: messages,
            temperature: options.temperature || 0.7,
            max_tokens: options.maxTokens || 4000
          };
        } else {
          // Generic API - attempt to adapt to various formats
          body = {
            prompt: messages.map(m => `${m.role}: ${m.content}`).join('\n'),
            temperature: options.temperature || 0.7,
            max_tokens: options.maxTokens || 4000
          };
          
          // Add model if provided
          if (config.model) {
            body.model = config.model;
          }
        }

        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
          },
          body: JSON.stringify(body)
        });
        break;

      default:
        return { success: false, error: `Unknown API provider: ${config.provider}` };
    }

    if (!response || !response.ok) {
      return {
        success: false,
        error: `API returned status ${response?.status || 'unknown'}: ${response?.statusText || 'Error connecting to the API'}`
      };
    }

    const data = await response.json();
    
    // Extract content from response based on the provider
    let content = '';
    
    switch (config.provider) {
      case 'perplexity':
      case 'openai':
        // OpenAI-like response format
        if (data.choices && data.choices[0]) {
          content = data.choices[0].message?.content || data.choices[0].text || '';
        }
        break;
        
      case 'claude':
        // Claude response format
        if (data.content && data.content.length > 0) {
          content = data.content[0].text || '';
        }
        break;
        
      case 'custom':
        // Try to handle various response formats
        if (data.choices && data.choices[0]) {
          content = data.choices[0].message?.content || data.choices[0].text || '';
        } else if (data.content) {
          // Direct content field
          content = typeof data.content === 'string' ? data.content : JSON.stringify(data.content);
        } else if (data.completion) {
          // Alternative format
          content = data.completion;
        } else if (data.response) {
          // Another alternative
          content = data.response;
        } else if (data.output) {
          // Yet another alternative
          content = data.output;
        } else {
          // Return raw data if we can't determine the format
          content = JSON.stringify(data);
        }
        break;
    }

    return { success: true, data: { content } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred during generation'
    };
  }
};

/**
 * Generates content specifically with a custom API configuration
 */
export const generateWithCustomApi = async (
  config: {
    endpoint: string;
    apiKey: string;
    model?: string;
    verifySSL?: boolean;
  },
  prompt: string,
  options: {
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<ApiResponse> => {
  try {
    // Ensure required fields are provided
    if (!config.endpoint || !config.apiKey) {
      return { success: false, error: 'API endpoint and key are required' };
    }

    // Prepare the messages array
    const messages = [];
    
    // Add system prompt if provided
    if (options.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }
    
    // Add the main user prompt
    messages.push({ role: 'user', content: prompt });

    // Determine if this is likely an OpenAI-compatible API
    const isOpenAICompatible = config.endpoint.includes('openai') || 
      config.endpoint.includes('api.together.xyz') || 
      config.endpoint.toLowerCase().includes('completion');
    
    let url = config.endpoint;
    let body;
    
    if (isOpenAICompatible) {
      // OpenAI-compatible endpoints
      url = config.endpoint.endsWith('/chat/completions') ? config.endpoint : 
        `${config.endpoint.replace(/\/$/, '')}/chat/completions`;
      
      body = {
        model: config.model || '',
        messages: messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 4000
      };
    } else {
      // Generic API - attempt to adapt to various formats
      body = {
        prompt: messages.map(m => `${m.role}: ${m.content}`).join('\n'),
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 4000
      };
      
      // Add model if provided
      if (config.model) {
        body.model = config.model;
      }
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify(body)
    });

    if (!response || !response.ok) {
      return {
        success: false,
        error: `API returned status ${response?.status || 'unknown'}: ${response?.statusText || 'Error connecting to the API'}`
      };
    }

    const data = await response.json();
    
    // Try to handle various response formats
    let content = '';
    
    if (data.choices && data.choices[0]) {
      content = data.choices[0].message?.content || data.choices[0].text || '';
    } else if (data.content) {
      // Direct content field
      content = typeof data.content === 'string' ? data.content : JSON.stringify(data.content);
    } else if (data.completion) {
      // Alternative format
      content = data.completion;
    } else if (data.response) {
      // Another alternative
      content = data.response;
    } else if (data.output) {
      // Yet another alternative
      content = data.output;
    } else {
      // Return raw data if we can't determine the format
      content = JSON.stringify(data);
    }

    return { success: true, data: { content } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred during generation'
    };
  }
};

/**
 * Helper function to get the appropriate config based on user settings
 */
export const getApiConfigFromSettings = () => {
  const preferredProvider = localStorage.getItem('preferred_provider') || 'perplexity';
  
  let config: ApiConfig = {
    provider: preferredProvider,
    apiKey: ''
  };
  
  switch (preferredProvider) {
    case 'perplexity':
      config.apiKey = localStorage.getItem('perplexity_api_key') || '';
      break;
      
    case 'openai':
      config.apiKey = localStorage.getItem('openai_api_key') || '';
      config.model = localStorage.getItem('openai_model') || 'gpt-4o';
      break;
      
    case 'claude':
      config.apiKey = localStorage.getItem('claude_api_key') || '';
      config.model = localStorage.getItem('claude_model') || 'claude-3-5-sonnet';
      break;
      
    case 'custom':
      config.endpoint = localStorage.getItem('custom_api_endpoint') || '';
      config.apiKey = localStorage.getItem('custom_api_key') || '';
      config.model = localStorage.getItem('custom_api_model') || '';
      config.verifySSL = localStorage.getItem('custom_api_verify') !== 'false';
      break;
  }
  
  return config;
};