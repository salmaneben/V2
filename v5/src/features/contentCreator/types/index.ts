export interface FormData {
  // Basic content fields
  title: string;
  mainKeyword: string;
  country: string;
  language: string;
  wordCount: string;
  targetAudience: string;
  faqs: string;
  seoKeywords: string;
  longTailKeywords: string; // Added this field
  tone: string;
  additionalInstructions: string;
  
  // Core Settings
  articleType: string;
  
  // Content Settings
  pointOfView: string;
  
  // AI Settings
  aiModel: string;
  textReadability: string;
  aiContentCleaning: string;
  
  // Multi-API Settings
  keywordsApiProvider?: string;
  keywordsApiModel?: string;
  contentApiProvider?: string;
  contentApiModel?: string;
  
  // Custom API Settings
  customApiEndpoint?: string;
  customApiKey?: string;
  customApiModel?: string;
  customApiVerify?: boolean;
  
  // Brand Voice
  brandVoice: string;
  
  // SEO and Structure
  introductoryHook: string;
  customHook: string;

  // Document Elements
  includeConclusion: boolean;
  includeTables: boolean;
  includeH3: boolean;
  includeLists: boolean;
  includeItalics: boolean;
  includeQuotes: boolean;
  includeKeyTakeaways: boolean;
  includeFAQs: boolean;
  includeBold: boolean;
  
  // Internal Linking
  internalLinkingWebsite: string;
  internalLinks: string; // For compatibility with original structure

  // External Linking
  externalLinkType: string;
  links: string; // For compatibility with original structure
  
  // Opt-In Settings - NEW
  enableOptIn: boolean;
  optInText: string;
  optInRequired: boolean;
  optInPlacement: OptInPlacementOption;
  optInDesign: OptInDesignOption;
  
  // Enhanced Image Prompt Configuration
  imageDetails: string; // Legacy field maintained for compatibility
  numberOfImagePrompts: number;
  imagePromptStyle: ImagePromptStyleOption;
  imageDistribution: ImageDistributionOption;
  customImagePrompts: string;
  
  // Media Hub fields - kept for type compatibility but functionality removed
  includeImages: boolean;
  numberOfImages: number;
  imageStyle: string;
  imageSize: string;
  additionalImageInstructions: string;
  brandName: string;
  includeKeywordAlt: boolean;
  addInformativeAlt: boolean;
  includeVideos: boolean;
  numberOfVideos: number;
  layoutOptions: string;
  strictMediaPlacement: boolean;
}

// Define new opt-in placement options
export type OptInPlacementOption = 
  | "top"
  | "after-content"
  | "bottom";

// Define new opt-in design style options
export type OptInDesignOption = 
  | "standard"
  | "minimalist"
  | "prominent";

// Define new image prompt style options
export type ImagePromptStyleOption =
  | "simple"
  | "detailed"
  | "creative";

// Define new image distribution options
export type ImageDistributionOption =
  | "header-only"
  | "balanced"
  | "throughout";

// Define possible AI model options
export type AIModelOption = 
  | "Default" 
  | "Claude 3.7 Sonnet + Real-Time SERPNEW" 
  | "GPT-4o Mini & GPT-4o"
  | "Claude 3.5 Haiku"
  | "Llama 3.3 70B"
  | "GPT-4o"
  | "Claude 3.5 Sonnet"
  | "GPT-4 Turbo"
  | "Claude 3 Opus"
  | "GPT-o1"
  | "Custom API";

// Define possible word count options
export type WordCountOption = 
  | "x-small" // 600-1200 words, 2-5 H2
  | "small"   // 1200-2400 words, 5-8 H2
  | "medium"  // 2400-3600 words, 9-12 H2
  | "large";  // 3600-5200 words, 13-16 H2

// Define possible article types
export type ArticleTypeOption = 
  | "None"
  | "How-to guide"
  | "Listicle"
  | "Product review"
  | "News"
  | "Comparison"
  | "Case study"
  | "Opinion piece"
  | "Tutorial"
  | "Roundup post"
  | "Q&A page";

// Define possible tone options
export type ToneOption = 
  | "None"
  | "Friendly"
  | "Professional"
  | "Informational"
  | "Transactional"
  | "Inspirational"
  | "Neutral"
  | "Witty"
  | "Casual"
  | "Authoritative"
  | "Encouraging"
  | "Persuasive"
  | "Poetic";

// Define possible readability options
export type ReadabilityOption = 
  | "None"
  | "5th grade"
  | "6th grade"
  | "7th grade"
  | "8th & 9th grade"
  | "10th to 12th grade"
  | "College"
  | "College graduate"
  | "Professional";

// Define possible AI content cleaning options
export type AIContentCleaningOption = 
  | "No AI Words Removal"
  | "Basic AI Words Removal"
  | "Extended AI Words Removal";

export interface ContentCreatorFormProps {
  onSubmit?: (data: any) => void;
  sidebarState?: string;
}

export interface GeneratedContentCardProps {
  content: string;
  copied: boolean;
  onCopy: () => void;
}

// Updated ApiConfig interface for both endpoint-based and provider-based configs
export interface ApiConfig {
  provider?: string;
  apiKey: string;
  model?: string;
  endpoint?: string;
  verifySSL?: boolean;
}

// API response interface
export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

// Provider options for the API services
export const API_PROVIDERS = [
  { label: 'Perplexity', value: 'perplexity' },
  { label: 'OpenAI', value: 'openai' },
  { label: 'Claude', value: 'claude' },
  { label: 'Custom API', value: 'custom' },
];

// Model options for various providers
export const MODEL_OPTIONS = [
  // Perplexity models
  { label: 'Llama 3.1 Sonar Small 128K', value: 'llama-3.1-sonar-small-128k-online', provider: 'perplexity' },
  { label: 'Llama 3.1 Sonar Medium 128K', value: 'llama-3.1-sonar-medium-128k-online', provider: 'perplexity' },
  { label: 'Mixtral 8x7B', value: 'mixtral-8x7b-32768', provider: 'perplexity' },
  { label: 'Sonar Small Online', value: 'sonar-small-online', provider: 'perplexity' },
  { label: 'Sonar Medium Online', value: 'sonar-medium-online', provider: 'perplexity' },
  
  // OpenAI models
  { label: 'GPT-4o', value: 'gpt-4o', provider: 'openai' },
  { label: 'GPT-4 Turbo', value: 'gpt-4-turbo', provider: 'openai' },
  { label: 'GPT-4', value: 'gpt-4', provider: 'openai' },
  { label: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo', provider: 'openai' },
  
  // Claude models
  { label: 'Claude 3.5 Sonnet', value: 'claude-3-5-sonnet', provider: 'claude' },
  { label: 'Claude 3 Opus', value: 'claude-3-opus', provider: 'claude' },
  { label: 'Claude 3 Sonnet', value: 'claude-3-sonnet', provider: 'claude' },
  { label: 'Claude 3 Haiku', value: 'claude-3-haiku', provider: 'claude' },
];

// Default values for the form
export const DEFAULT_FORM_VALUES: Partial<FormData> = {
  language: "English (US)",
  articleType: "None",
  wordCount: "medium", // 2400-3600 words, 9-12 H2
  tone: "Professional",
  pointOfView: "None",
  country: "United States",
  aiModel: "Default",
  textReadability: "8th & 9th grade",
  aiContentCleaning: "No AI Words Removal",
  customApiEndpoint: "",
  customApiKey: "",
  customApiModel: "",
  customApiVerify: true,
  includeConclusion: true,
  includeTables: true,
  includeH3: true,
  includeLists: true,
  includeItalics: true,
  includeQuotes: true,
  includeKeyTakeaways: true,
  includeFAQs: true,
  includeBold: true,
  includeImages: false,
  numberOfImages: 3,
  includeVideos: false,
  numberOfVideos: 1,
  layoutOptions: "Alternate image and video",
  strictMediaPlacement: false,
  
  // Default API providers and models
  keywordsApiProvider: "perplexity",
  keywordsApiModel: "llama-3.1-sonar-small-128k-online",
  contentApiProvider: "perplexity",
  contentApiModel: "llama-3.1-sonar-small-128k-online",
  
  // Default opt-in settings
  enableOptIn: false,
  optInText: "I agree to receive newsletters and promotional emails",
  optInRequired: false,
  optInPlacement: "bottom",
  optInDesign: "standard",
  
  // Default enhanced image settings
  numberOfImagePrompts: 5,
  imagePromptStyle: "detailed",
  imageDistribution: "balanced",
  customImagePrompts: "",
  imageDetails: "",
};