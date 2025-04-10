// src/features/meta-title-generator/utils/metaTitleGenerator.ts

import { MetaTitleGeneratorRequest, MetaTitleGeneratorResponse } from '../types';

export const generateMetaTitles = async (
  params: MetaTitleGeneratorRequest
): Promise<MetaTitleGeneratorResponse> => {
  try {
    const provider = params.provider || localStorage.getItem('preferred_provider') || 'perplexity';
    
    // Get the appropriate API key and model based on the provider
    let apiKey = '';
    let model = '';
    let endpoint = '';

    switch (provider) {
      case 'perplexity':
        apiKey = localStorage.getItem('perplexity_api_key') || '';
        model = localStorage.getItem('perplexity_model') || 'llama-3.1-sonar-small-128k-online';
        endpoint = 'https://api.perplexity.ai/chat/completions';
        break;

      case 'openai':
        apiKey = localStorage.getItem('openai_api_key') || '';
        model = localStorage.getItem('openai_model') || 'gpt-4o';
        endpoint = 'https://api.openai.com/v1/chat/completions';
        break;

      case 'claude':
        apiKey = localStorage.getItem('claude_api_key') || '';
        model = localStorage.getItem('claude_model') || 'claude-3-5-sonnet';
        endpoint = 'https://api.anthropic.com/v1/messages';
        break;
        
      case 'gemini':
        apiKey = localStorage.getItem('gemini_api_key') || '';
        model = localStorage.getItem('gemini_model') || 'gemini-2.0-flash';
        endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        break;

      case 'custom':
        apiKey = localStorage.getItem('custom_api_key') || '';
        model = localStorage.getItem('custom_api_model') || '';
        endpoint = localStorage.getItem('custom_api_endpoint') || '';
        break;

      default:
        throw new Error('Invalid provider selected');
    }

    if (!apiKey) {
      return {
        titles: [],
        error: `No API key found for ${provider}. Please set your API key in the API Settings.`
      };
    }

    if (!endpoint) {
      return {
        titles: [],
        error: 'API endpoint not configured. Please check your API Settings.'
      };
    }

    // Prepare the prompt for generating meta titles
    const promptText = `
      You are an expert copywriter who writes catchy, SEO-friendly blog titles in a friendly tone. Follow these rules:
      1. Write 10 titles for "${params.focusKeyword}" using the exact phrase "${params.focusKeyword}".
      2. Keep titles under 65 characters.
      3. Make sure "${params.focusKeyword}" appears at the beginning of title.
      4. Use hooks like "How," "Why," or "Best" to spark curiosity.
      5. Mix formats: listicles, questions, and how-tos.
      6. Avoid quotes, markdown, or self-references.
      7. Prioritize SEO keywords related to ${params.relatedTerm || params.focusKeyword}.
      8. Title should contain a number.
      
      Return only the list of 10 titles, nothing else.
    `;

    let response;
    let data;

    // Different request format for each provider
    if (provider === 'perplexity') {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: 'You are an expert SEO copywriter.' },
            { role: 'user', content: promptText }
          ],
          max_tokens: 1024
        })
      });

      data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || `Error: ${response.status}`);
      }

      // Extract titles from Perplexity response
      const content = data.choices?.[0]?.message?.content || '';
      return {
        titles: content.split('\n')
          .map(line => line.trim())
          .filter(line => line && !line.startsWith('#') && !line.startsWith('*') && !line.startsWith('-'))
          .slice(0, 10)
      };

    } else if (provider === 'openai') {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: 'You are an expert SEO copywriter.' },
            { role: 'user', content: promptText }
          ],
          max_tokens: 1024
        })
      });
      
      data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || `Error: ${response.status}`);
      }

      // Extract titles from OpenAI response
      const content = data.choices?.[0]?.message?.content || '';
      return {
        titles: content.split('\n')
          .map(line => line.trim())
          .filter(line => line && !line.startsWith('#') && !line.startsWith('*') && !line.startsWith('-'))
          .slice(0, 10)
      };

    } else if (provider === 'claude') {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: promptText }],
          max_tokens: 1024
        })
      });
      
      data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || `Error: ${response.status}`);
      }

      // Extract titles from Claude response
      const content = data.content?.[0]?.text || '';
      return {
        titles: content.split('\n')
          .map(line => line.trim())
          .filter(line => line && !line.startsWith('#') && !line.startsWith('*') && !line.startsWith('-'))
          .slice(0, 10)
      };
      
    } else if (provider === 'gemini') {
      // For Gemini, the endpoint already includes the API key as a query parameter
      // We need to remove the model from endpoint calculation since we need the base URL
      const baseEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models';
      
      response = await fetch(`${baseEndpoint}/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: promptText }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024
          }
        })
      });
      
      data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || `Error: ${response.status}`);
      }

      // Extract titles from Gemini response
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      return {
        titles: content.split('\n')
          .map(line => line.trim())
          .filter(line => line && !line.startsWith('#') && !line.startsWith('*') && !line.startsWith('-'))
          .slice(0, 10)
      };

    } else if (provider === 'custom') {
      // For custom endpoint, use the proxy API in your app
      response = await fetch('/api/custom-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          endpoint,
          apiKey,
          model,
          prompt: promptText,
          verifySSL: localStorage.getItem('custom_api_verify') !== 'false'
        })
      });
      
      data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Error: ${response.status}`);
      }

      return {
        titles: data.titles || []
      };
    }

    // If we get here without returning, something went wrong
    throw new Error('Failed to generate titles with the selected provider');

  } catch (error) {
    console.error('Error generating meta titles:', error);
    return {
      titles: [],
      error: error instanceof Error ? error.message : 'Failed to generate meta titles'
    };
  }
}