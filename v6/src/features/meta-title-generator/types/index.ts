// src/features/meta-title-generator/types/index.ts

export interface MetaTitleGeneratorRequest {
    focusKeyword: string;
    relatedTerm?: string;
    provider?: string;
  }
  
  export interface MetaTitleGeneratorResponse {
    titles: string[];
    error?: string;
  }
  
  export interface MetaTitleProps {
    onSave?: (title: string) => void;
  }