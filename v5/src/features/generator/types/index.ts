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
  
  // Multi-API Settings - NEW
  keywordsApiProvider: string;
  keywordsApiModel: string;
  imagesApiProvider: string;
  imagesApiModel: string;
  contentApiProvider: string;
  contentApiModel: string;
  
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

  // External Linking
  externalLinkType: string;
  
  // Media Hub
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

// Define provider options
export type ApiProviderOption =
  | "perplexity"
  | "openai"
  | "claude"
  | "deepseek"
  | "fluxai"
  | "custom";

// Define possible AI model options
export type AIModelOption = 
  | "Default" 
  | "Claude 3.7 Sonnet + Real-Time SERPNEW" 
  | "DeepSeek V3 0324 + Real-Time SERPNEW"
  | "GPT-4o Mini & GPT-4o"
  | "Claude 3.5 Haiku"
  | "Llama 3.3 70B"
  | "GPT-4o"
  | "Claude 3.5 Sonnet"
  | "GPT-4 Turbo"
  | "Claude 3 Opus"
  | "GPT-o1"
  | "Custom API";

// Define provider-specific model options
export const ApiModels: Record<ApiProviderOption, string[]> = {
  perplexity: ["llama-3.1-sonar-small-128k-online", "mixtral-8x22b-instruct"],
  openai: ["gpt-4o", "gpt-4-turbo", "gpt-4", "gpt-3.5-turbo"],
  claude: ["claude-3-5-sonnet", "claude-3-opus", "claude-3-sonnet", "claude-3-haiku"],
  deepseek: ["deepseek-chat", "deepseek-coder"],
  fluxai: ["flux-realism"],
  custom: []
};

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

// API configuration interface
export interface ApiConfig {
  provider: string;
  endpoint?: string;
  apiKey: string;
  model?: string;
  verifySSL?: boolean;
}

// API response interface
export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

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
  
  // Default API selections
  keywordsApiProvider: "perplexity",
  keywordsApiModel: "llama-3.1-sonar-small-128k-online",
  imagesApiProvider: "openai", 
  imagesApiModel: "gpt-4o",
  contentApiProvider: "perplexity",
  contentApiModel: "llama-3.1-sonar-small-128k-online",
  
  // Custom API defaults
  customApiEndpoint: "",
  customApiKey: "",
  customApiModel: "",
  customApiVerify: true,
  
  // Document elements
  includeConclusion: true,
  includeTables: true,
  includeH3: true,
  includeLists: true,
  includeItalics: true,
  includeQuotes: true,
  includeKeyTakeaways: true,
  includeFAQs: true,
  includeBold: true,
  
  // Media defaults
  includeImages: false,
  numberOfImages: 3,
  includeVideos: false,
  numberOfVideos: 1,
  layoutOptions: "Alternate image and video",
  strictMediaPlacement: false
};