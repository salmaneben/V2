import { ArticleSize, ArticleSizeType } from '../../article-generator/types';

/**
 * Article size presets with word count and section distributions
 */
export const ARTICLE_SIZES: Record<ArticleSizeType, ArticleSize> = {
  small: {
    totalWords: 800,
    sections: {
      intro: 150,
      body: 550,
      conclusion: 100
    },
    h2Count: 3,
    h3PerH2: 2
  },
  medium: {
    totalWords: 1500,
    sections: {
      intro: 200,
      body: 1100,
      conclusion: 200
    },
    h2Count: 5,
    h3PerH2: 2
  },
  large: {
    totalWords: 3000,
    sections: {
      intro: 300,
      body: 2400,
      conclusion: 300
    },
    h2Count: 7,
    h3PerH2: 3
  },
  custom: {
    totalWords: 0, // Will be set by user
    sections: {
      intro: 0,
      body: 0,
      conclusion: 0
    },
    h2Count: 0,
    h3PerH2: 0
  }
};

/**
 * Creates a custom article size configuration based on total word count
 * @param wordCount Total number of words
 * @returns Custom article size configuration
 */
export const createCustomArticleSize = (wordCount: number): ArticleSize => {
  // Calculate percentages for each section
  const introPercent = 0.15; // 15%
  const conclusionPercent = 0.1; // 10%
  const bodyPercent = 1 - introPercent - conclusionPercent; // 75%

  // Calculate H2 count based on word count (roughly 1 H2 per 500 words)
  const h2Count = Math.max(2, Math.round(wordCount / 500));
  
  // Calculate H3 per H2 based on word count
  let h3PerH2 = 2; // Default
  if (wordCount > 2000) h3PerH2 = 3;
  if (wordCount > 4000) h3PerH2 = 4;

  return {
    totalWords: wordCount,
    sections: {
      intro: Math.round(wordCount * introPercent),
      body: Math.round(wordCount * bodyPercent),
      conclusion: Math.round(wordCount * conclusionPercent)
    },
    h2Count,
    h3PerH2
  };
};

/**
 * Returns article size description for display
 * @param size Article size type
 * @param customWordCount Custom word count if applicable
 * @returns Human-readable description of article size
 */
export const getArticleSizeDescription = (
  size: ArticleSizeType,
  customWordCount?: number
): string => {
  switch (size) {
    case 'small':
      return 'Small (800 words, ~3-4 minute read)';
    case 'medium':
      return 'Medium (1,500 words, ~6-7 minute read)';
    case 'large':
      return 'Large (3,000 words, ~12-15 minute read)';
    case 'custom':
      return `Custom (${customWordCount || 0} words)`;
  }
};

/**
 * Gets the article size configuration
 * @param size Article size type
 * @param customWordCount Custom word count for 'custom' size
 * @returns Article size configuration
 */
export const getArticleSize = (
  size: ArticleSizeType,
  customWordCount?: number
): ArticleSize => {
  if (size === 'custom' && customWordCount) {
    return createCustomArticleSize(customWordCount);
  }
  return ARTICLE_SIZES[size];
};