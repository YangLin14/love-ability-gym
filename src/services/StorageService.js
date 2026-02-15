import { supabase } from './supabaseClient';

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
  /**
   * Subscribe to storage changes
   * @param {Function} callback 
   * @returns {Function} unsubscribe
   */
  static subscribe(callback) {
    const handler = () => callback();
    window.addEventListener('love-gym-storage-update', handler);
    return () => {
      window.removeEventListener('love-gym-storage-update', handler);
    };
  }

  static notify() {
    window.dispatchEvent(new Event('love-gym-storage-update'));
  }

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
        id: Date.now(), // Local ID
        uuid: crypto.randomUUID(), // Global ID for sync
        createdAt: new Date().toISOString(),
        ...data
      };
      
      const updated = [newEntry, ...existing];
      localStorage.setItem(key, JSON.stringify(updated));
      
      // Update cache
      cache.logs[moduleName] = updated;

      // Notify listeners
      this.notify();

      // Try to sync to cloud immediately if online
      this.syncEntryToCloud(moduleName, newEntry);
      
      return newEntry;
    } catch (e) {
      console.error("Storage save failed", e);
      return null;
    }
  }

  /**
   * Push a single entry to cloud (fire and forget)
   */
  static async syncEntryToCloud(moduleName, entry) {
    if (!supabase) return;
    
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData?.user) return;
      
      const user = authData.user;

      await supabase.from('user_logs').upsert({
        user_id: user.id,
        module_name: moduleName,
        data: entry,
        created_at: entry.createdAt,
        client_id: entry.uuid || entry.id.toString()
      }, { onConflict: 'client_id' });
    } catch (e) {
      console.warn("Cloud sync failed (offline?)", e);
    }
  }

  /**
   * Full Sync: Pull from cloud -> Merge -> Push local missing to cloud
   */
  static async syncWithCloud() {
    if (!supabase) return;
    
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData?.user) return;
      
      const user = authData.user;

      console.log('Starting cloud sync...');

      // 1. Fetch all cloud logs
      const { data: cloudLogs, error } = await supabase
        .from('user_logs')
        .select('*');
      
      if (error) throw error;

      // 2. Merge Cloud -> Local
      // Group cloud logs by module
      const cloudMap = {};
      cloudLogs.forEach(row => {
        if (!cloudMap[row.module_name]) cloudMap[row.module_name] = [];
        cloudMap[row.module_name].push(row.data);
      });

      // For each module, merge
      Object.keys(cloudMap).forEach(moduleName => {
        const localLogs = this.getLogs(moduleName);
        const merged = this.mergeLogs(localLogs, cloudMap[moduleName]);
        
        // Save back to local
        localStorage.setItem(`${STORAGE_PREFIX}${moduleName}_logs`, JSON.stringify(merged));
        cache.logs[moduleName] = merged;
      });

      console.log('Cloud sync finished');

    } catch (e) {
      console.error('Full sync failed', e);
    }
  }

  static mergeLogs(local, cloud) {
    const map = new Map();
    
    // changing: prioritize cloud if conflict? or merge properly.
    // For now, use UUID or ID to dedup.
    [...local, ...cloud].forEach(item => {
      const id = item.uuid || item.id;
      if (!map.has(id)) {
        map.set(id, item);
      }
    });

    return Array.from(map.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
    this.notify();
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
   * Save User Profile and Sync
   */
  static async saveProfile(profile) {
    localStorage.setItem('love_ability_profile', JSON.stringify(profile));
    
    // Sync to cloud as a special log entry
    if (supabase) {
      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData?.user) return;

        const user = authData.user;
        if (user) {
          await supabase.from('user_logs').upsert({
            user_id: user.id,
            module_name: 'profile', // Special module name
            data: profile,
            client_id: 'user_profile_data', // Fixed ID to ensure single-row update
            created_at: new Date().toISOString()
          }, { onConflict: 'client_id' });
        }
      } catch (e) {
        console.warn("Profile sync failed", e);
      }
    }
  }

  /**
   * Save User Stats and Sync
   */
  static async saveStats(stats) {
    localStorage.setItem('love_ability_stats', JSON.stringify(stats));
    
    // Sync to cloud
    if (supabase) {
      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData?.user) return;

        const user = authData.user;
        if (user) {
          await supabase.from('user_logs').upsert({
            user_id: user.id,
            module_name: 'stats', // Special module name
            data: stats,
            client_id: 'user_stats_data', // Fixed ID
            created_at: new Date().toISOString()
          }, { onConflict: 'client_id' });
        }
      } catch (e) {
        console.warn("Stats sync failed", e);
      }
    }
  }

  /**
   * Sync Global Data (Profile & Stats) from Cloud
   */
  static async syncGlobalData() {
    if (!supabase) return null;

    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData?.user) return null;
      
      const user = authData.user;

      // Fetch profile and stats
      const { data, error } = await supabase
        .from('user_logs')
        .select('*')
        .in('module_name', ['profile', 'stats']);

      if (error || !data) return null;

      let syncedData = {};

      data.forEach(row => {
        if (row.module_name === 'profile') {
           localStorage.setItem('love_ability_profile', JSON.stringify(row.data));
           syncedData.profile = row.data;
        }
        if (row.module_name === 'stats') {
           // We might want to merge stats carefully (e.g. take max XP), but for now last-write wins from cloud
           // strictly speaking, we should compare timestamps or values, but let's assume cloud is truth on load
           localStorage.setItem('love_ability_stats', JSON.stringify(row.data));
           syncedData.stats = row.data;
        }
      });
      
      return syncedData;

    } catch (e) {
      console.error("Global sync failed", e);
      return null;
    }
  }

  /**
   * Clear ALL data
   */
  static clearAllData() {
    localStorage.clear();
    cache.logs = {};
    this.notify();
    if (supabase) supabase.auth.signOut();
  }
}

export default StorageService;
