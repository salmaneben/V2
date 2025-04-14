// src/features/meta-title-generator/components/MetaTitleGenerator.tsx

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Alert } from '@/components/ui/alert';
import { Copy, CheckCircle, Settings, Type, Sparkles, Zap } from 'lucide-react';
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
      case 'gemini': return 'Google Gemini';
      case 'custom': return 'Custom API';
      default: return 'Default Provider';
    }
  };

  return (
    <div className="space-y-6">
      {successMessage && (
        <Alert className="mb-4 bg-green-50 border-green-200 text-green-800 shadow-md animate-in fade-in">
          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
          {successMessage}
        </Alert>
      )}
      
      {error && (
        <Alert variant="destructive" className="mb-4 shadow-md animate-in fade-in">
          {error}
        </Alert>
      )}
      
      <Card className="p-6 border border-indigo-100 shadow-xl rounded-xl overflow-hidden relative">
        {/* Subtle top gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-amber-600"></div>
        
        {/* Premium header styling */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-2.5 rounded-lg shadow-md mr-3">
              <Type className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-orange-600">Generate SEO-Friendly Blog Titles</h2>
          </div>
          <Link to="/api-settings">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 shadow-sm transition-all duration-200"
            >
              <Settings className="h-4 w-4" />
              <span>API Settings</span>
            </Button>
          </Link>
        </div>
        
        <p className="text-gray-600 mb-6 pl-2 border-l-2 border-orange-200 italic">
          Enter your focus keyword to generate 10 SEO-friendly blog titles that follow best practices.
          Currently using <span className="font-medium text-indigo-600">{getProviderDisplayName(preferredProvider)}</span>.
        </p>
        
        <div className="space-y-5">
          <div className="bg-orange-50/50 p-4 rounded-lg border border-orange-100">
            <label className="block text-sm font-medium mb-2 text-orange-700" htmlFor="focus-keyword">
              Focus Keyword *
            </label>
            <Input
              id="focus-keyword"
              value={focusKeyword}
              onChange={(e) => setFocusKeyword(e.target.value)}
              placeholder="Enter your focus keyword"
              className="w-full border-orange-200 focus:border-orange-400 focus:ring-orange-400 shadow-sm"
            />
            <p className="text-xs text-orange-600/80 mt-1.5 flex items-center">
              <Zap className="h-3 w-3 mr-1 text-orange-500" />
              The keyword will appear at the beginning of each title.
            </p>
          </div>
          
          <div className="bg-indigo-50/50 p-4 rounded-lg border border-indigo-100">
            <label className="block text-sm font-medium mb-2 text-indigo-700" htmlFor="related-term">
              Related Term (Optional)
            </label>
            <Input
              id="related-term"
              value={relatedTerm}
              onChange={(e) => setRelatedTerm(e.target.value)}
              placeholder="Enter a related term for more targeted titles"
              className="w-full border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 shadow-sm"
            />
            <p className="text-xs text-indigo-600/80 mt-1.5 flex items-center">
              <Zap className="h-3 w-3 mr-1 text-indigo-500" />
              Adding a related term will improve title relevance.
            </p>
          </div>
          
          <Button 
            onClick={handleGenerate} 
            disabled={isLoading || !focusKeyword}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-3 mt-3 rounded-lg flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Spinner className="h-5 w-5 text-white" />
                <span>Generating Titles...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>Generate Meta Titles</span>
              </>
            )}
          </Button>
        </div>
      </Card>

      {titles.length > 0 && (
        <Card className="p-6 border border-indigo-100 shadow-xl rounded-xl overflow-hidden relative">
          {/* Subtle top gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600"></div>
          
          <div className="flex items-center mb-4">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-2.5 rounded-lg shadow-md mr-3">
              <Type className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-indigo-600">Generated Titles</h3>
          </div>
          
          <p className="text-gray-600 mb-4 pl-2 border-l-2 border-indigo-200 italic">
            All titles are under 65 characters, include your focus keyword, and follow SEO best practices.
          </p>
          
          <ul className="space-y-3 mt-6">
            {titles.map((title, index) => (
              <li 
                key={index} 
                className="p-4 border border-indigo-100 rounded-lg hover:bg-indigo-50/70 flex justify-between items-center transition-all duration-200 hover:shadow-md group"
              >
                <span className="text-gray-800 pr-4 group-hover:text-indigo-700">{title}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleCopy(title, index)}
                  className={`flex items-center gap-1 min-w-[90px] transition-all duration-300 ${
                    copiedIndex === index 
                      ? 'bg-green-50 text-green-600 border-green-200' 
                      : 'border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700'
                  }`}
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