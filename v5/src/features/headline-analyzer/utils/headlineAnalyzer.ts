export interface HeadlineAnalysis {
    characterCount: number;
    wordCount: number;
    powerWords: number;
    commonWords: number;
    emotionalScore: number;
    type: string;
    hasNumber: boolean;
    isQuestion: boolean;
  }
  
  // Power words that create emotional impact
  const POWER_WORDS = [
    'amazing', 'incredible', 'essential', 'absolute', 'proven', 'ultimate', 'powerful',
    'stunning', 'remarkable', 'spectacular', 'surprising', 'breathtaking', 'unforgettable',
    'revolutionary', 'exceptional', 'exclusive', 'guaranteed', 'extraordinary', 'instantly',
    'effortless', 'fantastic', 'wonderful', 'sensational', 'mind-blowing', 'astonishing',
    'shocking', 'delightful', 'impressive', 'irresistible', 'magnificent', 'phenomenal',
    'inspiring', 'thrilling', 'unbelievable', 'legendary', 'magical', 'epic', 'perfect',
    'awesome', 'unbeatable', 'triumph', 'superb', 'excellent', 'best', 'stunning',
    'life-changing', 'breakthrough', 'game-changing', 'transformative', 'compelling', 'crucial',
    'critical', 'essential', 'vital', 'necessary', 'important', 'fundamental', 'key',
    'pivotal', 'significant', 'valuable', 'indispensable', 'mandatory', 'required',
    'free', 'save', 'instant', 'easy', 'secret', 'hidden', 'proven', 'guaranteed',
    'boost', 'unlock', 'discover', 'reveal', 'ultimate', 'powerful', 'simple', 'effective',
    'unique', 'exclusive', 'special', 'limited', 'premium', 'superior', 'elite', 'deluxe',
    'luxury', 'top', 'best', 'greatest', 'brilliant', 'smart', 'clever', 'innovative',
    'creative', 'ingenious', 'genius', 'expert', 'professional', 'master', 'specialist',
    'authority', 'guru', 'pro', 'veteran'
  ];
  
  // Common, less impactful words
  const COMMON_WORDS = [
    'the', 'and', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'about',
    'as', 'of', 'from', 'like', 'so', 'but', 'or', 'if', 'while', 'because',
    'when', 'where', 'how', 'what', 'who', 'why', 'that', 'this', 'these', 'those',
    'it', 'its', 'it\'s', 'they', 'them', 'their', 'there', 'here', 'you', 'your',
    'we', 'our', 'us', 'my', 'mine', 'his', 'her', 'hers', 'they', 'them',
    'be', 'is', 'are', 'was', 'were', 'been', 'being', 'have', 'has', 'had', 'having',
    'do', 'does', 'did', 'done', 'doing'
  ];
  
  // Words that express emotions
  const EMOTIONAL_WORDS = [
    'love', 'hate', 'fear', 'angry', 'happy', 'sad', 'joy', 'pain', 'worry', 'relief',
    'anxiety', 'hope', 'despair', 'excited', 'scared', 'thrilled', 'disappointed', 'proud',
    'ashamed', 'guilty', 'innocent', 'jealous', 'envious', 'grateful', 'thankful', 'resentful',
    'bitter', 'sweet', 'lonely', 'connected', 'abandoned', 'supported', 'betrayed', 'trusted',
    'frustrated', 'satisfied', 'annoyed', 'pleased', 'disgusted', 'attracted', 'repulsed',
    'interested', 'bored', 'curious', 'apathetic', 'enthusiastic', 'reluctant', 'eager',
    'hesitant', 'confident', 'insecure', 'brave', 'afraid', 'comfortable', 'uncomfortable',
    'calm', 'agitated', 'relaxed', 'tense', 'peaceful', 'chaotic', 'balanced', 'overwhelmed',
    'success', 'failure', 'win', 'lose', 'victory', 'defeat', 'triumph', 'disaster',
    'fortune', 'misfortune', 'luck', 'misery', 'wealth', 'poverty', 'health', 'illness'
  ];
  
  /**
   * Analyze a headline and return various metrics
   */
  export const analyzeHeadline = (headline: string): HeadlineAnalysis => {
    const normalizedHeadline = headline.toLowerCase().trim();
    const words = normalizedHeadline.split(/\s+/);
    
    // Count basic metrics
    const characterCount = headline.length;
    const wordCount = words.length;
    
    // Count power words
    const powerWordCount = words.filter(word => 
      POWER_WORDS.includes(word.replace(/[^a-z]/g, ''))
    ).length;
    
    // Count common words
    const commonWordCount = words.filter(word => 
      COMMON_WORDS.includes(word.replace(/[^a-z]/g, ''))
    ).length;
    
    // Calculate emotional score (0-1)
    const emotionalWordCount = words.filter(word => 
      EMOTIONAL_WORDS.includes(word.replace(/[^a-z]/g, ''))
    ).length;
    const emotionalScore = wordCount > 0 ? emotionalWordCount / wordCount : 0;
    
    // Determine headline type
    let type = 'General';
    if (normalizedHeadline.includes('how to')) {
      type = 'How-To';
    } else if (normalizedHeadline.includes('why')) {
      type = 'Why';
    } else if (/^\d+\s/.test(normalizedHeadline) || /\s\d+\s/.test(normalizedHeadline)) {
      type = 'List';
    } else if (normalizedHeadline.includes('vs') || normalizedHeadline.includes('versus')) {
      type = 'Versus';
    } else if (normalizedHeadline.startsWith('the ')) {
      type = 'The';
    } else if (/^[a-z]+ (ways|tips|tricks|ideas|steps|strategies|secrets|methods|principles|rules|lessons|habits|examples|reasons)/.test(normalizedHeadline)) {
      type = 'Resource';
    }
    
    // Check for numbers
    const hasNumber = /\d+/.test(normalizedHeadline);
    
    // Check if it's a question
    const isQuestion = normalizedHeadline.includes('?') || 
                       normalizedHeadline.startsWith('how') ||
                       normalizedHeadline.startsWith('what') ||
                       normalizedHeadline.startsWith('why') ||
                       normalizedHeadline.startsWith('when') ||
                       normalizedHeadline.startsWith('where') ||
                       normalizedHeadline.startsWith('who') ||
                       normalizedHeadline.startsWith('which') ||
                       normalizedHeadline.startsWith('are') ||
                       normalizedHeadline.startsWith('is') ||
                       normalizedHeadline.startsWith('can') ||
                       normalizedHeadline.startsWith('do') ||
                       normalizedHeadline.startsWith('does') ||
                       normalizedHeadline.startsWith('will') ||
                       normalizedHeadline.startsWith('should');
    
    return {
      characterCount,
      wordCount,
      powerWords: powerWordCount,
      commonWords: commonWordCount,
      emotionalScore,
      type,
      hasNumber,
      isQuestion
    };
  };