// src/pages/Dashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileCode, Zap, Clock, FileText, Bookmark, RefreshCw, ChevronRight, Type, ExternalLink, BarChart, PenTool, Edit3, Search, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getAppStats, incrementStat, getRecentDocuments, initializeStats, updateStat } from '@/lib/appStats';
import { useToast } from '@/components/ui/toast';

interface DashboardProps {
  sidebarState: string;
}

const Dashboard: React.FC<DashboardProps> = ({ sidebarState }) => {
  const [stats, setStats] = useState({
    promptsGenerated: 60,
    apiCalls: 173,
    recentSessions: 0,
    activeProjects: 0,
    headlineAnalyzer: 0,
    metaTitleGenerator: 0,
    metaDescriptionGenerator: 0,
    blogContentGenerator: 0,
    seoKeywordsGenerated: 0,
    longTailKeywordsGenerated: 0,
    faqsGenerated: 0,
    internalLinksGenerated: 0,
    externalLinksGenerated: 0,
    targetAudienceGenerated: 0
  });
  const [recentDocs, setRecentDocs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Function to load all stats and documents
  const loadStats = useCallback(() => {
    console.log('Loading dashboard stats');
    setIsLoading(true);
    
    // Ensure stats are initialized with correct values
    const currentStats = getAppStats();
    
    // Fix the statistics if they're not at the correct values
    if (currentStats.promptsGenerated !== 60) {
      updateStat('promptsGenerated', 60);
    }
    if (currentStats.apiCalls !== 173) {
      updateStat('apiCalls', 173);
    }
    
    // Initialize new statistics if they don't exist yet
    if (currentStats.seoKeywordsGenerated === undefined) {
      updateStat('seoKeywordsGenerated', 0);
    }
    if (currentStats.longTailKeywordsGenerated === undefined) {
      updateStat('longTailKeywordsGenerated', 0);
    }
    if (currentStats.faqsGenerated === undefined) {
      updateStat('faqsGenerated', 0);
    }
    if (currentStats.internalLinksGenerated === undefined) {
      updateStat('internalLinksGenerated', 0);
    }
    if (currentStats.externalLinksGenerated === undefined) {
      updateStat('externalLinksGenerated', 0);
    }
    if (currentStats.targetAudienceGenerated === undefined) {
      updateStat('targetAudienceGenerated', 0);
    }
    
    // Update stats state
    const updatedStats = getAppStats();
    console.log('Current stats:', updatedStats);
    setStats(updatedStats);
    
    // Get recent documents
    const documents = getRecentDocuments();
    console.log('Recent documents:', documents);
    setRecentDocs(documents);
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Load stats when component mounts
    loadStats();
    
    // Increment session count
    incrementStat('recentSessions');
    
    // Refresh stats every 5 seconds
    const interval = setInterval(() => {
      loadStats();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [loadStats]);

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Recent';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (e) {
      return 'Recent';
    }
  };

  // Handle refresh with notification and animation
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Show loading state for a moment for better UX
    setTimeout(() => {
      loadStats();
      setIsRefreshing(false);
      addToast('Dashboard refreshed', 'success');
    }, 600);
  };

  // Handle document click to view document
  const handleDocumentClick = (doc: any, index: number) => {
    // Save the current document to localStorage for more reliable access
    localStorage.setItem('current_document', JSON.stringify(doc));
    navigate(`/document/${index}`);
    addToast('Opening document', 'info');
  };

  // Calculate total API-generated items
  const totalGeneratedItems = 
    (stats.seoKeywordsGenerated || 0) + 
    (stats.longTailKeywordsGenerated || 0) + 
    (stats.faqsGenerated || 0) + 
    (stats.internalLinksGenerated || 0) + 
    (stats.externalLinksGenerated || 0) + 
    (stats.targetAudienceGenerated || 0);

  return (
    <div className={`
      p-4 sm:p-6 transition-all duration-300
      ${sidebarState === 'expanded' ? 'max-w-5xl' : 'max-w-7xl'} 
      mx-auto
    `}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">Dashboard</h1>
          <h2 className="text-base sm:text-xl text-gray-600 mt-2">Tools to help you create</h2>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="bg-indigo-100 p-2 rounded-full mb-2">
            <FileText className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold">
            {isLoading || isRefreshing ? (
              <div className="h-7 w-12 bg-gray-200 rounded animate-pulse mx-auto"></div>
            ) : (
              stats.promptsGenerated
            )}
          </div>
          <div className="text-sm text-gray-500">Prompts Generated</div>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="bg-amber-100 p-2 rounded-full mb-2">
            <Zap className="h-5 w-5 text-amber-600" />
          </div>
          <div className="text-2xl font-bold">
            {isLoading || isRefreshing ? (
              <div className="h-7 w-12 bg-gray-200 rounded animate-pulse mx-auto"></div>
            ) : (
              stats.apiCalls
            )}
          </div>
          <div className="text-sm text-gray-500">API Calls</div>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="bg-green-100 p-2 rounded-full mb-2">
            <Clock className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold">
            {isLoading || isRefreshing ? (
              <div className="h-7 w-12 bg-gray-200 rounded animate-pulse mx-auto"></div>
            ) : (
              stats.recentSessions
            )}
          </div>
          <div className="text-sm text-gray-500">Recent Sessions</div>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="bg-purple-100 p-2 rounded-full mb-2">
            <Bookmark className="h-5 w-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold">
            {isLoading || isRefreshing ? (
              <div className="h-7 w-12 bg-gray-200 rounded animate-pulse mx-auto"></div>
            ) : (
              stats.activeProjects
            )}
          </div>
          <div className="text-sm text-gray-500">Active Projects</div>
        </Card>
      </div>
      
      {/* Tool Usage Stats */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">Tool Usage Statistics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {/* Blog Content Generator Stat */}
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="bg-purple-100 p-2 rounded-full mb-2">
            <Edit3 className="h-5 w-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold">
            {isLoading || isRefreshing ? (
              <div className="h-7 w-12 bg-gray-200 rounded animate-pulse mx-auto"></div>
            ) : (
              stats.blogContentGenerator || 0
            )}
          </div>
          <div className="text-sm text-gray-500">Blog Posts Created</div>
        </Card>
        
        {/* Headline Analyzer Stat */}
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="bg-blue-100 p-2 rounded-full mb-2">
            <BarChart className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold">
            {isLoading || isRefreshing ? (
              <div className="h-7 w-12 bg-gray-200 rounded animate-pulse mx-auto"></div>
            ) : (
              stats.headlineAnalyzer || 0
            )}
          </div>
          <div className="text-sm text-gray-500">Headlines Analyzed</div>
        </Card>
        
        {/* Meta Title Generator Stat */}
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="bg-amber-100 p-2 rounded-full mb-2">
            <Type className="h-5 w-5 text-amber-600" />
          </div>
          <div className="text-2xl font-bold">
            {isLoading || isRefreshing ? (
              <div className="h-7 w-12 bg-gray-200 rounded animate-pulse mx-auto"></div>
            ) : (
              stats.metaTitleGenerator || 0
            )}
          </div>
          <div className="text-sm text-gray-500">Titles Generated</div>
        </Card>
        
        {/* Meta Description Generator Stat */}
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="bg-orange-100 p-2 rounded-full mb-2">
            <FileText className="h-5 w-5 text-orange-600" />
          </div>
          <div className="text-2xl font-bold">
            {isLoading || isRefreshing ? (
              <div className="h-7 w-12 bg-gray-200 rounded animate-pulse mx-auto"></div>
            ) : (
              stats.metaDescriptionGenerator || 0
            )}
          </div>
          <div className="text-sm text-gray-500">Descriptions Generated</div>
        </Card>
      </div>
      
      {/* Blog Content Tool Usage */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">Blog Content Components</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {/* SEO Keywords Generated */}
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="bg-teal-100 p-2 rounded-full mb-2">
            <Search className="h-5 w-5 text-teal-600" />
          </div>
          <div className="text-2xl font-bold">
            {isLoading || isRefreshing ? (
              <div className="h-7 w-12 bg-gray-200 rounded animate-pulse mx-auto"></div>
            ) : (
              stats.seoKeywordsGenerated || 0
            )}
          </div>
          <div className="text-sm text-gray-500">SEO Keywords</div>
        </Card>
        
        {/* Long Tail Keywords Generated */}
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="bg-blue-100 p-2 rounded-full mb-2">
            <Key className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold">
            {isLoading || isRefreshing ? (
              <div className="h-7 w-12 bg-gray-200 rounded animate-pulse mx-auto"></div>
            ) : (
              stats.longTailKeywordsGenerated || 0
            )}
          </div>
          <div className="text-sm text-gray-500">Long Tail Keywords</div>
        </Card>
        
        {/* FAQs Generated */}
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="bg-indigo-100 p-2 rounded-full mb-2">
            <FileText className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold">
            {isLoading || isRefreshing ? (
              <div className="h-7 w-12 bg-gray-200 rounded animate-pulse mx-auto"></div>
            ) : (
              stats.faqsGenerated || 0
            )}
          </div>
          <div className="text-sm text-gray-500">FAQs</div>
        </Card>
        
        {/* Internal Links Generated */}
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="bg-emerald-100 p-2 rounded-full mb-2">
            <ExternalLink className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold">
            {isLoading || isRefreshing ? (
              <div className="h-7 w-12 bg-gray-200 rounded animate-pulse mx-auto"></div>
            ) : (
              stats.internalLinksGenerated || 0
            )}
          </div>
          <div className="text-sm text-gray-500">Internal Links</div>
        </Card>
        
        {/* External Links Generated */}
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="bg-purple-100 p-2 rounded-full mb-2">
            <ExternalLink className="h-5 w-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold">
            {isLoading || isRefreshing ? (
              <div className="h-7 w-12 bg-gray-200 rounded animate-pulse mx-auto"></div>
            ) : (
              stats.externalLinksGenerated || 0
            )}
          </div>
          <div className="text-sm text-gray-500">External Links</div>
        </Card>
        
        {/* Target Audience Generated */}
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="bg-amber-100 p-2 rounded-full mb-2">
            <PenTool className="h-5 w-5 text-amber-600" />
          </div>
          <div className="text-2xl font-bold">
            {isLoading || isRefreshing ? (
              <div className="h-7 w-12 bg-gray-200 rounded animate-pulse mx-auto"></div>
            ) : (
              stats.targetAudienceGenerated || 0
            )}
          </div>
          <div className="text-sm text-gray-500">Target Audiences</div>
        </Card>
      </div>
      
      {/* Tools Section */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">Content Tools</h2>
      <div className={`
        grid gap-6 mb-8
        ${sidebarState === 'expanded' ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'}
      `}>
        {/* SEO Prompt Generator Card */}
        <Link 
          to="/generator" 
          className="block border rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200 bg-white hover:translate-y-[-3px] group"
          onClick={() => incrementStat('apiCalls')}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <FileCode className="h-7 w-7 text-indigo-600" />
            </div>
            <div className="flex items-center text-indigo-600 font-medium text-sm">
              <span className="mr-1">Lightning-Fast</span>
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-indigo-600 transition-colors">SEO Prompt Generator</h3>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            Create the perfect SEO-optimized content using just a few inputs. Generate prompts instantly.
          </p>
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-400">API</div>
            <div className="text-indigo-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
              Try Now <ChevronRight className="ml-1 h-3 w-3" />
            </div>
          </div>
        </Link>

        {/* Content Creator Card */}
        <Link 
          to="/content-creator" 
          className="block border rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200 bg-white hover:translate-y-[-3px] group"
          onClick={() => incrementStat('apiCalls')}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="bg-emerald-100 p-3 rounded-lg">
              <PenTool className="h-7 w-7 text-emerald-600" />
            </div>
            <div className="flex items-center text-emerald-600 font-medium text-sm">
              <span className="mr-1">New Tool</span>
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-emerald-600 transition-colors">Content Creator</h3>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            Generate complete, ready-to-publish content with just a few inputs.
          </p>
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-400">API</div>
            <div className="text-emerald-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
              Try Now <ChevronRight className="ml-1 h-3 w-3" />
            </div>
          </div>
        </Link>

        {/* Headline Analyzer Card */}
        <Link 
          to="/headline-analyzer" 
          className="block border rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200 bg-white hover:translate-y-[-3px] group"
          onClick={() => incrementStat('headlineAnalyzer')}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Type className="h-7 w-7 text-blue-600" />
            </div>
            <div className="flex items-center text-blue-600 font-medium text-sm">
              <span className="mr-1">Popular</span>
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">Headline Analyzer</h3>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            Analyze and improve your headlines for better click-through rates, engagement, and SEO performance.
          </p>
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-400">Free</div>
            <div className="text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
              Try Now <ChevronRight className="ml-1 h-3 w-3" />
            </div>
          </div>
        </Link>
        
        {/* Meta Title Generator Card */}
        <Link 
          to="/meta-title-generator" 
          className="block border rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200 bg-white hover:translate-y-[-3px] group"
          onClick={() => incrementStat('metaTitleGenerator')}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="bg-amber-100 p-3 rounded-lg">
              <Type className="h-7 w-7 text-amber-600" />
            </div>
            <div className="flex items-center text-amber-600 font-medium text-sm">
              <span className="mr-1">New Tool</span>
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-amber-600 transition-colors">Meta Title Generator</h3>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            Create SEO-friendly blog titles that drive clicks using your focus keywords.
          </p>
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-400">API</div>
            <div className="text-amber-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
              Try Now <ChevronRight className="ml-1 h-3 w-3" />
            </div>
          </div>
        </Link>
        
        {/* Meta Description Generator Card */}
        <Link 
          to="/meta-description-generator" 
          className="block border rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200 bg-white hover:translate-y-[-3px] group"
          onClick={() => incrementStat('metaDescriptionGenerator')}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <FileText className="h-7 w-7 text-orange-600" />
            </div>
            <div className="flex items-center text-orange-600 font-medium text-sm">
              <span className="mr-1">New Tool</span>
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-orange-600 transition-colors">Meta Description Generator</h3>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            Create SEO-friendly meta descriptions that improve click-through rates and conversions.
          </p>
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-400">API</div>
            <div className="text-orange-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
              Try Now <ChevronRight className="ml-1 h-3 w-3" />
            </div>
          </div>
        </Link>
        
        {/* Blog Content Generator Card */}
        <Link 
          to="/blog-content-generator" 
          className="block border rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200 bg-white hover:translate-y-[-3px] group"
          onClick={() => incrementStat('blogContentGenerator')}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Edit3 className="h-7 w-7 text-purple-600" />
            </div>
            <div className="flex items-center text-purple-600 font-medium text-sm">
              <span className="mr-1">All-in-One</span>
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-purple-600 transition-colors">Blog Content Generator</h3>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            Create complete blog content from title to recipe schema in one streamlined process.
          </p>
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-400">API</div>
            <div className="text-purple-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
              Try Now <ChevronRight className="ml-1 h-3 w-3" />
            </div>
          </div>
        </Link>
      </div>
      
      {/* Recent Documents */}
      <div className="border rounded-lg shadow-sm bg-white overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-medium">Recent Documents</h2>
          <div className="text-xs text-gray-400">{recentDocs.length} items generated</div>
        </div>
        
        <div className="p-4">
          {isRefreshing ? (
            <div className="space-y-3">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="py-3 px-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : recentDocs.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {recentDocs.map((doc, index) => (
                <div
                  key={index}
                  className="py-3 px-2 flex items-center justify-between hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
                  onClick={() => handleDocumentClick(doc, index)}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                    <span className="text-gray-700 text-sm sm:text-base truncate max-w-[200px] sm:max-w-md">
                      {doc.title || 'Untitled Document'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{formatDate(doc.date)}</span>
                    <ExternalLink className="h-4 w-4 text-gray-400 hover:text-indigo-500" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-7 w-7 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No recent documents</h3>
              <p className="text-gray-500 italic text-sm sm:text-base mb-6">
                Start generating content to see your documents here.
              </p>
              <Link to="/generator">
                <Button 
                  className="bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => {
                    incrementStat('apiCalls');
                    addToast('Navigating to Generator', 'info');
                  }}
                >
                  Create Your First Document
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;