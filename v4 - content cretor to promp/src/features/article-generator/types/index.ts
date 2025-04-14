// API Provider types
export type Provider = 'openai' | 'claude' | 'perplexity' | 'deepseek' | 'gemini';

// Niche options
export type NicheType = 
  'recipes' | 
  'technology' | 
  'health' | 
  'finance' | 
  'travel' | 
  'education' | 
  'fashion' | 
  'sports' | 
  'beauty' | 
  'business';

// API settings type
export interface ApiSettings {
  provider: Provider;
  model: string;
}

// Title generation request
export interface TitleGeneratorRequest {
  focusKeyword: string;
  provider?: Provider;
  customPrompt?: string; // Added custom prompt option
}

// Title generation response
export interface TitleGeneratorResponse {
  titles: string[];
  error?: string;
}

// Description generation request
export interface DescriptionGeneratorRequest {
  metaTitle: string;
  focusKeyword: string;
  provider?: Provider;
  customPrompt?: string; // Added custom prompt option
}

// Description generation response
export interface DescriptionGeneratorResponse {
  descriptions: string[];
  error?: string;
}

// Tags generation request
export interface TagsGeneratorRequest {
  metaTitle?: string;
  focusKeyword: string;
  metaDescription: string;
  provider?: Provider;
  customPrompt?: string; // Added custom prompt option
}

// Tags generation response
export interface TagsGeneratorResponse {
  tags: string[];
  error?: string;
}

// Main data structure
export interface ArticleGeneratorData {
  // Basic info
  focusKeyword: string;
  metaTitle: string;
  metaDescription: string;
  tags: string;
  
  // Enhanced SEO parameters
  niche: NicheType;
  relatedKeywords: string;
  internalLink: string;
  externalLink: string;
  
  // Content settings
  tone?: string;
  articleLength?: 'short' | 'medium' | 'long' | 'comprehensive';
  promptType?: 'standard' | 'advanced';
  seoLevel?: 'basic' | 'intermediate' | 'advanced';
  
  // Generated content
  generatedTitles: string[];
  generatedDescriptions: string[];
  generatedTags: string[];
  generatedArticle: string;
  
  // API settings
  apiSettings: ApiSettings | null;
  
  // Version for future migrations
  version?: string;
}

// API request parameters
export interface ArticleGeneratorRequest {
  metaTitle: string;
  focusKeyword: string;
  metaDescription: string;
  niche: NicheType;
  relatedKeywords?: string;
  internalLink?: string;
  externalLink?: string;
  provider?: Provider;
  model?: string;
  promptType?: 'standard' | 'advanced';
  seoLevel?: 'basic' | 'intermediate' | 'advanced';
}

// Article generation response
export interface ArticleGeneratorResponse {
  content: string;
  error?: string;
}

// Props for step components
export interface StepProps {
  data: ArticleGeneratorData;
  updateData: (newData: Partial<ArticleGeneratorData>) => void;
  onNextStep?: () => void;
  onPrevStep?: () => void;
  onComplete?: () => void;
}

// Props for NicheSelector component
export interface NicheSelectorProps {
  selectedNiche?: NicheType;
  onSelectNiche: (niche: NicheType) => void;
}

// Props for SeoSettings component
export interface SeoSettingsProps {
  selectedLevel: 'basic' | 'intermediate' | 'advanced';
  onSelectLevel: (level: 'basic' | 'intermediate' | 'advanced') => void;
}

// Props for ApiButton component
export interface ApiButtonProps {
  apiSettings: ApiSettings | null;
  updateApiSettings: (settings: ApiSettings) => void;
}