import { API_ENDPOINTS, DEFAULT_MODELS, getApiConfig } from '../../blog-content-generator/utils/apiConstants';
import { 
  TitleGeneratorRequest, 
  TitleGeneratorResponse,
  DescriptionGeneratorRequest,
  DescriptionGeneratorResponse,
  TagsGeneratorRequest,
  TagsGeneratorResponse,
  ArticleGeneratorRequest,
  ArticleGeneratorResponse,
  Provider,
  NicheType
} from '../types';

// Process API response based on provider - reusing same logic from blogContentGenerator
const processApiResponse = async (response: Response, provider: Provider) => {
  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Error: ${response.status}`);
    } catch (e) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }
  }

  try {
    const data = await response.json();
    
    if (provider === 'claude') {
      return data.content?.[0]?.text || '';
    } else if (provider === 'gemini') {
      // Gemini response format is different
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } else {
      return data.choices?.[0]?.message?.content || '';
    }
  } catch (error) {
    throw new Error('Failed to parse API response');
  }
};

// Get niche-specific instructions
const getNicheInstructions = (niche: NicheType): string => {
  const nicheInstructions: Record<NicheType, string> = {
    recipes: `
      This article relates to a food recipe. Ensure:
      - Clear, detailed ingredients list with measurements
      - Step-by-step preparation and cooking instructions
      - Preparation and cooking times
      - Serving size information
      - Nutritional information if possible
      - Tips for variations or substitutions
      - Storage and serving suggestions
      - High-quality descriptive language about taste and texture
    `,
    technology: `
      This article relates to technology. Ensure:
      - Accurate technical specifications and details
      - Balanced product/technology reviews with pros and cons
      - Comparison with competing products/technologies where relevant
      - Practical applications and use cases
      - Latest updates and version information
      - Accessibility explanations for technical concepts
      - Forward-looking trends or predictions when appropriate
    `,
    health: `
      This article relates to health and wellness. Ensure:
      - Science-backed information with references where possible
      - Clear explanation of health concepts and terminology
      - Balanced presentation of benefits and potential risks
      - Practical advice that readers can implement
      - Inclusion of expert perspectives when relevant
      - Disclaimers where appropriate (e.g., "consult with your doctor")
      - Sensitivity to different health conditions and situations
    `,
    finance: `
      This article relates to finance or money management. Ensure:
      - Clear explanation of financial concepts and terminology
      - Balanced presentation of risks and rewards
      - Factual information about financial products or strategies
      - Practical advice that readers can implement
      - Consideration of different financial situations
      - Disclaimers where appropriate (e.g., "not financial advice")
      - Current information with recent data points
    `,
    travel: `
      This article relates to travel. Ensure:
      - Practical information about the destination
      - Best times to visit and notable attractions
      - Tips about costs and budgeting
      - Suggested itineraries and activities
      - Information about restaurants, accommodations, and transportation
      - Tips for avoiding problems and enhancing the experience
    `,
    education: `
      This article relates to education. Ensure:
      - Innovative and effective teaching methods
      - Information supported by scientific and educational evidence
      - Strategies appropriate for different levels
      - Recommendations for useful educational resources and tools
      - Discussion of progress measurement and evaluation methods
      - Inclusion of practical exercises or tests
    `,
    fashion: `
      This article relates to fashion. Ensure:
      - Practical and seasonally appropriate tips
      - Discussion of current and upcoming trends
      - Options for various budgets and tastes
      - Suggestions for outfits and ways to reuse pieces
      - Tips for caring for clothes and accessories
      - Information about sustainability in fashion
    `,
    sports: `
      This article relates to sports. Ensure:
      - Detailed and correct exercises and techniques
      - Comprehensive and progressive training programs
      - Nutrition, rest, and recovery tips
      - Injury prevention information
      - Exercises customized for different fitness levels
      - Realistic goals and progress tracking methods
    `,
    beauty: `
      This article relates to beauty. Ensure:
      - Practical and easy-to-apply tips
      - Discussion of product ingredients and benefits
      - Natural and homemade alternatives
      - Suggested routines suitable for different types
      - Tips for different conditions (dry, oily, etc.)
      - Honest and balanced product reviews
    `,
    business: `
      This article relates to business. Ensure:
      - Practical and applicable strategies
      - Ideas supported by case studies and real examples
      - Discussion of potential challenges and solutions
      - Tips for startups and established companies
      - Information about financing, marketing, and management
      - Clarification of market trends and opportunities
    `
  };
  
  return nicheInstructions[niche] || '';
};

// Get SEO level instructions based on selected level
const getSeoLevelInstructions = (seoLevel: 'basic' | 'intermediate' | 'advanced'): string => {
  switch (seoLevel) {
    case 'basic':
      return `
### BASIC SEO OPTIMIZATION INSTRUCTIONS:
- Primary Keyword Usage:
  ✓ Include the focus keyword in the title
  ✓ Use the focus keyword in the first paragraph (within first 100 words)
  ✓ Include the focus keyword in at least one H2 heading
  ✓ Mention the focus keyword naturally in the conclusion
  ✓ Use the exact focus keyword 2-3 times throughout the content

- Content Structure:
  ✓ Use a clear hierarchical structure with H2 and H3 headings
  ✓ Keep paragraphs short (3-5 sentences) for better readability
  ✓ Use bullet points and numbered lists where appropriate
  ✓ Include a compelling introduction that immediately engages readers
  ✓ Write a strong conclusion with a clear takeaway

- Basic Meta Elements:
  ✓ Suggest a meta title (~60 characters) that includes the focus keyword
  ✓ Create a meta description (~155 characters) with the focus keyword
  ✓ Propose a simple URL slug that includes the focus keyword

- HTML Formatting:
  ✓ Format content with proper HTML elements (h2, h3, p, ul, ol, etc.)
  ✓ Use descriptive subheadings that include topically relevant terms
  ✓ Ensure proper spacing and formatting for readability

- User Experience Considerations:
  ✓ Write in a clear, straightforward manner appropriate for the target audience
  ✓ Ensure content fully addresses the topic and search intent
  ✓ Avoid keyword stuffing or unnatural language
      `;
    
    case 'intermediate':
      return `
### INTERMEDIATE SEO OPTIMIZATION INSTRUCTIONS:
- Everything in Basic SEO, plus:

- Enhanced Keyword Optimization:
  ✓ Use semantic variations of the focus keyword throughout
  ✓ Include related keywords and synonyms naturally in the content
  ✓ Optimize for long-tail variations of the main keyword
  ✓ Use LSI (Latent Semantic Indexing) keywords for better topic coverage

- Advanced Content Structure:
  ✓ Create a table of contents for longer articles (if over 1500 words)
  ✓ Use descriptive H2 and H3 headings that follow a logical hierarchy
  ✓ Include a "Key Takeaways" or "Summary" section
  ✓ Format content for featured snippet opportunities

- Strategic Linking:
  ✓ Include appropriate places for internal links (marked as [Internal Link Opportunity])
  ✓ Suggest external links to authoritative sources (marked as [External Link Opportunity])
  ✓ Use descriptive anchor text that includes relevant keywords

- Media Optimization:
  ✓ Suggest places for relevant images with descriptive alt text
  ✓ Recommend image placement for breaking up long text sections
  ✓ Suggest media types that would enhance the content

- FAQ Section:
  ✓ Include a FAQ section targeting "People Also Ask" opportunities
  ✓ Create 5-7 questions that address common user queries about the topic
  ✓ Provide concise answers (2-3 sentences) to each question

- Enhanced User Experience:
  ✓ Create content with strong "dwell time" potential (engaging enough to keep users on the page)
  ✓ Optimize for better CTR (click-through rate) with compelling headings
  ✓ Include bucket brigades to maintain reader interest
      `;
    
    case 'advanced':
      return `
### ADVANCED SEO OPTIMIZATION INSTRUCTIONS:
- Everything in Intermediate SEO, plus:

- Expert Keyword Optimization:
  ✓ Maintain optimal keyword density (1-2%) for primary and secondary keywords
  ✓ Implement advanced topic modeling with comprehensive semantic keyword usage
  ✓ Strategically place keywords in H2, H3, bold text, and first/last sentences of paragraphs
  ✓ Optimize for multiple keyword variations and search intents within the same content

- Rich Schema Markup Implementation:
  ✓ Structure content to support appropriate schema markup (Article, HowTo, FAQ, etc.)
  ✓ Format FAQ sections for FAQ schema implementation
  ✓ Include appropriate structured data elements based on content type
  ✓ Explicitly suggest schema type in a comment at the end of the article

- E-E-A-T Signal Enhancement:
  ✓ Demonstrate Experience, Expertise, Authoritativeness, and Trustworthiness
  ✓ Include fact-based statements with authoritative sources
  ✓ Provide comprehensive, accurate information that showcases subject expertise
  ✓ Address potential objections or counterarguments in a balanced way

- Content Cluster Integration:
  ✓ Position the content within a broader topic cluster
  ✓ Suggest related subtopics for internal linking opportunities
  ✓ Recommend pillar content connections for strengthening topical authority
  ✓ Include appropriate contextual links to establish content relationships

- User Intent Optimization:
  ✓ Address multiple user intents (informational, commercial, transactional)
  ✓ Provide clear, actionable information for each intent type
  ✓ Include comparison elements for commercial intent
  ✓ Add clear steps or processes for task-completion intent

- Mobile Optimization Guidelines:
  ✓ Create easily scannable content with clear subheadings
  ✓ Keep paragraphs extremely short for mobile readability (1-3 sentences)
  ✓ Break up content with frequent headings (every 300 words or less)
  ✓ Use bullet points and numbered lists liberally
      `;
    
    default:
      // Default to intermediate if level is not recognized
      return getSeoLevelInstructions('intermediate');
  }
};

// Function to generate instructions based on SEO content elements
const getSeoElementsInstructions = (params: ArticleGeneratorRequest): string => {
  // Build instructions based on enabled elements (default to true if not specified)
  const elements = [];
  
  // Bold keywords
  if (params.includeBold !== false) {
    elements.push(`
- Bold Keywords:
  ✓ Make all instances of the focus keyword "${params.focusKeyword}" bold
  ✓ Bold important related terms and secondary keywords
  ✓ Use bold formatting for key statistics or data points
  ✓ Format using <strong> tags or markdown **bold syntax**`);
  }
  
  // H3 subheadings
  if (params.includeH3 !== false) {
    elements.push(`
- H3 Subheadings:
  ✓ Use descriptive H3 subheadings under main H2 sections
  ✓ Include related keywords in H3 headings
  ✓ Keep H3 headings concise (under 60 characters)
  ✓ Maintain logical hierarchy (H2 > H3)`);
  }
  
  // Bullet lists
  if (params.includeLists !== false) {
    elements.push(`
- Bullet & Numbered Lists:
  ✓ Use bullet lists for non-sequential items
  ✓ Use numbered lists for sequential steps or ranked items
  ✓ Keep list items consistent in structure and length
  ✓ Begin each list item with action words when appropriate`);
  }
  
  // Tables
  if (params.includeTables !== false) {
    elements.push(`
- Data Tables:
  ✓ Include at least one comparison or data table
  ✓ Use clear column headers with relevant keywords
  ✓ Format tables for potential featured snippets
  ✓ Keep tables simple and mobile-friendly`);
  }
  
  // Internal links
  if (params.includeInternalLinks !== false) {
    elements.push(`
- Internal Links:
  ✓ Indicate opportunities for internal linking with [Internal Link: relevant anchor text]
  ✓ Use descriptive, keyword-rich anchor text
  ✓ Suggest 3-5 internal linking opportunities throughout the article
  ✓ Link to topically relevant content${params.internalLink ? `\n  ✓ Include the provided internal link: ${params.internalLink}` : ''}`);
  }
  
  // External links
  if (params.includeExternalLinks !== false) {
    elements.push(`
- External Links:
  ✓ Indicate opportunities for external linking with [External Link: description]
  ✓ Suggest linking to authoritative sources in the industry
  ✓ Use relevant anchor text for external links
  ✓ Include 2-3 external linking opportunities${params.externalLink ? `\n  ✓ Include the provided external link: ${params.externalLink}` : ''}`);
  }
  
  // FAQ section
  if (params.includeFAQs !== false) {
    elements.push(`
- FAQ Section:
  ✓ Create a dedicated FAQ section at the end of the article
  ✓ Include 5-7 frequently asked questions about the topic
  ✓ Format questions to target "People Also Ask" opportunities
  ✓ Provide concise, valuable answers (2-3 sentences each)
  ✓ Structure for potential FAQ schema markup`);
  }
  
  // Key takeaways
  if (params.includeKeyTakeaways !== false) {
    elements.push(`
- Key Takeaways:
  ✓ Include a "Key Takeaways" section before the conclusion
  ✓ Summarize 3-5 main points from the article
  ✓ Format as a bulleted list for quick scanning
  ✓ Include the focus keyword in at least one takeaway`);
  }
  
  // Join all enabled elements
  return elements.join("\n");
};

// Generate article titles
export const generateTitles = async (
  params: TitleGeneratorRequest
): Promise<TitleGeneratorResponse> => {
  try {
    const provider = params.provider || localStorage.getItem('preferred_provider') as Provider || 'perplexity';
    const { apiKey, model: defaultModel, endpoint } = getApiConfig(provider);
    const selectedModel = params.model || defaultModel;
    
    if (!apiKey) {
      return {
        titles: [],
        error: `No API key found for ${provider}. Please set your API key in the API Settings.`
      };
    }

    // Use custom prompt if provided, otherwise use default
    const promptText = params.customPrompt || `
      You are a professional copywriter who creates engaging, SEO-friendly titles with a friendly tone. Follow these rules:
      1. Write 10 titles for "${params.focusKeyword}" using the exact phrase "${params.focusKeyword}"
      2. Keep titles under 65 characters.
      3. Ensure the keyword appears early in the title.
      4. Use hooks like "How", "Why", or "Best" to spark curiosity.
      5. Mix formats: lists, questions, and how-tos.
      6. Avoid quotes, markdown, or self-references.
      7. Prioritize SEO words related to ${params.focusKeyword}.
      8. Title should include a random number based on the keyword.
      
      Return only a list of 10 titles, one per line, without any additional text, numbering, or formatting.
    `;

    let response;
    
    // Different request format for each provider
    if (provider === 'claude') {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [{ role: 'user', content: promptText }],
          max_tokens: 1024
        })
      });
    } else if (provider === 'gemini') {
      // Gemini API format
      response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${selectedModel}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: promptText }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
            topP: 0.9,
            topK: 40
          }
        })
      });
    } else {
      // Works for OpenAI, Perplexity, DeepSeek
      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            { role: 'system', content: 'You are an expert in SEO content writing.' },
            { role: 'user', content: promptText }
          ],
          max_tokens: 1024
        })
      });
    }

    const content = await processApiResponse(response, provider);
    
    // Extract titles from response
    return {
      titles: content.split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#') && !line.startsWith('*') && !line.startsWith('-'))
        .slice(0, 10)
    };

  } catch (error) {
    console.error('Error generating article titles:', error);
    return {
      titles: [],
      error: error instanceof Error ? error.message : 'Failed to generate article titles'
    };
  }
};

// Generate Meta descriptions
export const generateDescriptions = async (
  params: DescriptionGeneratorRequest
): Promise<DescriptionGeneratorResponse> => {
  try {
    const provider = params.provider || localStorage.getItem('preferred_provider') as Provider || 'perplexity';
    const { apiKey, model: defaultModel, endpoint } = getApiConfig(provider);
    const selectedModel = params.model || defaultModel;
    
    if (!apiKey) {
      return {
        descriptions: [],
        error: `No API key found for ${provider}. Please set your API key in the API Settings.`
      };
    }

    // Use custom prompt if provided, otherwise use default
    const promptText = params.customPrompt || `
      You are an SEO content strategy expert who writes compelling descriptions for blogs. Follow these rules:
      1. Write 10 descriptions for blog post titled "${params.metaTitle}".
      2. Use the exact phrase "${params.focusKeyword}" naturally in each description.
      3. Keep descriptions under 160 characters (ideal for SEO).
      4. Start with a hook: ask a question, use action verbs, or highlight a pain point.
      5. Include SEO words related to the topic and address user intent (tips, solutions).
      6. End with a light call to action like "Discover", "Learn", "Try".
      7. Avoid quotes, markdown, or self-references.
      8. Keep tone friendly and conversational.
      
      Return only a list of 10 descriptions, one per line, without any additional text, numbering, or formatting.
    `;

    let response;
    
    // Different request format for each provider
    if (provider === 'claude') {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [{ role: 'user', content: promptText }],
          max_tokens: 1024
        })
      });
    } else if (provider === 'gemini') {
      // Gemini API format
      response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${selectedModel}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: promptText }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
            topP: 0.9,
            topK: 40
          }
        })
      });
    } else {
      // Works for OpenAI, Perplexity, DeepSeek
      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            { role: 'system', content: 'You are an expert in SEO content strategy.' },
            { role: 'user', content: promptText }
          ],
          max_tokens: 1024
        })
      });
    }

    const content = await processApiResponse(response, provider);
    
    // Extract descriptions from response
    return {
      descriptions: content.split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#') && !line.startsWith('*') && !line.startsWith('-'))
        .slice(0, 10)
    };

  } catch (error) {
    console.error('Error generating meta descriptions:', error);
    return {
      descriptions: [],
      error: error instanceof Error ? error.message : 'Failed to generate meta descriptions'
    };
  }
};

// Generate tags
export const generateTags = async (
  params: TagsGeneratorRequest
): Promise<TagsGeneratorResponse> => {
  try {
    const provider = params.provider || localStorage.getItem('preferred_provider') as Provider || 'perplexity';
    const { apiKey, model: defaultModel, endpoint } = getApiConfig(provider);
    const selectedModel = params.model || defaultModel;
    
    if (!apiKey) {
      return {
        tags: [],
        error: `No API key found for ${provider}. Please set your API key in the API Settings.`
      };
    }

    // Use custom prompt if provided, otherwise use default
    const promptText = params.customPrompt || `
      You are an SEO content strategy expert who writes compelling blog articles.
      Based on the keyword "${params.focusKeyword}" and meta description "${params.metaDescription}" 
      write 7 WordPress meta tags separated by commas.
      
      Return only the tags in a comma-separated list, without any additional text or formatting.
    `;

    let response;
    
    // Different request format for each provider
    if (provider === 'claude') {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [{ role: 'user', content: promptText }],
          max_tokens: 1024
        })
      });
    } else if (provider === 'gemini') {
      // Gemini API format
      response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${selectedModel}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: promptText }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
            topP: 0.9,
            topK: 40
          }
        })
      });
    } else {
      // Works for OpenAI, Perplexity, DeepSeek
      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            { role: 'system', content: 'You are an expert in SEO content strategy.' },
            { role: 'user', content: promptText }
          ],
          max_tokens: 1024
        })
      });
    }

    const content = await processApiResponse(response, provider);
    
    // Extract tags from response - split by commas
    return {
      tags: content
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag && !tag.startsWith('#') && !tag.startsWith('*') && !tag.startsWith('-'))
        .slice(0, 7)
    };

  } catch (error) {
    console.error('Error generating tags:', error);
    return {
      tags: [],
      error: error instanceof Error ? error.message : 'Failed to generate tags'
    };
  }
};

// Main function to generate article content
export const generateArticleContent = async (params: ArticleGeneratorRequest): Promise<ArticleGeneratorResponse> => {
  try {
    const {
      metaTitle,
      focusKeyword,
      metaDescription,
      niche,
      relatedKeywords,
      internalLink,
      externalLink,
      provider = 'openai',
      model,
      promptType = 'standard',
      seoLevel = 'intermediate'
    } = params;

    // Get API configuration
    const { apiKey, model: defaultModel, endpoint } = getApiConfig(provider as Provider);
    const selectedModel = model || defaultModel;
    
    if (!apiKey) {
      return {
        content: '',
        error: `No API key found for ${provider}. Please set your API key in the API Settings.`
      };
    }

    // Get niche-specific instructions
    const nicheInstructions = getNicheInstructions(niche);
    
    // Get SEO level instructions
    const seoLevelInstructions = getSeoLevelInstructions(seoLevel);
    
    // Get SEO elements instructions
    const seoElementsInstructions = getSeoElementsInstructions(params);

    // Construct the prompt based on prompt type and SEO level
    let promptText = `
# ARTICLE GENERATION TASK

You are an expert SEO content writer assigned to create a highly optimized article about "${focusKeyword}" that will rank well in search engines while providing valuable information to readers.

## ARTICLE DETAILS
- Title: "${metaTitle}"
- Focus Keyword: "${focusKeyword}"
- Meta Description: "${metaDescription}"
- Niche: ${niche}
${relatedKeywords ? `- Related Keywords: ${relatedKeywords}` : ''}

## NICHE-SPECIFIC GUIDELINES
${nicheInstructions}

## SEO OPTIMIZATION LEVEL: ${seoLevel.toUpperCase()}
${seoLevelInstructions}

## SEO CONTENT ELEMENTS
${seoElementsInstructions}

## CONTENT STRUCTURE REQUIREMENTS
1. Title (H1): Use the provided title or create a better one that includes the focus keyword
2. Introduction: Begin with an engaging hook that includes the focus keyword in the first 100 words
3. Main Body: 
   - Create appropriate H2 sections based on the topic
   - Include relevant H3 subsections where needed
   - Support main points with evidence, examples, and explanations
   - Format content for readability (short paragraphs, lists, etc.)
4. Conclusion: Summarize key points and include a call-to-action

## FORMATTING INSTRUCTIONS
- Use proper markdown formatting
- Format headings as: # (H1), ## (H2), ### (H3)
- Use **bold** for emphasis on keywords and important points
- Use bullet lists and numbered lists where appropriate
- Keep paragraphs short (3-5 sentences maximum)
- Maintain a conversational, engaging tone throughout
`;

    // Add advanced prompt elements if needed
    if (promptType === 'advanced') {
      promptText += `
## ADVANCED REQUIREMENTS
${internalLink ? `- Include this internal link naturally in the content: ${internalLink}` : ''}
${externalLink ? `- Include this external link to an authoritative source: ${externalLink}` : ''}
- Implement advanced on-page SEO techniques appropriate for ${seoLevel} optimization
- Structure content to support rich snippet opportunities
- Optimize for both search engines and reader engagement
- Include unique insights and valuable information not easily found elsewhere
`;
    }

    // Add final output instructions
    promptText += `
## FINAL DELIVERABLES
1. Complete, ready-to-publish article with proper formatting
2. Suggested meta title (if different from provided title)
3. Suggested meta description (if different from provided description)
4. Suggested URL slug (3-5 words including focus keyword)

Begin writing the article now. Focus on creating exceptional, valuable content that demonstrates E-E-A-T (Experience, Expertise, Authoritativeness, and Trustworthiness) while following all SEO best practices.
`;

    // System prompt for different providers
    const systemPrompt = `You are an expert SEO content writer and ${niche} specialist with deep knowledge of search engine optimization. You create content that ranks well in search engines while providing genuine value to readers. You follow current SEO best practices and write with clear structure, engaging style, and proper keyword optimization.`;

    // Construct API request based on provider
    let response;
    switch (provider) {
      case 'claude':
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: selectedModel,
            messages: [
              {
                role: 'system',
                content: systemPrompt
              },
              {
                role: 'user',
                content: promptText
              }
            ],
            max_tokens: 4000
          })
        });
        break;
      
      case 'gemini':
        // For Gemini, we construct the endpoint URL with the model and API key
        response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${selectedModel}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: systemPrompt + "\n\n" + promptText }]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 4000
            }
          })
        });
        break;
      
      case 'perplexity':
      case 'deepseek':
      default: // OpenAI and others
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: selectedModel,
            messages: [
              {
                role: 'system',
                content: systemPrompt
              },
              {
                role: 'user',
                content: promptText
              }
            ],
            max_tokens: 4000
          })
        });
    }

    const content = await processApiResponse(response, provider as Provider);
    
    return { content };
  } catch (error) {
    console.error('Error generating article content:', error);
    return {
      content: '',
      error: error instanceof Error ? error.message : 'Failed to generate article content'
    };
  }
};