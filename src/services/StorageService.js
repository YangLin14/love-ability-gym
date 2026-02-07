const STORAGE_PREFIX = 'love_gym_';

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
      const key = `${STORAGE_PREFIX}${moduleName}_logs`;
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
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
  }

  /**
   * Get all logs from all modules sorted by date
   */
  static getAllLogs() {
    const modules = ['module1', 'module2', 'module3', 'module4', 'module5'];
    let allLogs = [];

    modules.forEach(mod => {
      const logs = this.getLogs(mod);
      // Add module tag to each log
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
  }
}

export default StorageService;
