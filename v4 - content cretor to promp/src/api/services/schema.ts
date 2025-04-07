// src/api/services/schema.ts
import { ApiConfig, ApiResponse, ContentGenerationOptions, Provider } from '../types';
import { generateContent } from '../client';
import { getApiConfig, getPreferredProvider } from '../storage';
import { safeJsonParse } from '../utils';

// Generate schema markup for article content
export const generateArticleSchema = async (
  title: string,
  content: string,
  options: ContentGenerationOptions & {
    provider?: Provider;
    apiConfig?: ApiConfig;
    author?: string;
    datePublished?: string;
    imageUrl?: string;
  } = {}
): Promise<ApiResponse> => {
  // Use provided config, or get from provider, or use default
  const config = options.apiConfig || 
    (options.provider ? getApiConfig(options.provider) : getApiConfig(getPreferredProvider()));
  
  // Extract first 500 characters of content for context
  const contentPreview = content.slice(0, 500);
  
  const prompt = `Generate JSON-LD schema markup for an Article with title "${title}" and content preview: "${contentPreview}". 
    ${options.author ? `The author is "${options.author}".` : ''} 
    ${options.datePublished ? `The publication date is "${options.datePublished}".` : ''} 
    ${options.imageUrl ? `The main image URL is "${options.imageUrl}".` : ''}
    Return only the JSON-LD markup with no additional explanations.`;
  
  const systemPrompt = options.systemPrompt || 
    "You are an expert in structured data and SEO. Create valid JSON-LD schema markup for articles following the schema.org specifications.";
  
  const response = await generateContent(config, prompt, {
    ...options,
    systemPrompt
  });
  
  // If successful, try to parse the response as JSON and format it
  if (response.success && response.data?.content) {
    try {
      // Extract JSON from the content (it might be wrapped in ```json ... ``` or have explanations)
      const jsonContent = extractJsonFromString(response.data.content);
      const parsedJson = safeJsonParse(jsonContent);
      
      if (parsedJson) {
        // Return the properly formatted JSON
        return {
          success: true,
          data: {
            schema: parsedJson,
            schemaString: JSON.stringify(parsedJson, null, 2)
          }
        };
      }
    } catch (error) {
      // If parsing fails, return the original response
      console.error('Failed to parse schema JSON:', error);
    }
  }
  
  return response;
};

// Generate recipe schema markup for recipe content
export const generateRecipeSchema = async (
  title: string,
  ingredients: string[],
  instructions: string[],
  options: ContentGenerationOptions & {
    provider?: Provider;
    apiConfig?: ApiConfig;
    author?: string;
    prepTime?: string;
    cookTime?: string;
    totalTime?: string;
    keywords?: string[];
    imageUrl?: string;
    description?: string;
  } = {}
): Promise<ApiResponse> => {
  // Use provided config, or get from provider, or use default
  const config = options.apiConfig || 
    (options.provider ? getApiConfig(options.provider) : getApiConfig(getPreferredProvider()));
  
  const prompt = `Generate JSON-LD schema markup for a Recipe with title "${title}".
    Ingredients: ${JSON.stringify(ingredients)}
    Instructions: ${JSON.stringify(instructions)}
    ${options.author ? `The author is "${options.author}".` : ''} 
    ${options.prepTime ? `The preparation time is "${options.prepTime}".` : ''} 
    ${options.cookTime ? `The cooking time is "${options.cookTime}".` : ''} 
    ${options.totalTime ? `The total time is "${options.totalTime}".` : ''}
    ${options.description ? `The description is "${options.description}".` : ''}
    ${options.keywords && options.keywords.length > 0 ? `The keywords are: ${options.keywords.join(', ')}.` : ''}
    ${options.imageUrl ? `The main image URL is "${options.imageUrl}".` : ''}
    Return only the JSON-LD markup with no additional explanations.`;
  
  const systemPrompt = options.systemPrompt || 
    "You are an expert in structured data and SEO. Create valid JSON-LD schema markup for recipes following the schema.org specifications.";
  
  const response = await generateContent(config, prompt, {
    ...options,
    systemPrompt
  });
  
  // If successful, try to parse the response as JSON and format it
  if (response.success && response.data?.content) {
    try {
      // Extract JSON from the content (it might be wrapped in ```json ... ``` or have explanations)
      const jsonContent = extractJsonFromString(response.data.content);
      const parsedJson = safeJsonParse(jsonContent);
      
      if (parsedJson) {
        // Return the properly formatted JSON
        return {
          success: true,
          data: {
            schema: parsedJson,
            schemaString: JSON.stringify(parsedJson, null, 2)
          }
        };
      }
    } catch (error) {
      // If parsing fails, return the original response
      console.error('Failed to parse schema JSON:', error);
    }
  }
  
  return response;
};

// Helper function to extract JSON from string (handles markdown code blocks)
const extractJsonFromString = (str: string): string => {
  // Try to extract JSON from markdown code blocks
  const jsonRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
  const match = str.match(jsonRegex);
  
  if (match && match[1]) {
    return match[1].trim();
  }
  
  // If no code blocks, look for objects starting with { and ending with }
  const objectRegex = /(\{[\s\S]*\})/;
  const objectMatch = str.match(objectRegex);
  
  if (objectMatch && objectMatch[1]) {
    return objectMatch[1].trim();
  }
  
  // Otherwise return the original string
  return str;
};