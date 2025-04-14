import { HookType } from '../../article-generator/types';

/**
 * Hook type definitions with descriptions and examples
 */
export interface HookTypeInfo {
  type: HookType;
  description: string;
  example: string;
  placeholder: string;
}

export const HOOK_TYPES: HookTypeInfo[] = [
  {
    type: 'Question',
    description: 'Start with a thought-provoking question to engage readers',
    example: 'Have you ever wondered why some people can eat whatever they want and never gain weight?',
    placeholder: 'Pose a thought-provoking question that makes the reader curious about the answer'
  },
  {
    type: 'Statistic',
    description: 'Open with a surprising or compelling statistic',
    example: 'Over 70% of online businesses fail within their first year — but knowing these five factors can triple your chance of success.',
    placeholder: 'Share a surprising statistic or data point that highlights the importance of your topic'
  },
  {
    type: 'Story',
    description: 'Begin with a short, engaging narrative or anecdote',
    example: "When Sarah first started her weight loss journey, she couldn't imagine running a marathon. Three years later, she crossed the finish line with tears in her eyes.",
    placeholder: 'Tell a brief, relatable story that introduces your topic in a personal way'
  },
  {
    type: 'Quote',
    description: 'Start with a powerful, relevant quote',
    example: '"The greatest wealth is health," Virgil wrote nearly 2,000 years ago. This ancient wisdom has never been more relevant than in today\'s fast-paced world.',
    placeholder: 'Use a memorable quote that relates to your topic and draws readers in'
  },
  {
    type: 'Challenge',
    description: 'Present a challenge or problem that readers can relate to',
    example: 'Creating content that ranks well on Google while still engaging real human readers feels like an impossible challenge for many website owners.',
    placeholder: 'Identify a challenge or problem your readers face that your content will help solve'
  },
  {
    type: 'Controversial',
    description: 'Make a bold or slightly controversial statement',
    example: "Everything you've been told about productivity is wrong. The most productive people don't use to-do lists, and science proves it.",
    placeholder: 'Make a bold or contrarian statement that challenges conventional wisdom about your topic'
  },
  {
    type: 'Definition',
    description: 'Begin by defining a key term in an interesting way',
    example: "Financial freedom isn't having unlimited money — it's having enough passive income to cover your lifestyle without working. And it's more achievable than you might think.",
    placeholder: 'Define a key term or concept related to your topic in a fresh, interesting way'
  },
  {
    type: 'Direct',
    description: 'Address the reader directly with a clear value proposition',
    example: "In this guide, you'll discover exactly how to optimize your website for both search engines and visitors — no technical experience required.",
    placeholder: 'Directly state what the reader will gain from your content in clear, benefit-focused language'
  }
];

/**
 * Get a hook type by its identifier
 * @param type Hook type identifier
 * @returns Hook type information
 */
export const getHookTypeInfo = (type: HookType): HookTypeInfo => {
  const hookType = HOOK_TYPES.find(hook => hook.type === type);
  if (!hookType) {
    return HOOK_TYPES[0]; // Default to Question
  }
  return hookType;
};