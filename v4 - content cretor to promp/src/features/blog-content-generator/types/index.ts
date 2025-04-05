// src/features/blog-content-generator/types/index.ts

// Common API types
export type Provider = 'perplexity' | 'openai' | 'claude' | 'deepseek' | 'custom';

export interface ApiConfig {
  provider: Provider;
  apiKey: string;
  endpoint?: string;
  model?: string;
  verifySSL?: boolean;
}

export interface APIResponse {
  error?: string;
}

// Step 1: Meta Title Generation
export interface MetaTitleGeneratorRequest {
  focusKeyword: string;
  relatedTerm?: string;
  provider?: Provider;
  apiConfig?: ApiConfig;
}

export interface MetaTitleGeneratorResponse extends APIResponse {
  titles: string[];
}

// Step 2: Meta Description Generation
export interface MetaDescriptionGeneratorRequest {
  metaTitle: string;
  focusKeyword: string;
  relatedTerm?: string;
  provider?: Provider;
  apiConfig?: ApiConfig;
}

export interface MetaDescriptionGeneratorResponse extends APIResponse {
  descriptions: string[];
}

// Step 3: Outline Generation
export interface OutlineGeneratorRequest {
  metaTitle: string;
  focusKeyword: string;
  provider?: Provider;
  apiConfig?: ApiConfig;
}

export interface OutlineGeneratorResponse extends APIResponse {
  outline: string;
}

// Step 4: Content Generation Based on Outline
export interface ContentGeneratorRequest {
  focusKeyword: string;
  outline: string;
  contentLength?: number;
  targetAudience?: string;
  provider?: Provider;
  apiConfig?: ApiConfig;
}

export interface ContentGeneratorResponse extends APIResponse {
  content: string;
}

// Step 5: Recipe Content Generation
export interface RecipeContentGeneratorRequest {
  metaTitle: string;
  focusKeyword: string;
  recipeName: string;
  provider?: Provider;
  apiConfig?: ApiConfig;
}

export interface RecipeContentGeneratorResponse extends APIResponse {
  content: string;
}

// Step 6: Recipe Schema Markup Generation
export interface RecipeSchemaMarkupRequest {
  recipeName: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  recipeType?: string;
  cuisine?: string;
  keywords?: string;
  recipeYield?: string;
  calories?: string;
  ingredients?: string[];
  instructions?: string[];
  pros?: string[];
  cons?: string[];
  provider?: Provider;
  apiConfig?: ApiConfig;
}

export interface RecipeSchemaMarkupResponse extends APIResponse {
  schemaMarkup: string;
}

// Enhanced API Settings
export interface ApiSettings {
  // Meta Title Generator API Settings
  titleApiProvider: Provider;
  titleApiModel: string;
  
  // Meta Description Generator API Settings
  descriptionApiProvider: Provider;
  descriptionApiModel: string;
  
  // Outline Generator API Settings
  outlineApiProvider: Provider;
  outlineApiModel: string;
  
  // Content Generator API Settings
  contentApiProvider: Provider;
  contentApiModel: string;
  
  // Recipe Generator API Settings (if applicable)
  recipeApiProvider: Provider;
  recipeApiModel: string;
  
  // Schema Generator API Settings (if applicable)
  schemaApiProvider: Provider;
  schemaApiModel: string;
  
  // Custom API Settings
  customApiEndpoint: string;
  customApiKey: string;
  customApiModel: string;
  customApiVerify: boolean;
}

// Enhanced Image Settings
export interface ImageSettings {
  numberOfImagePrompts: number;
  imagePromptStyle: 'simple' | 'detailed' | 'creative';
  imageDistribution: 'header-only' | 'balanced' | 'throughout';
  customImagePrompts: string;
}

// Opt-In Settings
export interface OptInSettings {
  enableOptIn: boolean;
  optInText: string;
  optInRequired: boolean;
  optInPlacement: 'top' | 'bottom' | 'after-content';
  optInDesign: 'standard' | 'minimalist' | 'prominent';
}

// Combined Blog Content Generator Form Data
export interface BlogContentFormData {
  // Common fields
  focusKeyword: string;
  relatedTerm: string;
  provider?: Provider; // Kept for backward compatibility
  
  // API Settings - Per step providers
  apiSettings?: {
    titleApiProvider?: Provider;
    titleApiModel?: string;
    descriptionApiProvider?: Provider;
    descriptionApiModel?: string;
    outlineApiProvider?: Provider;
    outlineApiModel?: string;
    contentApiProvider?: Provider;
    contentApiModel?: string;
    recipeApiProvider?: Provider;
    recipeApiModel?: string;
    schemaApiProvider?: Provider;
    schemaApiModel?: string;
    
    // Custom API Settings
    customApiEndpoint?: string;
    customApiKey?: string;
    customApiModel?: string;
    customApiVerify?: boolean;
  };
  
  // Step 1: Meta Title
  selectedTitle: string;
  generatedTitles: string[];
  
  // Step 2: Meta Description
  selectedDescription: string;
  generatedDescriptions: string[];
  
  // Step 3: Outline
  outline: string;
  
  // Step 4: Content
  content: string;
  contentLength: number;
  targetAudience: string;
  
  // Step 5: Recipe Content (optional)
  isRecipe: boolean;
  recipeName: string;
  recipeContent: string;
  
  // Step 6: Recipe Schema (optional)
  prepTime: string;
  cookTime: string;
  totalTime: string;
  recipeType: string;
  cuisine: string;
  keywords: string;
  recipeYield: string;
  calories: string;
  ingredients: string[];
  instructions: string[];
  pros: string[];
  cons: string[];
  schemaMarkup: string;
  
  // Enhanced Settings
  imageSettings?: ImageSettings;
  optInSettings?: OptInSettings;
  
  // Additional Content Settings
  wordCount?: string; // 'small', 'medium', 'large'
  language?: string;
  country?: string;
  tone?: string;
  textReadability?: string;
  includeConclusion?: boolean;
  includeTables?: boolean;
  includeH3?: boolean;
  includeLists?: boolean;
  includeItalics?: boolean;
  includeQuotes?: boolean;
  includeKeyTakeaways?: boolean;
  includeFAQs?: boolean;
  includeBold?: boolean;
  
  // SEO settings
  seoKeywords?: string;
  longTailKeywords?: string;
  faqs?: string;
  
  // Internal/External linking
  internalLinkingWebsite?: string;
  externalLinkType?: string;
  
  // Custom instructions
  additionalInstructions?: string;
  
  // Output settings
  outputFormat?: 'standard' | 'blogPost';
}

// Component Props
export interface BlogContentGeneratorProps {
  onSave?: (data: BlogContentFormData) => void;
}

export interface StepProps {
  data: BlogContentFormData;
  updateData: (newData: Partial<BlogContentFormData>) => void;
  onNextStep: () => void;
  onPrevStep?: () => void;
}