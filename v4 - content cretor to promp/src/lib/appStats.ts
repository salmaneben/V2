// src/lib/appStats.ts

export interface TimeSeriesData {
  timestamp: string;
  value: number;
}

export interface TimeSeriesStats {
  daily: Record<string, number>;
  weekly: Record<string, number>;
  monthly: Record<string, number>;
}

export interface AppStats {
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

export interface TimeTrackedStats {
  aggregate: AppStats;
  timeSeries: Record<keyof AppStats, TimeSeriesData[]>;
}

const LOCAL_STORAGE_KEY = 'app_stats';
const TIME_SERIES_KEY = 'app_stats_time_series';

// Initialize stats if they don't exist
export const initializeStats = (): void => {
  // Initialize aggregate stats
  const existingStats = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!existingStats) {
    const initialStats: AppStats = {
      promptsGenerated: 60,
      apiCalls: 173,
      recentSessions: 1,
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
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialStats));
    console.log('Stats initialized:', initialStats);
  } else {
    // Check if all fields exist, add them if not
    try {
      const stats = JSON.parse(existingStats);
      let updated = false;
      
      const expectedKeys: (keyof AppStats)[] = [
        'promptsGenerated', 'apiCalls', 'recentSessions', 'activeProjects', 
        'headlineAnalyzer', 'metaTitleGenerator', 'metaDescriptionGenerator', 
        'blogContentGenerator', 'seoKeywordsGenerated', 'longTailKeywordsGenerated', 
        'faqsGenerated', 'internalLinksGenerated', 'externalLinksGenerated', 
        'targetAudienceGenerated'
      ];
      
      expectedKeys.forEach(key => {
        if (!(key in stats)) {
          stats[key] = 0;
          updated = true;
        }
      });
      
      if (updated) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stats));
        console.log('Updated stats structure:', stats);
      }
    } catch (e) {
      console.error('Error checking stats:', e);
    }
  }
  
  // Initialize time series stats if needed
  const existingTimeSeries = localStorage.getItem(TIME_SERIES_KEY);
  if (!existingTimeSeries) {
    initializeTimeSeries();
  }
};

// Initialize time series data structure
export const initializeTimeSeries = (): void => {
  const expectedKeys: (keyof AppStats)[] = [
    'promptsGenerated', 'apiCalls', 'recentSessions', 'activeProjects', 
    'headlineAnalyzer', 'metaTitleGenerator', 'metaDescriptionGenerator', 
    'blogContentGenerator', 'seoKeywordsGenerated', 'longTailKeywordsGenerated', 
    'faqsGenerated', 'internalLinksGenerated', 'externalLinksGenerated', 
    'targetAudienceGenerated'
  ];
  
  const initialTimeSeries: Record<string, TimeSeriesData[]> = {};
  
  // Initialize each key with an empty array
  expectedKeys.forEach(key => {
    initialTimeSeries[key] = [];
  });
  
  localStorage.setItem(TIME_SERIES_KEY, JSON.stringify(initialTimeSeries));
  console.log('Time series stats initialized');
};

// Get the current aggregate stats
export const getAppStats = (): AppStats => {
  const stats = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stats) {
    initializeStats();
    return getAppStats();
  }
  
  try {
    const parsedStats = JSON.parse(stats) as AppStats;
    return parsedStats;
  } catch (e) {
    console.error('Error parsing stats:', e);
    return {
      promptsGenerated: 60,
      apiCalls: 173,
      recentSessions: 1,
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
    };
  }
};

// Get the time series data
export const getTimeSeriesStats = (): Record<string, TimeSeriesData[]> => {
  const timeSeries = localStorage.getItem(TIME_SERIES_KEY);
  if (!timeSeries) {
    initializeTimeSeries();
    return getTimeSeriesStats();
  }
  
  try {
    return JSON.parse(timeSeries);
  } catch (e) {
    console.error('Error parsing time series stats:', e);
    initializeTimeSeries();
    return getTimeSeriesStats();
  }
};

// Update a specific aggregate stat
export const updateStat = (stat: keyof AppStats, value: number): void => {
  const stats = getAppStats();
  stats[stat] = value;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stats));
  console.log(`Stat ${stat} updated to ${value}`);
};

// Increment a specific stat and track it in time series
export const incrementStat = (stat: keyof AppStats): void => {
  // Update aggregate stat
  const stats = getAppStats();
  stats[stat] += 1;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stats));
  
  // Update time series data
  const timeSeries = getTimeSeriesStats();
  const now = new Date();
  const timestamp = now.toISOString();
  
  // Ensure the stat exists in timeSeries
  if (!timeSeries[stat]) {
    timeSeries[stat] = [];
  }
  
  timeSeries[stat].push({
    timestamp,
    value: stats[stat]
  });
  
  // Keep only last 365 days of data to prevent localStorage from growing too large
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  timeSeries[stat] = timeSeries[stat].filter(item => 
    new Date(item.timestamp) >= oneYearAgo
  );
  
  localStorage.setItem(TIME_SERIES_KEY, JSON.stringify(timeSeries));
  console.log(`Stat ${stat} incremented to ${stats[stat]} and time logged`);
};

// Get stats aggregated by day
export const getDailyStats = (stat: keyof AppStats, days: number = 7): {date: string, value: number}[] => {
  const timeSeries = getTimeSeriesStats();
  const statData = timeSeries[stat] || [];
  
  if (statData.length === 0) {
    return [];
  }
  
  const result: Record<string, number> = {};
  const now = new Date();
  
  // Initialize result with zeros for last 'days' days
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
    result[dateString] = 0;
  }
  
  // Filter data for requested days
  const cutoffDate = new Date(now);
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  // Group data by day and find the max value for each day
  statData.forEach(item => {
    const itemDate = new Date(item.timestamp);
    if (itemDate >= cutoffDate) {
      const dateString = itemDate.toISOString().split('T')[0];
      if (dateString in result) {
        // Only keep the highest value for each day
        result[dateString] = Math.max(result[dateString], item.value);
      }
    }
  });
  
  // Convert to array format for easier charting
  return Object.entries(result)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

// Get stats aggregated by week
export const getWeeklyStats = (stat: keyof AppStats, weeks: number = 4): {week: string, value: number}[] => {
  const timeSeries = getTimeSeriesStats();
  const statData = timeSeries[stat] || [];
  
  if (statData.length === 0) {
    return [];
  }
  
  const result: Record<string, number> = {};
  const now = new Date();
  
  // Get week number for a date
  const getWeekNumber = (d: Date): string => {
    const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
    const pastDaysOfYear = (d.getTime() - firstDayOfYear.getTime()) / 86400000;
    const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    return `${d.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
  };
  
  // Initialize result with zeros for last 'weeks' weeks
  for (let i = 0; i < weeks; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - (i * 7));
    const weekString = getWeekNumber(date);
    result[weekString] = 0;
  }
  
  // Filter data for requested weeks
  const cutoffDate = new Date(now);
  cutoffDate.setDate(cutoffDate.getDate() - (weeks * 7));
  
  // Group data by week and find the max value for each week
  statData.forEach(item => {
    const itemDate = new Date(item.timestamp);
    if (itemDate >= cutoffDate) {
      const weekString = getWeekNumber(itemDate);
      if (weekString in result) {
        // Only keep the highest value for each week
        result[weekString] = Math.max(result[weekString], item.value);
      }
    }
  });
  
  // Convert to array format for easier charting
  return Object.entries(result)
    .map(([week, value]) => ({ week, value }))
    .sort((a, b) => a.week.localeCompare(b.week));
};

// Get stats aggregated by month
export const getMonthlyStats = (stat: keyof AppStats, months: number = 6): {month: string, value: number}[] => {
  const timeSeries = getTimeSeriesStats();
  const statData = timeSeries[stat] || [];
  
  if (statData.length === 0) {
    return [];
  }
  
  const result: Record<string, number> = {};
  const now = new Date();
  
  // Initialize result with zeros for last 'months' months
  for (let i = 0; i < months; i++) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    const monthString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    result[monthString] = 0;
  }
  
  // Filter data for requested months
  const cutoffDate = new Date(now);
  cutoffDate.setMonth(cutoffDate.getMonth() - months);
  
  // Group data by month and find the max value for each month
  statData.forEach(item => {
    const itemDate = new Date(item.timestamp);
    if (itemDate >= cutoffDate) {
      const monthString = `${itemDate.getFullYear()}-${(itemDate.getMonth() + 1).toString().padStart(2, '0')}`;
      if (monthString in result) {
        // Only keep the highest value for each month
        result[monthString] = Math.max(result[monthString], item.value);
      }
    }
  });
  
  // Convert to array format for easier charting
  return Object.entries(result)
    .map(([month, value]) => ({ month, value }))
    .sort((a, b) => a.month.localeCompare(b.month));
};

// Save a recently generated prompt
export const savePrompt = (title: string, content: string): void => {
  // Save the prompt to recent documents
  const recentDocs = localStorage.getItem('recent_documents') || '[]';
  const docs = JSON.parse(recentDocs);
  
  docs.unshift({
    title,
    content,
    date: new Date().toISOString()
  });
  
  // Keep only the 10 most recent docs
  const updatedDocs = docs.slice(0, 10);
  localStorage.setItem('recent_documents', JSON.stringify(updatedDocs));
  
  // Increment stats
  incrementStat('promptsGenerated');
  incrementStat('apiCalls');
  
  console.log('Prompt saved and stats updated');
};

// Get recent documents
export const getRecentDocuments = (): any[] => {
  const docs = localStorage.getItem('recent_documents') || '[]';
  return JSON.parse(docs);
};

// Calculate statistics for a given time period
export const getStatsGrowth = (stat: keyof AppStats, period: 'day' | 'week' | 'month'): number => {
  const timeSeries = getTimeSeriesStats();
  const statData = timeSeries[stat] || [];
  
  if (statData.length < 2) {
    return 0; // Not enough data
  }
  
  let currentPeriodData: {date: string, value: number}[] = [];
  let previousPeriodData: {date: string, value: number}[] = [];
  
  if (period === 'day') {
    currentPeriodData = getDailyStats(stat, 1);
    previousPeriodData = getDailyStats(stat, 2).slice(0, 1);
  } else if (period === 'week') {
    currentPeriodData = getWeeklyStats(stat, 1);
    previousPeriodData = getWeeklyStats(stat, 2).slice(0, 1);
  } else if (period === 'month') {
    currentPeriodData = getMonthlyStats(stat, 1);
    previousPeriodData = getMonthlyStats(stat, 2).slice(0, 1);
  }
  
  const currentValue = currentPeriodData.length > 0 ? currentPeriodData[0].value : 0;
  const previousValue = previousPeriodData.length > 0 ? previousPeriodData[0].value : 0;
  
  if (previousValue === 0) {
    return currentValue > 0 ? 100 : 0; // If previous value is 0, and current is positive, consider 100% growth
  }
  
  return Math.round(((currentValue - previousValue) / previousValue) * 100);
};

// Migration function to convert old stats to new time-tracked format
export const migrateStatsToTimeSeries = (): void => {
  try {
    const stats = getAppStats();
    const timeSeries = getTimeSeriesStats();
    const now = new Date().toISOString();
    
    // For each stat, add current value to time series if not already there
    Object.keys(stats).forEach(key => {
      const statKey = key as keyof AppStats;
      const currentValue = stats[statKey];
      
      // First, make sure the key exists in timeSeries
      if (!timeSeries[statKey]) {
        timeSeries[statKey] = [];
      }
      
      // Only add if we have a value and time series is empty
      if (currentValue && timeSeries[statKey].length === 0) {
        timeSeries[statKey].push({
          timestamp: now,
          value: currentValue
        });
      }
    });
    
    localStorage.setItem(TIME_SERIES_KEY, JSON.stringify(timeSeries));
    console.log('Stats migrated to time series format');
  } catch (error) {
    console.error('Error migrating stats to time series:', error);
    // If there's an error, reinitialize the time series
    initializeTimeSeries();
  }
};

// Initialize on load
(function() {
  try {
    initializeStats();
    // Attempt to migrate any existing stats to time series format
    migrateStatsToTimeSeries();
  } catch (error) {
    console.error('Error initializing stats:', error);
    // Reinitialize everything if there's an error
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(TIME_SERIES_KEY);
    initializeStats();
    initializeTimeSeries();
  }
})();