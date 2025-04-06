import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { analyzeHeadline, HeadlineAnalysis } from '../utils/headlineAnalyzer';
import { regenerateHeadlines } from '../utils/headlineRegenerator';
import { Sparkles, RefreshCw, Info, ThumbsUp, Copy, Check } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface HeadlineAnalyzerProps {
  sidebarState?: string;
}

// Score threshold for automatically regenerating headlines
const LOW_SCORE_THRESHOLD = 70;

const HeadlineAnalyzer: React.FC<HeadlineAnalyzerProps> = ({ sidebarState = 'collapsed' }) => {
  const [headline, setHeadline] = useState('');
  const [analysis, setAnalysis] = useState<HeadlineAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [regeneratedHeadlines, setRegeneratedHeadlines] = useState<string[]>([]);
  const [selectedHeadline, setSelectedHeadline] = useState('');
  const { addToast } = useToast();

  // Sample improvement suggestions
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Handle analyzing the headline
  const handleAnalyze = () => {
    if (!headline.trim()) {
      addToast('Please enter a headline to analyze', 'warning');
      return;
    }

    setLoading(true);
    
    // Reset any previously regenerated headlines
    setRegeneratedHeadlines([]);
    setSelectedHeadline('');
    
    // Small delay to simulate processing
    setTimeout(() => {
      const result = analyzeHeadline(headline);
      setAnalysis(result);
      
      // Generate suggestions based on analysis
      generateSuggestions(result);
      
      // Calculate score
      const score = calculateScore(result);
      
      setLoading(false);
      addToast('Headline analyzed successfully', 'success');
      
      // If score is low, automatically regenerate better headlines
      if (score < LOW_SCORE_THRESHOLD) {
        // Automatically start regeneration process
        regenerateHeadlinesForLowScore(headline, result);
      }
    }, 1000);
  };

  // Automatically regenerate headlines when score is low
  const regenerateHeadlinesForLowScore = async (headlineText: string, analysisResult: HeadlineAnalysis) => {
    setRegenerating(true);
    
    try {
      const newHeadlines = await regenerateHeadlines(headlineText, analysisResult);
      setRegeneratedHeadlines(newHeadlines);
      
      if (newHeadlines.length > 0) {
        addToast('Generated alternative headlines with better potential scores', 'info');
      }
    } catch (error) {
      console.error('Failed to regenerate headlines:', error);
      // Don't show error toast since this is an automatic process
    } finally {
      setRegenerating(false);
    }
  };

  const generateSuggestions = (result: HeadlineAnalysis) => {
    const newSuggestions = [];
    
    // Length-based suggestions
    if (result.characterCount < 40) {
      newSuggestions.push("Consider making your headline longer for better SEO impact.");
    } else if (result.characterCount > 70) {
      newSuggestions.push("Your headline might be too long. Search engines typically display only the first 50-60 characters.");
    }
    
    // Word-based suggestions
    if (result.wordCount < 5) {
      newSuggestions.push("Add more descriptive words to increase engagement.");
    } else if (result.wordCount > 12) {
      newSuggestions.push("Consider shortening your headline for better readability and recall.");
    }
    
    // Power word suggestions
    if (result.powerWords < 1) {
      newSuggestions.push("Include power words like 'essential', 'proven', or 'ultimate' to increase emotional appeal.");
    }
    
    // Common word suggestions
    if (result.commonWords > result.wordCount / 2) {
      newSuggestions.push("Try using more specific or uncommon words to make your headline stand out.");
    }
    
    // Emotional words suggestions
    if (result.emotionalScore < 0.2) {
      newSuggestions.push("Add more emotional or sensory words to create a stronger connection with readers.");
    }
    
    // If no issues found
    if (newSuggestions.length === 0) {
      newSuggestions.push("Your headline looks well-balanced! Consider A/B testing with variations to see what performs best.");
    }
    
    setSuggestions(newSuggestions);
  };

  const handleReset = () => {
    setHeadline('');
    setAnalysis(null);
    setSuggestions([]);
    setRegeneratedHeadlines([]);
    setSelectedHeadline('');
    addToast('Headline analyzer reset', 'info');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(headline);
      setCopied(true);
      addToast('Headline copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      addToast('Failed to copy headline', 'error');
    }
  };

  // Handle selecting a regenerated headline
  const handleSelectHeadline = (selected: string) => {
    setSelectedHeadline(selected);
  };

  // Apply the selected headline
  const applySelectedHeadline = () => {
    if (selectedHeadline) {
      setHeadline(selectedHeadline);
      setSelectedHeadline('');
      setRegeneratedHeadlines([]);
      
      // Analyze the new headline automatically
      setTimeout(() => {
        const result = analyzeHeadline(selectedHeadline);
        setAnalysis(result);
        generateSuggestions(result);
        addToast('New headline applied and analyzed', 'success');
      }, 500);
    }
  };

  // Generate a score based on analysis
  const calculateScore = (analysis: HeadlineAnalysis): number => {
    if (!analysis) return 0;
    
    let score = 70; // Base score
    
    // Length factors
    if (analysis.characterCount > 40 && analysis.characterCount < 60) score += 10;
    if (analysis.wordCount >= 6 && analysis.wordCount <= 10) score += 5;
    
    // Word quality factors
    score += analysis.powerWords * 3;
    score += analysis.emotionalScore * 20;
    
    // Common words penalty
    score -= (analysis.commonWords / analysis.wordCount) * 10;
    
    // Ensure score is within 0-100 range
    return Math.min(Math.max(Math.round(score), 0), 100);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Calculate the current score
  const currentScore = analysis ? calculateScore(analysis) : 0;

  return (
    <div className={`
      py-6 px-4 transition-all duration-300
      ${sidebarState === 'expanded' ? 'max-w-5xl' : 'max-w-6xl'} 
      mx-auto
    `}>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Headline Analyzer</h1>
        <p className="text-gray-600 mt-2">
          Create high-impact, engaging headlines for better click-through rates and SEO performance.
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1">
        {/* Input Section */}
        <Card className="p-6 border border-gray-200">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Your Headline
              </label>
              <div className="relative">
                <textarea
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g., 10 Proven Ways to Boost Your Website Traffic"
                  className="w-full p-3 border rounded-md min-h-[100px] text-base border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  maxLength={100}
                />
                <div className={`absolute bottom-2 right-2 text-xs ${
                  headline.length > 70 ? 'text-red-500' : headline.length > 50 ? 'text-yellow-500' : 'text-gray-500'
                }`}>
                  {headline.length}/100
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={handleAnalyze}
                disabled={loading || regenerating || !headline.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : regenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing & Improving...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Analyze Headline
                  </>
                )}
              </Button>
              
              <Button 
                onClick={handleReset}
                variant="outline"
                disabled={loading || regenerating || (!headline && !analysis)}
              >
                Reset
              </Button>
              
              {headline && (
                <Button 
                  onClick={handleCopy}
                  variant="outline"
                  className="ml-auto"
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Analysis Section */}
        {analysis && (
          <Card className="p-6 border border-gray-200">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-bold text-gray-800">Analysis Results</h2>
                <div className="flex items-center">
                  <div className="mr-3 text-sm font-medium text-gray-500">Overall Score:</div>
                  <div className={`text-2xl font-bold ${getScoreColor(calculateScore(analysis))}`}>
                    {calculateScore(analysis)}%
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Length</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Characters:</span>
                      <span className="font-medium">{analysis.characterCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Words:</span>
                      <span className="font-medium">{analysis.wordCount}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          analysis.characterCount < 40 ? 'bg-red-500' : 
                          analysis.characterCount > 70 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${(analysis.characterCount / 100) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Ideal: 40-60 characters
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Word Choice</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Power Words:</span>
                      <span className="font-medium">{analysis.powerWords}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Common Words:</span>
                      <span className="font-medium">{analysis.commonWords}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Emotional Score:</span>
                      <span className="font-medium">{(analysis.emotionalScore * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Headline Type</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Type:</span>
                      <span className="font-medium">{analysis.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Contains Number:</span>
                      <span className="font-medium">{analysis.hasNumber ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Question Format:</span>
                      <span className="font-medium">{analysis.isQuestion ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Improvement Suggestions */}
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <Info className="h-5 w-5 text-blue-500 mr-2" />
                  <h3 className="text-md font-semibold text-gray-800">Improvement Suggestions</h3>
                </div>
                <ul className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start">
                      <ThumbsUp className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        )}
        
        {/* Regenerated Headlines Section */}
        {regeneratedHeadlines.length > 0 && (
          <Card className="p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Alternative Headlines with Higher Score Potential</h2>
            <p className="text-sm text-gray-600 mb-4">
              We've automatically generated better alternatives. Select one to use instead.
            </p>
            
            <div className="space-y-3 mb-4">
              {regeneratedHeadlines.map((newHeadline, index) => (
                <div 
                  key={index}
                  onClick={() => handleSelectHeadline(newHeadline)}
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${
                    selectedHeadline === newHeadline 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <p className="text-gray-800">{newHeadline}</p>
                </div>
              ))}
            </div>
            
            {selectedHeadline && (
              <Button 
                onClick={applySelectedHeadline}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Use This Headline
              </Button>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default HeadlineAnalyzer;