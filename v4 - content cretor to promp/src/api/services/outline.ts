// src/api/services/outline.ts
import { ApiConfig, ApiResponse, ContentGenerationOptions, Provider } from '../types';
import { generateContent } from '../client';
import { getApiConfig, getPreferredProvider } from '../storage';

// Generate outline for a blog post or article
export const generateOutline = async (
  title: string,
  keywords: string,
  options: ContentGenerationOptions & {
    provider?: Provider;
    apiConfig?: ApiConfig;
    outlineDepth?: 'basic' | 'detailed' | 'comprehensive';
  } = {}
): Promise<ApiResponse> => {
  // Use provided config, or get from provider, or use default
  const config = options.apiConfig || 
    (options.provider ? getApiConfig(options.provider) : getApiConfig(getPreferredProvider()));
  
  const outlineDepth = options.outlineDepth || 'detailed';
  
  let depthInstructions = '';
  switch (outlineDepth) {
    case 'basic':
      depthInstructions = 'Create a simple outline with just H2 headings.';
      break;
    case 'detailed':
      depthInstructions = 'Create a detailed outline with H2 headings and H3 subheadings.';
      break;
    case 'comprehensive':
      depthInstructions = 'Create a comprehensive outline with H2 headings, H3 subheadings, and bullet points for key details under each section.';
      break;
  }
  
  const prompt = `Create an outline for an article titled "${title}" targeting the keyword "${keywords}". ${depthInstructions} Ensure the outline covers the topic thoroughly and has a logical flow.`;
  
  const systemPrompt = options.systemPrompt || 
    "You are an expert content strategist. Create well-structured outlines that cover topics comprehensively and help writers create engaging, informative content.";
  
  return generateContent(config, prompt, {
    ...options,
    systemPrompt
  });
};

// Generate section content based on an outline section
export const generateSectionContent = async (
  title: string,
  section: string,
  keyword: string,
  options: ContentGenerationOptions & {
    provider?: Provider;
    apiConfig?: ApiConfig;
    wordCount?: number;
  } = {}
): Promise<ApiResponse> => {
  // Use provided config, or get from provider, or use default
  const config = options.apiConfig || 
    (options.provider ? getApiConfig(options.provider) : getApiConfig(getPreferredProvider()));
  
  const wordCount = options.wordCount || 300;
  
  const prompt = `Write content for the section "${section}" from an article titled "${title}" focusing on the keyword "${keyword}". The content should be approximately ${wordCount} words, be engaging, informative, and naturally incorporate the keyword.`;
  
  const systemPrompt = options.systemPrompt || 
    "You are an expert content writer. Create engaging, informative, and SEO-friendly content that readers will find valuable.";
  
  return generateContent(config, prompt, {
    ...options,
    systemPrompt
  });
};