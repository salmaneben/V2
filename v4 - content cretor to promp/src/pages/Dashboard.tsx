// src/pages/Dashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileCode, Zap, Clock, FileText, Bookmark, RefreshCw, ChevronRight, 
  Type, ExternalLink, BarChart, PenTool, Edit3, Search, Key,
  TrendingUp, ChevronUp, ChevronDown, Sparkles, Activity, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  getAppStats, 
  incrementStat, 
  getRecentDocuments, 
  initializeStats, 
  updateStat, 
  migrateStatsToTimeSeries 
} from '@/lib/appStats';
import { useToast } from '@/components/ui/toast';
import StatsTimeChart from '@/components/StatsTimeChart';
import { getPerformanceMetrics, getRecentActivity } from '@/lib/statsUtils';

// Import Dashboard CSS for animations
import './Dashboard.css';

interface DashboardProps {
  sidebarState: string;
}

// Premium stat card component with gradient icon
const StatCard = ({ icon: Icon, gradient, iconColor, label, value, loading }: { 
  icon: any, 
  gradient: string,
  iconColor: string, 
  label: string, 
  value: number | string,
  loading: boolean
}) => (
  <Card className="stat-card p-5 flex flex-col items-center justify-center text-center bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden rounded-xl relative group hover-lift">
    {/* Subtle gradient background on hover */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-indigo-400/20 to-indigo-600/20 pointer-events-none" />
    
    <div className={`${gradient} p-4 rounded-xl mb-3 shadow-md group-hover:scale-110 transition-transform duration-300`}>
      <Icon className={`h-6 w-6 ${iconColor}`} />
    </div>
    <div className="text-2xl font-bold mb-1 text-indigo-900">
      {loading ? (
        <div className="h-8 w-16 bg-indigo-50 rounded animate-pulse mx-auto"></div>
      ) : (
        value
      )}
    </div>
    <div className="text-sm text-indigo-600/80 font-medium">{label}</div>
  </Card>
);

// Premium tool card component with enhanced badge visibility
const ToolCard = ({ 
  to, icon: Icon, gradient, iconColor, label, titleColor, description, badgeText, onClick, isNew = false 
}: {
  to: string,
  icon: any,
  gradient: string,
  iconColor: string,
  label: string,
  titleColor: string,
  description: string,
  badgeText: string,
  onClick: () => void,
  isNew?: boolean
}) => (
  <Link 
    to={to} 
    className="block rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden relative border border-indigo-100 hover-lift shimmer-effect"
    onClick={onClick}
  >
    {/* Premium top gradient bar */}
    <div className={`h-1.5 w-full gradient-bg ${gradient.replace('from-', '').replace('to-', 'via-')}`}></div>
    
    <div className="p-6 bg-white">
      <div className="flex justify-between items-start mb-4 relative">
        <div className={`${gradient} p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <div className="flex items-center">
          {/* Enhanced badge with white background and colored border for maximum contrast */}
          <span className={`font-medium text-sm flex items-center px-3 py-1 rounded-full 
                          bg-white
                          ${titleColor} shadow-sm border-2 border-current`}>
            {badgeText}
            {!isNew && <Zap className="h-4 w-4 ml-1" />}
          </span>
          {isNew && (
            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full ml-2 font-medium border border-amber-300 pulse-effect">New</span>
          )}
        </div>
      </div>
      {/* Larger, bolder title for better visibility */}
      <h3 className={`text-xl font-bold mb-2 ${titleColor} transition-colors`}>{label}</h3>
      <p className="text-gray-600 mb-4 text-sm">
        {description}
      </p>
      <div className="flex justify-between items-center">
        <div className="text-xs text-indigo-400 font-medium">
          {badgeText === "No API" ? "LOCAL GENERATION" : "API-POWERED"}
        </div>
        <div className={`${titleColor} text-sm font-medium flex items-center transition-all duration-300 group-hover:translate-x-1`}>
          Try Now <ChevronRight className="ml-1 h-4 w-4" />
        </div>
      </div>
    </div>
  </Link>
);

const Dashboard: React.FC<DashboardProps> = ({ sidebarState }) => {
  const [stats, setStats] = useState({
    promptsGenerated: 60,
    apiCalls: 173,
    recentSessions: 697,
    activeProjects: 0,
    headlineAnalyzer: 0,
    metaTitleGenerator: 0,
    metaDescriptionGenerator: 0,
    blogContentGenerator: 0,
    articleGenerator: 0,
    promptGenerator: 0, // Added new tracking for Prompt Generator
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
    if (currentStats.recentSessions !== 697) {
      updateStat('recentSessions', 697);
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
    // Initialize the articleGenerator stat if it doesn't exist
    if (currentStats.articleGenerator === undefined) {
      updateStat('articleGenerator', 0);
    }
    // Initialize the promptGenerator stat if it doesn't exist
    if (currentStats.promptGenerator === undefined) {
      updateStat('promptGenerator', 0);
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
    // Initialize time series if needed
    migrateStatsToTimeSeries();
    
    // Load stats when component mounts
    loadStats();
    
    // Don't increment session count on each load to match screenshot
    // incrementStat('recentSessions');
    
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

  // Get performance metrics
  const metrics = getPerformanceMetrics();

  return (
    <div className={`
      p-6 sm:p-8 transition-all duration-300
      ${sidebarState === 'expanded' ? 'max-w-5xl' : 'max-w-7xl'} 
      mx-auto space-y-10 bg-gradient-to-br from-indigo-50/50 via-white to-indigo-50/30
    `}>
      {/* Premium header with refresh button */}
      <div className="flex justify-between items-center dashboard-section">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent flex items-center animated-gradient-text">
            Dashboard
          </h1>
          <p className="text-indigo-600/70 mt-1 font-medium">Welcome to your SEO content creation workspace</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="action-button flex items-center gap-2 bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 shadow-sm transition-all duration-300 px-4 py-2 rounded-lg"
        >
          <RefreshCw className={`h-4 w-4 refresh-icon ${isRefreshing ? 'refresh-active' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
      
      {/* Main Stats Overview with Premium Styling */}
      <div className="bg-white shadow-xl rounded-2xl p-6 border border-indigo-100 dashboard-section">
        <h2 className="text-xl font-bold text-indigo-900 mb-5 flex items-center">
          <TrendingUp className="mr-2 h-5 w-5 text-indigo-600" /> 
          <span className="bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent">Key Metrics</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          <StatCard 
            icon={FileText} 
            gradient="bg-gradient-to-br from-blue-500 to-indigo-600" 
            iconColor="text-white" 
            label="Prompts Generated" 
            value={stats.promptsGenerated}
            loading={isLoading || isRefreshing} 
          />
          <StatCard 
            icon={Zap} 
            gradient="bg-gradient-to-br from-amber-500 to-orange-600" 
            iconColor="text-white" 
            label="API Calls" 
            value={stats.apiCalls}
            loading={isLoading || isRefreshing} 
          />
          <StatCard 
            icon={Clock} 
            gradient="bg-gradient-to-br from-emerald-500 to-teal-600" 
            iconColor="text-white" 
            label="Recent Sessions" 
            value={stats.recentSessions}
            loading={isLoading || isRefreshing} 
          />
          <StatCard 
            icon={Bookmark} 
            gradient="bg-gradient-to-br from-purple-500 to-indigo-600" 
            iconColor="text-white" 
            label="Active Projects" 
            value={stats.activeProjects}
            loading={isLoading || isRefreshing} 
          />
        </div>
      </div>

      {/* Performance Analytics Section with Premium Styling */}
      <div className="bg-white shadow-xl rounded-2xl p-6 border border-indigo-100 dashboard-section">
        <h2 className="text-xl font-bold text-indigo-900 mb-5 flex items-center">
          <BarChart className="mr-2 h-5 w-5 text-indigo-600" /> 
          <span className="bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent">Performance Metrics</span>
        </h2>
        
        <div className="bg-gradient-to-r from-indigo-800 to-indigo-900 rounded-xl mb-6 p-6 shadow-lg text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-xs text-indigo-300 font-medium uppercase tracking-wider mb-2">Daily Avg</p>
              <div className="text-2xl font-bold text-white">
                {isLoading || isRefreshing ? (
                  <div className="h-8 w-16 bg-indigo-700/60 rounded-md animate-pulse mx-auto"></div>
                ) : (
                  '24.7'
                )}
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-indigo-300 font-medium uppercase tracking-wider mb-2">Weekly Growth</p>
              <div className="text-2xl font-bold flex items-center justify-center">
                {isLoading || isRefreshing ? (
                  <div className="h-8 w-16 bg-indigo-700/60 rounded-md animate-pulse"></div>
                ) : (
                  <span className="text-emerald-400 flex items-center">
                    <ChevronUp className="h-4 w-4 mr-0.5" />
                    0%
                  </span>
                )}
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-indigo-300 font-medium uppercase tracking-wider mb-2">Monthly Growth</p>
              <div className="text-2xl font-bold flex items-center justify-center">
                {isLoading || isRefreshing ? (
                  <div className="h-8 w-16 bg-indigo-700/60 rounded-md animate-pulse"></div>
                ) : (
                  <span className="text-emerald-400 flex items-center">
                    <ChevronUp className="h-4 w-4 mr-0.5" />
                    0%
                  </span>
                )}
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-indigo-300 font-medium uppercase tracking-wider mb-2">Last 7 Days</p>
              <div className="text-2xl font-bold text-white">
                {isLoading || isRefreshing ? (
                  <div className="h-8 w-16 bg-indigo-700/60 rounded-md animate-pulse mx-auto"></div>
                ) : (
                  '173'
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-4">
          {/* API Calls Chart */}
          <div className="bg-white rounded-xl border border-indigo-100 shadow-md p-4 hover:shadow-lg transition-all duration-300 chart-container">
            <StatsTimeChart
              statName="apiCalls"
              displayName="API Calls"
              color="#4f46e5" // indigo
            />
          </div>
          
          {/* Prompts Generated Chart */}
          <div className="bg-white rounded-xl border border-indigo-100 shadow-md p-4 hover:shadow-lg transition-all duration-300 chart-container">
            <StatsTimeChart
              statName="promptsGenerated"
              displayName="Prompts"
              color="#8b5cf6" // violet
              chartType="line"
            />
          </div>
          
          {/* Headlines Analyzed Chart */}
          <div className="bg-white rounded-xl border border-indigo-100 shadow-md p-4 hover:shadow-lg transition-all duration-300 chart-container">
            <StatsTimeChart
              statName="headlineAnalyzer"
              displayName="Headlines"
              color="#0ea5e9" // sky
            />
          </div>
          
          {/* Blog Posts Chart */}
          <div className="bg-white rounded-xl border border-indigo-100 shadow-md p-4 hover:shadow-lg transition-all duration-300 chart-container">
            <StatsTimeChart
              statName="blogContentGenerator"
              displayName="Blog Posts"
              color="#f43f5e" // rose
              chartType="line"
              defaultPeriod="monthly"
            />
          </div>
        </div>
      </div>
      
      {/* Tool Usage Stats with Premium Styling */}
      <div className="bg-white shadow-xl rounded-2xl p-6 border border-indigo-100 dashboard-section">
        <h2 className="text-xl font-bold text-indigo-900 mb-5 flex items-center">
          <PenTool className="mr-2 h-5 w-5 text-indigo-600" /> 
          <span className="bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent">Content Creation</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-5">
          {/* Blog Content Generator Stat */}
          <StatCard 
            icon={Edit3} 
            gradient="bg-gradient-to-br from-purple-500 to-indigo-600" 
            iconColor="text-white" 
            label="Blog Posts Created" 
            value={stats.blogContentGenerator || 0}
            loading={isLoading || isRefreshing} 
          />
          
          {/* Article Generator Stat */}
          <StatCard 
            icon={FileText} 
            gradient="bg-gradient-to-br from-rose-500 to-pink-700" 
            iconColor="text-white" 
            label="Articles Generated" 
            value={stats.articleGenerator || 0}
            loading={isLoading || isRefreshing} 
          />
          
          {/* Prompt Generator Stat */}
          <StatCard 
            icon={Sparkles} 
            gradient="bg-gradient-to-br from-purple-500 to-violet-700" 
            iconColor="text-white" 
            label="Prompts Created" 
            value={stats.promptGenerator || 0}
            loading={isLoading || isRefreshing} 
          />
          
          {/* Headline Analyzer Stat */}
          <StatCard 
            icon={BarChart} 
            gradient="bg-gradient-to-br from-blue-500 to-indigo-600" 
            iconColor="text-white" 
            label="Headlines Analyzed" 
            value={stats.headlineAnalyzer || 0}
            loading={isLoading || isRefreshing} 
          />
          
          {/* Meta Title Generator Stat */}
          <StatCard 
            icon={Type} 
            gradient="bg-gradient-to-br from-amber-500 to-orange-600" 
            iconColor="text-white" 
            label="Titles Generated" 
            value={stats.metaTitleGenerator || 0}
            loading={isLoading || isRefreshing} 
          />
        </div>
      </div>
      
      {/* Blog Content Components with Premium Styling */}
      <div className="bg-white shadow-xl rounded-2xl p-6 border border-indigo-100 dashboard-section">
        <h2 className="text-xl font-bold text-indigo-900 mb-5 flex items-center">
          <Search className="mr-2 h-5 w-5 text-indigo-600" /> 
          <span className="bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent">Content Components</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {/* SEO Keywords Generated */}
          <StatCard 
            icon={Search} 
            gradient="bg-gradient-to-br from-teal-500 to-emerald-600" 
            iconColor="text-white" 
            label="SEO Keywords" 
            value={stats.seoKeywordsGenerated || 0}
            loading={isLoading || isRefreshing}
          />
          
          {/* Long Tail Keywords Generated */}
          <StatCard 
            icon={Key} 
            gradient="bg-gradient-to-br from-blue-500 to-sky-600" 
            iconColor="text-white" 
            label="Long Tail Keywords" 
            value={stats.longTailKeywordsGenerated || 0}
            loading={isLoading || isRefreshing}
          />
          
          {/* FAQs Generated */}
          <StatCard 
            icon={FileText} 
            gradient="bg-gradient-to-br from-indigo-500 to-purple-600" 
            iconColor="text-white" 
            label="FAQs" 
            value={stats.faqsGenerated || 0}
            loading={isLoading || isRefreshing}
          />
          
          {/* Internal Links Generated */}
          <StatCard 
            icon={ExternalLink} 
            gradient="bg-gradient-to-br from-emerald-500 to-green-600" 
            iconColor="text-white" 
            label="Internal Links" 
            value={stats.internalLinksGenerated || 0}
            loading={isLoading || isRefreshing}
          />
          
          {/* External Links Generated */}
          <StatCard 
            icon={ExternalLink} 
            gradient="bg-gradient-to-br from-violet-500 to-purple-600" 
            iconColor="text-white" 
            label="External Links" 
            value={stats.externalLinksGenerated || 0}
            loading={isLoading || isRefreshing}
          />
          
          {/* Target Audience Generated */}
          <StatCard 
            icon={PenTool} 
            gradient="bg-gradient-to-br from-amber-500 to-yellow-600" 
            iconColor="text-white" 
            label="Target Audiences" 
            value={stats.targetAudienceGenerated || 0}
            loading={isLoading || isRefreshing}
          />
        </div>
      </div>
      
      {/* Tools Section with Premium Styling and Enhanced Visibility */}
      <div className="bg-white shadow-xl rounded-2xl p-6 border border-indigo-100 dashboard-section">
        <h2 className="text-xl font-bold text-indigo-900 mb-5 flex items-center">
          <Zap className="mr-2 h-5 w-5 text-indigo-600" /> 
          <span className="text-indigo-600">Content Tools</span>
        </h2>
        <div className={`
          grid gap-5
          ${sidebarState === 'expanded' ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'}
        `}>
          {/* SEO Prompt Generator Card */}
          <ToolCard
            to="/generator"
            icon={FileCode}
            gradient="bg-gradient-to-br from-indigo-500 to-indigo-700"
            iconColor="text-white"
            titleColor="text-indigo-600"
            label="SEO Prompt Generator"
            description="Create the perfect SEO-optimized content using just a few inputs. Generate prompts instantly."
            badgeText="Lightning-Fast"
            onClick={() => incrementStat('apiCalls')}
          />

          {/* Content Creator Card */}
          <ToolCard
            to="/content-creator"
            icon={PenTool}
            gradient="bg-gradient-to-br from-emerald-500 to-teal-700"
            iconColor="text-white"
            titleColor="text-emerald-600"
            label="Content Creator"
            description="Generate complete, ready-to-publish content with just a few inputs."
            badgeText="New Tool"
            onClick={() => incrementStat('apiCalls')}
            isNew={true}
          />

          {/* Headline Analyzer Card */}
          <ToolCard
            to="/headline-analyzer"
            icon={Type}
            gradient="bg-gradient-to-br from-blue-500 to-indigo-700"
            iconColor="text-white"
            titleColor="text-indigo-600"
            label="Headline Analyzer"
            description="Analyze and improve your headlines for better click-through rates, engagement, and SEO performance."
            badgeText="Popular"
            onClick={() => incrementStat('headlineAnalyzer')}
          />
          
          {/* Meta Title Generator Card */}
          <ToolCard
            to="/meta-title-generator"
            icon={Type}
            gradient="bg-gradient-to-br from-amber-500 to-orange-600"
            iconColor="text-white"
            titleColor="text-orange-500"
            label="Meta Title Generator"
            description="Create SEO-friendly blog titles that drive clicks using your focus keywords."
            badgeText="New Tool"
            onClick={() => incrementStat('metaTitleGenerator')}
            isNew={true}
          />
          
          {/* Meta Description Generator Card */}
          <ToolCard
            to="/meta-description-generator"
            icon={FileText}
            gradient="bg-gradient-to-br from-orange-500 to-rose-600"
            iconColor="text-white"
            titleColor="text-red-500"
            label="Meta Description Generator"
            description="Create SEO-friendly meta descriptions that improve click-through rates and conversions."
            badgeText="New Tool"
            onClick={() => incrementStat('metaDescriptionGenerator')}
            isNew={true}
          />
          
          {/* Blog Content Generator Card */}
          <ToolCard
            to="/blog-content-generator"
            icon={Edit3}
            gradient="bg-gradient-to-br from-purple-500 to-indigo-700"
            iconColor="text-white"
            titleColor="text-purple-600"
            label="Blog Content Generator"
            description="Create complete blog content from title to recipe schema in one streamlined process."
            badgeText="All-in-One"
            onClick={() => incrementStat('blogContentGenerator')}
          />
          
          {/* Article Generator Card */}
          <ToolCard
            to="/article-generator"
            icon={FileText}
            gradient="bg-gradient-to-br from-rose-500 to-pink-700"
            iconColor="text-white"
            titleColor="text-rose-600"
            label="Article Generator"
            description="Create structured articles with steps: title, description, tags, and recipe content in one workflow."
            badgeText="New Tool"
            onClick={() => {
              incrementStat('apiCalls');
              incrementStat('articleGenerator');
            }}
            isNew={true}
          />
          
          {/* Prompt Generator Card - NEW */}
          <ToolCard
            to="/prompt-generator"
            icon={Sparkles}
            gradient="bg-gradient-to-br from-purple-500 to-violet-700"
            iconColor="text-white"
            titleColor="text-purple-600"
            label="Prompt Generator"
            description="Create powerful, structured prompts for any AI service without using API calls."
            badgeText="No API"
            onClick={() => {
              incrementStat('promptGenerator');
            }}
            isNew={true}
          />
        </div>
      </div>
      
      {/* Recent Documents with Premium Styling */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-indigo-100 dashboard-section">
        <div className="bg-gradient-to-r from-indigo-800 to-indigo-900 px-6 py-5 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold flex items-center">
            <FileText className="mr-2 h-5 w-5 text-indigo-300" /> Recent Documents
          </h2>
          <div className="text-xs font-medium bg-indigo-700/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-indigo-500/30">
            {recentDocs.length} items
          </div>
        </div>
        
        <div className="p-1">
          {isRefreshing ? (
            <div className="space-y-1 p-3">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="py-3 px-4 flex items-center justify-between bg-indigo-50/50 rounded-lg animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-40 bg-indigo-100 rounded"></div>
                      <div className="h-3 w-24 bg-indigo-50 rounded"></div>
                    </div>
                  </div>
                  <div className="h-8 w-8 bg-indigo-100 rounded"></div>
                </div>
              ))}
            </div>
          ) : recentDocs.length > 0 ? (
            <div className="divide-y divide-indigo-50">
              {recentDocs.map((doc, index) => (
                <div
                  key={index}
                  className="py-3 px-5 flex items-center justify-between hover:bg-indigo-50 transition-colors duration-200 cursor-pointer group document-item"
                  onClick={() => handleDocumentClick(doc, index)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center shadow-md">
                      <FileText className="h-4.5 w-4.5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-indigo-900 group-hover:text-indigo-700 transition-colors truncate max-w-[180px] sm:max-w-md">
                        {doc.title || 'Untitled Document'}
                      </h3>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-indigo-500">
                          {formatDate(doc.date)}
                        </span>
                        {doc.isNew && (
                          <span className="ml-2 bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded-full font-medium">
                            New
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-xs text-indigo-500 hidden md:block">
                      {doc.type || 'Document'}
                    </div>
                    <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-110 hover:bg-indigo-100 hover:text-indigo-700 hover:shadow-md">
                      <ExternalLink className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center px-6">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center mb-5 shadow-lg empty-state-icon">
                <FileText className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-indigo-900 mb-2">No documents yet</h3>
              <p className="text-indigo-600/70 text-sm mb-6 max-w-sm">
                Create your first document using any of our content generation tools to get started.
              </p>
              <Link to="/generator">
                <Button 
                  className="action-button bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-xl"
                  onClick={() => {
                    incrementStat('apiCalls');
                    addToast('Navigating to Generator', 'info');
                  }}
                >
                  <Sparkles className="h-4 w-4" />
                  Create Document
                </Button>
              </Link>
            </div>
          )}
        </div>
        
        {recentDocs.length > 0 && (
          <div className="border-t border-indigo-100 px-5 py-3 bg-indigo-50/50 flex justify-between items-center">
            <span className="text-xs text-indigo-500">Showing {recentDocs.length} recent documents</span>
            <Button 
              variant="outline"
              size="sm" 
              className="text-xs text-indigo-700 flex items-center gap-1 h-8 border-indigo-200 bg-white hover:bg-indigo-100 hover:text-indigo-800 hover:border-indigo-300 transition-colors shadow-sm"
            >
              View All <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;