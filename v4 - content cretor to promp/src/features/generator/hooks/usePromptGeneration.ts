import { useState } from 'react';
import { useToast } from '@/components/ui/toast';
import { generateContent } from '@/features/contentCreator/services/apiService';

export const usePromptGeneration = () => {
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Use toast instead of browser notifications
  const { addToast } = useToast();

  const generatePrompt = async (formData: any, apiConfig?: any) => {
    // Create the base prompt template
    const basePrompt = `Task: You are an expert content writer assigned to create a high-quality, SEO-optimized blog post about [${
      formData.mainKeyword
    }] in ${formData.language} for an audience in ${formData.country}.

Instructions:
1. Content Structure:
Article Specifications:
- Hook Type: ${formData.hookType} style hook
- Hook Brief: ${formData.hookBrief}
- Target Audience: ${formData.targetAudience}
- Tone: ${formData.tone}
- Structure:
  - Introduction (with specified hook)
  - Main Body with FAQs integration
  - Conclusion with call to action

2. SEO Requirements:
- Main Keyword: ${formData.mainKeyword}
- Secondary Keywords: ${formData.seoKeywords}
${formData.links ? `- External References: ${formData.links}` : ''}
${formData.internalLinks ? `- Internal Links: ${formData.internalLinks}` : ''}

3. Additional Requirements:
- FAQs to Address:
${formData.faqs}

Please generate comprehensive, engaging content that meets all these requirements.`;

    // Set the base prompt immediately for instant feedback
    setGeneratedPrompt(basePrompt);
    
    // If API config is provided and we have an API key, try to enhance the prompt
    if (apiConfig && apiConfig.apiKey) {
      try {
        setIsGenerating(true);
        setError(null);
        
        // Use the selected API to enhance the prompt if desired
        const systemPrompt = "You are a professional content strategist. Review and enhance the provided content brief to make it more effective. Keep the same structure and core requirements, but add precision and clarity. The output should be a refined, more detailed version of the input brief that would result in better content.";
        
        const result = await generateContent(
          apiConfig,
          basePrompt,
          {
            systemPrompt,
            temperature: 0.5,
            maxTokens: 800
          }
        );
        
        if (result.success && result.data?.content) {
          // Replace the base prompt with the enhanced version
          setGeneratedPrompt(result.data.content);
          addToast('Enhanced prompt generated successfully!', 'success');
        } else {
          // If enhancement fails, keep the base prompt
          addToast('Using basic prompt template (API enhancement failed)', 'warning');
          setError(result.error || 'Failed to enhance prompt with AI');
        }
      } catch (err) {
        console.error('Error enhancing prompt:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        addToast('Failed to enhance prompt, using basic template', 'warning');
      } finally {
        setIsGenerating(false);
      }
    } else {
      // If no API config, just use the base prompt
      addToast('Prompt generated successfully!', 'success');
    }
    
    return basePrompt;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      // Show toast notification for successful copy
      addToast('Prompt copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Show toast notification for error
      addToast('Failed to copy prompt', 'error');
    }
  };

  return {
    generatedPrompt,
    isGenerating,
    error,
    copied,
    generatePrompt,
    copyToClipboard,
  };
};