// src/lib/appStats.ts

export interface AppStats {
    promptsGenerated: number;
    apiCalls: number;
    recentSessions: number;
    activeProjects: number;
    headlineAnalyzer: number;
    // keywordResearch removed
  }
  
  const LOCAL_STORAGE_KEY = 'app_stats';
  
  // Initialize stats if they don't exist
  export const initializeStats = (): void => {
    const existingStats = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!existingStats) {
      const initialStats: AppStats = {
        promptsGenerated: 60,
        apiCalls: 173,
        recentSessions: 1,
        activeProjects: 0,
        headlineAnalyzer: 0
        // keywordResearch removed
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialStats));
      console.log('Stats initialized:', initialStats);
    } else {
      // Check if headlineAnalyzer exists, add it if not
      try {
        const stats = JSON.parse(existingStats);
        let updated = false;
        
        if (!('headlineAnalyzer' in stats)) {
          stats.headlineAnalyzer = 0;
          updated = true;
        }
        
        // keywordResearch check removed
        
        if (updated) {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stats));
          console.log('Updated stats structure:', stats);
        }
      } catch (e) {
        console.error('Error checking stats:', e);
      }
    }
  };
  
  // Get the current stats
  export const getAppStats = (): AppStats => {
    const stats = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stats) {
      initializeStats();
      return getAppStats();
    }
    
    try {
      const parsedStats = JSON.parse(stats);
      // Ensure headlineAnalyzer exists
      if (!('headlineAnalyzer' in parsedStats)) {
        parsedStats.headlineAnalyzer = 0;
      }
      // keywordResearch check removed
      return parsedStats;
    } catch (e) {
      console.error('Error parsing stats:', e);
      return {
        promptsGenerated: 60,
        apiCalls: 173,
        recentSessions: 1,
        activeProjects: 0,
        headlineAnalyzer: 0
        // keywordResearch removed
      };
    }
  };
  
  // Update a specific stat
  export const updateStat = (stat: keyof AppStats, value: number): void => {
    const stats = getAppStats();
    stats[stat] = value;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stats));
    console.log(`Stat ${stat} updated to ${value}`);
  };
  
  // Increment a specific stat
  export const incrementStat = (stat: keyof AppStats): void => {
    const stats = getAppStats();
    stats[stat] += 1;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stats));
    console.log(`Stat ${stat} incremented to ${stats[stat]}`);
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