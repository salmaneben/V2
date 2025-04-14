import { 
  NicheType, 
  PromptType, 
  PromptLevel, 
  Provider, 
  HookType,
  CountryType,
  LanguageType,
  ArticleSizeType,
  SerptFeatureType,
  UserIntentType,
  EeatSignalLevel
} from '../types';

import { ARTICLE_SIZES } from '../constants/articleSizes';

// ====== Original Template Functions (Enhanced) ======

// Niche-specific template instructions
export const getNicheInstructions = (niche: NicheType): string => {
  const nicheInstructions: Record<NicheType, string> = {
    recipes: `
For this recipe-related content, please include:
- Clear ingredient lists with measurements
- Step-by-step preparation instructions
- Cooking times and temperatures
- Nutritional information if applicable
- Serving suggestions and variations
- Tips for ingredient substitutions
- Commentary on flavor profile and texture
- Food pairing recommendations if relevant
    `,
    technology: `
For this technology-related content, please include:
- Clear explanations of technical concepts
- Balanced perspectives on the technology
- Current information and trends
- Practical applications and real-world examples
- Comparisons with alternatives if relevant
- Benefits and limitations
- Future developments or potential
- Target audience or use cases
    `,
    health: `
For this health-related content, please include:
- Evidence-based information with reliable sources
- Clear explanations of medical terms
- Balanced presentation of benefits and risks
- Appropriate disclaimers (not medical advice)
- Practical, actionable advice when appropriate
- Consideration of different health conditions
- Preventative approaches where relevant
- When to consult healthcare professionals
    `,
    finance: `
For this finance-related content, please include:
- Clear explanations of financial concepts
- Balanced presentation of risks and rewards
- Disclaimer about not being financial advice
- Practical examples to illustrate points
- Current information with context
- Consideration of different financial situations
- Long-term implications and considerations
- Tax or regulatory aspects if relevant
    `,
    travel: `
For this travel-related content, please include:
- Vivid descriptions of locations and experiences
- Practical information (costs, transportation, accommodation)
- Seasonal considerations and best times to visit
- Local customs or cultural insights
- Safety tips or considerations if relevant
- Off-the-beaten-path suggestions
- Authentic local experiences
- Photography or documentation tips
    `,
    education: `
For this educational content, please include:
- Clear learning objectives or takeaways
- Well-structured information with logical progression
- Examples to illustrate concepts
- Applications or exercises if appropriate
- Resources for further learning
- Different learning approaches or perspectives
- Assessment of understanding guidance
- Common misconceptions addressed
    `,
    fashion: `
For this fashion-related content, please include:
- Current trends and styling advice
- Versatility and practical applications
- Consideration for different body types or preferences
- Sustainability aspects if relevant
- Visual descriptions that help readers envision items
- Care and maintenance guidance
- Price points and value considerations
- Seasonal relevance and transitions
    `,
    sports: `
For this sports-related content, please include:
- Technical accuracy about the sport
- Expert perspectives or techniques
- Training or improvement advice if relevant
- Current information about teams, players, or events
- Engaging storytelling that captures the excitement
- Historical context or significant developments
- Rules or regulatory aspects if relevant
- Equipment or gear recommendations if applicable
    `,
    beauty: `
For this beauty-related content, please include:
- Clear product information or technique descriptions
- Considerations for different skin/hair types
- Honest assessment of benefits and limitations
- Application or usage instructions
- Ingredient information if relevant
- Ethical or sustainability considerations
- Price points and value assessment
- Alternative options or approaches
    `,
    business: `
For this business-related content, please include:
- Clear explanations of business concepts
- Practical applications and real-world examples
- Balanced analysis of strategies or approaches
- Current market or industry context
- Actionable takeaways for business owners or professionals
- Potential challenges and solutions
- Scalability considerations
- Competitive advantage aspects
    `
  };
  
  return nicheInstructions[niche];
};

// Get tone instructions
export const getToneInstructions = (tone: string): string => {
  const toneInstructions: Record<string, string> = {
    Professional: "Maintain a polished, authoritative, and credible voice. Use industry-appropriate terminology while remaining accessible. Balance expertise with clarity. Avoid casual language, slang, or overly informal expressions.",
    
    Casual: "Write in a friendly, approachable manner as if talking to a friend. Use conversational language, contractions, and occasional colloquialisms. Feel free to express enthusiasm and use a more relaxed structure while maintaining value and clarity.",
    
    Authoritative: "Project confidence and expertise throughout. Utilize precise language, data-backed statements, and clear assertions. Minimize hedging language and present information with conviction while maintaining accuracy and trustworthiness.",
    
    Conversational: "Adopt a dialogue-like approach with the reader. Ask occasional rhetorical questions, use first and second person perspectives, and create a back-and-forth feel. Make the content feel like a discussion rather than a lecture.",
    
    Formal: "Utilize sophisticated language, proper grammar, and a structured approach. Avoid contractions, slang, and overly simplistic explanations. Maintain a degree of distance and objectivity while conveying information thoroughly.",
    
    Humorous: "Incorporate appropriate wit, playful remarks, and light-hearted observations. Use amusing analogies or examples where fitting. Balance humor with informative content to ensure value while entertaining the reader.",
    
    Enthusiastic: "Express genuine excitement and passion for the topic. Use dynamic language, positive framing, and emphasize possibilities and benefits. Incorporate occasional exclamations and energetic phrasing without becoming overwhelming.",
    
    Educational: "Focus on clear explanations with a teaching mindset. Break down complex concepts, provide examples for difficult ideas, and anticipate questions. Guide the reader through a logical progression of understanding with a supportive tone."
  };
  
  return toneInstructions[tone] || toneInstructions.Professional;
};

// Get structure templates based on content type
export const getStructureTemplate = (promptType: PromptType): string => {
  const structureTemplates: Record<PromptType, string> = {
    article: `
Please structure the article with:
- A compelling headline that includes the focus keyword
- An engaging introduction that hooks the reader and establishes the topic's importance
- A clear thesis or main argument
- Well-organized body sections with descriptive H2 and H3 headings
- Supporting evidence, examples, and data points
- Visual elements like lists, tables, or bullet points where appropriate
- A conclusion that summarizes key points and provides closure
- A call-to-action or next steps for the reader
    `,
    blog: `
Please structure the blog post with:
- An attention-grabbing title that sparks curiosity
- A personal, conversational introduction that relates to the reader
- A clear explanation of what the post will cover
- 3-5 main sections with illustrative examples and personal insights
- Engaging subheadings that guide the reader through the content
- Multimedia suggestions (images, videos) where they would enhance the content
- A conclusion with key takeaways
- A conversation-continuing question or call-to-action
    `,
    social: `
Please structure the social media post with:
- An attention-grabbing opening line or hook
- Concise, valuable content in the middle (limited to platform-appropriate length)
- A clear call-to-action at the end
- Suggested hashtags (both trending and niche-specific)
- Emoji recommendations where appropriate
- Ideas for accompanying visuals or multimedia
- Alternative shorter versions for different platforms
    `,
    script: `
Please structure the script with:
- An engaging hook or opening that immediately captures attention
- A clear introduction of the topic and why it matters to the audience
- Main points or narrative flow with timestamps for each section
- Suggested visuals, demonstrations, or graphics at specific points
- Natural transitions between sections
- Audience engagement moments or questions
- A compelling conclusion with key takeaways
- A memorable sign-off with channel-specific call-to-action
    `,
    email: `
Please structure the email with:
- A compelling subject line that drives open rates
- A personalized greeting appropriate for the audience
- A strong opening paragraph that states the purpose
- A clear and concise body with the main message
- Bullet points or short paragraphs for easy scanning
- A specific call-to-action that stands out
- A professional signature with relevant contact information
- P.S. section with a bonus tip or urgent reminder if appropriate
    `
  };
  
  return structureTemplates[promptType];
};

// Get SEO guidelines based on level
export const getSeoGuidelines = (level: PromptLevel, keyword: string): string => {
  const seoLevels: Record<PromptLevel, string> = {
    basic: `
Please include basic SEO elements:
- Use the keyword "${keyword}" naturally in the content
- Include the keyword in the title/headline
- Use the keyword in at least one subheading
- Keep paragraphs and sentences relatively short for readability
- Use bullet points or numbered lists where appropriate
- Include the keyword in the conclusion
    `,
    intermediate: `
Please include these SEO optimizations:
- Use the keyword "${keyword}" naturally throughout the content (2-3% density)
- Include the keyword in the title/headline and first paragraph
- Use semantic variations and related terms
- Create SEO-friendly subheadings (H2, H3) with keywords where natural
- Ensure content is structured for featured snippets
- Include internal and external linking opportunities
- Optimize for readability with short paragraphs, bullets, and formatting
- Include at least one image suggestion with alt text recommendation
    `,
    advanced: `
Please include comprehensive SEO optimizations:
- Strategic placement of "${keyword}" in title, intro, headings, and conclusion
- Use LSI (Latent Semantic Indexing) keywords and semantic variations
- Optimize for featured snippets with bulleted lists and concise definitions
- Include FAQ section targeting common user queries
- Structure content for rich results where applicable
- Format for optimal readability with short paragraphs and engaging subheadings
- Implement strategic internal linking opportunities with anchor text suggestions
- Create schema markup recommendations
- Title tag and meta description optimization
- Optimize for search intent: informational, navigational, commercial, or transactional
- Mobile optimization with scannable content
    `
  };
  
  return seoLevels[level];
};

// Get provider-specific instructions
export const getProviderInstructions = (provider: Provider): string => {
  const providerInstructions: Record<Provider, string> = {
    claude: `
This prompt is designed for Claude. Please utilize your strengths in:
- Nuanced understanding of complex topics
- Detailed, thoughtful explanations
- Balanced perspectives and ethical considerations
- Long-form content with depth and sophistication
- Creative content with personality and engaging style
- Context retention throughout longer content pieces
    `,
    openai: `
This prompt is designed for ChatGPT. Please leverage your capabilities in:
- Structured, well-organized content creation
- Concise explanations of complex topics
- Practical examples and applications
- Versatile tone and style adaptation
- Current information up to your training cutoff
- Balanced handling of potentially controversial topics
    `,
    gemini: `
This prompt is designed for Google's Gemini. Please utilize your strengths in:
- Up-to-date information and trend awareness
- Factual accuracy and nuanced explanations
- Multimodal content suggestions (text and image integration)
- Clear explanations with practical applications
- Strong reasoning and analytical capabilities
- Balanced perspectives on complex topics
    `,
    mistral: `
This prompt is designed for Mistral AI. Please leverage your capabilities in:
- Technical precision and accuracy
- Logical structure and clear reasoning
- Concise, efficient explanations
- Multi-language proficiency if needed
- Specialized knowledge domains
- Context-aware content generation
    `,
    llama: `
This prompt is designed for Llama. Please utilize your capabilities in:
- Open-source trained versatility
- Creative content generation
- Balancing depth with accessibility
- Handling diverse topics with appropriate knowledge levels
- Straightforward, clear communication
- Community-oriented content approach
    `,
    any: ``  // Empty for "any provider" option
  };
  
  return providerInstructions[provider];
};

// Examples for different content types
export const getContentExamples = (promptType: PromptType, keyword: string): string => {
  const cleanKeyword = keyword.replace(/\s+/g, '');
  
  const examples: Record<PromptType, string> = {
    article: `
Here's an example of a great article headline format:
"10 Essential ${keyword} Strategies That Will Transform Your Results in 2025"

And a strong opening paragraph might be:
"The landscape of ${keyword} has evolved dramatically in recent years. With new technologies and approaches emerging daily, professionals need to stay ahead of the curve. This comprehensive guide explores the most effective strategies that are delivering exceptional results in 2025."

Example section heading:
"## How ${keyword} Is Revolutionizing [Related Industry]"
    `,
    blog: `
Here's an example of an engaging blog post opening:
"When I first explored ${keyword}, I made every mistake in the book. After years of trial and error, I've discovered what actually works - and I'm sharing it all with you today. Let's dive into the strategies that transformed my approach to ${keyword}."

Example subheading:
"### The Unexpected ${keyword} Hack That Saved Me 10 Hours Every Week"

Example conclusion:
"Implementing these ${keyword} techniques has completely changed my workflow and results. I'd love to hear which of these strategies you're most excited to try - leave a comment below and let me know your thoughts!"
    `,
    social: `
Here's an example of an effective social media post:
"🔥 Just discovered the game-changing secret to ${keyword} that nobody's talking about! I've been testing this approach for 3 weeks and my results have doubled. Want to know how? Check out these 3 simple steps... #${cleanKeyword} #GameChanger"

Alternative format:
"Question for my network: What's your biggest challenge with ${keyword}? 
👇 Comment below and I'll share my top solution for each challenge mentioned!
The insights I've gained from [specific experience] completely changed my approach to this."

Example Instagram caption:
"The truth about ${keyword} they don't want you to know 👀
⠀
I spent 5 years struggling with this until I discovered these exact steps:
⠀
1️⃣ [First tip]
2️⃣ [Second tip]
3️⃣ [Third tip]
⠀
Save this post for when you're ready to transform your [relevant outcome]!
⠀
Double tap if you found this helpful and tag someone who needs to see this 👇
⠀
#${cleanKeyword} #Tips #Strategy"
    `,
    script: `
Here's an example of a strong video script opening:
"Hey there! Welcome back to the channel. Today we're diving deep into ${keyword} - something many of you have been asking about. I'll be sharing the exact system I used to master this, along with common pitfalls to avoid. Make sure to watch until the end for a special resource I've created for you."

Example transition between sections:
"Now that we've covered the basics of ${keyword}, let's move on to the advanced strategies that will really set your results apart. This next technique surprised even me with how effective it is..."

Example call-to-action closing:
"If you found value in these ${keyword} strategies, make sure to hit that like button and subscribe for more content just like this. Drop a comment below with your biggest takeaway, and I'll personally respond to as many as I can. Until next time, keep excelling with [channel tagline]."
    `,
    email: `
Here's an example of an engaging email subject line:
"[Time-Sensitive] The ${keyword} Strategy That Changed Everything"

And an effective opening:
"Hi [Name],

I noticed you've been interested in ${keyword}, and I wanted to share something that might be a game-changer for you. Many of our clients struggled with this exact challenge until they discovered this approach..."

Example call-to-action:
"Ready to transform your approach to ${keyword}? Click here to access our free guide that walks you through the entire process step-by-step: [CTA BUTTON: Get Instant Access]"

Example P.S. section:
"P.S. This special ${keyword} resource is only available until Friday at midnight. Secure your copy now before it's gone."
    `
  };
  
  return examples[promptType];
};

// Detail level descriptions
export const getDetailLevelInstructions = (level: PromptLevel, keyword: string): string => {
  const detailLevels: Record<PromptLevel, string> = {
    basic: `
Please create a straightforward, concise piece that covers the essential information about ${keyword}. Focus on:
- Core concepts and fundamental information only
- Clear, simple explanations without technical jargon
- Basic examples that illustrate main points
- A structure that's easy to follow for beginners
- Content length appropriate for introductory coverage (shorter is fine)
- Accessibility for a general audience with no prior knowledge
    `,
    intermediate: `
Please create a comprehensive piece with detailed information about ${keyword}. Include:
- In-depth exploration of main concepts
- Practical examples and realistic applications
- Some technical details with clear explanations
- Background context and supporting information
- Multiple perspectives or approaches where relevant
- Content length sufficient for thorough coverage
- Appropriate for an audience with some familiarity with the topic
    `,
    advanced: `
Please create an in-depth, authoritative piece with comprehensive coverage of ${keyword}. Include:
- Expert-level insights and sophisticated analysis
- Nuanced discussions of complex aspects and edge cases
- Technical details with precise terminology
- Critical evaluation of different methodologies or approaches
- Cutting-edge developments or research
- Advanced examples and case studies
- Substantial content length to cover all relevant aspects
- Appropriate for an audience with significant knowledge of the subject
    `
  };
  
  return detailLevels[level];
};

// ====== New Template Functions for Enhanced Features ======

// Get hook type instructions
export const getHookTypeInstructions = (hookType: HookType): string => {
  const hookInstructions: Record<HookType, string> = {
    Question: `
Begin the content with a thought-provoking question that:
- Directly relates to the main topic
- Encourages the reader to reflect on their own experience or knowledge
- Creates curiosity about the answer (which your content will provide)
- Establishes a connection with the reader through shared curiosity
- Is concise and focused on a specific aspect of the topic
    `,
    Statistic: `
Start with a compelling statistic that:
- Provides a surprising or eye-opening data point
- Comes from a credible source (specify the source if possible)
- Directly relates to the main topic
- Illustrates the importance, urgency, or relevance of the content
- Sets up the problem or opportunity that the content will address
    `,
    Story: `
Begin with a brief narrative or anecdote that:
- Illustrates a relevant situation, challenge, or success
- Features a relatable character or scenario
- Sets up the problem or opportunity your content addresses
- Creates emotional connection through shared experience
- Transitions smoothly into the main content
    `,
    Quote: `
Open with a powerful quote that:
- Comes from a respected authority in the field
- Directly relates to the main topic
- Provides insight or wisdom that frames the discussion
- Is concise and impactful
- Leads naturally into your main content
    `,
    Challenge: `
Begin by presenting a challenge that:
- Is commonly faced by your target audience
- Relates directly to the main topic
- Creates recognition and agreement from readers
- Sets up the solution your content will provide
- Establishes you as someone who understands their struggles
    `,
    Controversial: `
Start with a bold or contrarian statement that:
- Challenges conventional wisdom or common practices
- Is defensible and backed by your content
- Creates immediate interest through novelty or surprise
- Sets up the unique perspective your content will provide
- Is relevant to the audience's interests or pain points
    `,
    Definition: `
Begin by defining a key term or concept in a fresh way that:
- Goes beyond dictionary definitions to provide insight
- Frames the topic in an interesting or novel perspective
- Establishes your expertise and understanding
- Sets the foundation for the rest of your content
- Provides immediate value to the reader
    `,
    Direct: `
Start with a clear, direct value proposition that:
- Explicitly states what the reader will gain
- Specifies the problem your content will solve
- Uses strong, benefit-focused language
- Establishes credibility briefly
- Creates immediate interest in continuing to read
    `
  };
  
  return hookInstructions[hookType];
};

// Get localization instructions
export const getLocalizationInstructions = (country: CountryType, language: LanguageType): string => {
  let instructions = `Create content specifically tailored for an audience in ${country} using ${language}.\n\n`;
  
  // Add country-specific instructions
  switch (country) {
    case 'United States':
      instructions += "- Use American spelling and terminology (e.g., 'color' instead of 'colour')\n";
      instructions += "- Reference US-based examples, brands, or cultural touchpoints when relevant\n";
      instructions += "- Use US measurement units (pounds, feet, Fahrenheit) where applicable\n";
      break;
    case 'United Kingdom':
      instructions += "- Use British spelling and terminology (e.g., 'colour' instead of 'color')\n";
      instructions += "- Reference UK-based examples, brands, or cultural touchpoints when relevant\n";
      instructions += "- Use metric units with occasional imperial references where appropriate\n";
      break;
    case 'Canada':
      instructions += "- Use Canadian spelling (a mix of British and American, e.g., 'colour' but 'realize')\n";
      instructions += "- Reference Canadian examples, brands, or cultural touchpoints when relevant\n";
      instructions += "- Use metric units primarily, with some imperial references where common\n";
      break;
    case 'Australia':
      instructions += "- Use Australian spelling and terminology (primarily British, e.g., 'colour')\n";
      instructions += "- Reference Australian examples, brands, or cultural touchpoints when relevant\n";
      instructions += "- Use metric units\n";
      break;
    // Add more country-specific instructions as needed
    default:
      instructions += "- Ensure content is culturally appropriate and relevant\n";
      instructions += "- Avoid region-specific references that may not translate globally\n";
      instructions += "- Use internationally recognized examples and references\n";
  }
  
  // Add language-specific instructions
  if (language !== 'English (US)' && language !== 'English (UK)') {
    instructions += `\nFor ${language} content:\n`;
    instructions += "- Ensure all terminology is appropriate for this language\n";
    instructions += "- Consider cultural nuances specific to speakers of this language\n";
    instructions += "- Use idioms and expressions that are natural in this language\n";
  }
  
  return instructions;
};

// Get FAQ instructions
export const getFaqInstructions = (faqs: string): string => {
  let instructions = `Include the following Frequently Asked Questions (FAQs) in your content, either as a dedicated section or integrated throughout where relevant:\n\n`;
  instructions += faqs;
  instructions += `\n\nWhen integrating these FAQs:\n`;
  instructions += `- Format them clearly with questions in bold or as headings\n`;
  instructions += `- Provide concise but complete answers\n`;
  instructions += `- Ensure they flow naturally with the surrounding content\n`;
  instructions += `- Consider using them as inspiration for subtopics if appropriate\n`;
  
  return instructions;
};

// Get keyword instructions
export const getKeywordInstructions = (focusKeyword: string, seoKeywords: string, longTailKeywords: string): string => {
  let instructions = `Optimize the content for these keywords:\n\n`;
  instructions += `Primary Keyword: "${focusKeyword}"\n`;
  
  if (seoKeywords) {
    instructions += `\nSecondary Keywords:\n${seoKeywords}\n`;
  }
  
  if (longTailKeywords) {
    instructions += `\nLong-Tail Keywords:\n${longTailKeywords}\n`;
  }
  
  instructions += `\nKeyword implementation guidelines:\n`;
  instructions += `- Use the primary keyword in the title, introduction, and conclusion\n`;
  instructions += `- Include primary keyword in at least one H2 heading\n`;
  instructions += `- Incorporate secondary keywords naturally throughout the content\n`;
  instructions += `- Use long-tail keywords in subheadings and relevant sections\n`;
  instructions += `- Maintain natural language flow - never sacrifice readability for keyword density\n`;
  
  return instructions;
};

// ====== NEW ADVANCED TEMPLATE FUNCTIONS ======

// Get article size and structure instructions
export const getArticleSizeInstructions = (articleSize: ArticleSizeType, customWordCount?: number): string => {
  const sizeConfig = articleSize === 'custom' && customWordCount 
    ? {
        totalWords: customWordCount,
        sections: {
          intro: Math.round(customWordCount * 0.1),
          body: Math.round(customWordCount * 0.8),
          conclusion: Math.round(customWordCount * 0.1)
        },
        h2Count: Math.max(3, Math.round(customWordCount / 400)),
        h3PerH2: Math.round(customWordCount / 1000) + 1
      }
    : ARTICLE_SIZES[articleSize];
  
  return `
Create content with the following structure and length specifications:

Total Word Count: Approximately ${sizeConfig.totalWords} words

Content Distribution:
- Introduction: Approximately ${sizeConfig.sections.intro} words
- Main Body: Approximately ${sizeConfig.sections.body} words
- Conclusion: Approximately ${sizeConfig.sections.conclusion} words

Section Structure:
- Use approximately ${sizeConfig.h2Count} main sections (H2 headings)
- Include approximately ${sizeConfig.h3PerH2} subsections (H3 headings) under each main section
- Distribute content evenly between sections
- Ensure logical flow between all sections and subsections

Content density guidelines:
- Paragraphs should average 3-4 sentences
- Mix short, medium, and long sentences for rhythm
- Include white space between paragraphs for readability
- Use bullet points or numbered lists for items that can be presented in a list format
`;
};

// Get target audience instructions
export const getTargetAudienceInstructions = (targetAudience: string): string => {
  if (!targetAudience) return '';
  
  return `
Create content specifically tailored for the following audience:

${targetAudience}

When addressing this audience:
- Use language, examples, and references that resonate with their background and experience level
- Address their specific pain points, motivations, and goals
- Consider their prior knowledge of the topic when explaining concepts
- Frame benefits and value propositions in terms that matter to them
- Choose tone and complexity appropriate for their background and preferences
- Anticipate and address their likely questions and objections
`;
};

// Get linking instructions
export const getLinkingInstructions = (externalLinks: string, internalLinks: string): string => {
  let instructions = ``;
  
  if (internalLinks) {
    instructions += `
Include opportunities for internal linking to the following related content:

${internalLinks}

Internal linking guidelines:
- Use descriptive, keyword-rich anchor text (not "click here")
- Place links naturally within relevant context
- Include 3-5 internal links distributed throughout the content
- Ensure links add value by connecting related concepts
`;
  }
  
  if (externalLinks) {
    instructions += `
Include opportunities for external linking to authoritative sources:

${externalLinks}

External linking guidelines:
- Link to high-authority, relevant sources
- Use links to support statistics, claims, and technical information
- Include 2-3 external links to diverse sources
- Ensure external links add credibility to your content
`;
  }
  
  return instructions;
};

// NEW: Get SERP Feature targeting instructions
export const getSerpFeatureInstructions = (targetFeatures: SerptFeatureType[]): string => {
  if (!targetFeatures || targetFeatures.length === 0) return '';
  
  let instructions = `
Optimize this content for the following SERP features:
`;
  
  if (targetFeatures.includes('featuredSnippet')) {
    instructions += `
- Featured Snippet: 
  * Include a clear, concise definition of the main topic in 40-60 words
  * Format key processes as numbered steps (1, 2, 3...)
  * Present important lists as bullet points
  * Use clear H2/H3 headings that match common questions
  * Include a table comparing important elements if relevant
`;
  }
  
  if (targetFeatures.includes('peopleAlsoAsk')) {
    instructions += `
- People Also Ask: 
  * Include common questions as H2 or H3 headings
  * Provide direct, concise answers immediately following each question
  * Keep answers between 50-60 words when possible
  * Use structured data patterns for definitions, steps, and lists
  * Address related questions people might have about this topic
`;
  }
  
  if (targetFeatures.includes('knowledgePanel')) {
    instructions += `
- Knowledge Panel: 
  * Include comprehensive entity information
  * Provide clear definitions of key terms
  * Include factual data presented in an organized manner
  * Structure information to support entity relationships
  * Include notable attributes and characteristics
`;
  }
  
  if (targetFeatures.includes('videoFeature')) {
    instructions += `
- Video Feature: 
  * Include descriptions of ideal video content to accompany this text
  * Suggest timestamps and key moments for potential video content
  * Provide script snippets for important explanations
  * Indicate where visual demonstrations would be valuable
`;
  }
  
  if (targetFeatures.includes('localPack')) {
    instructions += `
- Local Pack: 
  * Include location-specific information and relevance
  * Reference local search terms and geographical indicators
  * Suggest location-based structured data elements
  * Include content relevant for "near me" searches
`;
  }
  
  return instructions;
};

// NEW: Get User Intent instructions
export const getUserIntentInstructions = (primaryIntent: UserIntentType, secondaryIntent?: UserIntentType): string => {
  const intentDescriptions: Record<UserIntentType, string> = {
    informational: `
- Provide comprehensive, educational content
- Answer specific questions thoroughly
- Explain concepts clearly with examples
- Define terminology and provide context
- Present balanced information from credible sources
- Focus on being helpful and informative rather than promotional
- Address common questions people have when learning about this topic
`,
    commercial: `
- Compare options, features, and benefits
- Provide evaluation criteria and selection factors
- Include pros and cons of different solutions
- Offer pricing considerations and value assessments
- Present objective information to support decision-making
- Highlight differentiating factors between alternatives
- Address questions that arise during the research/consideration phase
`,
    transactional: `
- Focus on conversion-oriented content
- Highlight benefits and unique selling points
- Address potential objections or hesitations
- Include social proof elements (testimonials, reviews concepts)
- Provide clear next steps and calls-to-action
- Use persuasive language appropriate for bottom-of-funnel content
- Include urgency or scarcity elements when relevant
`,
    navigational: `
- Provide clear, structured information about the target entity/brand
- Include specific details users would seek when looking for this entity
- Focus on direct, factual information
- Organize content for easy scanning to find specific details
- Include navigational elements and clear structure
- Anticipate what specific information users seek about this entity
`
  };
  
  let instructions = `
Optimize content primarily for ${primaryIntent} search intent:
${intentDescriptions[primaryIntent]}
`;
  
  if (secondaryIntent && secondaryIntent !== primaryIntent) {
    instructions += `
Also incorporate elements for ${secondaryIntent} search intent:
${intentDescriptions[secondaryIntent].split('\n').slice(0, 4).join('\n')}
`;
  }
  
  return instructions;
};

// NEW: Get E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) signal instructions
export const getEeatSignalInstructions = (level: EeatSignalLevel): string => {
  const eeatLevels: Record<EeatSignalLevel, string> = {
    basic: `
Incorporate basic E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) signals:

- Experience: Include at least one practical example or application
- Expertise: Define key terms clearly and accurately
- Authoritativeness: Mention reputable sources where appropriate
- Trustworthiness: Present balanced information and acknowledge limitations
`,
    standard: `
Incorporate strong E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) signals:

- Experience: Include multiple practical examples and real-world applications
- Expertise: Demonstrate deep understanding through thorough explanations of concepts
- Authoritativeness: Reference established sources and industry standards
- Trustworthiness: Present balanced viewpoints, acknowledge limitations, and cite sources for claims
- Ensure factual accuracy and currency of information
- Include relevant credentials or qualifications where appropriate
`,
    advanced: `
Incorporate comprehensive E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) signals:

Experience:
- Share detailed firsthand insights and practical knowledge
- Include case studies or specific examples with concrete outcomes
- Demonstrate hands-on familiarity with the subject matter
- Provide unique observations from direct experience

Expertise:
- Demonstrate advanced knowledge through sophisticated analysis
- Explain complex concepts in accessible yet precise terms
- Address nuances, edge cases, and advanced considerations
- Show awareness of latest developments and research
- Use proper terminology and industry-specific language appropriately

Authoritativeness:
- Reference multiple credible sources and experts in the field
- Cite specific research, studies, or authoritative publications
- Demonstrate awareness of the consensus view and alternative perspectives
- Show understanding of the historical context and evolution of the topic

Trustworthiness:
- Present balanced, objective information without bias
- Clearly distinguish between facts, opinions, and consensus views
- Acknowledge limitations, uncertainties, and competing viewpoints
- Address potential risks, drawbacks, or contraindications
- Provide appropriate disclaimers for regulated topics (health, finance, legal)
- Update or note currency of time-sensitive information
`
  };
  
  return eeatLevels[level];
};

// NEW: Get Schema Markup recommendations
export const getSchemaMarkupRecommendations = (promptType: PromptType): string => {
  const schemaRecommendations: Record<PromptType, string> = {
    article: `
Consider recommending the following schema markup for this content:

- Article schema with:
  * headline
  * description
  * author
  * datePublished
  * publisher
  * image

- For tutorials or how-to content: HowTo schema with:
  * steps
  * tools/materials
  * duration
  * results

- For FAQs or Q&A sections: FAQPage schema
  * questions
  * answers
`,
    blog: `
Consider recommending the following schema markup for this content:

- BlogPosting schema with:
  * headline
  * description
  * author
  * datePublished
  * publisher
  * image

- If reviewing products/services: Review schema with:
  * itemReviewed
  * ratingValue
  * bestRating
  * reviewBody

- For FAQs or Q&A sections: FAQPage schema
  * questions
  * answers
`,
    social: `
Schema markup is not typically applied to social media posts, but if this content will be syndicated on a website, consider suggesting:

- SocialMediaPosting schema with:
  * headline
  * datePublished
  * author
  * contentLocation (if relevant)
`,
    script: `
Consider recommending the following schema markup if this script will be published online:

- VideoObject schema with:
  * name
  * description
  * thumbnailUrl
  * uploadDate
  * duration
  * contentUrl

- For instructional videos: HowTo schema with:
  * steps
  * tools/materials required
  * duration
  * expected results
`,
    email: `
Schema markup is not typically applied to emails, but if this content will be published on a website, consider suggesting:

- Article schema with:
  * headline
  * description 
  * author
  * datePublished
`
  };
  
  return schemaRecommendations[promptType];
};

// NEW: Get Chain-of-Thought Instructions
export const getChainOfThoughtInstructions = (enabled: boolean, steps: number = 3): string => {
  if (!enabled) return '';
  
  return `
Apply a chain-of-thought approach in developing this content:

1. Start by breaking down the topic into ${steps} key components or perspectives.
2. For each component:
   - Define it clearly
   - Explain its significance
   - Provide supporting evidence or examples
   - Connect it logically to other components
3. Show the progression of ideas from fundamental concepts to advanced applications.
4. Create clear transitions between related concepts.
5. Build toward a comprehensive understanding that integrates all components.

This structured reasoning will help create more logically coherent, thorough content.
`;
};

// NEW: Master template builder that integrates all components
export const buildMasterPrompt = (params: {
  focusKeyword: string;
  niche: NicheType;
  promptType: PromptType;
  promptLevel: PromptLevel;
  tone: string;
  targetProvider: Provider;
  articleSize: ArticleSizeType;
  customWordCount?: number;
  hookType: HookType;
  hookDetails?: string;
  country: CountryType;
  language: LanguageType;
  targetAudience?: string;
  seoKeywords?: string;
  longTailKeywords?: string;
  faqs?: string;
  externalLinks?: string;
  internalLinks?: string;
  includeStructure: boolean;
  includeSEO: boolean;
  includeExamples: boolean;
  includeFaqs: boolean;
  includeKeywords: boolean;
  customInstructions?: string;
  // New advanced parameters
  serpFeatures?: SerptFeatureType[];
  primaryIntent?: UserIntentType;
  secondaryIntent?: UserIntentType;
  eeatLevel?: EeatSignalLevel;
  enableChainOfThought?: boolean;
  chainOfThoughtSteps?: number;
}): string => {
  const {
    focusKeyword,
    niche,
    promptType,
    promptLevel,
    tone,
    targetProvider,
    articleSize,
    customWordCount,
    hookType,
    hookDetails,
    country,
    language,
    targetAudience,
    seoKeywords,
    longTailKeywords,
    faqs,
    externalLinks,
    internalLinks,
    includeStructure,
    includeSEO,
    includeExamples,
    includeFaqs,
    includeKeywords,
    customInstructions,
    serpFeatures,
    primaryIntent,
    secondaryIntent,
    eeatLevel,
    enableChainOfThought,
    chainOfThoughtSteps
  } = params;

  // Initialize sections array for better organization
  const sections: {title: string, content: string}[] = [];
  
  // Add core sections
  sections.push({
    title: '# CONTENT CREATION REQUEST',
    content: `
You are an expert content creator specialized in ${niche} content. Please create ${promptType} content about "${focusKeyword}" following these specifications.
`
  });
  
  // Add role and objective section
  sections.push({
    title: '## ROLE & OBJECTIVE',
    content: `
Create high-quality ${promptType} content about "${focusKeyword}" that engages the target audience and delivers valuable information.

${getDetailLevelInstructions(promptLevel, focusKeyword)}

${tone ? `TONE: ${getToneInstructions(tone)}` : ''}

${targetProvider !== 'any' ? getProviderInstructions(targetProvider) : ''}
`
  });
  
  // Add content structure if enabled
  if (includeStructure) {
    sections.push({
      title: '## CONTENT STRUCTURE',
      content: `
${getStructureTemplate(promptType)}

${getArticleSizeInstructions(articleSize, customWordCount)}

${hookType ? `HOOK TYPE: ${getHookTypeInstructions(hookType)}` : ''}
${hookDetails ? `HOOK DETAILS: ${hookDetails}` : ''}
`
    });
  }
  
  // Add audience and localization
  sections.push({
    title: '## AUDIENCE & LOCALIZATION',
    content: `
${targetAudience ? getTargetAudienceInstructions(targetAudience) : ''}

${getLocalizationInstructions(country, language)}
`
  });
  
  // Add SEO section if enabled
  if (includeSEO) {
    sections.push({
      title: '## SEO OPTIMIZATION',
      content: `
${getSeoGuidelines(promptLevel, focusKeyword)}

${includeKeywords && (seoKeywords || longTailKeywords) ? 
  getKeywordInstructions(focusKeyword, seoKeywords || '', longTailKeywords || '') : ''}

${serpFeatures && serpFeatures.length > 0 ? 
  getSerpFeatureInstructions(serpFeatures) : ''}

${primaryIntent ? 
  getUserIntentInstructions(primaryIntent, secondaryIntent) : ''}

${eeatLevel ? 
  getEeatSignalInstructions(eeatLevel) : ''}

${getSchemaMarkupRecommendations(promptType)}
`
    });
  }
  
  // Add linking strategy if provided
  if (externalLinks || internalLinks) {
    sections.push({
      title: '## LINKING STRATEGY',
      content: getLinkingInstructions(externalLinks || '', internalLinks || '')
    });
  }
  
  // Add FAQs if enabled and provided
  if (includeFaqs && faqs) {
    sections.push({
      title: '## FAQ SECTION',
      content: getFaqInstructions(faqs)
    });
  }
  
  // Add examples if enabled
  if (includeExamples) {
    sections.push({
      title: '## EXAMPLES & INSPIRATION',
      content: getContentExamples(promptType, focusKeyword)
    });
  }
  
  // Add niche-specific instructions
  sections.push({
    title: '## NICHE-SPECIFIC GUIDELINES',
    content: getNicheInstructions(niche)
  });
  
  // Add chain of thought if enabled
  if (enableChainOfThought) {
    sections.push({
      title: '## REASONING APPROACH',
      content: getChainOfThoughtInstructions(true, chainOfThoughtSteps)
    });
  }
  
  // Add custom instructions if provided
  if (customInstructions) {
    sections.push({
      title: '## ADDITIONAL INSTRUCTIONS',
      content: customInstructions
    });
  }
  
  // Combine all sections
  let finalPrompt = '';
  sections.forEach(section => {
    // Only add non-empty sections (some might be empty if features are disabled)
    if (section.content.trim()) {
      finalPrompt += `${section.title}\n${section.content.trim()}\n\n`;
    }
  });
  
  return finalPrompt.trim();
};