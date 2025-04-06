// src/features/meta-description-generator/types/index.ts

export interface MetaDescriptionGeneratorRequest {
    metaTitle: string;
    focusKeyword: string;
    relatedTerm?: string;
    provider?: string;
  }
  
  export interface MetaDescriptionGeneratorResponse {
    descriptions: string[];
    error?: string;
  }
  
  export interface MetaDescriptionProps {
    onSave?: (description: string) => void;
  }