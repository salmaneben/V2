import { HeadlineAnalysis } from './headlineAnalyzer';

/**
 * Configuration interface for headline regeneration
 */
interface RegenerationConfig {
  apiKey?: string;
  endpoint: string;
  maxResults: number;
  temperature: number;
}

/**
 * Default configuration for headline regeneration
 */
const DEFAULT_CONFIG: RegenerationConfig = {
  endpoint: 'https://api.openai.com/v1/completions',
  maxResults: 5,
  temperature: 0.7
};

/**
 * Regenerates headlines based on analysis results
 * 
 * @param headline The original headline
 * @param analysis The analysis results of the original headline
 * @returns An array of alternative headlines
 */
export async function regenerateHeadlines(
  headline: string,
  analysis: HeadlineAnalysis
): Promise<string[]> {
  try {
    // Get API key from localStorage
    const apiKey = localStorage.getItem('api_key');
    
    if (!apiKey) {
      throw new Error('API key not found. Please add your API key in Settings.');
    }
    
    // Construct the prompt for headline generation
    const prompt = constructPrompt(headline, analysis);
    
    // Get config from localStorage or use defaults
    const configStr = localStorage.getItem('headline_regenerator_config');
    const config: RegenerationConfig = configStr 
      ? { ...DEFAULT_CONFIG, ...JSON.parse(configStr) }
      : DEFAULT_CONFIG;
    
    // Make API request to regenerate headlines
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo-instruct',  // Or another appropriate model
        prompt: prompt,
        max_tokens: 300,
        n: config.maxResults,
        temperature: config.temperature,
        stop: ['\n\n'] // Stop at double line breaks to separate headlines
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to regenerate headlines');
    }
    
    const data = await response.json();
    
    // Parse API response into an array of headlines
    const headlines = parseHeadlinesFromResponse(data);
    return headlines;
  } catch (error) {
    console.error('Headline regeneration failed:', error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('An unknown error occurred during headline regeneration');
    }
  }
}

/**
 * Constructs a prompt for the API based on analysis results
 */
function constructPrompt(headline: string, analysis: HeadlineAnalysis): string {
  let prompt = `Generate ${DEFAULT_CONFIG.maxResults} alternative headlines for the following headline:
"${headline}"

The current headline has the following characteristics:
- Character count: ${analysis.characterCount} (ideal: 40-60)
- Word count: ${analysis.wordCount} (ideal: 6-10)
- Contains ${analysis.powerWords} power words
- Contains ${analysis.commonWords} common words
- Emotional score: ${(analysis.emotionalScore * 100).toFixed(0)}%
- Headline type: ${analysis.type}

Create alternatives that improve the following aspects:`;

  // Add specific improvement areas based on analysis
  if (analysis.characterCount < 40) {
    prompt += '\n- Make it slightly longer (aim for 40-60 characters)';
  } else if (analysis.characterCount > 70) {
    prompt += '\n- Make it shorter (aim for 40-60 characters)';
  }
  
  if (analysis.wordCount < 5) {
    prompt += '\n- Use more descriptive words (aim for 6-10 words)';
  } else if (analysis.wordCount > 12) {
    prompt += '\n- Reduce word count for better readability (aim for 6-10 words)';
  }
  
  if (analysis.powerWords < 1) {
    prompt += '\n- Include at least one power word (e.g., essential, proven, ultimate)';
  }
  
  if (analysis.commonWords > analysis.wordCount / 2) {
    prompt += '\n- Reduce the number of common words, use more specific language';
  }
  
  if (analysis.emotionalScore < 0.2) {
    prompt += '\n- Increase emotional impact with stronger, more evocative language';
  }
  
  // Additional instructions for the model
  prompt += `

Keep the core message and topic the same, but make the headline more engaging, clear, and compelling.
Format the response as a list of numbered headlines only, with no additional text.
Example format:
1. [First Alternative Headline]
2. [Second Alternative Headline]
and so on.`;

  return prompt;
}

/**
 * Parses the API response to extract headlines
 */
function parseHeadlinesFromResponse(response: any): string[] {
  try {
    // Check if we have choices in the response
    if (!response.choices || !Array.isArray(response.choices) || response.choices.length === 0) {
      return [];
    }
    
    // Extract text from choices
    const rawText = response.choices.map((choice: any) => choice.text).join('\n');
    
    // Parse numbered list format (1. Headline 2. Headline, etc.)
    const headlineRegex = /\d+\.\s+(.*?)(?=\n\d+\.|\n\n|$)/gs;
    const matches = [...rawText.matchAll(headlineRegex)];
    
    if (matches.length > 0) {
      // Return captured headlines
      return matches.map(match => match[1].trim()).filter(h => h.length > 0);
    }
    
    // Fallback: just split by new lines if numbered format isn't found
    return rawText.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.match(/^\d+\.$/)); // Remove empty lines and bare numbers
  } catch (error) {
    console.error('Failed to parse headlines from response:', error);
    return [];
  }
}