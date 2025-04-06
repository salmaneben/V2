// @/features/contentCreator/utils/articleSizeHelper.ts
// New helper specifically for Content Creator form to avoid affecting other tools

/**
 * Returns article size information based on the selected word count category
 * @param wordCount The selected word count category ('x-small', 'small', 'medium', 'large')
 * @returns Object containing wordCount (number), h2 section count, and h3 subsection count
 */
export const getContentArticleSize = (wordCount: string) => {
    // Define article sizes with precise values
    switch (wordCount) {
      case 'x-small':
        return {
          wordCount: 900,  // Average of 600-1200 range
          h2: '2-5',
          h3: '5-10'
        };
      case 'small':
        return {
          wordCount: 1800, // Average of 1200-2400 range
          h2: '5-8',
          h3: '10-16'
        };
      case 'medium':
        return {
          wordCount: 3000, // Average of 2400-3600 range
          h2: '8-12',
          h3: '16-24'
        };
      case 'large':
        return {
          wordCount: 4400, // Average of 3600-5200 range
          h2: '13-16',
          h3: '26-32'
        };
      default:
        // Provide a safe default (medium)
        return {
          wordCount: 3000,
          h2: '8-12',
          h3: '16-24'
        };
    }
  };
  
  /**
   * Calculates approximate reading time based on word count
   * @param wordCount Number of words in the article
   * @returns Reading time in minutes
   */
  export const calculateReadingTime = (wordCount: number): number => {
    // Average reading speed: 200-250 words per minute
    const wordsPerMinute = 225;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };
  
  /**
   * Maps word count to article pricing tiers
   * @param wordCount Number of words in the article
   * @returns Pricing information
   */
  export const getArticlePricing = (wordCount: string): {tier: string, credits: number} => {
    switch (wordCount) {
      case 'x-small':
        return { tier: 'Starter', credits: 1 };
      case 'small':
        return { tier: 'Basic', credits: 2 };
      case 'medium':
        return { tier: 'Standard', credits: 3 };
      case 'large':
        return { tier: 'Premium', credits: 4 };
      default:
        return { tier: 'Standard', credits: 3 };
    }
  };