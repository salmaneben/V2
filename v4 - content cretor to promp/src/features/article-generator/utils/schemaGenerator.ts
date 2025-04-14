import { NicheType } from '../types';

/**
 * Generates JSON-LD schema markup based on the selected niche
 * @param niche The content niche
 * @param title The article title
 * @param description The article description
 * @param tags Article tags (comma-separated string)
 * @returns JSON-LD schema markup as a string
 */
export const generateSchemaMarkup = (
  niche: NicheType,
  title: string,
  description: string,
  tags: string
): string => {
  // Convert tags string to array
  const keywords = tags.split(',').map(tag => tag.trim()).filter(Boolean);
  
  // Base article schema for all content types
  const baseArticleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "keywords": keywords.join(', '),
    "author": {
      "@type": "Person",
      "name": "Author Name" // This would typically be replaced with actual author data
    },
    "publisher": {
      "@type": "Organization",
      "name": "Publisher Name", // This would typically be replaced with actual publisher data
      "logo": {
        "@type": "ImageObject",
        "url": "https://example.com/logo.png"
      }
    },
    "datePublished": new Date().toISOString(),
    "dateModified": new Date().toISOString()
  };
  
  // Generate schema based on niche
  switch (niche) {
    case 'recipes':
      return generateRecipeSchema(title, description, keywords);
    
    case 'technology':
      return generateTechArticleSchema(title, description, keywords);
    
    case 'health':
      return generateHealthArticleSchema(title, description, keywords);
    
    case 'finance':
      return generateFinanceArticleSchema(title, description, keywords);
    
    case 'travel':
      return generateTravelArticleSchema(title, description, keywords);
    
    case 'business':
      return generateBusinessArticleSchema(title, description, keywords);
    
    // For other niches, use the standard Article schema
    default:
      return JSON.stringify(baseArticleSchema, null, 2);
  }
};

/**
 * Generates Recipe schema for food content
 */
const generateRecipeSchema = (title: string, description: string, keywords: string[]): string => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    "name": title,
    "description": description,
    "keywords": keywords.join(', '),
    "author": {
      "@type": "Person",
      "name": "Chef Name" // Replace with actual chef name
    },
    "datePublished": new Date().toISOString(),
    "prepTime": "PT20M", // Example: 20 minutes prep time
    "cookTime": "PT30M", // Example: 30 minutes cook time
    "totalTime": "PT50M", // Example: 50 minutes total time
    "recipeYield": "4 servings", // Example
    "recipeCategory": "Main Course", // Example
    "recipeCuisine": "Italian", // Example
    "nutrition": {
      "@type": "NutritionInformation",
      "calories": "350 calories", // Example
      "fatContent": "15 g" // Example
    },
    "recipeIngredient": [
      // Example ingredients - would be replaced with actual data
      "2 cups flour",
      "1 teaspoon salt",
      "1 cup water"
    ],
    "recipeInstructions": [
      {
        "@type": "HowToStep",
        "text": "Mix ingredients in a bowl" // Example
      },
      {
        "@type": "HowToStep",
        "text": "Cook for 30 minutes" // Example
      }
    ]
  };
  
  return JSON.stringify(schema, null, 2);
};

/**
 * Generates TechArticle schema for technology content
 */
const generateTechArticleSchema = (title: string, description: string, keywords: string[]): string => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": title,
    "description": description,
    "keywords": keywords.join(', '),
    "author": {
      "@type": "Person",
      "name": "Tech Author" // Replace with actual author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Tech Publisher",
      "logo": {
        "@type": "ImageObject",
        "url": "https://example.com/logo.png"
      }
    },
    "datePublished": new Date().toISOString(),
    "dateModified": new Date().toISOString(),
    "proficiencyLevel": "Beginner", // Could be Beginner, Expert, etc.
    "dependencies": "None", // Software dependencies if relevant
    "articleSection": "Technology"
  };
  
  return JSON.stringify(schema, null, 2);
};

/**
 * Generates MedicalWebPage schema for health content
 */
const generateHealthArticleSchema = (title: string, description: string, keywords: string[]): string => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "headline": title,
    "description": description,
    "keywords": keywords.join(', '),
    "author": {
      "@type": "Person",
      "name": "Health Professional" // Replace with actual author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Health Publisher",
      "logo": {
        "@type": "ImageObject",
        "url": "https://example.com/logo.png"
      }
    },
    "datePublished": new Date().toISOString(),
    "dateModified": new Date().toISOString(),
    "medicalAudience": {
      "@type": "MedicalAudience",
      "audienceType": "General Public"
    },
    "mainContentOfPage": {
      "@type": "WebPageElement",
      "cssSelector": "main"
    }
  };
  
  return JSON.stringify(schema, null, 2);
};

/**
 * Generates FinancialProduct schema for finance content
 */
const generateFinanceArticleSchema = (title: string, description: string, keywords: string[]): string => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "keywords": keywords.join(', '),
    "author": {
      "@type": "Person",
      "name": "Financial Expert" // Replace with actual author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Finance Publisher",
      "logo": {
        "@type": "ImageObject",
        "url": "https://example.com/logo.png"
      }
    },
    "datePublished": new Date().toISOString(),
    "dateModified": new Date().toISOString(),
    "articleSection": "Finance",
    "about": {
      "@type": "FinancialProduct",
      "name": "Financial Information",
      "category": "Finance"
    }
  };
  
  return JSON.stringify(schema, null, 2);
};

/**
 * Generates TouristAttraction schema for travel content
 */
const generateTravelArticleSchema = (title: string, description: string, keywords: string[]): string => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TravelGuide",
    "headline": title,
    "description": description,
    "keywords": keywords.join(', '),
    "author": {
      "@type": "Person",
      "name": "Travel Writer" // Replace with actual author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Travel Publisher",
      "logo": {
        "@type": "ImageObject",
        "url": "https://example.com/logo.png"
      }
    },
    "datePublished": new Date().toISOString(),
    "dateModified": new Date().toISOString(),
    "about": {
      "@type": "TouristAttraction",
      "name": "Travel Destination", // Replace with actual destination
      "description": description
    }
  };
  
  return JSON.stringify(schema, null, 2);
};

/**
 * Generates BusinessArticle schema for business content
 */
const generateBusinessArticleSchema = (title: string, description: string, keywords: string[]): string => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BusinessArticle",
    "headline": title,
    "description": description,
    "keywords": keywords.join(', '),
    "author": {
      "@type": "Person",
      "name": "Business Expert" // Replace with actual author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Business Publisher",
      "logo": {
        "@type": "ImageObject",
        "url": "https://example.com/logo.png"
      }
    },
    "datePublished": new Date().toISOString(),
    "dateModified": new Date().toISOString(),
    "articleSection": "Business"
  };
  
  return JSON.stringify(schema, null, 2);
};