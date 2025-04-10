import { useState, useCallback } from 'react';
import { Provider, ApiConfig } from '../types';
import { testConnection } from '../client';
import { getApiConfig } from '../storage';

interface UseApiConnectionReturn {
  isConnecting: boolean;
  connectionStatus: 'idle' | 'connecting' | 'success' | 'error';
  errorMessage: string | null;
  testApiConnection: (configOrProvider?: ApiConfig | Provider, optionalConfig?: ApiConfig) => Promise<boolean>;
}

export const useApiConnection = (initialProvider?: Provider): UseApiConnectionReturn => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const testApiConnection = useCallback(async (configOrProvider?: ApiConfig | Provider, optionalConfig?: ApiConfig) => {
    setIsConnecting(true);
    setConnectionStatus('connecting');
    setErrorMessage(null);
    
    try {
      let apiConfig: ApiConfig;
      
      // Determine if first parameter is a config object or a provider string
      if (configOrProvider && typeof configOrProvider === 'object') {
        // It's a config object
        apiConfig = configOrProvider;
      } else {
        // It's a provider string or undefined
        const provider = configOrProvider as Provider | undefined;
        apiConfig = optionalConfig || getApiConfig(provider || initialProvider || 'perplexity');
      }
      
      // Debug logging to help troubleshoot
      console.log('Testing connection with:', {
        provider: apiConfig.provider,
        hasApiKey: Boolean(apiConfig.apiKey),
        model: apiConfig.model
      });
      
      const result = await testConnection(apiConfig);
      
      if (result.success) {
        setConnectionStatus('success');
        setIsConnecting(false);
        return true;
      } else {
        setConnectionStatus('error');
        setErrorMessage(result.error || 'Connection failed');
        setIsConnecting(false);
        return false;
      }
    } catch (error) {
      console.error('Connection test error:', error);
      setConnectionStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
      setIsConnecting(false);
      return false;
    }
  }, [initialProvider]);
  
  return {
    isConnecting,
    connectionStatus,
    errorMessage,
    testApiConnection
  };
};