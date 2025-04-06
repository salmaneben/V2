import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGeneratorForm } from '../hooks/useGeneratorForm';
import { 
  Wand, 
  Loader2, 
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Brain,
  Cpu,
  Palette,
  Server
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { hookTypes } from '../constants/hookTypes';

interface GeneratorFormProps {
  onSubmit: (data: any) => void;
  sidebarState?: string;
  apiConfig?: any; // Add apiConfig as a prop
}

const GeneratorForm: React.FC<GeneratorFormProps> = ({ onSubmit, sidebarState, apiConfig }) => {
  const { 
    formData,
    apiError,
    handleInputChange,
    handleHookTypeChange,
    generateSEOKeywords,
    generateFAQs,
    generateTargetAudience,
    handleSubmit,
    isGeneratingKeywords,
    isGeneratingFAQs,
    isGeneratingTargetAudience
  } = useGeneratorForm({ onSubmit, apiConfig }); // Pass apiConfig to the hook

  // Helper function to get provider icon
  const getProviderIcon = () => {
    if (!apiConfig) return null;
    
    switch(apiConfig.provider) {
      case 'perplexity':
        return <Sparkles className="h-5 w-5 text-indigo-500" />;
      case 'openai':
        return <Brain className="h-5 w-5 text-green-500" />;
      case 'claude':
        return <Cpu className="h-5 w-5 text-purple-500" />;
      case 'deepseek':
        return <Sparkles className="h-5 w-5 text-blue-500" />;
      case 'fluxai':
        return <Palette className="h-5 w-5 text-orange-500" />;
      case 'custom':
        return <Server className="h-5 w-5 text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* API Error Message */}
      {apiError && (
        <Card className="p-4 border-l-4 border-red-500 bg-red-50 mb-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800">API Configuration Error</h3>
              <p className="text-sm text-red-700 mt-1">{apiError}</p>
              <div className="mt-2">
                <Link 
                  to="/api-settings" 
                  className="text-sm font-medium text-red-600 hover:text-red-800 flex items-center"
                >
                  Configure API Settings
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Information */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Main Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Main Keyword or Question
              </label>
              <input
                type="text"
                value={formData.mainKeyword}
                onChange={(e) => handleInputChange('mainKeyword', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="e.g., Best hiking trails in Colorado"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                The primary topic or question the content will focus on
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-700 text-sm font-medium">
                  SEO Keywords
                </label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="text-xs py-1 px-2"
                  onClick={generateSEOKeywords}
                  disabled={isGeneratingKeywords || !formData.mainKeyword}
                >
                  {isGeneratingKeywords ? (
                    <>
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand className="mr-1 h-3 w-3" />
                      Generate Keywords
                    </>
                  )}
                </Button>
              </div>
              <textarea
                value={formData.seoKeywords}
                onChange={(e) => handleInputChange('seoKeywords', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md h-24"
                placeholder="• keyword 1&#10;• keyword 2&#10;• keyword 3"
              />
              <p className="text-xs text-gray-500 mt-1">
                Secondary keywords to include in the content
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-700 text-sm font-medium">
                  Frequently Asked Questions
                </label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="text-xs py-1 px-2"
                  onClick={generateFAQs}
                  disabled={isGeneratingFAQs || !formData.mainKeyword}
                >
                  {isGeneratingFAQs ? (
                    <>
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand className="mr-1 h-3 w-3" />
                      Generate FAQs
                    </>
                  )}
                </Button>
              </div>
              <textarea
                value={formData.faqs}
                onChange={(e) => handleInputChange('faqs', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md h-32"
                placeholder="1. Q: What are the best hiking trails in Colorado?&#10;A: The best hiking trails include..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Questions and answers that should be addressed in the content
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-700 text-sm font-medium">
                  Target Audience
                </label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="text-xs py-1 px-2"
                  onClick={generateTargetAudience}
                  disabled={isGeneratingTargetAudience || !formData.mainKeyword}
                >
                  {isGeneratingTargetAudience ? (
                    <>
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand className="mr-1 h-3 w-3" />
                      Generate Audience
                    </>
                  )}
                </Button>
              </div>
              <textarea
                value={formData.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md h-24"
                placeholder="Describe the target audience for this content..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Demographic and psychographic details of the intended audience
              </p>
            </div>
          </div>
        </Card>

        {/* Language & Content Settings */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Language & Content Size</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Language
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="English (US)">English (US)</option>
                  <option value="English (UK)">English (UK)</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Italian">Italian</option>
                  <option value="Portuguese">Portuguese</option>
                  <option value="Dutch">Dutch</option>
                  <option value="Russian">Russian</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Chinese (Simplified)">Chinese (Simplified)</option>
                  <option value="Korean">Korean</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Country/Region
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Spain">Spain</option>
                  <option value="Italy">Italy</option>
                  <option value="Japan">Japan</option>
                  <option value="Global">Global (International)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Content Size
                </label>
                <select
                  value={formData.wordCount}
                  onChange={(e) => handleInputChange('wordCount', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="x-small">X-Small (600-1200 words)</option>
                  <option value="small">Small (1200-2400 words)</option>
                  <option value="medium">Medium (2400-3600 words)</option>
                  <option value="large">Large (3600-5200 words)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Tone of Voice
                </label>
                <select
                  value={formData.tone}
                  onChange={(e) => handleInputChange('tone', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="Professional">Professional</option>
                  <option value="Conversational">Conversational</option>
                  <option value="Friendly">Friendly</option>
                  <option value="Authoritative">Authoritative</option>
                  <option value="Informational">Informational</option>
                  <option value="Persuasive">Persuasive</option>
                  <option value="Casual">Casual</option>
                  <option value="Witty">Witty</option>
                  <option value="Humorous">Humorous</option>
                  <option value="Formal">Formal</option>
                </select>
              </div>
            </div>

            {/* API Info Card */}
            <div className="mt-4 bg-gray-50 p-3 rounded-md border border-gray-200">
              <div className="flex items-center">
                {getProviderIcon()}
                <div className="ml-2">
                  <h3 className="text-sm font-medium">Using API: 
                    <span className="ml-1 text-indigo-600">
                      {apiConfig ? apiConfig.provider.charAt(0).toUpperCase() + apiConfig.provider.slice(1) : 'None configured'}
                    </span>
                  </h3>
                  {apiConfig && apiConfig.model && (
                    <p className="text-xs text-gray-500">Model: {apiConfig.model}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Introduction Hook */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Introduction Hook</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Hook Type
              </label>
              <select
                value={formData.hookType}
                onChange={(e) => handleHookTypeChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {hookTypes.map((hook) => (
                  <option key={hook.type} value={hook.type}>
                    {hook.type}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                The style of hook to use at the start of the content
              </p>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Hook Brief
              </label>
              <textarea
                value={formData.hookBrief}
                onChange={(e) => handleInputChange('hookBrief', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md h-24"
                placeholder="Provide guidance for the hook..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Optional details about how the hook should be constructed
              </p>
            </div>
          </div>
        </Card>

        {/* Additional Requirements */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Additional Requirements</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                External Links (Optional)
              </label>
              <textarea
                value={formData.links}
                onChange={(e) => handleInputChange('links', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md h-20"
                placeholder="e.g., https://example.com/resource1&#10;https://example.com/resource2"
              />
              <p className="text-xs text-gray-500 mt-1">
                External resources to reference in the content
              </p>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Image Details (Optional)
              </label>
              <input
                type="text"
                value={formData.imageDetails}
                onChange={(e) => handleInputChange('imageDetails', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="e.g., hiking trail map, mountain landscape"
              />
              <p className="text-xs text-gray-500 mt-1">
                Suggest image topics for the content
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <Button 
          type="submit" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-md text-lg flex mx-auto items-center"
        >
          <Wand className="mr-2 h-5 w-5" />
          Generate Prompt
        </Button>
        
        <p className="text-sm text-gray-500 mt-3">
          This will generate an SEO-optimized content prompt for your chosen topic.
        </p>
      </div>
    </form>
  );
};

export default GeneratorForm;