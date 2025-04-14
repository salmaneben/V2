/**
 * Available content niches
 */
export type NicheType = 
  'recipes' | 'technology' | 'health' | 'finance' | 'travel' | 
  'education' | 'fashion' | 'sports' | 'beauty' | 'business';

/**
 * Available prompt/content types
 */
export type PromptType = 'article' | 'blog' | 'social' | 'script' | 'email';

/**
 * Available detail/complexity levels
 */
export type PromptLevel = 'basic' | 'intermediate' | 'advanced';

/**
 * Supported AI providers
 */
export type Provider = 'claude' | 'openai' | 'gemini' | 'mistral' | 'llama' | 'any';

/**
 * Countries for content localization
 */
export type CountryType = 
  'United States' | 'United Kingdom' | 'Canada' | 'Australia' | 
  'Germany' | 'France' | 'Spain' | 'Italy' | 'Japan' | 'India' | 
  'Brazil' | 'Mexico' | 'China' | 'Russia' | 'South Africa' | 'Other';

/**
 * Languages for content
 */
export type LanguageType = 
  'English (US)' | 'English (UK)' | 'Spanish' | 'French' | 
  'German' | 'Italian' | 'Portuguese' | 'Japanese' | 
  'Chinese' | 'Russian' | 'Arabic' | 'Hindi' | 'Other';

/**
 * Article size options
 */
export type ArticleSizeType = 'small' | 'medium' | 'large' | 'custom';

/**
 * Hook type options for articles
 */
export type HookType = 
  'Question' | 'Statistic' | 'Story' | 'Quote' | 
  'Challenge' | 'Controversial' | 'Definition' | 'Direct';

/**
 * Content tone options
 */
export type ToneType = 
  'Professional' | 'Casual' | 'Authoritative' | 'Conversational' |
  'Formal' | 'Humorous' | 'Enthusiastic' | 'Educational';

/**
 * SERP feature targeting options
 */
export type SerptFeatureType = 
  'featuredSnippet' | 'peopleAlsoAsk' | 'knowledgePanel' | 
  'videoFeature' | 'localPack' | 'imageCarousel' | 'relatedSearches';

/**
 * User search intent options
 */
export type UserIntentType = 
  'informational' | 'commercial' | 'transactional' | 'navigational';

/**
 * E-E-A-T signal levels
 */
export type EeatSignalLevel = 'basic' | 'standard' | 'advanced';

/**
 * API configuration for optional AI assistance
 */
export interface ApiConfig {
  provider: string;
  apiKey: string;
  model: string;
  endpoint?: string;
}

/**
 * SEO Keywords structure
 */
export interface SeoKeywords {
  primary: string;
  secondary: string[];
}

/**
 * FAQ item structure
 */
export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Article size configuration
 */
export interface ArticleSize {
  totalWords: number;
  sections: {
    intro: number;
    body: number;
    conclusion: number;
  };
  h2Count: number;
  h3PerH2: number;
}

/**
 * Chain of thought configuration
 */
export interface ChainOfThoughtConfig {
  enabled: boolean;
  steps: number;
  reasoningStyle: 'analytical' | 'creative' | 'balanced';
}

/**
 * SERP feature configuration
 */
export interface SerpFeatureConfig {
  targetFeatures: SerptFeatureType[];
  priorityFeature?: SerptFeatureType;
  featureSpecificContent?: Record<string, string>;
}

/**
 * User intent configuration
 */
export interface UserIntentConfig {
  primaryIntent: UserIntentType;
  secondaryIntent?: UserIntentType;
  contentFunnelStage: 'awareness' | 'consideration' | 'decision';
}

/**
 * E-E-A-T signals configuration
 */
export interface EeatSignalsConfig {
  level: EeatSignalLevel;
  expertiseLevel: 'basic' | 'intermediate' | 'advanced' | 'expert';
  includeCredentials: boolean;
  includeSourceCitations: boolean;
}

/**
 * Enhanced Prompt Generator Data
 */
export interface EnhancedPromptGeneratorData {
  // Basic info
  focusKeyword: string;
  
  // Content parameters
  niche: NicheType;
  promptType: PromptType;
  promptLevel: PromptLevel;
  targetProvider: Provider;
  tone: ToneType;
  
  // SEO parameters
  seoKeywords: string;
  longTailKeywords: string;
  targetAudience: string;
  faqs: string;
  externalLinks: string;
  internalLinks: string;
  
  // Locale parameters
  country: CountryType;
  language: LanguageType;
  
  // Structure parameters
  articleSize: ArticleSizeType;
  customWordCount?: number;
  hookType: HookType;
  hookDetails: string;
  
  // Feature flags
  includeStructure: boolean;
  includeSEO: boolean;
  includeExamples: boolean;
  includeFaqs: boolean;
  includeKeywords: boolean;
  
  // Advanced SEO features
  serpFeatures?: SerptFeatureType[];
  primaryIntent?: UserIntentType;
  secondaryIntent?: UserIntentType;
  eeatLevel?: EeatSignalLevel;
  
  // Advanced content features
  enableChainOfThought?: boolean;
  chainOfThoughtSteps?: number;
  
  // Custom settings
  customInstructions: string;
  
  // Generated content
  generatedPrompt: string;
}

/**
 * Legacy type for backward compatibility
 */
export interface PromptGeneratorData {
  focusKeyword: string;
  niche: NicheType;
  promptType: PromptType;
  promptLevel: PromptLevel;
  targetProvider: Provider;
  tone: string;
  includeStructure: boolean;
  includeSEO: boolean;
  includeExamples: boolean;
  customInstructions: string;
  generatedPrompt: string;
}

/**
 * API Response type for AI-assisted generation
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Hook props for API integration
 */
export interface UseSeoPromptGeneratorProps {
  apiConfig?: ApiConfig;
  onError?: (error: string) => void;
}