// src/features/generator/hooks/useGeneratorForm.ts

import { useState, useEffect } from 'react';
import { FormData, UseGeneratorFormProps } from '../types';
import { hookTypes } from '../constants/hookTypes';
import { getArticleSize } from '../utils/articleSizes';
import { generateContent } from '@/features/contentCreator/services/apiService';

const initialFormData: FormData = {
  mainKeyword: '',
  country: 'United States',
  language: 'English (US)',
  wordCount: 'medium',
  targetAudience: '',
  links: '',
  internalLinks: '',
  faqs: '',
  seoKeywords: '',
  imageDetails: '',
  tone: 'Professional',
  hookType: 'Question',
  hookBrief: '',
};

export const useGeneratorForm = ({ onSubmit, apiConfig }: UseGeneratorFormProps) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);
  const [isGeneratingFAQs, setIsGeneratingFAQs] = useState(false);
  const [isGeneratingTargetAudience, setIsGeneratingTargetAudience] = useState(false);
  const [isGeneratingLinks, setIsGeneratingLinks] = useState(false);
  const [isGeneratingInternalLinks, setIsGeneratingInternalLinks] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [websiteUrl, setWebsiteUrl] = useState<string>('');
  const [websiteUrls, setWebsiteUrls] = useState<string>('');
  const [apiError, setApiError] = useState<string | null>(null);

  // Clear API error when API config changes
  useEffect(() => {
    setApiError(null);
  }, [apiConfig]);

  const generatePrompt = (data: FormData) => {
    const articleSize = getArticleSize(data.wordCount);
    const seoKeywordsString = data.seoKeywords;

    return `Task: You are an expert content writer assigned to create a high-quality, SEO-optimized blog post about [${
      data.mainKeyword
    }] in ${data.language} for an audience in ${data.country}.

Instructions:
1. Content Structure:
Article Specifications:
• Total Length: ${articleSize.range} words
• Hook Type: ${data.hookType} style hook
• Hook Brief: ${data.hookBrief}
• Structure:
- Introduction: ${articleSize.sections.intro} words (start with the specified hook type)
- Main Body: ${articleSize.sections.body} words (divided into ${
      articleSize.h2
    } main sections)
- Conclusion: ${articleSize.sections.conclusion} words
• Format: ${
      articleSize.h2
    } H2 sections with appropriate H3 subsections

Body:
Incorporate the provided Frequently Asked Questions (FAQs) and secondary keywords/questions seamlessly into the content.
Develop each section thoroughly, ensuring it adds value and depth to the reader's understanding.
Where appropriate, include tables to present data or comparisons clearly.

2. Writing Style:
Adopt a natural, organic, and casual tone.
Simple Vocabulary: Opt for everyday language, avoiding jargon or complex terminology.
Write with a unique tone and creativity, influencing the article's voice and making the content feel more personal and engaging.
Readability: Use formatting like bold, italics, bullet points, and short paragraphs to improve clarity.
Conversational and Relatable Tone: Write as if engaging in a one-on-one conversation with the reader. Use second-person pronouns like "you" to create intimacy and relatability.
Stylish and Trend-Conscious: Reflect contemporary trends relevant to the topic. Use vivid descriptions to help readers visualize concepts and settings.
Witty and Clever Insights: Incorporate subtle humor, clever analogies, and questions to keep the content engaging and interesting.
Anecdotal and Storytelling Elements: Include relevant anecdotes or personal insights to illustrate points, enhancing engagement and memorability.
Authoritative Yet Approachable: Demonstrate expertise and deep knowledge of the subject matter while maintaining a friendly and approachable tone.
Attention to Detail and Aesthetics: Ensure descriptions are precise and detailed, reflecting a keen sense of style and alignment with ${
      data.tone
    } aesthetic.
Perplexity: Use a mix of simple, compound, and complex sentences, adding variety and rhythm. This keeps the reader engaged and reflects natural thought patterns.
Burstiness: Vary sentence lengths and styles, creating a more human-like rhythm to the text.
Show a lot of originality, humor, and creativity. Introduce unexpected angles, personal anecdotes, and novel ideas.
You write with great logical flow, with coherent transitions between ideas. Use narrative techniques to guide the reader through the content.
Seamlessly use connectors, transitions, and conjunctions to ensure smooth flow between ideas and paragraphs, making it easy to follow the argument.
Have a good balance of short and long sentences, using variations to emphasize key points or create emphasis.

3. SEO Optimization:
• Integrate the main keyword and secondary keywords naturally throughout the text.
• Utilize headings and subheadings with keywords where appropriate.
• Craft a compelling meta description (~155 characters) that includes the main keyword.
• SEO Keywords to include: ${seoKeywordsString}
• **Keyword Highlighting**: Highlight all instances of the main keyword and secondary keywords using **bold tags** (<b>keyword</b>). This helps emphasize important terms for both readers and search engines.
${
  data.internalLinks
    ? `• Internal Linking Strategy:
- Link to the following internal pages: ${data.internalLinks}
- Ensure anchor text is natural and relevant
- Distribute internal links evenly throughout the content
- Use descriptive anchor text that includes target keywords where appropriate`
    : ''
}

4. EEAT Compliance:
• Demonstrate experience and expertise by providing accurate and detailed information.
• Establish authoritativeness by referencing credible sources or including quotes from experts (if applicable).
• Build trustworthiness through honest, transparent, and unbiased content.

5. Content Variety:
• Suggest where to insert relevant images to enhance the visual appeal and support the content${
      data.imageDetails
        ? ` (e.g., "Insert image of ${data.imageDetails} here")`
        : ''
    }.
• Include tables to organize complex information or data for better comprehension.

6. Additional Guidelines:
• Target Audience: ${data.targetAudience}
• Length: Aim for a word count of ${articleSize.range} words
• Originality: Ensure the content is original, free of plagiarism, and not AI-detectable.
• Formatting: Use proper formatting with short paragraphs, bullet points, and numbered lists where appropriate.
• Tone Consistency: Maintain the ${data.tone} tone consistently throughout the article.
Include the following links to ensure we are backing up statements. Ensure to hyperlink these resources appropriately ${
      data.links
    }
• Language and Locale: Use ${data.language} and ensure cultural relevance to ${
      data.country
    }.

Information Provided:
• Main Keyword/Question: ${data.mainKeyword}
• Frequently Asked Questions (FAQs): 
${data.faqs}

Objective:
Create a blog post that not only informs but also engages and resonates with the reader, positioning the content as a valuable resource that stands out in search engine results.`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for required API config
    if (!checkApiConfig()) {
      return;
    }
    
    const prompt = generatePrompt(formData);
    if (onSubmit) {
      onSubmit({ ...formData, generatedPrompt: prompt });
    }
  };

  // Check API configuration validity
  const checkApiConfig = (): boolean => {
    // Clear any previous errors
    setApiError(null);

    // Check if we have the main keyword
    if (!formData.mainKeyword) {
      setApiError('Please enter a main keyword first.');
      return false;
    }

    // Check if we have a valid API configuration
    if (!apiConfig) {
      setApiError('No API configuration found. Please configure an API provider in the settings.');
      return false;
    }

    // Check if we have an API key for the selected provider
    if (!apiConfig.apiKey) {
      setApiError(`No API key found for ${apiConfig.provider}. Please set it up in the API settings.`);
      return false;
    }

    // Additional validation for custom API
    if (apiConfig.provider === 'custom' && !apiConfig.endpoint) {
      setApiError('Custom API endpoint is required. Please set it up in the API settings.');
      return false;
    }

    return true;
  };

  // Generate SEO keywords using the selected API
  const generateSEOKeywords = async () => {
    if (!checkApiConfig()) {
      return;
    }

    setIsGeneratingKeywords(true);
    try {
      const systemPrompt = 'You are an SEO expert. Generate a list of 8 high-quality, relevant, and varied SEO keywords for the given topic. Provide only the keywords in a bullet list. Do not include any additional information, explanations, intros, or outros.';
      const userPrompt = `Generate SEO keywords for: ${formData.mainKeyword}`;
      
      const result = await generateContent(
        apiConfig, 
        userPrompt,
        {
          systemPrompt,
          temperature: 0.2,
          maxTokens: 100
        }
      );

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate keywords');
      }

      const generatedKeywords = result.data?.content || '';
      setFormData(prev => ({
        ...prev,
        seoKeywords: generatedKeywords,
      }));
    } catch (error) {
      console.error('Error generating keywords:', error);
      setApiError(error instanceof Error ? error.message : 'Failed to generate keywords');
    } finally {
      setIsGeneratingKeywords(false);
    }
  };

  // Generate FAQs using the selected API
  const generateFAQs = async () => {
    if (!checkApiConfig()) {
      return;
    }

    setIsGeneratingFAQs(true);
    try {
      const systemPrompt = 'You are a content researcher specializing in FAQ creation. Generate 5 frequently asked questions (with answers) related to the given topic. Format as a numbered list with Q: and A: prefixes. Make the questions concise and the answers informative but brief (2-3 sentences each). Focus on questions that actual users would ask.';
      const userPrompt = `Generate FAQs for the topic: ${formData.mainKeyword}`;
      
      const result = await generateContent(
        apiConfig, 
        userPrompt,
        {
          systemPrompt,
          temperature: 0.2,
          maxTokens: 800
        }
      );

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate FAQs');
      }

      const generatedFAQs = result.data?.content || '';
      setFormData(prev => ({
        ...prev,
        faqs: generatedFAQs,
      }));
    } catch (error) {
      console.error('Error generating FAQs:', error);
      setApiError(error instanceof Error ? error.message : 'Failed to generate FAQs');
    } finally {
      setIsGeneratingFAQs(false);
    }
  };

  // Generate Target Audience using the selected API
  const generateTargetAudience = async () => {
    if (!checkApiConfig()) {
      return;
    }

    setIsGeneratingTargetAudience(true);
    try {
      const systemPrompt = 'You are a market research expert. Create a concise but detailed target audience description for the given topic. Include demographics, psychographics, interests, pain points, and goals. Keep it under 150 words and make it specific enough to be useful for content targeting.';
      const userPrompt = `Create a target audience description for content about: ${formData.mainKeyword}`;
      
      const result = await generateContent(
        apiConfig, 
        userPrompt,
        {
          systemPrompt,
          temperature: 0.2,
          maxTokens: 300
        }
      );

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate target audience');
      }

      const generatedTargetAudience = result.data?.content || '';
      setFormData(prev => ({
        ...prev,
        targetAudience: generatedTargetAudience,
      }));
    } catch (error) {
      console.error('Error generating target audience:', error);
      setApiError(error instanceof Error ? error.message : 'Failed to generate target audience');
    } finally {
      setIsGeneratingTargetAudience(false);
    }
  };

  // Generate Links using the selected API
  const generateLinks = async () => {
    if (!checkApiConfig()) {
      return;
    }

    setIsGeneratingLinks(true);
    try {
      const systemPrompt = 'You are a research expert. Find 2 authoritative resources (websites, studies, or articles) related to the given topic. Provide ONLY the URLs in the format: "1. URL1\n2. URL2" - Do not include any explanations, comments, or additional text.';
      const userPrompt = `Find 2 authoritative resources for the topic: ${formData.mainKeyword}`;
      
      const result = await generateContent(
        apiConfig, 
        userPrompt,
        {
          systemPrompt,
          temperature: 0.2,
          maxTokens: 150
        }
      );

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate links');
      }

      const generatedLinks = result.data?.content || '';
      setFormData(prev => ({
        ...prev,
        links: generatedLinks,
      }));
    } catch (error) {
      console.error('Error generating links:', error);
      setApiError(error instanceof Error ? error.message : 'Failed to generate links');
    } finally {
      setIsGeneratingLinks(false);
    }
  };

  // Generate Internal Links using the selected API
  const generateInternalLinks = async () => {
    if (!checkApiConfig()) {
      return;
    }

    if (!websiteUrl) {
      setApiError('Please enter your website URL in the Internal Links section first.');
      return;
    }

    if (!websiteUrls || websiteUrls.trim() === '') {
      setApiError('Please paste your website URLs or sitemap content first.');
      return;
    }

    setIsGeneratingInternalLinks(true);
    try {
      const systemPrompt = 'You are an SEO and internal linking expert. Your task is to select the 3 most relevant URLs from a provided list that would make good internal links for an article on the main topic. Format your response as: "1. [full URL] - Suggested anchor text: [anchor text]"';
      const userPrompt = `I'm writing an article about "${formData.mainKeyword}" for my website ${websiteUrl}.\n\nHere's a list of URLs from my website:\n${websiteUrls}\n\nSelect the 3 most relevant URLs from this list that would make good internal links for my article. For each URL, suggest appropriate anchor text.`;
      
      const result = await generateContent(
        apiConfig, 
        userPrompt,
        {
          systemPrompt,
          temperature: 0.2,
          maxTokens: 500
        }
      );

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate internal links');
      }

      const generatedInternalLinks = result.data?.content || '';
      setFormData(prev => ({
        ...prev,
        internalLinks: generatedInternalLinks,
      }));
    } catch (error) {
      console.error('Error generating internal links:', error);
      setApiError(error instanceof Error ? error.message : 'Failed to generate internal links');
    } finally {
      setIsGeneratingInternalLinks(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHookTypeChange = (hookType: string) => {
    const selectedHook = hookTypes.find(hook => hook.type === hookType);
    setFormData(prev => ({
      ...prev,
      hookType,
      hookBrief: selectedHook?.placeholder || ''
    }));
  };

  return {
    formData,
    generatedPrompt,
    apiConfig,
    apiError,
    handleInputChange,
    handleHookTypeChange,
    generateSEOKeywords,
    generateFAQs,
    generateTargetAudience,
    generateLinks,
    generateInternalLinks,
    handleSubmit,
    isGeneratingKeywords,
    isGeneratingFAQs,
    isGeneratingTargetAudience,
    isGeneratingLinks,
    isGeneratingInternalLinks,
    websiteUrl,
    setWebsiteUrl,
    websiteUrls,
    setWebsiteUrls,
  };
};