# Prompt Generator Tool

A standalone tool for generating well-structured prompts for AI content creation without making API calls.

## Overview

The Prompt Generator helps users create effective prompts for various content types, optimized for different AI providers. It builds prompts dynamically based on user selections and predefined templates.

## Features

- **Multiple Content Types**: Support for articles, blog posts, social media, scripts, and emails
- **Niche-Specific Templates**: Customized instructions for each content niche
- **Detail Levels**: Three levels of content complexity
- **Tone Selection**: Eight different writing tones
- **Provider Optimization**: Tailored guidance for different AI services
- **No API Calls**: Works completely client-side using predefined templates
- **LocalStorage Persistence**: Saves settings between sessions

## Component Structure

- **PromptGenerator**: Main component orchestrating the UI and prompt generation
- **NicheSelector**: Grid-based UI for selecting content niches
- **PromptTypeSelector**: Selection UI for different content types
- **DetailLevelSelector**: Options for basic, intermediate, and advanced detail levels
- **ToneSelector**: Selection for various writing tones
- **ProviderSelector**: Options for targeting specific AI providers
- **OptionsSelector**: Checkbox options for additional prompt features

## Usage

1. Select the focus keyword/topic
2. Choose a content niche
3. Select the content type
4. Set the detail level
5. Choose a writing tone
6. Select target AI provider (if applicable)
7. Configure additional options
8. Add any custom instructions
9. Generate the prompt
10. Copy and use with any AI service

## Installation

1. Add the `prompt-generator` directory to your project's features folder
2. Import the PromptGenerator component
3. Add to your application routes

```jsx
import PromptGenerator from './features/prompt-generator';

// In your routes
<Route path="/prompt-generator" element={<PromptGenerator />} />
```

## Dependencies

- React
- TypeScript
- Tailwind CSS

## Customization

- Templates can be modified in `utils/promptTemplates.ts`
- Component UI can be customized with Tailwind classes
- Add new niches, content types, or providers by extending the type definitions and templates

## License

MIT