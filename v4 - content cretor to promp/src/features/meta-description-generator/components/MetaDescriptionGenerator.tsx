// src/features/meta-description-generator/components/MetaDescriptionGenerator.tsx

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Alert } from '@/components/ui/alert';
import { Copy, CheckCircle, Settings, Info } from 'lucide-react';
import { generateMetaDescriptions } from '../utils/metaDescriptionGenerator';
import { MetaDescriptionProps } from '../types';
import { Link } from 'react-router-dom';

export const MetaDescriptionGenerator: React.FC<MetaDescriptionProps> = ({ onSave }) => {
  const [metaTitle, setMetaTitle] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');
  const [relatedTerm, setRelatedTerm] = useState('');
  const [descriptions, setDescriptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [preferredProvider, setPreferredProvider] = useState('perplexity');
  const [charCount, setCharCount] = useState<{[key: number]: number}>({});
  
  // Load preferred provider from localStorage
  useEffect(() => {
    const savedProvider = localStorage.getItem('preferred_provider');
    if (savedProvider) {
      setPreferredProvider(savedProvider);
    }
  }, []);

  // Calculate character count for each description
  useEffect(() => {
    const counts: {[key: number]: number} = {};
    descriptions.forEach((desc, index) => {
      counts[index] = desc.length;
    });
    setCharCount(counts);
  }, [descriptions]);

  const handleGenerate = async () => {
    if (!metaTitle) {
      setError('Please enter a meta title');
      return;
    }

    if (!focusKeyword) {
      setError('Please enter a focus keyword');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await generateMetaDescriptions({
        metaTitle,
        focusKeyword,
        relatedTerm: relatedTerm || undefined,
        provider: preferredProvider
      });

      if (result.error) {
        setError(result.error);
      } else {
        setDescriptions(result.descriptions);
        
        // Call onSave to increment stats
        if (onSave && typeof onSave === 'function') {
          onSave(metaTitle);
        }
        
        setSuccessMessage('Descriptions generated successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      }
    } catch (err) {
      setError('Failed to generate descriptions. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (description: string, index: number) => {
    navigator.clipboard.writeText(description)
      .then(() => {
        setCopiedIndex(index);
        setSuccessMessage('Description copied to clipboard!');
        
        // Reset the copied status after 2 seconds
        setTimeout(() => {
          setCopiedIndex(null);
          setSuccessMessage(null);
        }, 2000);
      })
      .catch(() => {
        setError('Failed to copy description');
        
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

  // Get color class based on character count
  const getCharCountColorClass = (count: number) => {
    if (count <= 120) return 'text-green-600';
    if (count <= 155) return 'text-amber-600';
    return 'text-red-600';
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
          <h2 className="text-xl font-bold">Generate SEO-Friendly Meta Descriptions</h2>
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
          Generate compelling meta descriptions that improve click-through rates and SEO.
          Currently using <span className="font-medium">{getProviderDisplayName(preferredProvider)}</span>.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="meta-title">
              Meta Title *
            </label>
            <Input
              id="meta-title"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Enter your blog post title"
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">Enter the title of your blog post or content.</p>
          </div>
          
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
            <p className="text-xs text-gray-500 mt-1">The keyword will be included in each description.</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="related-term">
              Related Term (Optional)
            </label>
            <Input
              id="related-term"
              value={relatedTerm}
              onChange={(e) => setRelatedTerm(e.target.value)}
              placeholder="Enter a related term for more targeted descriptions"
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">Adding a related term will improve description relevance.</p>
          </div>
          
          <Button 
            onClick={handleGenerate} 
            disabled={isLoading || !metaTitle || !focusKeyword}
            className="w-full bg-orange-600 hover:bg-orange-700 mt-2"
          >
            {isLoading ? <Spinner className="mr-2" /> : null}
            {isLoading ? 'Generating Descriptions...' : 'Generate Meta Descriptions'}
          </Button>
        </div>
      </Card>

      {descriptions.length > 0 && (
        <Card className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="text-xl font-bold">Generated Descriptions</h3>
              <p className="text-gray-600 mt-1">
                Ideal meta descriptions are 50-160 characters. <span className="text-green-600">Green</span> means good, 
                <span className="text-amber-600"> amber</span> is acceptable, and <span className="text-red-600">red</span> is too long.
              </p>
            </div>
          </div>
          
          <ul className="space-y-4 mt-6">
            {descriptions.map((description, index) => (
              <li 
                key={index} 
                className="p-4 border rounded-md hover:bg-orange-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-gray-800 pr-4">{description}</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleCopy(description, index)}
                    className="flex items-center gap-1 min-w-[80px] ml-2 flex-shrink-0"
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
                </div>
                <div className={`text-xs ${getCharCountColorClass(charCount[index] || 0)}`}>
                  {charCount[index] || 0} characters
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};