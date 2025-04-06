import { ApiResponse } from './types';

// Safe JSON parsing with error handling
export const safeJsonParse = (text: string): any => {
  try {
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
};

// Format error messages for display
export const formatErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unknown error occurred';
};

// Create a standard error response
export const createErrorResponse = (error: unknown): ApiResponse => {
  return {
    success: false,
    error: formatErrorMessage(error)
  };
};

// Check if a response is from an OpenAI-compatible API
export const isOpenAICompatibleEndpoint = (endpoint: string): boolean => {
  return endpoint.includes('openai') || 
    endpoint.includes('api.together.xyz') || 
    endpoint.toLowerCase().includes('completion');
};

// Format an API endpoint to ensure it has the correct path
export const formatApiEndpoint = (endpoint: string, isOpenAICompatible: boolean): string => {
  if (!isOpenAICompatible) {
    return endpoint;
  }
  
  return endpoint.endsWith('/chat/completions') 
    ? endpoint 
    : `${endpoint.replace(/\/$/, '')}/chat/completions`;
};