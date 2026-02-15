const STORAGE_PREFIX = 'love_gym_';

// Simple in-memory cache
const cache = {
  logs: {},
  lastFetch: {}
};

class StorageService {
  /**
   * Save a log entry to a specific module's storage
   * @param {string} moduleName - 'module1', 'module2', etc.
   * @param {object} data - The data directly.
   */
  static saveLog(moduleName, data) {
    try {
      const key = `${STORAGE_PREFIX}${moduleName}_logs`;
      const existing = this.getLogs(moduleName);
      const newEntry = {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        ...data
      };
      
      const updated = [newEntry, ...existing];
      localStorage.setItem(key, JSON.stringify(updated));
      
      // Update cache
      cache.logs[moduleName] = updated;
      
      return newEntry;
    } catch (e) {
      console.error("Storage save failed", e);
      return null;
    }
  }

  /**
   * Get all logs for a module
   */
  static getLogs(moduleName) {
    try {
      // Return cached if available
      if (cache.logs[moduleName]) {
        return cache.logs[moduleName];
      }

      const key = `${STORAGE_PREFIX}${moduleName}_logs`;
      const raw = localStorage.getItem(key);
      const parsed = (raw && raw !== "null") ? JSON.parse(raw) : [];
      
      // Update cache
      cache.logs[moduleName] = parsed;
      
      return parsed;
    } catch (e) {
      console.error("Storage read failed", e);
      return [];
    }
  }

  /**
   * Clear logs for a module
   */
  static clearLogs(moduleName) {
    const key = `${STORAGE_PREFIX}${moduleName}_logs`;
    localStorage.removeItem(key);
    delete cache.logs[moduleName];
  }

  /**
   * Get all logs from all modules sorted by date
   */
  static getAllLogs() {
    const modules = ['module1', 'module2', 'module3', 'module4', 'module5'];
    let allLogs = [];

    // This is still synchronous but now reads from memory if cached
    modules.forEach(mod => {
      const logs = this.getLogs(mod);
      // Add module tag to each log. 
      // Optimization: avoid re-mapping if we can, but since we are modifying object, 
      // we might want to cache the "allLogs" result too if this becomes a bottleneck.
      // For now, the heavy lifting (localStorage.getItem and JSON.parse) is cached.
      const taggedLogs = logs.map(log => ({ ...log, module: mod }));
      allLogs = [...allLogs, ...taggedLogs];
    });

    return allLogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  /**
   * Get usage statistics
   */
  static getStats() {
    const allLogs = this.getAllLogs();
    const stats = {};
    
    allLogs.forEach(log => {
      // Count by tool type (assuming 'type' or 'tool' property exists, or infer from structure)
      // If no explicit type, fallback to module
      const type = log.tool || log.type || log.module; 
      stats[type] = (stats[type] || 0) + 1;
    });

    return stats;
  }

  /**
   * Clear ALL data
   */
  static clearAllData() {
    localStorage.clear();
    cache.logs = {};
  }
}

export default StorageService;
