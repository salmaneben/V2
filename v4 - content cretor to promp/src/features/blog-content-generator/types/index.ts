// src/features/blog-content-generator/types/index.ts

export type Provider = 'perplexity' | 'openai' | 'claude' | 'deepseek' | 'gemini' | 'custom';

export interface StepProps {
  data: any;
  updateData: (newData: any) => void;
  onNextStep?: () => void;
  onPrevStep?: () => void;
}

// API responses

export interface MetaTitleGeneratorRequest {
  focusKeyword: string;
  relatedTerm?: string;
  provider?: Provider;
  numTitles?: number;
}

export interface MetaTitleGeneratorResponse {
  titles: string[];
  error?: string;
}

export interface MetaDescriptionGeneratorRequest {
  metaTitle: string;
  focusKeyword: string;
  relatedTerm?: string;
  provider?: Provider;
  numDescriptions?: number;
}

export interface MetaDescriptionGeneratorResponse {
  descriptions: string[];
  error?: string;
}

export interface OutlineGeneratorRequest {
  metaTitle: string;
  focusKeyword: string;
  provider?: Provider;
}

export interface OutlineGeneratorResponse {
  outline: string;
  error?: string;
}

export interface ContentGeneratorRequest {
  metaTitle: string;
  focusKeyword: string;
  outline: string;
  relatedTerm?: string;
  provider?: Provider;
  wordCount?: string;
  contentLength?: number;
  tone?: string;
  textReadability?: string;
  targetAudience?: string;
  seoKeywords?: string;
  longTailKeywords?: string;
  internalLinkingWebsite?: string;
  externalLinkType?: string;
  faqs?: string;
  additionalInstructions?: string;
  includeConclusion?: boolean;
  includeTables?: boolean;
  includeH3?: boolean;
  includeLists?: boolean;
  includeItalics?: boolean;
  includeQuotes?: boolean;
  includeBold?: boolean;
  includeKeyTakeaways?: boolean;
  includeFAQs?: boolean;
  outputFormat?: string;
}

export interface ContentGeneratorResponse {
  content: string;
  error?: string;
}

export interface RecipeContentGeneratorRequest {
  metaTitle: string;
  focusKeyword: string;
  recipeName: string;
  provider?: Provider;
}

export interface RecipeContentGeneratorResponse {
  content: string;
  error?: string;
}

export interface RecipeSchemaMarkupRequest {
  recipeName: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  recipeYield?: string;
  recipeType?: string;
  cuisine?: string;
  calories?: string;
  keywords?: string;
  ingredients?: string[];
  instructions?: string[];
  pros?: string[];
  cons?: string[];
  provider?: Provider;
}

export interface RecipeSchemaMarkupResponse {
  schemaMarkup: string;
  error?: string;
}