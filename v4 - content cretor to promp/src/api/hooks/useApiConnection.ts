// src/api/hooks/useApiConnection.ts
import { useState, useCallback } from 'react';
import { Provider, ApiConfig } from '../types';
import { testConnection } from '../client';
import { getApiConfig } from '../storage';

interface UseApiConnectionReturn {
  isConnecting: boolean;
  connectionStatus: 'idle' | 'connecting' | 'success' | 'error';
  errorMessage: string | null;
  testApiConnection: (provider?: Provider, config?: ApiConfig) => Promise<boolean>;
}

export const useApiConnection = (initialProvider?: Provider): UseApiConnectionReturn => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const testApiConnection = useCallback(async (provider?: Provider, config?: ApiConfig) => {
    setIsConnecting(true);
    setConnectionStatus('connecting');
    setErrorMessage(null);
    
    try {
      // Use provided config or load from storage
      const apiConfig = config || getApiConfig(provider || initialProvider || 'perplexity');
      
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