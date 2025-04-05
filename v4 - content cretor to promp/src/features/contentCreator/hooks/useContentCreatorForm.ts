// Updated useContentCreatorForm.ts - With Enhanced Image Prompt Handling and Opt-In Functionality

import { useState, useEffect } from 'react';
import { FormData, ApiConfig, DEFAULT_FORM_VALUES } from '../types';
// Import from your existing article size helper
import { getArticleSize } from '@/features/generator/utils/articleSizes';
import { generateContent } from '../services/apiService';

// Use the default form values as the base
const initialFormData: FormData = {
  // Basic content fields
  title: '',
  mainKeyword: '',
  country: DEFAULT_FORM_VALUES.country || 'United States',
  language: DEFAULT_FORM_VALUES.language || 'English (US)',
  wordCount: DEFAULT_FORM_VALUES.wordCount || 'medium',
  targetAudience: '',
  faqs: '',
  seoKeywords: '',
  longTailKeywords: '', // New field for long-tail keywords
  tone: DEFAULT_FORM_VALUES.tone || 'Professional',
  additionalInstructions: '',
  
  // Hook settings for compatibility with original structure
  hookType: '',
  hookBrief: '',
  
  // Core Settings
  articleType: DEFAULT_FORM_VALUES.articleType || 'None',
  
  // Content Settings
  pointOfView: DEFAULT_FORM_VALUES.pointOfView || 'None',
  
  // AI Settings
  aiModel: DEFAULT_FORM_VALUES.aiModel || 'Default',
  textReadability: DEFAULT_FORM_VALUES.textReadability || '8th & 9th grade',
  aiContentCleaning: DEFAULT_FORM_VALUES.aiContentCleaning || 'No AI Words Removal',
  
  // Multi-API Settings
  keywordsApiProvider: DEFAULT_FORM_VALUES.keywordsApiProvider || 'perplexity',
  keywordsApiModel: DEFAULT_FORM_VALUES.keywordsApiModel || 'llama-3.1-sonar-small-128k-online',
  contentApiProvider: DEFAULT_FORM_VALUES.contentApiProvider || 'perplexity',
  contentApiModel: DEFAULT_FORM_VALUES.contentApiModel || 'llama-3.1-sonar-small-128k-online',
  
  // Custom API Settings
  customApiEndpoint: DEFAULT_FORM_VALUES.customApiEndpoint || '',
  customApiKey: DEFAULT_FORM_VALUES.customApiKey || '',
  customApiModel: DEFAULT_FORM_VALUES.customApiModel || '',
  customApiVerify: DEFAULT_FORM_VALUES.customApiVerify !== false,
  
  // Brand Voice
  brandVoice: '',
  
  // SEO and Structure
  introductoryHook: '',
  customHook: '',

  // Document Elements
  includeConclusion: DEFAULT_FORM_VALUES.includeConclusion !== false,
  includeTables: DEFAULT_FORM_VALUES.includeTables !== false,
  includeH3: DEFAULT_FORM_VALUES.includeH3 !== false,
  includeLists: DEFAULT_FORM_VALUES.includeLists !== false,
  includeItalics: DEFAULT_FORM_VALUES.includeItalics !== false,
  includeQuotes: DEFAULT_FORM_VALUES.includeQuotes !== false,
  includeKeyTakeaways: DEFAULT_FORM_VALUES.includeKeyTakeaways !== false,
  includeFAQs: DEFAULT_FORM_VALUES.includeFAQs !== false,
  includeBold: DEFAULT_FORM_VALUES.includeBold !== false,
  
  // Internal Linking
  internalLinkingWebsite: '',
  internalLinks: '',  // For compatibility with original structure

  // External Linking
  externalLinkType: '',
  links: '',  // For compatibility with original structure
  
  // Enhanced Image Prompt Configuration
  imageDetails: '',  // Legacy field maintained for compatibility
  numberOfImagePrompts: 5, // Default number of image suggestions
  imagePromptStyle: 'detailed', // Options: 'simple', 'detailed', 'creative'
  imageDistribution: 'balanced', // Options: 'header-only', 'balanced', 'throughout'
  customImagePrompts: '', // Custom image prompt instructions
  
  // Opt-In Settings
  enableOptIn: DEFAULT_FORM_VALUES.enableOptIn || false,
  optInText: DEFAULT_FORM_VALUES.optInText || 'I agree to receive newsletters and promotional emails',
  optInRequired: DEFAULT_FORM_VALUES.optInRequired || false,
  optInPlacement: DEFAULT_FORM_VALUES.optInPlacement || 'bottom', // Options: 'top', 'bottom', 'after-content'
  optInDesign: DEFAULT_FORM_VALUES.optInDesign || 'standard', // Options: 'standard', 'minimalist', 'prominent'
  
  // Media Hub fields - kept for compatibility but functionality removed
  includeImages: DEFAULT_FORM_VALUES.includeImages || false,
  numberOfImages: DEFAULT_FORM_VALUES.numberOfImages || 3,
  imageStyle: '',
  imageSize: '1344×768',
  additionalImageInstructions: '',
  brandName: '',
  includeKeywordAlt: false,
  addInformativeAlt: false,
  includeVideos: DEFAULT_FORM_VALUES.includeVideos || false,
  numberOfVideos: DEFAULT_FORM_VALUES.numberOfVideos || 1,
  layoutOptions: DEFAULT_FORM_VALUES.layoutOptions || 'Alternate image and video',
  strictMediaPlacement: DEFAULT_FORM_VALUES.strictMediaPlacement || false,
};

interface UseContentCreatorFormProps {
  onSubmit?: (data: any) => void;
  generationMode?: 'content' | 'prompt';
  apiConfig: ApiConfig;
}

export const useContentCreatorForm = ({ 
  onSubmit, 
  generationMode = 'content',
  apiConfig
}: UseContentCreatorFormProps) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);
  const [isGeneratingLongTailKeywords, setIsGeneratingLongTailKeywords] = useState(false);
  const [isGeneratingFAQs, setIsGeneratingFAQs] = useState(false);
  const [isGeneratingTargetAudience, setIsGeneratingTargetAudience] = useState(false);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [isGeneratingLinks, setIsGeneratingLinks] = useState(false);
  const [isGeneratingInternalLinks, setIsGeneratingInternalLinks] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [websiteUrl, setWebsiteUrl] = useState<string>('');
  const [websiteUrls, setWebsiteUrls] = useState<string>('');
  const [apiError, setApiError] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<'standard' | 'blogPost'>('standard');

  // Clear API error when API config changes
  useEffect(() => {
    setApiError(null);
  }, [apiConfig]);

  // Load potentially saved form data from localStorage on initialization
  useEffect(() => {
    const savedFormData = localStorage.getItem('content_creator_form');
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        setFormData(prev => ({
          ...prev,
          ...parsedData
        }));
      } catch (e) {
        console.error('Error parsing saved form data:', e);
      }
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('content_creator_form', JSON.stringify({
      keywordsApiProvider: formData.keywordsApiProvider,
      keywordsApiModel: formData.keywordsApiModel,
      contentApiProvider: formData.contentApiProvider,
      contentApiModel: formData.contentApiModel,
      enableOptIn: formData.enableOptIn,
      optInText: formData.optInText,
      optInRequired: formData.optInRequired,
      optInPlacement: formData.optInPlacement,
      optInDesign: formData.optInDesign,
    }));
  }, [
    formData.keywordsApiProvider,
    formData.keywordsApiModel,
    formData.contentApiProvider,
    formData.contentApiModel,
    formData.enableOptIn,
    formData.optInText,
    formData.optInRequired,
    formData.optInPlacement,
    formData.optInDesign
  ]);

  // Enhanced blog post specific prompt template generator with image prompt controls and opt-in features
  const generateBlogPostTemplate = (data: FormData) => {
    // Get article size with original structure
    const articleSize = getArticleSize(data.wordCount);
    const seoKeywordsString = data.seoKeywords || data.mainKeyword;
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    
    // Determine image placement strategy based on settings
    let imagePlacementInstructions = '';
    
    switch (data.imageDistribution || 'balanced') {
      case 'header-only':
        imagePlacementInstructions = `• Place exactly ${data.numberOfImagePrompts || 5} image suggestions:
    - One after the title
    - One before the conclusion
    - The rest at the beginning of the most important H2 sections`;
        break;
      case 'balanced':
        imagePlacementInstructions = `• Place exactly ${data.numberOfImagePrompts || 5} image suggestions:
    - One after the title
    - One before the conclusion
    - The rest distributed evenly at the beginning of main H2 sections`;
        break;
      case 'throughout':
        imagePlacementInstructions = `• Place exactly ${data.numberOfImagePrompts || 5} image suggestions:
    - One after the title
    - One before the conclusion
    - The rest distributed throughout the content at appropriate locations, including within subsections where relevant`;
        break;
      default:
        imagePlacementInstructions = `• Place exactly ${data.numberOfImagePrompts || 5} image suggestions at strategic points throughout the article`;
    }
    
    // Determine image style instructions
    let imageStyleInstructions = '';
    
    switch (data.imagePromptStyle || 'detailed') {
      case 'simple':
        imageStyleInstructions = '• Keep image descriptions brief and straightforward';
        break;
      case 'detailed':
        imageStyleInstructions = '• Make image descriptions detailed, specifying elements, composition, style, and mood';
        break;
      case 'creative':
        imageStyleInstructions = '• Create imaginative, conceptual image descriptions that use metaphors and creative visualization';
        break;
      default:
        imageStyleInstructions = '• Provide clear, detailed image descriptions';
    }
    
    // Add opt-in instructions if enabled
    let optInInstructions = '';
    if (data.enableOptIn) {
      let placementText = '';
      switch (data.optInPlacement) {
        case 'top':
          placementText = 'at the top of the article, before the main content';
          break;
        case 'bottom':
          placementText = 'at the bottom of the article after the conclusion';
          break;
        case 'after-content':
          placementText = 'after the main content but before the conclusion';
          break;
        default:
          placementText = 'at the bottom of the article';
      }
      
      let designStyle = '';
      switch (data.optInDesign) {
        case 'standard':
          designStyle = 'standard design with checkbox and label';
          break;
        case 'minimalist':
          designStyle = 'minimalist design with subtle styling';
          break;
        case 'prominent':
          designStyle = 'prominent design with highlighted box and clear call-to-action';
          break;
        default:
          designStyle = 'standard design';
      }
      
      optInInstructions = `
8. OPT-IN FORM:
• Include an email newsletter opt-in form ${placementText}
• Use a ${designStyle}
• Display the opt-in text: "${data.optInText}"
• The opt-in should be formatted as: *[Email Opt-In: ${data.optInText}]*
${data.optInRequired ? '• Mark the opt-in as required' : '• The opt-in should not be required'}`;
    }
    
    // Create the blog post focused template
    const template = `Task: You are an expert SEO content writer assigned to create a highly optimized, search engine ranking blog post about [${data.mainKeyword}] in ${data.language} for an audience in ${data.country}. The article should be formatted similar to premium published content, following specific structural guidelines.

BLOG POST STRUCTURE AND FORMAT:

1. TITLE & INTRODUCTION:
• Create a compelling H1 title format: "${data.mainKeyword}: Proven Strategies for ${nextYear}" (or similar formulation that incorporates the main keyword and year)
• Begin with an eye-catching statistic or surprising fact in the introduction
• Format image suggestions in italics with brackets like this: *[Suggested Image: description of relevant image]*
• Include 3-4 paragraphs in the introduction that:
  - Identify the problem or challenge
  - Highlight the opportunity
  - Acknowledge common obstacles
  - Preview what the article will deliver

2. MAIN SECTIONS STRUCTURE:
• Create ${articleSize.h2} main H2 sections with descriptive, keyword-rich headings
• Include 2-4 H3 subsections under each main section
• Begin each main section with a suggested image placement in italics: *[Suggested Image: description]*
• Follow a teaching pattern in each section: explain concept → provide examples → give actionable steps
• Bold all instances of the main keyword and important related terms using **double asterisks**
• Use tables to present comparative data where relevant
• Include both bulleted and numbered lists for scannable content

3. CONTENT FORMATTING SPECIFICS:
• Use proper Markdown formatting throughout:
  - # for H1 (title only)
  - ## for H2 (main sections)
  - ### for H3 (subsections)
  - #### for H4 (if needed for deep nesting)
  - **text** for bold/emphasis of keywords and important concepts
  - *text* for italics, including image suggestions
  - Proper table formatting with header rows and column alignment
  - Numbered lists for sequential steps
  - Bulleted lists for non-sequential items

4. CONTENT ELEMENTS TO INCLUDE:
• ${articleSize.h2} major sections covering different aspects of ${data.mainKeyword}
• At least one comparison table with 3+ columns
• Multiple numbered lists for step-by-step processes
• Bulleted lists for features, benefits, or options
• Image suggestions at the beginning of each major section
• Statistics and data points throughout for credibility (with sources if available)
• A compelling conclusion that summarizes key points and encourages action
• A meta description at the very end in a separate section

5. SEO OPTIMIZATION INSTRUCTIONS:
• Include the main keyword [${data.mainKeyword}] in:
  - Title (H1)
  - First paragraph
  - At least 2 H2 headings
  - Meta description
  - Conclusion
• Bold the main keyword and variations throughout using **keyword** format
• Use semantic variations and LSI keywords naturally
${data.longTailKeywords ? `• Incorporate these long-tail keywords naturally throughout:\n${data.longTailKeywords}` : ''}
• Create sections that would work well as featured snippets
• Structure FAQ sections to target "People Also Ask" opportunities
• Target both informational and commercial intent where appropriate

6. WRITING STYLE GUIDELINES:
• Authoritative but accessible tone
• Data-driven approach with specific statistics where possible
• Practical, actionable advice over theoretical concepts
• Solutions-oriented focus addressing reader pain points
• Comprehensive coverage with specific examples
• ${data.tone || 'Professional'} voice throughout
${data.pointOfView !== 'None' ? `• Write from a ${data.pointOfView} perspective` : ''}
• Conversational elements to engage the reader
• Strategic use of rhetorical questions to maintain interest

7. IMAGE PROMPT GUIDELINES:
${imagePlacementInstructions}
${imageStyleInstructions}
• Format ALL image suggestions as: *[Suggested Image: detailed description of image concept]*
${data.imageDetails ? `• Include these specific image concepts: ${data.imageDetails}` : ''}
${data.customImagePrompts ? `• Additional image instructions: ${data.customImagePrompts}` : ''}
• Ensure image suggestions complement and enhance the surrounding content
• Number each image suggestion (e.g., *[Suggested Image 1: description]*)
• IMPORTANT: Include EXACTLY ${data.numberOfImagePrompts || 5} image suggestions - no more, no less
${optInInstructions}

CONTENT SPECIFICATIONS:
• Article Length: ${articleSize.range || articleSize.wordCount} words
• Target Audience: ${data.targetAudience || "People interested in " + data.mainKeyword}
• Main Keyword: ${data.mainKeyword}
• Supporting Keywords: ${seoKeywordsString}
${data.longTailKeywords ? `• Long-tail Keywords: ${data.longTailKeywords}` : ''}
${data.faqs ? `• FAQs to incorporate: ${data.faqs}` : ''}
${data.internalLinkingWebsite || data.internalLinks ? `• Internal links to include: ${data.internalLinkingWebsite || data.internalLinks}` : ''}
${data.externalLinkType || data.links ? `• External links to reference: ${data.externalLinkType || data.links}` : ''}
${data.additionalInstructions ? `• Additional instructions: ${data.additionalInstructions}` : ''}

FINAL DELIVERABLE REQUIREMENTS:
1. Complete, ready-to-publish blog post in proper Markdown format
2. Optimized meta description (150-155 characters) at the end
3. Suggested URL slug (3-5 words, including main keyword)
4. EXACTLY ${data.numberOfImagePrompts || 5} image suggestions formatted as specified throughout the article
${data.enableOptIn ? `5. Email opt-in form with the text: "${data.optInText}"` : ''}

Use the example below as a structural reference for the expected format of your blog post, particularly noting the heading hierarchy, image suggestion placement, bold keywords, and overall flow:

# How to Make Money Online: Proven Strategies for ${nextYear}

*[Suggested Image 1: A person working on a laptop with digital income graphics floating around them]*

## Introduction

According to recent studies, [insert relevant statistic], yet [contrasting statistic]. In today's digital landscape, the internet has evolved from [what it was] to [what it is now] offering countless opportunities to generate income. Whether you're looking to [goal 1], [goal 2], or [goal 3], the digital world provides an unprecedented variety of options to **${data.mainKeyword}**.

[Additional 2-3 paragraphs introducing the topic, highlighting benefits and challenges]

## [First Main Topic]

*[Suggested Image 2: Descriptive image related to first topic]*

[Introduction to this section - 1-2 paragraphs]

### [Subtopic 1]
[Detailed content with examples, possibly a list]

### [Subtopic 2]
[Content that might include a table comparing options]

| Option | Benefit | Difficulty | Initial Investment |
|--------|---------|------------|-------------------|
| [Option 1] | [Benefit] | [Level] | [Amount/Effort] |
| [Option 2] | [Benefit] | [Level] | [Amount/Effort] |

### [Subtopic 3]
[Content that might include numbered steps]

1. **[First step]**: [Explanation]
2. **[Second step]**: [Explanation]

[Continue with remaining sections following this structure]

## Conclusion

*[Suggested Image ${data.numberOfImagePrompts || 5}: Person looking satisfied while working/achieving goal related to topic]*

[Summary paragraph]

[Final thoughts and call to action]

${data.enableOptIn && data.optInPlacement === 'bottom' ? `
*[Email Opt-In: ${data.optInText}]*
` : ''}

---

### Meta Description:
Discover proven strategies for **${data.mainKeyword}** in ${nextYear}. From [approach 1] to [approach 2], learn legitimate ways to [desired outcome] with this comprehensive guide.`;

    return template;
  };

  // Simple prompt template generator function - Updated with image handling and opt-in features
  const generatePrompt = (data: FormData) => {
    const articleSize = getArticleSize(data.wordCount);
    const seoKeywordsString = data.seoKeywords;

    // Add opt-in instructions if enabled
    let optInInstructions = '';
    if (data.enableOptIn) {
      optInInstructions = `
• Email Opt-In Form:
  - Include an email newsletter opt-in form with the text: "${data.optInText}"
  - Place it ${data.optInPlacement === 'top' ? 'at the top of the content' : data.optInPlacement === 'after-content' ? 'after the main content but before the conclusion' : 'at the bottom of the content'}
  - Use a ${data.optInDesign === 'standard' ? 'standard' : data.optInDesign === 'minimalist' ? 'minimalist' : 'prominent'} design
  ${data.optInRequired ? '- Make the opt-in required' : '- The opt-in should be optional'}
  - Format it as: "Insert email opt-in form: [Text: ${data.optInText}]"`;
    }

    return `Task: You are an expert content writer assigned to create a high-quality, SEO-optimized blog post about [${
      data.mainKeyword
    }] in ${data.language} for an audience in ${data.country}.

Instructions:
1. Content Structure:
Article Specifications:
• Total Length: ${articleSize.range || articleSize.wordCount} words
• Hook Type: ${data.introductoryHook || data.hookType || 'Engaging'} style hook
• Hook Brief: ${data.customHook || data.hookBrief || 'Create an attention-grabbing opening that immediately draws the reader in'}
• Structure:
  - Introduction: ${articleSize.sections?.intro || Math.round(articleSize.wordCount * 0.1)} words (start with the specified hook type)
  - Main Body: ${articleSize.sections?.body || Math.round(articleSize.wordCount * 0.8)} words (divided into ${
      articleSize.h2
    } main sections)
  - Conclusion: ${articleSize.sections?.conclusion || Math.round(articleSize.wordCount * 0.1)} words
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
${data.pointOfView !== 'None' ? `• Point of View: Write from a ${data.pointOfView} perspective for better engagement.` : ''}
Stylish and Trend-Conscious: Reflect contemporary trends relevant to the topic. Use vivid descriptions to help readers visualize concepts and settings.
Witty and Clever Insights: Incorporate subtle humor, clever analogies, and questions to keep the content engaging and interesting.
Anecdotal and Storytelling Elements: Include relevant anecdotes or personal insights to illustrate points, enhancing engagement and memorability.
Authoritative Yet Approachable: Demonstrate expertise and deep knowledge of the subject matter while maintaining a friendly and approachable tone.
Attention to Detail and Aesthetics: Ensure descriptions are precise and detailed, reflecting a keen sense of style and alignment with ${
      data.tone || 'Professional'
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
${data.longTailKeywords ? `• Long-Tail Keywords: Include these specific long-tail variations:\n${data.longTailKeywords}` : ''}
• **Keyword Highlighting**: Highlight all instances of the main keyword and secondary keywords using **bold tags** (<b>keyword</b>). This helps emphasize important terms for both readers and search engines.
${
  data.internalLinkingWebsite || data.internalLinks
    ? `• Internal Linking Strategy:
  - Link to the following internal pages: ${data.internalLinkingWebsite || data.internalLinks}
  - Ensure anchor text is natural and relevant
  - Distribute internal links evenly throughout the content
  - Use descriptive anchor text that includes target keywords where appropriate`
    : ''
}
${
  data.externalLinkType || data.links
    ? `• External Linking Strategy:
  - Link to these authoritative sources: ${data.externalLinkType || data.links}
  - Use relevant anchor text
  - Only link to high-authority websites to boost EAT signals`
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
${data.includeTables ? '• Include tables to organize complex information or data for better comprehension.' : ''}
${data.includeLists ? '• Use bullet points and numbered lists to break down complex information and improve readability.' : ''}
${data.includeKeyTakeaways ? '• Add "Key Takeaways" sections at the end of major points to summarize important information.' : ''}

6. Additional Guidelines:
• Target Audience: ${data.targetAudience || data.mainKeyword}
• Length: Aim for a word count of ${articleSize.range || articleSize.wordCount} words
• Readability Level: ${data.textReadability || '8th & 9th grade'}. ${(data.textReadability || '').includes('grade') ? 'Simple sentences and paragraphs for better readability scores.' : 'Adjust complexity for your target audience.'}
• Originality: Ensure the content is original, free of plagiarism, and not AI-detectable.
• Formatting: Use proper formatting with short paragraphs, bullet points, and numbered lists where appropriate.
• Tone Consistency: Maintain the ${data.tone || 'Professional'} tone consistently throughout the article.
${data.aiContentCleaning && data.aiContentCleaning !== 'No AI Words Removal' ? '• AI Content Cleaning: ' + data.aiContentCleaning + '. Create unique, natural-sounding content that passes AI detection.' : ''}
${data.brandVoice ? '• Brand Voice: ' + data.brandVoice : ''}
• Language and Locale: Use ${data.language} with regional considerations for ${data.country}.
${data.additionalInstructions ? '\nAdditional Specific Instructions:\n' + data.additionalInstructions : ''}

7. Image Suggestions:
• Include ${data.numberOfImagePrompts || 5} descriptive image suggestions throughout the content
• Format them as "Insert image of [detailed description]" 
• Place them at strategic points to enhance the content
${data.customImagePrompts ? `• Image style instructions: ${data.customImagePrompts}` : ''}
${optInInstructions}

Information Provided:
• Main Keyword/Question: ${data.mainKeyword}
• Content Title: ${data.title || data.mainKeyword}
${data.seoKeywords ? `• SEO Keywords: ${data.seoKeywords}` : ''}
${data.longTailKeywords ? `• Long-tail Keywords: ${data.longTailKeywords}` : ''}
${data.faqs ? `• Frequently Asked Questions (FAQs) to target in "People Also Ask" (keep answers brief, 1-2 sentences): 
${data.faqs}` : ''}
${data.imageDetails ? `• Image details to incorporate: ${data.imageDetails}` : ''}
${data.links || data.externalLinkType ? `• External links to include: ${data.links || data.externalLinkType}` : ''}

Objective:
Create a blog post that not only informs but also engages and resonates with the reader, positioning the content as a valuable resource that stands out in search engine results. Optimize for both search engines and reader experience.

FINAL OUTPUT REQUIREMENTS:
• Include suggested meta title (55-60 characters) with main keyword near beginning
• Include suggested meta description (150-155 characters) with keyword and call-to-action
• Include suggested URL slug (3-5 words maximum including main keyword)
${data.enableOptIn ? `• Include an email newsletter opt-in form with the text: "${data.optInText}"` : ''}`;
  };

  // Hybrid SEO-focused prompt template generator function with opt-in functionality
  const generatePromptTemplate = (data: FormData) => {
    // Get article size with original structure
    const articleSize = getArticleSize(data.wordCount);
    const seoKeywordsString = data.seoKeywords || data.mainKeyword;
    
    // Add opt-in instructions if enabled
    let optInInstructions = '';
    if (data.enableOptIn) {
      optInInstructions = `
9. OPT-IN FORM INTEGRATION:
• Include an email newsletter opt-in form with the text: "${data.optInText}"
• Placement: ${data.optInPlacement === 'top' ? 'At the top of the article before the main content' : data.optInPlacement === 'after-content' ? 'After the main content but before the conclusion' : 'At the bottom of the article after the conclusion'}
• Design Style: ${data.optInDesign === 'standard' ? 'Standard design with clear label and checkbox' : data.optInDesign === 'minimalist' ? 'Minimalist design with subtle styling' : 'Prominent design with highlighted box and clear call-to-action'}
• Requirements: ${data.optInRequired ? 'Mark the opt-in as required' : 'The opt-in should be optional'}
• Format it in the content as: "Insert email opt-in form: [${data.optInText}]"`;
    }
    
    // Create the hybrid SEO-focused prompt template
    const template = `Task: You are an expert SEO content writer assigned to create a highly optimized, search engine ranking ${data.articleType !== 'None' ? data.articleType : 'blog post'} about [${data.mainKeyword}] in ${data.language} for an audience in ${data.country}.

SEO OBJECTIVES:
• Create content that will rank in the top 3 positions for the target keyword [${data.mainKeyword}]
• Optimize for search intent (informational, commercial, transactional)
• Maximize engagement metrics (time on page, low bounce rate)
• Create SEO-optimized headings, meta description, and structured content
• Include proper keyword usage throughout the content (title, headings, body, URL suggestions)

Instructions:
1. Content Structure:
Article Specifications:
• Total Length: ${articleSize.range || articleSize.wordCount} words (Google favors comprehensive content on this topic)
• Hook Type: ${data.introductoryHook || data.hookType || 'Engaging'} style hook
• Hook Brief: ${data.customHook || data.hookBrief || 'Create an attention-grabbing opening that immediately draws the reader in, includes the primary keyword naturally, and satisfies search intent.'}
• Structure:
  - Introduction: ${articleSize.sections?.intro || Math.round(articleSize.wordCount * 0.1)} words (start with the specified hook type, include primary keyword in first paragraph)
  - Main Body: ${articleSize.sections?.body || Math.round(articleSize.wordCount * 0.8)} words (divided into ${articleSize.h2} main H2 sections with primary/secondary keywords in subheadings)
  - Conclusion: ${articleSize.sections?.conclusion || Math.round(articleSize.wordCount * 0.1)} words ${data.includeConclusion ? '(summarize key points, include primary keyword, and add call-to-action)' : '(brief summary with primary keyword mention)'}
• Format: ${articleSize.h2} H2 sections with appropriate H3 subsections

2. KEYWORD OPTIMIZATION:
• Primary Keyword Usage:
  - Include in title (preferably near the beginning)
  - Include in first paragraph (within first 100 words)
  - Include in at least one H2 heading
  - Include in conclusion
  - Natural distribution throughout content (approximately every 200-300 words)
  - Include exact match 3-4 times, semantic variations 4-5 times
• LSI Keywords: Include semantic variations of the main keyword throughout
${data.longTailKeywords ? `• Long-Tail Keywords: Include these specific long-tail variations:\n${data.longTailKeywords}` : ''}
• Avoid keyword stuffing: Maintain a natural, reader-friendly flow
${data.includeBold ? '• Bold primary and secondary keywords 1-2 times each (not every instance)' : ''}
• SEO Keywords to include: ${seoKeywordsString}

3. Writing Style:
• Adopt a natural, organic, and casual tone optimized for both readers and search engines
• Simple Vocabulary: Opt for everyday language, avoiding jargon or complex terminology for better readability scores
• Write with a unique tone and creativity, influencing the article's voice and making the content feel more personal and engaging
• Readability: Use formatting like bold, italics, bullet points, and short paragraphs to improve clarity and increase time on page
• Conversational and Relatable Tone: Write as if engaging in a one-on-one conversation with the reader. Use second-person pronouns like "you" to create intimacy and relatability
${data.pointOfView !== 'None' ? `• Point of View: Write from a ${data.pointOfView} perspective for better engagement.` : ''}
• Stylish and Trend-Conscious: Reflect contemporary trends relevant to the topic. Use vivid descriptions to help readers visualize concepts and settings
• Witty and Clever Insights: Incorporate subtle humor, clever analogies, and questions to keep the content engaging and reduce bounce rate
• Anecdotal and Storytelling Elements: Include relevant anecdotes or personal insights to illustrate points, enhancing engagement and memorability
• Authoritative Yet Approachable: Demonstrate expertise and deep knowledge of the subject matter while maintaining a friendly and approachable tone
• Attention to Detail and Aesthetics: Ensure descriptions are precise and detailed, reflecting a keen sense of style and alignment with ${data.tone || 'Professional'} aesthetic
• Use a mix of simple, compound, and complex sentences with varied lengths for a more human-like rhythm to the text
• Show originality, humor, and creativity with unexpected angles, personal anecdotes, and novel ideas
• Write with great logical flow, with coherent transitions between ideas and sections

4. DOCUMENT ELEMENTS FOR SEO:
${data.includeConclusion ? '• CONCLUSION: Include a strong, keyword-rich conclusion that summarizes key points and includes a clear call-to-action. Include the primary keyword at least once in the conclusion to reinforce relevance.' : ''}
${data.includeTables ? '• TABLES: Create data-rich, comparison tables that could generate rich snippets in search results. Include clear headers with semantic keywords and ensure the data is well-structured for potential structured data marking.' : ''}
${data.includeH3 ? '• H3 SUBHEADINGS: Use descriptive H3 subheadings with secondary and long-tail keywords throughout the content. H3 headings should follow a logical hierarchy under H2 sections and strengthen topical relevance.' : ''}
${data.includeLists ? '• LISTS: Create both bulleted and numbered lists for scannable content that can appear as featured snippets. Lists should be preceded by a keyword-rich sentence that could serve as the snippet title.' : ''}
${data.includeItalics ? '• ITALICS: Use italics for emphasis on important concepts, specialized terms, and phrases that are semantically related to the main keyword. This helps highlight key points for both readers and search engines.' : ''}
${data.includeQuotes ? '• QUOTES: Include relevant quotes from authoritative sources to boost EAT signals. Each quote should be properly attributed and add contextual value to the surrounding content, reinforcing topical expertise.' : ''}
${data.includeKeyTakeaways ? '• KEY TAKEAWAYS: Add "Key Takeaways" sections at the end of major points that summarize critical information in 3-5 bullet points. Format these for possible featured snippet selection by Google.' : ''}
${data.includeFAQs ? '• FAQ SECTION: Create a dedicated FAQ section with 5-7 semantically relevant questions that target "People Also Ask" opportunities. Structure questions using natural language that matches search intent and conversational queries.' : ''}
${data.includeBold ? '• BOLD TEXT: Strategically bold primary and secondary keywords (1-2 times each) throughout the content. Do not bold every instance, but focus on key placements like first paragraph, subheadings, and conclusion.' : ''}

5. SEO Optimization:
• Integrate the main keyword and secondary keywords naturally throughout the text
• Utilize headings and subheadings with keywords where appropriate
• Craft a compelling meta description (~155 characters) that includes the main keyword and encourages clicks
• Optimize for featured snippets with concise definitions, step-by-step instructions, or clear answers to common questions
• Create scannable content with short paragraphs (2-4 sentences maximum)
• Use bucket brigades to increase dwell time (e.g., "But there's more...", "Here's the interesting part...")
${data.internalLinkingWebsite || data.internalLinks ? `• Internal Linking Strategy:
  - Link to these relevant internal pages: ${data.internalLinkingWebsite || data.internalLinks}
  - Use exact match or partial match anchor text (not generic "click here")
  - Distribute internal links evenly throughout the content
  - Use descriptive anchor text that includes target keywords where appropriate` : ''}
${data.externalLinkType || data.links ? `• External Linking Strategy:
  - Link to these authoritative sources: ${data.externalLinkType || data.links}
  - Use relevant anchor text
  - Only link to high-authority websites to boost EAT signals` : ''}

6. EEAT Compliance:
• Demonstrate Experience: Include expert insights, data, statistics, and studies
• Show Expertise: Provide accurate and detailed information with depth and clarity
• Establish Authoritativeness: Reference credible sources or including quotes from experts
• Build Trustworthiness: Present balanced viewpoints, fact-check information, and maintain accuracy

7. Content Variety and Image Suggestions:
• Include exactly ${data.numberOfImagePrompts || 5} image suggestions throughout the content
• Format image suggestions as: "Insert image of [detailed description]" 
• Place image suggestions at strategic points to enhance understanding and break up text
${data.imageDetails ? `• Include these specific image concepts: ${data.imageDetails}` : ''}
${data.customImagePrompts ? `• Follow these image style guidelines: ${data.customImagePrompts}` : ''}
${data.includeTables ? '• Include tables to organize complex information or data for better comprehension and featured snippet opportunities' : ''}
${data.includeLists ? '• Use bullet points and numbered lists to break down complex information and improve readability' : ''}
${data.includeKeyTakeaways ? '• Add "Key Takeaways" sections at the end of major points to summarize important information' : ''}

8. Additional Guidelines:
• Target Audience: ${data.targetAudience || data.mainKeyword}
• Length: Aim for a word count of ${articleSize.range || articleSize.wordCount} words
• Readability Level: ${data.textReadability || '8th & 9th grade'}. ${(data.textReadability || '').includes('grade') ? 'Simple sentences and paragraphs for better readability scores.' : 'Adjust complexity for your target audience.'}
• Originality: Ensure the content is original, free of plagiarism, and not AI-detectable
• Formatting: Use proper formatting with short paragraphs, bullet points, and numbered lists where appropriate
• Tone Consistency: Maintain the ${data.tone || 'Professional'} tone consistently throughout the article
${data.aiContentCleaning && data.aiContentCleaning !== 'No AI Words Removal' ? '• AI Content Cleaning: ' + data.aiContentCleaning + '. Create unique, natural-sounding content that passes AI detection.' : ''}
${data.brandVoice ? '• Brand Voice: ' + data.brandVoice : ''}
• Language and Locale: Use ${data.language} with regional considerations for ${data.country}
${data.additionalInstructions ? '\nAdditional Specific Instructions:\n' + data.additionalInstructions : ''}
${optInInstructions}

Information Provided:
• Main Keyword/Question: ${data.mainKeyword}
• Content Title: ${data.title || data.mainKeyword}
${data.seoKeywords ? `• SEO Keywords: ${data.seoKeywords}` : ''}
${data.longTailKeywords ? `• Long-tail Keywords: ${data.longTailKeywords}` : ''}
${data.faqs ? `• Frequently Asked Questions (FAQs) to target in "People Also Ask": 
${data.faqs}` : ''}
${data.imageDetails ? `• Image details to incorporate: ${data.imageDetails}` : ''}
${data.links || data.externalLinkType ? `• External links to include: ${data.links || data.externalLinkType}` : ''}

FINAL OUTPUT REQUIREMENTS:
• INCLUDE META TITLE SUGGESTION: Create an SEO-optimized title tag (55-60 characters) with main keyword near beginning
• INCLUDE META DESCRIPTION: Create a compelling meta description (150-155 characters) with keyword and call-to-action
• INCLUDE URL SLUG SUGGESTION: Propose a short, keyword-rich URL slug
• INCLUDE SCHEMA MARKUP SUGGESTIONS: Recommend appropriate schema for this content type
${data.enableOptIn ? `• INCLUDE EMAIL OPT-IN FORM: Add an email sign-up form with text "${data.optInText}"` : ''}

FORMAT THE OUTPUT AS REGULAR TEXT CONTENT:
- Clear section titles and subtitles
- Properly spaced paragraphs (2-4 sentences per paragraph for readability)
- Use ** for bold text and * for italic text when needed
- Use dashes or numbers for lists
- Include meta title, meta description, and URL suggestions at the end`;

    return template;
  };

  // SEO-focused content template generator for API calls - Updated with opt-in functionality
  const generateContentTemplate = (data: FormData) => {
    // Get article size with original structure
    const articleSize = getArticleSize(data.wordCount);
    const seoKeywordsString = data.seoKeywords || data.mainKeyword;
    
    // Add opt-in section if enabled
    let optInSection = '';
    if (data.enableOptIn) {
      optInSection = `
OPT-IN FORM:
• Include an email newsletter opt-in form with text: "${data.optInText}"
• Placement: ${data.optInPlacement === 'top' ? 'At the top of the article' : data.optInPlacement === 'after-content' ? 'After the main content, before conclusion' : 'At the bottom of the article'}
• Design: ${data.optInDesign === 'standard' ? 'Standard design with checkbox and label' : data.optInDesign === 'minimalist' ? 'Minimalist design with subtle styling' : 'Prominent design with highlighted box and call-to-action'}
• Requirement: ${data.optInRequired ? 'Required opt-in' : 'Optional opt-in'}
• Format it as: "Insert email opt-in form: [${data.optInText}]"`;
    }
    
    return `
Create a high-quality, SEO-optimized ${data.articleType !== 'None' ? data.articleType : 'blog post'} for the main keyword [${data.mainKeyword}] with the following specifications:

SEO REQUIREMENTS:
• Target Keyword: ${data.mainKeyword}
• Secondary Keywords: ${seoKeywordsString}
${data.longTailKeywords ? `• Long-tail Keywords: ${data.longTailKeywords}` : ''}
• Word Count: ${articleSize.range || articleSize.wordCount} words (optimal for competitive rankings)
• Title Tag: Create an SEO-optimized title (55-60 chars) with keyword near beginning
• Meta Description: Create a compelling description (150-155 chars) with keyword + CTA
• URL Slug: Suggest a keyword-rich URL slug (3-5 words, including main keyword)

CONTENT STRUCTURE:
• Title: ${data.title || `Create SEO-optimized H1 for: ${data.mainKeyword}`}
• Introduction: Start with a ${data.introductoryHook || data.hookType || 'engaging'} hook, include main keyword in first 100 words
• Main Sections: ${articleSize.h2} H2 headings with keywords in subheadings
${data.includeH3 ? '• Use H3 subheadings with secondary keywords throughout' : ''}
${data.includeConclusion ? '• Include a strong conclusion with main keyword and call-to-action' : ''}

KEYWORD PLACEMENT:
• Include main keyword in first paragraph, H2 headings, and conclusion
• Use natural keyword density (approximately every 200-300 words)
• Include semantic variations throughout
${data.longTailKeywords ? '• Incorporate the provided long-tail keywords throughout the content' : ''}
${data.includeBold ? '• Bold main keyword and secondary keywords 1-2 times each' : ''}

DOCUMENT ELEMENTS (REQUIRED):
${data.includeConclusion ? '• CONCLUSION: Include a keyword-rich conclusion that summarizes key points and includes a clear call-to-action.' : ''}
${data.includeTables ? '• TABLES: Create comparison tables for featured snippet opportunities with semantic keywords in headers.' : ''}
${data.includeH3 ? '• H3 SUBHEADINGS: Use keyword-rich H3 subheadings throughout to improve content hierarchy and SEO.' : ''}
${data.includeLists ? '• LISTS: Create bulleted and numbered lists preceded by keyword-rich sentences for featured snippets.' : ''}
${data.includeItalics ? '• ITALICS: Use italics for emphasis on important terms related to the main topic.' : ''}
${data.includeQuotes ? '• QUOTES: Include relevant authoritative quotes that boost EAT signals and topical expertise.' : ''}
${data.includeKeyTakeaways ? '• KEY TAKEAWAYS: Add "Key Takeaways" sections with 3-5 bullet points for featured snippets.' : ''}
${data.includeFAQs ? '• FAQ SECTION: Create a dedicated FAQ section targeting "People Also Ask" opportunities with natural language questions.' : ''}
${data.includeBold ? '• BOLD TEXT: Strategically bold keywords in key placements (first paragraph, subheadings, conclusion).' : ''}

AUDIENCE & STYLE:
• Target Audience: ${data.targetAudience || "Research and identify target audience"}
• Tone: ${data.tone || 'Professional'} (authoritative and trustworthy for better EAT signals)
• Readability: ${data.textReadability || '8th & 9th grade'} (short paragraphs, simple sentences)
• Point of View: ${data.pointOfView !== 'None' ? data.pointOfView : 'Appropriate for topic'}
• Language: ${data.language} with regional terms for ${data.country}

IMAGE SUGGESTIONS:
• Include ${data.numberOfImagePrompts || 5} image suggestions throughout the content
• Format as "Insert image of [detailed description]"
${data.imageDetails ? `• Include these image concepts: ${data.imageDetails}` : ''}
${data.customImagePrompts ? `• Image style guidelines: ${data.customImagePrompts}` : ''}
${optInSection}

${data.faqs ? `FAQS TO TARGET IN "PEOPLE ALSO ASK":\n${data.faqs}` : ''}

${data.internalLinkingWebsite || data.internalLinks ? `INTERNAL LINKS TO INCLUDE:\n${data.internalLinkingWebsite || data.internalLinks}` : ''}

${data.links || data.externalLinkType ? `EXTERNAL LINKS TO INCLUDE:\n${data.links || data.externalLinkType}` : ''}

${data.additionalInstructions ? `ADDITIONAL INSTRUCTIONS:\n${data.additionalInstructions}` : ''}

${data.aiContentCleaning && data.aiContentCleaning !== 'No AI Words Removal' ? `AI CONTENT CLEANING: ${data.aiContentCleaning}. Create unique, natural content that passes AI detection.` : ''}

FINAL DELIVERABLES:
1. Complete SEO-optimized content (${articleSize.range || articleSize.wordCount} words)
2. Suggested meta title (55-60 chars)
3. Suggested meta description (150-155 chars)
4. Suggested URL slug
5. Schema markup recommendations
${data.enableOptIn ? `6. Email newsletter opt-in form with text: "${data.optInText}"` : ''}

FORMAT AS PLAIN TEXT with:
- Clear section titles and subtitles
- Short paragraphs (2-4 sentences max)
- ** for bold text and * for italic text
- Dashes or numbers for lists
`;
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

  // Generate Title using selected API
  const generateTitle = async () => {
    if (!checkApiConfig()) return;
    
    setIsGeneratingTitle(true);
    try {
      const systemPrompt = 'You are a professional SEO content writer. Create a single catchy, engaging, and SEO-friendly blog post title for the given keyword. Do not include quotes around the title. Do not provide any explanation, alternatives, or additional text - only return the exact title to use. Keep it under 70 characters for optimal SEO. The title should be compelling and make readers want to click.';
      const userPrompt = `Create an SEO optimized blog post title for the keyword: ${formData.mainKeyword}`;
      
      const result = await generateContent(
        apiConfig,
        userPrompt,
        {
          systemPrompt,
          temperature: 0.7,
          maxTokens: 50
        }
      );
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to generate title');
      }
      
      const generatedTitle = result.data?.content?.trim() || '';
      setFormData(prev => ({
        ...prev,
        title: generatedTitle,
      }));
      
      return generatedTitle;
    } catch (error) {
      console.error('Error generating title:', error);
      setApiError(error instanceof Error ? error.message : 'Failed to generate title');
    } finally {
      setIsGeneratingTitle(false);
    }
  };

  // Generate SEO keywords using the selected API - UPDATED
  const generateSEOKeywords = async () => {
    if (!checkApiConfig()) return;

    setIsGeneratingKeywords(true);
    try {
      // Updated prompt to match your specified format
      const systemPrompt = 'You are an SEO expert.';
      const userPrompt = `Generate a list of the 5 best SEO keywords for the following topic: ${formData.mainKeyword}. Provide only the keywords in a bullet list. Do not include any additional information, explanations, intros, or outros.`;
      
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

  // Generate Long Tail Keywords using the selected API - NEW FUNCTION
  const generateLongTailKeywords = async () => {
    if (!checkApiConfig()) return;

    setIsGeneratingLongTailKeywords(true);
    try {
      const systemPrompt = 'You are an SEO expert.';
      const userPrompt = `Generate a list of 3 long-tail or related keywords for the topic: ${formData.mainKeyword}. Provide only the keywords in a bulleted list. Do not add any explanations, intros, or outros.`;
      
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
        throw new Error(result.error || 'Failed to generate long-tail keywords');
      }

      const generatedLongTailKeywords = result.data?.content || '';
      setFormData(prev => ({
        ...prev,
        longTailKeywords: generatedLongTailKeywords,
      }));
    } catch (error) {
      console.error('Error generating long-tail keywords:', error);
      setApiError(error instanceof Error ? error.message : 'Failed to generate long-tail keywords');
    } finally {
      setIsGeneratingLongTailKeywords(false);
    }
  };

  // Generate FAQs using the selected API - UPDATED FOR SEO OPTIMIZATION
  const generateFAQs = async () => {
    if (!checkApiConfig()) return;

    setIsGeneratingFAQs(true);
    try {
      const systemPrompt = 'You are an SEO specialist focusing on FAQ optimization for search engines. Create 5 concise FAQs that target high-search-volume questions related to the keyword. Format each as a numbered list with Q: and A: prefixes. Make questions conversational (how, what, why, can, etc.) and answers brief (1-2 sentences max) while including the main keyword naturally. Optimize specifically for Google\'s "People Also Ask" feature. Use natural language without keyword stuffing.';
      const userPrompt = `Generate 5 SEO-optimized FAQs for the topic: ${formData.mainKeyword}. Focus on short, direct answers that would appear in Google's "People Also Ask" boxes.`;
      
      const result = await generateContent(
        apiConfig, 
        userPrompt,
        {
          systemPrompt,
          temperature: 0.2,
          maxTokens: 600
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

  // Generate Target Audience using the selected API - UPDATED FOR BREVITY AND SEO USEFULNESS
  const generateTargetAudience = async () => {
    if (!checkApiConfig()) return;

    setIsGeneratingTargetAudience(true);
    try {
      const systemPrompt = 'You are an SEO strategist. Create an extremely concise target audience profile that will help optimize content. Format as 3-5 bullet points covering only: core demographics, primary search intent, and key pain points they\'re solving. Total length under 60 words. Be specific and actionable for content creation.';
      const userPrompt = `Create a concise, SEO-focused target audience profile for: ${formData.mainKeyword}`;
      
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
    if (!checkApiConfig()) return;

    setIsGeneratingLinks(true);
    try {
      const systemPrompt = 'You are an SEO expert. Find 2-3 high-authority external resources (websites, studies, or articles) related to the given topic that would be valuable for building EAT signals in content. Provide ONLY the URLs in the format: "1. URL1\n2. URL2" - Do not include any explanations, comments, or additional text.';
      const userPrompt = `Find high-authority external resources for the topic: ${formData.mainKeyword}`;
      
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
      // Support both field names for compatibility
      setFormData(prev => ({
        ...prev,
        externalLinkType: generatedLinks,
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
    if (!checkApiConfig()) return;

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
      const systemPrompt = 'You are an SEO and internal linking expert. Your task is to select the 3 most relevant URLs from a provided list that would make good internal links for an article on the main topic. Format your response as: "1. [full URL] - Suggested anchor text: [anchor text]" where the anchor text includes relevant keywords for SEO but remains natural and useful for readers.';
      const userPrompt = `I'm writing an SEO article about "${formData.mainKeyword}" for my website ${websiteUrl}.\n\nHere's a list of URLs from my website:\n${websiteUrls}\n\nSelect the 3 most relevant URLs from this list that would make good internal links for my article. For each URL, suggest appropriate keyword-rich anchor text for SEO.`;
      
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
      // Support both field names for compatibility
      setFormData(prev => ({
        ...prev,
        internalLinkingWebsite: generatedInternalLinks,
        internalLinks: generatedInternalLinks,
      }));
    } catch (error) {
      console.error('Error generating internal links:', error);
      setApiError(error instanceof Error ? error.message : 'Failed to generate internal links');
    } finally {
      setIsGeneratingInternalLinks(false);
    }
  };

  // Generate actual content using API
  const generateContentWithAPI = async () => {
    if (!checkApiConfig()) return;
    
    if (!formData.title.trim()) {
      setApiError('Please enter a title for your content.');
      return;
    }

    setIsGenerating(true);
    setApiError(null);
    
    try {
      // Choose the right template based on output format
      let contentTemplate = '';
      if (outputFormat === 'blogPost') {
        contentTemplate = generateBlogPostTemplate(formData);
      } else {
        contentTemplate = generateContentTemplate(formData);
      }
      
      const systemPrompt = 'You are an expert SEO content writer specializing in creating high-quality, search engine optimized content. You excel at writing engaging, valuable content that ranks well in search engines while providing real value to readers. Focus on proper keyword placement, semantic relevance, and content structure that performs well in search results.';

      // Generate the main content
      const result = await generateContent(
        apiConfig,
        contentTemplate,
        {
          systemPrompt,
          temperature: 0.7,
          maxTokens: 4000
        }
      );
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to generate content');
      }
      
      let finalContent = result.data?.content || '';
      
      setGeneratedContent(finalContent);
      
      if (onSubmit) {
        onSubmit({
          ...formData,
          generatedContent: finalContent
        });
      }
    } catch (error) {
      console.error('Error generating content:', error);
      setApiError(error instanceof Error ? error.message : 'Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleCheckboxChange = (field: keyof FormData, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for required fields first
    if (!formData.mainKeyword.trim()) {
      setApiError('Please enter a main keyword first.');
      return;
    }
    
    setApiError(null); // Clear any previous errors
    
    if (generationMode === 'content') {
      // For content generation, we need a title
      if (!formData.title.trim()) {
        setApiError('Please enter a title for your content.');
        return;
      }
      generateContentWithAPI();
    } else {
      // Generate prompt locally instead of using API
      try {
        // Choose template based on output format
        let prompt = '';
        if (outputFormat === 'blogPost') {
          prompt = generateBlogPostTemplate(formData);
        } else {
          prompt = generatePromptTemplate(formData);
        }
        
        setGeneratedPrompt(prompt);
        
        if (onSubmit) {
          onSubmit({
            ...formData,
            generatedPrompt: prompt
          });
        }
      } catch (error) {
        console.error('Error generating prompt:', error);
        setApiError('Failed to generate prompt template.');
      }
    }
  };

  return {
    formData,
    generatedContent,
    generatedPrompt,
    apiConfig,
    apiError,
    isGenerating,
    isGeneratingKeywords,
    isGeneratingLongTailKeywords,
    isGeneratingFAQs,
    isGeneratingTargetAudience,
    isGeneratingTitle,
    isGeneratingLinks,
    isGeneratingInternalLinks,
    handleInputChange,
    handleCheckboxChange,
    handleSubmit,
    generateSEOKeywords,
    generateLongTailKeywords,
    generateFAQs,
    generateTargetAudience,
    generateTitle,
    generateLinks,
    generateInternalLinks,
    websiteUrl,
    setWebsiteUrl,
    websiteUrls,
    setWebsiteUrls,
    outputFormat,
    setOutputFormat
  };
};