// src/features/meta-description-generator/utils/metaDescriptionGenerator.ts

import { MetaDescriptionGeneratorRequest, MetaDescriptionGeneratorResponse } from '../types';

export const generateMetaDescriptions = async (
  params: MetaDescriptionGeneratorRequest
): Promise<MetaDescriptionGeneratorResponse> => {
  try {
    const provider = params.provider || localStorage.getItem('preferred_provider') || 'perplexity';
    
    // Get the appropriate API key and model based on the provider
    let apiKey = '';
    let model = '';
    let endpoint = '';

    switch (provider) {
      case 'perplexity':
        apiKey = localStorage.getItem('perplexity_api_key') || '';
        model = 'llama-3.1-sonar-small-128k-online'; // Default Perplexity model
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
        descriptions: [],
        error: `No API key found for ${provider}. Please set your API key in the API Settings.`
      };
    }

    if (!endpoint) {
      return {
        descriptions: [],
        error: 'API endpoint not configured. Please check your API Settings.'
      };
    }

    // Prepare the prompt for generating meta descriptions
    const promptText = `
      You are an SEO-savvy content strategist who writes compelling blog descriptions.
      Follow these rules:
      1. Write 10 descriptions for the blog post titled "${params.metaTitle}".
      2. Use the exact phrase "${params.focusKeyword}" naturally in each description.
      3. Keep descriptions under 160 characters (ideal for SEO).
      4. Start with a hook: ask a question, use action verbs, or highlight a pain point.
      5. Include SEO keywords related to ${params.relatedTerm || 'the topic'} and address user intent (e.g., tips, solutions).
      6. End with a subtle CTA like "Discover", "Learn", "Try".
      7. Avoid quotes, markdown, or self-references.
      8. Maintain a friendly, conversational tone.
      
      Return only the list of 10 descriptions, nothing else.
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
            { role: 'system', content: 'You are an expert SEO content strategist.' },
            { role: 'user', content: promptText }
          ],
          max_tokens: 1024
        })
      });

      data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || `Error: ${response.status}`);
      }

      // Extract descriptions from Perplexity response
      const content = data.choices?.[0]?.message?.content || '';
      return {
        descriptions: content.split('\n')
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
            { role: 'system', content: 'You are an expert SEO content strategist.' },
            { role: 'user', content: promptText }
          ],
          max_tokens: 1024
        })
      });
      
      data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || `Error: ${response.status}`);
      }

      // Extract descriptions from OpenAI response
      const content = data.choices?.[0]?.message?.content || '';
      return {
        descriptions: content.split('\n')
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

      // Extract descriptions from Claude response
      const content = data.content?.[0]?.text || '';
      return {
        descriptions: content.split('\n')
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
        descriptions: data.descriptions || []
      };
    }

    // If we get here without returning, something went wrong
    throw new Error('Failed to generate descriptions with the selected provider');

  } catch (error) {
    console.error('Error generating meta descriptions:', error);
    return {
      descriptions: [],
      error: error instanceof Error ? error.message : 'Failed to generate meta descriptions'
    };
  }
}