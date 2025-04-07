// src/api/hooks/useContentGeneration.ts
import { useState, useCallback } from 'react';
import { Provider, ApiConfig, ContentGenerationOptions } from '../types';
import { generateContent } from '../client';
import { getApiConfig, getPreferredProvider } from '../storage';

interface UseContentGenerationReturn {
  content: string | null;
  isGenerating: boolean;
  error: string | null;
  generateContent: (
    prompt: string, 
    options?: ContentGenerationOptions & { 
      provider?: Provider;
      apiConfig?: ApiConfig;
    }
  ) => Promise<string | null>;
}

export const useContentGeneration = (): UseContentGenerationReturn => {
  const [content, setContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const generate = useCallback(async (
    prompt: string,
    options: ContentGenerationOptions & {
      provider?: Provider;
      apiConfig?: ApiConfig;
    } = {}
  ) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Use provided config, specific provider config, or preferred provider config
      const config = options.apiConfig || 
        (options.provider ? getApiConfig(options.provider) : getApiConfig(getPreferredProvider()));
      
      const result = await generateContent(config, prompt, {
        systemPrompt: options.systemPrompt,
        temperature: options.temperature,
        maxTokens: options.maxTokens
      });
      
      if (result.success && result.data?.content) {
        setContent(result.data.content);
        setIsGenerating(false);
        return result.data.content;
      } else {
        setError(result.error || 'Failed to generate content');
        setIsGenerating(false);
        return null;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
      setIsGenerating(false);
      return null;
    }
  }, []);
  
  return {
    content,
    isGenerating,
    error,
    generateContent: generate
  };
};