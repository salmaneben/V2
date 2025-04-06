// src/features/blog-content-generator/utils/blogContentGenerator.ts

import { 
    MetaTitleGeneratorRequest, 
    MetaTitleGeneratorResponse,
    MetaDescriptionGeneratorRequest,
    MetaDescriptionGeneratorResponse,
    OutlineGeneratorRequest,
    OutlineGeneratorResponse,
    ContentGeneratorRequest,
    ContentGeneratorResponse,
    RecipeContentGeneratorRequest,
    RecipeContentGeneratorResponse,
    RecipeSchemaMarkupRequest,
    RecipeSchemaMarkupResponse,
    Provider
  } from '../types';
  
  // Helper function to get API configuration based on provider
  const getApiConfig = (provider: Provider = 'perplexity') => {
    let apiKey = '';
    let model = '';
    let endpoint = '';
  
    switch (provider) {
      case 'perplexity':
        apiKey = localStorage.getItem('perplexity_api_key') || '';
        model = 'llama-3.1-sonar-small-128k-online';
        endpoint = 'https://api.perplexity.ai/chat/completions';
        break;
  
      case 'openai':
        apiKey = localStorage.getItem('openai_api_key') || '';
        model = localStorage.getItem('openai_model') || 'gpt-4o';
        endpoint = 'https://api.openai.com/v1/chat/completions';
        break;
  
      case 'claude':
        apiKey = localStorage.getItem('claude_api_key') || '';
        model = localStorage.getItem('claude_model') || 'claude-3-5-sonnet';
        endpoint = 'https://api.anthropic.com/v1/messages';
        break;
        
      case 'deepseek':
        apiKey = localStorage.getItem('deepseek_api_key') || '';
        model = localStorage.getItem('deepseek_model') || 'deepseek-chat';
        endpoint = 'https://api.deepseek.ai/v1/chat/completions';
        break;
  
      case 'custom':
        apiKey = localStorage.getItem('custom_api_key') || '';
        model = localStorage.getItem('custom_api_model') || '';
        endpoint = localStorage.getItem('custom_api_endpoint') || '';
        break;
  
      default:
        throw new Error('Invalid provider selected');
    }
  
    return { apiKey, model, endpoint, provider };
  };
  
  // Process API response based on provider
  const processApiResponse = async (response: Response, provider: Provider) => {
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Error: ${response.status}`);
    }
  
    const data = await response.json();
    
    if (provider === 'claude') {
      return data.content?.[0]?.text || '';
    } else {
      return data.choices?.[0]?.message?.content || '';
    }
  };
  
  // Generate Meta Titles
  export const generateMetaTitles = async (
    params: MetaTitleGeneratorRequest
  ): Promise<MetaTitleGeneratorResponse> => {
    try {
      const provider = params.provider || localStorage.getItem('preferred_provider') as Provider || 'perplexity';
      const { apiKey, model, endpoint } = getApiConfig(provider);
      
      if (!apiKey) {
        return {
          titles: [],
          error: `No API key found for ${provider}. Please set your API key in the API Settings.`
        };
      }
  
      // Prepare the prompt for generating meta titles
      const promptText = `
        You are an expert copywriter who writes catchy, SEO-friendly blog titles in a friendly tone. Follow these rules:
        1. Write 10 titles for "${params.focusKeyword}" using the exact phrase "${params.focusKeyword}".
        2. Keep titles under 65 characters.
        3. Make sure "${params.focusKeyword}" appears at the beginning of title.
        4. Use hooks like "How," "Why," or "Best" to spark curiosity.
        5. Mix formats: listicles, questions, and how-tos.
        6. Avoid quotes, markdown, or self-references.
        7. Prioritize SEO keywords related to ${params.relatedTerm || params.focusKeyword}.
        8. Title should contain a number.
        
        Return only the list of 10 titles, one per line, without any additional text, numbering, or formatting.
      `;
  
      let response;
      
      // Different request format for each provider
      if (provider === 'claude') {
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: promptText }],
            max_tokens: 1024
          })
        });
      } else {
        // Works for OpenAI, Perplexity, DeepSeek
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: 'You are an expert SEO copywriter.' },
              { role: 'user', content: promptText }
            ],
            max_tokens: 1024
          })
        });
      }
  
      const content = await processApiResponse(response, provider);
      
      // Extract titles from response
      return {
        titles: content.split('\n')
          .map(line => line.trim())
          .filter(line => line && !line.startsWith('#') && !line.startsWith('*') && !line.startsWith('-'))
          .slice(0, 10)
      };
  
    } catch (error) {
      console.error('Error generating meta titles:', error);
      return {
        titles: [],
        error: error instanceof Error ? error.message : 'Failed to generate meta titles'
      };
    }
  };
  
  // Generate Meta Descriptions
  export const generateMetaDescriptions = async (
    params: MetaDescriptionGeneratorRequest
  ): Promise<MetaDescriptionGeneratorResponse> => {
    try {
      const provider = params.provider || localStorage.getItem('preferred_provider') as Provider || 'perplexity';
      const { apiKey, model, endpoint } = getApiConfig(provider);
      
      if (!apiKey) {
        return {
          descriptions: [],
          error: `No API key found for ${provider}. Please set your API key in the API Settings.`
        };
      }
  
      // Prepare the prompt for generating meta descriptions
      const promptText = `
        You are an SEO-savvy content strategist who writes compelling blog descriptions.
        Follow these rules:
        1. Write 10 descriptions for the blog post titled "${params.metaTitle}".
        2. Use the exact phrase "${params.focusKeyword}" naturally in each description.
        3. Keep descriptions under 160 characters (ideal for SEO).
        4. Start with a hook: ask a question, use action verbs, or highlight a pain point.
        5. Include SEO keywords related to ${params.relatedTerm || 'the topic'} and address user intent (e.g., tips, solutions).
        6. End with a subtle CTA like "Discover", "Learn", "Try".
        7. Avoid quotes, markdown, or self-references.
        8. Maintain a friendly, conversational tone.
        
        Return only the list of 10 descriptions, one per line, without any additional text, numbering, or formatting.
      `;
  
      let response;
      
      // Different request format for each provider
      if (provider === 'claude') {
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: promptText }],
            max_tokens: 1024
          })
        });
      } else {
        // Works for OpenAI, Perplexity, DeepSeek
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: 'You are an expert SEO content strategist.' },
              { role: 'user', content: promptText }
            ],
            max_tokens: 1024
          })
        });
      }
  
      const content = await processApiResponse(response, provider);
      
      // Extract descriptions from response
      return {
        descriptions: content.split('\n')
          .map(line => line.trim())
          .filter(line => line && !line.startsWith('#') && !line.startsWith('*') && !line.startsWith('-'))
          .slice(0, 10)
      };
  
    } catch (error) {
      console.error('Error generating meta descriptions:', error);
      return {
        descriptions: [],
        error: error instanceof Error ? error.message : 'Failed to generate meta descriptions'
      };
    }
  };
  
  // Generate Blog Outline
  export const generateOutline = async (
    params: OutlineGeneratorRequest
  ): Promise<OutlineGeneratorResponse> => {
    try {
      const provider = params.provider || localStorage.getItem('preferred_provider') as Provider || 'perplexity';
      const { apiKey, model, endpoint } = getApiConfig(provider);
      
      if (!apiKey) {
        return {
          outline: '',
          error: `No API key found for ${provider}. Please set your API key in the API Settings.`
        };
      }
  
      // Prepare the prompt for generating blog outline
      const promptText = `
        Act as a professional Copywriter and SEO specialist. Write a detailed outline for a WordPress blog post based on this title: "${params.metaTitle}" using "${params.focusKeyword}" as the focus keyword.
        
        Don't include the title and description in your results and make sure you use proper heading structure with H2 and H3 headings.
        
        Create a comprehensive outline with main sections (H2) and subsections (H3) where appropriate.
        
        Include the focus keyword naturally in at least 2-3 headings.
        
        The outline should have a logical flow from introduction to conclusion.
      `;
  
      let response;
      
      // Different request format for each provider
      if (provider === 'claude') {
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: promptText }],
            max_tokens: 1500
          })
        });
      } else {
        // Works for OpenAI, Perplexity, DeepSeek
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: 'You are an expert SEO copywriter and outline creator.' },
              { role: 'user', content: promptText }
            ],
            max_tokens: 1500
          })
        });
      }
  
      const content = await processApiResponse(response, provider);
      
      return { outline: content };
  
    } catch (error) {
      console.error('Error generating blog outline:', error);
      return {
        outline: '',
        error: error instanceof Error ? error.message : 'Failed to generate blog outline'
      };
    }
  };
  
  // Generate Blog Content Based on Outline
  export const generateContent = async (
    params: ContentGeneratorRequest
  ): Promise<ContentGeneratorResponse> => {
    try {
      const provider = params.provider || localStorage.getItem('preferred_provider') as Provider || 'perplexity';
      const { apiKey, model, endpoint } = getApiConfig(provider);
      
      if (!apiKey) {
        return {
          content: '',
          error: `No API key found for ${provider}. Please set your API key in the API Settings.`
        };
      }
  
      // Prepare the prompt for generating blog content
      const promptText = `
        You are a professional Copywriter and SEO specialist. Write the content for a blog post based on the following outline and instructions:
        
        Instructions:
        1. Focus keyword: ${params.focusKeyword}
        2. Content length: ${params.contentLength || 1200} words.
        3. Tone: Friendly, engaging, and easy to read (4th-grade reading level).
        4. Structure: Follow the blog outline provided below. Use headings and subheadings with the focus keyword naturally integrated.
        5. SEO:
           - Include the focus keyword in the first 100 words, headings, and 2-3 times per 300 words.
           - Add related keywords where relevant.
        6. Audience: Write for readers who are interested in ${params.targetAudience || 'this topic'}.
        7. Formatting:
           - Use detailed paragraphs.
           - Include bullet points, lists, or numbered steps if necessary.
           - End with a strong call-to-action.
        8. Additional Notes: Keep the content conversational and engaging. Avoid fluff or overly technical language.
        
        Blog Outline:
        ${params.outline}
        
        Write the complete blog post following this outline and the instructions above. Use proper HTML formatting for headings (h2, h3) and other elements.
      `;
  
      let response;
      
      // Different request format for each provider
      if (provider === 'claude') {
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: promptText }],
            max_tokens: 4000
          })
        });
      } else {
        // Works for OpenAI, Perplexity, DeepSeek
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: 'You are an expert SEO copywriter and content creator.' },
              { role: 'user', content: promptText }
            ],
            max_tokens: 4000
          })
        });
      }
  
      const content = await processApiResponse(response, provider);
      
      return { content };
  
    } catch (error) {
      console.error('Error generating blog content:', error);
      return {
        content: '',
        error: error instanceof Error ? error.message : 'Failed to generate blog content'
      };
    }
  };
  
  // Generate Recipe Content
  export const generateRecipeContent = async (
    params: RecipeContentGeneratorRequest
  ): Promise<RecipeContentGeneratorResponse> => {
    try {
      const provider = params.provider || localStorage.getItem('preferred_provider') as Provider || 'perplexity';
      const { apiKey, model, endpoint } = getApiConfig(provider);
      
      if (!apiKey) {
        return {
          content: '',
          error: `No API key found for ${provider}. Please set your API key in the API Settings.`
        };
      }
  
      // Prepare the prompt for generating recipe content
      const promptText = `
        Act as a professional recipe blogger and SEO specialist. Write a 1,000+ word WordPress blog post for this title: "${params.metaTitle}" using "${params.focusKeyword}" as a focus keyword.
        
        Follow this structure and guidelines strictly:
        
        Introduction:
        Write a 200 word captivating introduction using friendly and simple words for a recipe blog post about ${params.recipeName}. Start with a strong hook that highlights the dish's key qualities. Include an interesting anecdote or fun fact about the recipe to grab attention. Describe why this dish is special and why readers should try it, emphasizing its simplicity, quick preparation time, and family-friendly appeal. Compare it briefly to another popular recipe. End with a positive and inviting tone that makes the reader excited to try the recipe.
        
        What is ${params.recipeName}?
        Write a conversational and engaging 120-word paragraph about the name of this recipe. Use a lighthearted and humorous tone, incorporating rhetorical questions to pique curiosity about the name's origin. Add a playful anecdote about why it's called this and include a classic saying. End with an encouraging call to action that invites readers to try the recipe.
        
        Why You'll Love This ${params.recipeName}:
        Write a clear and engaging section focusing on three key aspects: the main highlight of the dish, the cost-saving benefits of making it at home, and the flavorful toppings or ingredients that make it special. Use descriptive language to appeal to the reader's senses and create a friendly tone throughout. Include a brief comparison to a related recipe, encouraging readers to explore more content. Ensure the section is well-structured, concise, and ends with a call to action.
        
        How to Make ${params.recipeName}:
        
        Quick Overview:
        Offer a brief preview of what makes this dish easy, delicious, and satisfying. Highlight key features such as its simplicity, taste, and any standout elements. Also, mention the preparation time.
        
        Key Ingredients for ${params.recipeName}:
        List all the ingredients needed to make the recipe. Include a note about where to find an image showing the ingredients. Make sure each ingredient is listed clearly, including specific quantities and any special preparations needed.
        
        Step-by-Step Instructions:
        Break down the cooking process into clear, actionable steps with detailed instructions. Ensure each step is easy to follow and includes specific details about the ingredients, techniques, and timing involved. Use simple language and provide enough detail so that someone with minimal cooking experience can successfully complete the recipe.
        
        What to Serve ${params.recipeName} With:
        Suggest complementary dishes, sides, or drinks that pair well with the recipe. Provide a few ideas that enhance the main dish and offer variety, considering flavors, textures, and overall meal balance.
        
        Top Tips for Perfecting ${params.recipeName}:
        Offer valuable tips to enhance the cooking process or flavor. Include detailed advice on ingredient substitutions, timing adjustments, and common mistakes to avoid. Make sure the tips are practical and helpful for both beginners and experienced cooks.
        
        Storing and Reheating Tips:
        Provide practical advice on how to store leftovers and how long the dish stays fresh. Include detailed instructions on proper storage methods, such as refrigeration or freezing, and specify how long the dish can be kept. Also, offer guidance on how to reheat the dish for optimal taste or how to freeze it for future meals.
        
        Format the content with proper HTML headings (h2, h3) and structure for a WordPress blog post. Use the focus keyword naturally throughout the content, especially in headings and the first 100 words.
      `;
  
      let response;
      
      // Different request format for each provider
      if (provider === 'claude') {
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: promptText }],
            max_tokens: 4000
          })
        });
      } else {
        // Works for OpenAI, Perplexity, DeepSeek
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: 'You are an expert recipe blogger and SEO content creator.' },
              { role: 'user', content: promptText }
            ],
            max_tokens: 4000
          })
        });
      }
  
      const content = await processApiResponse(response, provider);
      
      return { content };
  
    } catch (error) {
      console.error('Error generating recipe content:', error);
      return {
        content: '',
        error: error instanceof Error ? error.message : 'Failed to generate recipe content'
      };
    }
  };
  
  // Generate Recipe Schema Markup
  export const generateRecipeSchemaMarkup = async (
    params: RecipeSchemaMarkupRequest
  ): Promise<RecipeSchemaMarkupResponse> => {
    try {
      const provider = params.provider || localStorage.getItem('preferred_provider') as Provider || 'perplexity';
      const { apiKey, model, endpoint } = getApiConfig(provider);
      
      if (!apiKey) {
        return {
          schemaMarkup: '',
          error: `No API key found for ${provider}. Please set your API key in the API Settings.`
        };
      }
  
      // Create a structured recipe data object
      const recipeData = {
        recipeName: params.recipeName,
        prepTime: params.prepTime || "PT15M",
        cookTime: params.cookTime || "PT30M",
        totalTime: params.totalTime || "PT45M",
        recipeType: params.recipeType || "Main Course",
        cuisine: params.cuisine || "International",
        keywords: params.keywords || params.recipeName,
        recipeYield: params.recipeYield || "4 servings",
        calories: params.calories || "350 calories",
        ingredients: params.ingredients || ["Ingredient 1", "Ingredient 2", "Ingredient 3"],
        instructions: params.instructions || ["Step 1", "Step 2", "Step 3"],
        pros: params.pros || ["Delicious", "Easy to make", "Healthy"],
        cons: params.cons || ["Takes time", "Requires special ingredients"]
      };
  
      // Generate proper JSON-LD schema markup
      const schemaMarkup = `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org/",
    "@type": "Recipe",
    "name": "${recipeData.recipeName}",
    "author": {
      "@type": "Person",
      "name": "Recipe Author"
    },
    "datePublished": "${new Date().toISOString().split('T')[0]}",
    "description": "Delicious ${recipeData.recipeName} recipe that's easy to make and perfect for any occasion.",
    "prepTime": "${recipeData.prepTime}",
    "cookTime": "${recipeData.cookTime}",
    "totalTime": "${recipeData.totalTime}",
    "keywords": "${recipeData.keywords}",
    "recipeYield": "${recipeData.recipeYield}",
    "recipeCategory": "${recipeData.recipeType}",
    "recipeCuisine": "${recipeData.cuisine}",
    "nutrition": {
      "@type": "NutritionInformation",
      "calories": "${recipeData.calories}"
    },
    "recipeIngredient": ${JSON.stringify(recipeData.ingredients)},
    "recipeInstructions": ${JSON.stringify(recipeData.instructions.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "text": step
    })))},
    "review": {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Recipe Reviewer"
      },
      "reviewBody": "This ${recipeData.recipeName} recipe is absolutely delicious and easy to follow!"
    }
  }
  </script>
  `;
  
      return { schemaMarkup };
  
    } catch (error) {
      console.error('Error generating recipe schema markup:', error);
      return {
        schemaMarkup: '',
        error: error instanceof Error ? error.message : 'Failed to generate recipe schema markup'
      };
    }
  };