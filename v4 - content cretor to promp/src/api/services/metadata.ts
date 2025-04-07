// src/api/services/metadata.ts
import { ApiConfig, ApiResponse, ContentGenerationOptions, Provider } from '../types';
import { generateContent } from '../client';
import { getApiConfig, getPreferredProvider } from '../storage';

// Generate meta title for content
export const generateMetaTitle = async (
  title: string,
  keywords: string,
  options: ContentGenerationOptions & {
    provider?: Provider;
    apiConfig?: ApiConfig;
  } = {}
): Promise<ApiResponse> => {
  // Use provided config, or get from provider, or use default
  const config = options.apiConfig || 
    (options.provider ? getApiConfig(options.provider) : getApiConfig(getPreferredProvider()));
  
  const prompt = `Create a compelling meta title for an article titled "${title}" focusing on the keyword "${keywords}". The meta title should be 50-60 characters, include the main keyword, and be designed for high CTR from search results.`;
  
  const systemPrompt = options.systemPrompt || 
    "You are an expert SEO specialist. Create meta titles that are engaging, include target keywords, and stay within character limits.";
  
  return generateContent(config, prompt, {
    ...options,
    systemPrompt
  });
};

// Generate meta description for content
export const generateMetaDescription = async (
  title: string,
  content: string,
  options: ContentGenerationOptions & {
    provider?: Provider;
    apiConfig?: ApiConfig;
  } = {}
): Promise<ApiResponse> => {
  // Use provided config, or get from provider, or use default
  const config = options.apiConfig || 
    (options.provider ? getApiConfig(options.provider) : getApiConfig(getPreferredProvider()));
  
  // Extract first 500 characters of content for context
  const contentPreview = content.slice(0, 500);
  
  const prompt = `Create a compelling meta description for an article titled "${title}" with the following content: "${contentPreview}". The meta description should be 150-160 characters, inform readers what the content is about, and include a call to action.`;
  
  const systemPrompt = options.systemPrompt || 
    "You are an expert SEO specialist. Create meta descriptions that accurately summarize content, include relevant keywords naturally, and encourage clicks.";
  
  return generateContent(config, prompt, {
    ...options,
    systemPrompt
  });
};