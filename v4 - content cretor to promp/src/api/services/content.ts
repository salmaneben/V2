import { ApiConfig, ApiResponse, ContentGenerationOptions, Provider } from '../types';
import { generateContent } from '../client';
import { getApiConfig, getPreferredProvider } from '../storage';

// Generate blog content
export const generateBlogContent = async (
  prompt: string,
  options: ContentGenerationOptions & {
    provider?: Provider;
    apiConfig?: ApiConfig;
  } = {}
): Promise<ApiResponse> => {
  // Use provided config, or get from provider, or use default
  const config = options.apiConfig || 
    (options.provider ? getApiConfig(options.provider) : getApiConfig(getPreferredProvider()));

  return generateContent(config, prompt, {
    systemPrompt: options.systemPrompt,
    temperature: options.temperature,
    maxTokens: options.maxTokens
  });
};

// Generate article outlines
export const generateOutline = async (
  title: string,
  keywords: string,
  options: ContentGenerationOptions & {
    provider?: Provider;
    apiConfig?: ApiConfig;
  } = {}
): Promise<ApiResponse> => {
  const prompt = `Create a detailed outline for an article titled "${title}" focusing on the keyword "${keywords}".`;
  
  const systemPrompt = options.systemPrompt || 
    "You are an expert content outline creator. Create a structured outline with H2 headings and H3 subheadings.";
  
  return generateBlogContent(prompt, {
    ...options,
    systemPrompt
  });
};

// Generate content based on an outline
export const generateContentFromOutline = async (
  outline: string,
  keywords: string,
  options: ContentGenerationOptions & {
    provider?: Provider;
    apiConfig?: ApiConfig;
    wordCount?: string;
    tone?: string;
  } = {}
): Promise<ApiResponse> => {
  const wordCountGuide = options.wordCount 
    ? `Create approximately ${options.wordCount === 'small' ? '1500' 
      : options.wordCount === 'medium' ? '3000' 
      : options.wordCount === 'large' ? '4500' : '3000'} words.`
    : '';

  const toneGuide = options.tone 
    ? `Use a ${options.tone} tone.` 
    : '';

  const prompt = `Create complete content based on this outline:\n\n${outline}\n\nFocus on the main keyword: ${keywords}. ${wordCountGuide} ${toneGuide}`;
  
  const systemPrompt = options.systemPrompt || 
    "You are an expert content writer. Create comprehensive, engaging, and SEO-optimized content following the outline structure.";
  
  return generateBlogContent(prompt, {
    ...options,
    systemPrompt
  });
};