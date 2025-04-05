// src/lib/statsUtils.ts

export interface DashboardStats {
    promptsGenerated: number;
    apiCalls: number;
    recentSessions: number;
    activeProjects: number;
  }
  
  // Get current stats
  export const getStats = (): DashboardStats => {
    try {
      const storedStats = localStorage.getItem('dashboard_stats');
      if (storedStats) {
        return JSON.parse(storedStats);
      }
    } catch (error) {
      console.error("Error retrieving stats:", error);
    }
    
    // Default stats if nothing exists
    return {
      promptsGenerated: 0,
      apiCalls: 0,
      recentSessions: 0,
      activeProjects: 0
    };
  };
  
  // Update a specific stat
  export const incrementStat = (statName: keyof DashboardStats): void => {
    try {
      const currentStats = getStats();
      currentStats[statName] += 1;
      localStorage.setItem('dashboard_stats', JSON.stringify(currentStats));
    } catch (error) {
      console.error(`Error incrementing stat ${statName}:`, error);
    }
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
  
  // Get recent documents
  export const getRecentDocuments = (): any[] => {
    try {
      const storedDocs = localStorage.getItem('recent_documents');
      return storedDocs ? JSON.parse(storedDocs) : [];
    } catch (error) {
      console.error("Error fetching recent documents:", error);
      return [];
    }
  };