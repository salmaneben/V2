// src/features/blog-content-generator/components/SchemaMarkupStep.tsx

import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle, ArrowLeft, PlusCircle, MinusCircle, Code, Settings } from 'lucide-react';
import { generateRecipeSchemaMarkup } from '../utils/blogContentGenerator';
import { StepProps, Provider } from '../types';
import ApiSettingsSelector from './ApiSettingsSelector';

export const SchemaMarkupStep: React.FC<StepProps> = ({ 
  data, 
  updateData, 
  onPrevStep 
}) => {
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [newIngredient, setNewIngredient] = useState('');
  const [newInstruction, setNewInstruction] = useState('');
  const [newPro, setNewPro] = useState('');
  const [newCon, setNewCon] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showApiSettings, setShowApiSettings] = useState(false);
  
  // Initialize API settings if they don't exist
  useEffect(() => {
    if (!data.apiSettings?.schemaApiProvider) {
      // Try to load from localStorage or use defaults
      const schemaApiProvider = localStorage.getItem('preferred_provider_schemaApiProvider') as Provider || data.provider || 'deepseek';
      const schemaApiModel = localStorage.getItem('preferred_model_schemaApiModel') || getDefaultModel(schemaApiProvider);
      
      updateData({
        apiSettings: {
          ...data.apiSettings,
          schemaApiProvider,
          schemaApiModel
        }
      });
    }
  }, []);
  
  // Initialize schema values if needed
  useEffect(() => {
    if (!data.ingredients || data.ingredients.length === 0) {
      updateData({
        ingredients: [''],
        instructions: [''],
        pros: [''],
        cons: [''],
        prepTime: 'PT30M',
        cookTime: 'PT1H',
        totalTime: 'PT1H30M',
        recipeYield: '4 servings',
        recipeType: 'Main Course',
        cuisine: 'American',
        calories: '350 calories',
        keywords: data.focusKeyword
      });
    }
  }, []);
  
  const getDefaultModel = (provider: Provider): string => {
    switch (provider) {
      case 'openai': return 'gpt-4';
      case 'claude': return 'claude-3-sonnet-20240229';
      case 'perplexity': return 'llama-3.1-sonar-small-128k-online';
      case 'deepseek': return 'deepseek-chat';
      case 'custom': return localStorage.getItem('custom_api_model') || '';
      default: return '';
    }
  };

  const handleGenerateSchema = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      // Use the schema-specific provider if available, otherwise fall back to global provider
      const provider = data.apiSettings?.schemaApiProvider || data.provider || 'deepseek';
      
      const result = await generateRecipeSchemaMarkup({
        recipeName: data.recipeName,
        prepTime: data.prepTime,
        cookTime: data.cookTime,
        totalTime: data.totalTime,
        recipeType: data.recipeType,
        cuisine: data.cuisine,
        keywords: data.keywords,
        recipeYield: data.recipeYield,
        calories: data.calories,
        ingredients: data.ingredients?.filter(i => i.trim()) || [],
        instructions: data.instructions?.filter(i => i.trim()) || [],
        pros: data.pros?.filter(i => i.trim()) || [],
        cons: data.cons?.filter(i => i.trim()) || [],
        provider
      });

      if (result.error) {
        setError(result.error);
      } else {
        updateData({ schemaMarkup: result.schemaMarkup });
        
        setSuccessMessage('Schema markup generated successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      }
    } catch (err) {
      setError('Failed to generate schema markup. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!data.schemaMarkup) return;
    
    navigator.clipboard.writeText(data.schemaMarkup)
      .then(() => {
        setCopied(true);
        setSuccessMessage('Schema markup copied to clipboard!');
        
        // Reset the copied status after 2 seconds
        setTimeout(() => {
          setCopied(false);
          setSuccessMessage(null);
        }, 2000);
      })
      .catch(() => {
        setError('Failed to copy schema markup');
        
        // Clear error after 3 seconds
        setTimeout(() => {
          setError(null);
        }, 3000);
      });
  };
  
  const handleProviderChange = (providerId: string, provider: Provider) => {
    updateData({
      apiSettings: {
        ...data.apiSettings,
        [providerId]: provider
      }
    });
  };
  
  const handleModelChange = (modelId: string, model: string) => {
    updateData({
      apiSettings: {
        ...data.apiSettings,
        [modelId]: model
      }
    });
  };

  // Handle array type inputs (ingredients, instructions, pros, cons)
  const handleAddIngredient = () => {
    if (!newIngredient.trim()) return;
    updateData({ ingredients: [...(data.ingredients || []), newIngredient] });
    setNewIngredient('');
  };

  const handleRemoveIngredient = (index: number) => {
    const updated = [...(data.ingredients || [])];
    updated.splice(index, 1);
    updateData({ ingredients: updated });
  };

  const handleAddInstruction = () => {
    if (!newInstruction.trim()) return;
    updateData({ instructions: [...(data.instructions || []), newInstruction] });
    setNewInstruction('');
  };

  const handleRemoveInstruction = (index: number) => {
    const updated = [...(data.instructions || [])];
    updated.splice(index, 1);
    updateData({ instructions: updated });
  };

  const handleAddPro = () => {
    if (!newPro.trim()) return;
    updateData({ pros: [...(data.pros || []), newPro] });
    setNewPro('');
  };

  const handleRemovePro = (index: number) => {
    const updated = [...(data.pros || [])];
    updated.splice(index, 1);
    updateData({ pros: updated });
  };

  const handleAddCon = () => {
    if (!newCon.trim()) return;
    updateData({ cons: [...(data.cons || []), newCon] });
    setNewCon('');
  };

  const handleRemoveCon = (index: number) => {
    const updated = [...(data.cons || [])];
    updated.splice(index, 1);
    updateData({ cons: updated });
  };

  return (
    <div className="space-y-6">
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-md">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md">
          {error}
        </div>
      )}
      
      <div className="p-6 border rounded-md bg-white shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Step 5: Recipe Schema Markup</h2>
          {data.schemaMarkup && (
            <button 
              className="flex items-center gap-1 px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>
        
        <p className="text-gray-600 mb-6">
          Add recipe details to generate schema markup for better SEO. Recipe schema helps search engines understand your content and can lead to rich results.
        </p>
        
        <div className="w-full border rounded-md p-4 mb-4">
          <button 
            className="flex items-center gap-2 w-full text-left"
            onClick={() => setShowApiSettings(!showApiSettings)}
          >
            <Settings className="h-4 w-4" />
            <span>API Settings</span>
            <span className="ml-auto">{showApiSettings ? '▲' : '▼'}</span>
          </button>
          
          {showApiSettings && (
            <div className="mt-3">
              <ApiSettingsSelector
                stepName="Schema Markup Generator"
                providerId="schemaApiProvider"
                modelId="schemaApiModel"
                provider={data.apiSettings?.schemaApiProvider || data.provider || 'deepseek'}
                model={data.apiSettings?.schemaApiModel || getDefaultModel(data.apiSettings?.schemaApiProvider || data.provider || 'deepseek')}
                onProviderChange={handleProviderChange}
                onModelChange={handleModelChange}
                showCustomOptions={true}
              />
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Recipe Name</label>
              <input
                type="text"
                value={data.recipeName}
                readOnly
                className="w-full p-2 border rounded-md bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Keywords</label>
              <input
                type="text"
                value={data.keywords || data.focusKeyword}
                onChange={(e) => updateData({ keywords: e.target.value })}
                placeholder="Separate keywords with commas"
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Preparation Time (ISO 8601)</label>
              <input
                type="text"
                value={data.prepTime || 'PT30M'}
                onChange={(e) => updateData({ prepTime: e.target.value })}
                placeholder="PT30M"
                className="w-full p-2 border rounded-md"
              />
              <p className="text-xs text-gray-500 mt-1">Format: PT#H#M (e.g., PT1H30M for 1 hour 30 minutes)</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cooking Time (ISO 8601)</label>
              <input
                type="text"
                value={data.cookTime || 'PT1H'}
                onChange={(e) => updateData({ cookTime: e.target.value })}
                placeholder="PT1H"
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total Time (ISO 8601)</label>
              <input
                type="text"
                value={data.totalTime || 'PT1H30M'}
                onChange={(e) => updateData({ totalTime: e.target.value })}
                placeholder="PT1H30M"
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Recipe Yield</label>
              <input
                type="text"
                value={data.recipeYield || '4 servings'}
                onChange={(e) => updateData({ recipeYield: e.target.value })}
                placeholder="4 servings"
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Recipe Type</label>
              <input
                type="text"
                value={data.recipeType || 'Main Course'}
                onChange={(e) => updateData({ recipeType: e.target.value })}
                placeholder="Main Course, Dessert, Appetizer, etc."
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cuisine</label>
              <input
                type="text"
                value={data.cuisine || 'American'}
                onChange={(e) => updateData({ cuisine: e.target.value })}
                placeholder="American, Italian, Chinese, etc."
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Calories</label>
              <input
                type="text"
                value={data.calories || '350 calories'}
                onChange={(e) => updateData({ calories: e.target.value })}
                placeholder="350 calories"
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Ingredients</label>
              <div className="space-y-2 mb-3">
                {data.ingredients?.map((ingredient, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={ingredient}
                      onChange={(e) => {
                        const updated = [...data.ingredients!];
                        updated[index] = e.target.value;
                        updateData({ ingredients: updated });
                      }}
                      placeholder={`Ingredient ${index + 1}`}
                      className="w-full p-2 border rounded-md"
                    />
                    <button
                      onClick={() => handleRemoveIngredient(index)}
                      className="p-2 border rounded-md bg-gray-100 hover:bg-gray-200"
                    >
                      <MinusCircle className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  placeholder="Add new ingredient"
                  className="w-full p-2 border rounded-md"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddIngredient()}
                />
                <button
                  onClick={handleAddIngredient}
                  className="p-2 border rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                  disabled={!newIngredient.trim()}
                >
                  <PlusCircle className="h-4 w-4 text-green-500" />
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Instructions</label>
              <div className="space-y-2 mb-3">
                {data.instructions?.map((instruction, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <textarea
                      value={instruction}
                      onChange={(e) => {
                        const updated = [...data.instructions!];
                        updated[index] = e.target.value;
                        updateData({ instructions: updated });
                      }}
                      placeholder={`Step ${index + 1}`}
                      className="w-full p-2 border rounded-md"
                      rows={2}
                    ></textarea>
                    <button
                      onClick={() => handleRemoveInstruction(index)}
                      className="p-2 border rounded-md bg-gray-100 hover:bg-gray-200"
                    >
                      <MinusCircle className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <textarea
                  value={newInstruction}
                  onChange={(e) => setNewInstruction(e.target.value)}
                  placeholder="Add new instruction step"
                  className="w-full p-2 border rounded-md"
                  rows={2}
                ></textarea>
                <button
                  onClick={handleAddInstruction}
                  className="p-2 border rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                  disabled={!newInstruction.trim()}
                >
                  <PlusCircle className="h-4 w-4 text-green-500" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Pros</label>
                <div className="space-y-2 mb-3">
                  {data.pros?.map((pro, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={pro}
                        onChange={(e) => {
                          const updated = [...data.pros!];
                          updated[index] = e.target.value;
                          updateData({ pros: updated });
                        }}
                        placeholder={`Pro ${index + 1}`}
                        className="w-full p-2 border rounded-md"
                      />
                      <button
                        onClick={() => handleRemovePro(index)}
                        className="p-2 border rounded-md bg-gray-100 hover:bg-gray-200"
                      >
                        <MinusCircle className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newPro}
                    onChange={(e) => setNewPro(e.target.value)}
                    placeholder="Add new pro"
                    className="w-full p-2 border rounded-md"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddPro()}
                  />
                  <button
                    onClick={handleAddPro}
                    className="p-2 border rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                    disabled={!newPro.trim()}
                  >
                    <PlusCircle className="h-4 w-4 text-green-500" />
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Cons</label>
                <div className="space-y-2 mb-3">
                  {data.cons?.map((con, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={con}
                        onChange={(e) => {
                          const updated = [...data.cons!];
                          updated[index] = e.target.value;
                          updateData({ cons: updated });
                        }}
                        placeholder={`Con ${index + 1}`}
                        className="w-full p-2 border rounded-md"
                      />
                      <button
                        onClick={() => handleRemoveCon(index)}
                        className="p-2 border rounded-md bg-gray-100 hover:bg-gray-200"
                      >
                        <MinusCircle className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newCon}
                    onChange={(e) => setNewCon(e.target.value)}
                    placeholder="Add new con"
                    className="w-full p-2 border rounded-md"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCon()}
                  />
                  <button
                    onClick={handleAddCon}
                    className="p-2 border rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                    disabled={!newCon.trim()}
                  >
                    <PlusCircle className="h-4 w-4 text-green-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleGenerateSchema} 
            disabled={isLoading}
            className={`w-full p-3 rounded-md ${isLoading ? 'bg-purple-300' : 'bg-purple-600 hover:bg-purple-700'} text-white flex items-center justify-center`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating Schema Markup...</span>
              </>
            ) : (
              <>
                <Code className="mr-2 h-4 w-4" />
                <span>Generate Recipe Schema Markup</span>
              </>
            )}
          </button>
          
          {data.schemaMarkup && (
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Schema Markup</label>
              <div className="border rounded-lg p-4 bg-gray-900 text-gray-100 overflow-auto">
                <pre className="whitespace-pre-wrap break-all text-xs">
                  {data.schemaMarkup}
                </pre>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Add this markup to the head section of your HTML or use a WordPress schema plugin to add it to your post.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrevStep}
          className="px-3 py-2 border rounded-md bg-gray-100 hover:bg-gray-200 flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Content
        </button>
        
        <button
          onClick={() => {
            // We're done, trigger completion message
            setSuccessMessage('Recipe content and schema markup generation complete! You can copy and use it now.');
            setTimeout(() => setSuccessMessage(null), 5000);
          }}
          disabled={!data.schemaMarkup}
          className={`p-3 rounded-md ${!data.schemaMarkup ? 'bg-green-300' : 'bg-green-600 hover:bg-green-700'} text-white flex items-center`}
        >
          Complete Recipe Generation
          <CheckCircle className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};