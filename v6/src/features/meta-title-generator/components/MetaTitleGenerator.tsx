// src/features/meta-title-generator/components/MetaTitleGenerator.tsx

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Alert } from '@/components/ui/alert';
import { Copy, CheckCircle, Settings } from 'lucide-react';
import { generateMetaTitles } from '../utils/metaTitleGenerator';
import { MetaTitleProps } from '../types';
import { Link } from 'react-router-dom';

export const MetaTitleGenerator: React.FC<MetaTitleProps> = ({ onSave }) => {
  const [focusKeyword, setFocusKeyword] = useState('');
  const [relatedTerm, setRelatedTerm] = useState('');
  const [titles, setTitles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [preferredProvider, setPreferredProvider] = useState('perplexity');
  
  // Load preferred provider from localStorage
  useEffect(() => {
    const savedProvider = localStorage.getItem('preferred_provider');
    if (savedProvider) {
      setPreferredProvider(savedProvider);
    }
  }, []);

  const handleGenerate = async () => {
    if (!focusKeyword) {
      setError('Please enter a focus keyword');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await generateMetaTitles({
        focusKeyword,
        relatedTerm: relatedTerm || undefined,
        provider: preferredProvider
      });

      if (result.error) {
        setError(result.error);
      } else {
        setTitles(result.titles);
        
        // Call onSave to increment stats
        if (onSave && typeof onSave === 'function') {
          onSave(focusKeyword);
        }
        
        setSuccessMessage('Titles generated successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      }
    } catch (err) {
      setError('Failed to generate titles. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (title: string, index: number) => {
    navigator.clipboard.writeText(title)
      .then(() => {
        setCopiedIndex(index);
        setSuccessMessage('Title copied to clipboard!');
        
        // Reset the copied status after 2 seconds
        setTimeout(() => {
          setCopiedIndex(null);
          setSuccessMessage(null);
        }, 2000);
      })
      .catch(() => {
        setError('Failed to copy title');
        
        // Clear error after 3 seconds
        setTimeout(() => {
          setError(null);
        }, 3000);
      });
  };

  // Get the provider display name
  const getProviderDisplayName = (provider: string) => {
    switch (provider) {
      case 'perplexity': return 'Perplexity AI';
      case 'openai': return 'OpenAI';
      case 'claude': return 'Claude';
      case 'custom': return 'Custom API';
      default: return 'Default Provider';
    }
  };

  return (
    <div className="space-y-6">
      {successMessage && (
        <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
          {successMessage}
        </Alert>
      )}
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          {error}
        </Alert>
      )}
      
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Generate SEO-Friendly Blog Titles</h2>
          <Link to="/api-settings">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
            >
              <Settings className="h-4 w-4" />
              <span>API Settings</span>
            </Button>
          </Link>
        </div>
        
        <p className="text-gray-600 mb-6">
          Enter your focus keyword to generate 10 SEO-friendly blog titles that follow best practices.
          Currently using <span className="font-medium">{getProviderDisplayName(preferredProvider)}</span>.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="focus-keyword">
              Focus Keyword *
            </label>
            <Input
              id="focus-keyword"
              value={focusKeyword}
              onChange={(e) => setFocusKeyword(e.target.value)}
              placeholder="Enter your focus keyword"
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">The keyword will appear at the beginning of each title.</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="related-term">
              Related Term (Optional)
            </label>
            <Input
              id="related-term"
              value={relatedTerm}
              onChange={(e) => setRelatedTerm(e.target.value)}
              placeholder="Enter a related term for more targeted titles"
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">Adding a related term will improve title relevance.</p>
          </div>
          
          <Button 
            onClick={handleGenerate} 
            disabled={isLoading || !focusKeyword}
            className="w-full bg-amber-600 hover:bg-amber-700 mt-2"
          >
            {isLoading ? <Spinner className="mr-2" /> : null}
            {isLoading ? 'Generating Titles...' : 'Generate Meta Titles'}
          </Button>
        </div>
      </Card>

      {titles.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Generated Titles</h3>
          <p className="text-gray-600 mb-4">
            All titles are under 65 characters, include your focus keyword, and follow SEO best practices.
          </p>
          <ul className="space-y-3 mt-6">
            {titles.map((title, index) => (
              <li 
                key={index} 
                className="p-4 border rounded-md hover:bg-amber-50 flex justify-between items-center transition-colors"
              >
                <span className="text-gray-800 pr-4">{title}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleCopy(title, index)}
                  className="flex items-center gap-1 min-w-[80px]"
                >
                  {copiedIndex === index ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy</span>
                    </>
                  )}
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};