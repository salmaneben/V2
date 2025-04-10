// src/lib/statsUtils.ts

import { 
  getAppStats, 
  incrementStat, 
  getRecentDocuments, 
  getDailyStats,
  getWeeklyStats,
  getMonthlyStats,
  getStatsGrowth
} from './appStats';

export interface DashboardStats {
  promptsGenerated: number;
  apiCalls: number;
  recentSessions: number;
  activeProjects: number;
  headlineAnalyzer: number;
  metaTitleGenerator: number;
  metaDescriptionGenerator: number;
  blogContentGenerator: number;
  seoKeywordsGenerated: number;
  longTailKeywordsGenerated: number;
  faqsGenerated: number;
  internalLinksGenerated: number;
  externalLinksGenerated: number;
  targetAudienceGenerated: number;
}

// Re-export functions from appStats to maintain API compatibility
export { 
  getAppStats as getStats,
  incrementStat,
  getRecentDocuments,
  getDailyStats,
  getWeeklyStats,
  getMonthlyStats,
  getStatsGrowth
};

// Additional utility functions for dashboard

// Calculate total generated content items
export const getTotalGeneratedItems = (): number => {
  const stats = getAppStats();
  return (
    (stats.seoKeywordsGenerated || 0) +
    (stats.longTailKeywordsGenerated || 0) +
    (stats.faqsGenerated || 0) +
    (stats.internalLinksGenerated || 0) +
    (stats.externalLinksGenerated || 0) +
    (stats.targetAudienceGenerated || 0)
  );
};

// Calculate recent activity metrics
export const getRecentActivity = (days: number = 7): number => {
  const dailyApiCalls = getDailyStats('apiCalls', days);
  return dailyApiCalls.reduce((sum, item) => sum + item.value, 0);
};

// Save a generated prompt
export const saveGeneratedPrompt = (prompt: string, title: string = "Untitled Prompt"): void => {
  try {
    // Increment the stats
    incrementStat('promptsGenerated');
    
    // Save to recent documents
    const recentDocs = getRecentDocuments();
    const newDoc = {
      title,
      content: prompt,
      date: new Date().toISOString(),
      type: 'prompt'
    };
    
    // Add to beginning of array
    recentDocs.unshift(newDoc);
    
    // Keep only most recent 10
    const updatedDocs = recentDocs.slice(0, 10);
    localStorage.setItem('recent_documents', JSON.stringify(updatedDocs));
  } catch (error) {
    console.error("Error saving generated prompt:", error);
  }
};

// Get performance metrics for dashboard
export const getPerformanceMetrics = (): { 
  totalApiCalls: number;
  dailyAverage: number;
  weeklyGrowth: number;
  monthlyGrowth: number;
} => {
  const stats = getAppStats();
  const dailyApiCalls = getDailyStats('apiCalls', 7);
  
  const totalApiCalls = stats.apiCalls;
  const dailyAverage = dailyApiCalls.length > 0 
    ? dailyApiCalls.reduce((sum, item) => sum + item.value, 0) / dailyApiCalls.length
    : 0;
  
  const weeklyGrowth = getStatsGrowth('apiCalls', 'week');
  const monthlyGrowth = getStatsGrowth('apiCalls', 'month');
  
  return {
    totalApiCalls,
    dailyAverage,
    weeklyGrowth,
    monthlyGrowth
  };
};