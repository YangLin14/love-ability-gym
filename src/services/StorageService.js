import { supabase } from './supabaseClient';
import * as db from './db';

const STORAGE_PREFIX = 'love_gym_';
const ALL_MODULES = ['module1', 'module2', 'module3', 'module4', 'module5'];

// In-memory cache — populated on init() from IndexedDB.
// Sync callers (getLogs, getAllLogs, getStats) read from this cache.
// Writes go to IndexedDB first, then update cache.
const cache = {
  logs: {},       // { [moduleName]: Array }
  allLogs: null,  // Flat sorted array (invalidated on write)
  ready: false,   // True after init() completes
};

class StorageService {

  // ─── Initialization ──────────────────────────────────────

  /**
   * Must be called once at app startup (in AppProvider).
   * Migrates localStorage data → IndexedDB if needed, then pre-fills cache.
   */
  static async init() {
    if (cache.ready) return;

    try {
      // 1. Migrate if first run after upgrade
      if (!db.isMigrated()) {
        await this._migrateFromLocalStorage();
        db.setMigrated();
      }

      // 2. Pre-fill cache from IndexedDB
      for (const mod of ALL_MODULES) {
        cache.logs[mod] = await db.getLogsByModule(mod);
      }
      cache.allLogs = null; // will be built lazily
      cache.ready = true;

      console.log('[StorageService] Initialized from IndexedDB');
    } catch (e) {
      console.error('[StorageService] Init failed, falling back to localStorage', e);
      // Fallback: populate cache from localStorage so app still works
      this._loadCacheFromLocalStorage();
      cache.ready = true;
    }
  }

  /**
   * One-time migration: read all module logs from localStorage → IndexedDB.
   */
  static async _migrateFromLocalStorage() {
    console.log('[StorageService] Migrating localStorage → IndexedDB...');
    for (const mod of ALL_MODULES) {
      const key = `${STORAGE_PREFIX}${mod}_logs`;
      const raw = localStorage.getItem(key);
      if (raw && raw !== 'null') {
        try {
          const logs = JSON.parse(raw);
          if (Array.isArray(logs) && logs.length > 0) {
            // Ensure every entry has a uuid and moduleName
            const prepared = logs.map(entry => ({
              ...entry,
              uuid: entry.uuid || entry.id?.toString() || crypto.randomUUID(),
              moduleName: mod,
            }));
            await db.bulkInsert(prepared);
          }
        } catch (e) {
          console.error(`[Migration] Failed to parse ${key}`, e);
        }
      }
    }
    console.log('[StorageService] Migration complete');
  }

  /**
   * Fallback: populate cache from localStorage (used if IndexedDB fails).
   */
  static _loadCacheFromLocalStorage() {
    for (const mod of ALL_MODULES) {
      const key = `${STORAGE_PREFIX}${mod}_logs`;
      const raw = localStorage.getItem(key);
      let parsed = [];
      if (raw && raw !== 'null') {
        try { parsed = JSON.parse(raw); } catch (e) { parsed = []; }
      }
      cache.logs[mod] = parsed;
    }
  }

  // ─── Event System ────────────────────────────────────────

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

  // ─── Log CRUD ────────────────────────────────────────────

  /**
   * Save a log entry. Writes to IndexedDB + updates cache synchronously.
   * @param {string} moduleName
   * @param {object} data
   * @returns {object} The saved entry (sync return for backward compat).
   */
  static saveLog(moduleName, data) {
    try {
      const now = new Date().toISOString();
      const newEntry = {
        id: Date.now(),
        uuid: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
        moduleName,
        ...data,
      };

      // 1. Update cache immediately (sync)
      if (!cache.logs[moduleName]) cache.logs[moduleName] = [];
      cache.logs[moduleName] = [newEntry, ...cache.logs[moduleName]];
      cache.allLogs = null; // invalidate

      // 2. Persist to IndexedDB (async, fire-and-forget)
      db.addLog(moduleName, newEntry).catch(e =>
        console.error('[StorageService] IndexedDB write failed', e)
      );

      // 3. Backward compat: also write to localStorage as backup
      try {
        const key = `${STORAGE_PREFIX}${moduleName}_logs`;
        localStorage.setItem(key, JSON.stringify(cache.logs[moduleName]));
      } catch (e) {
        // localStorage full or unavailable — non-fatal
      }

      // 4. Notify listeners
      this.notify();

      // 5. Cloud sync
      this.syncEntryToCloud(moduleName, newEntry);

      return newEntry;
    } catch (e) {
      console.error('Storage save failed', e);
      return null;
    }
  }

  /**
   * Get logs for a module (synchronous, reads from cache).
   */
  static getLogs(moduleName) {
    if (cache.logs[moduleName]) {
      return cache.logs[moduleName];
    }

    // Fallback if cache not ready: read from localStorage
    const key = `${STORAGE_PREFIX}${moduleName}_logs`;
    const raw = localStorage.getItem(key);
    let parsed = [];
    if (raw && raw !== 'null') {
      try { parsed = JSON.parse(raw); } catch (e) { parsed = []; }
    }
    cache.logs[moduleName] = parsed;
    return parsed;
  }

  /**
   * Get ALL logs across all modules, sorted by date (synchronous).
   */
  static getAllLogs() {
    if (cache.allLogs) return cache.allLogs;

    let allLogs = [];
    for (const mod of ALL_MODULES) {
      const logs = this.getLogs(mod);
      const tagged = logs.map(log => ({ ...log, module: mod }));
      allLogs = [...allLogs, ...tagged];
    }
    allLogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    cache.allLogs = allLogs;
    return allLogs;
  }

  /**
   * Clear logs for a module.
   */
  static clearLogs(moduleName) {
    if (moduleName) {
      const key = `${STORAGE_PREFIX}${moduleName}_logs`;
      localStorage.removeItem(key);
      delete cache.logs[moduleName];
      db.clearLogsByModule(moduleName).catch(() => {});
    } else {
      // Clear all modules
      for (const mod of ALL_MODULES) {
        localStorage.removeItem(`${STORAGE_PREFIX}${mod}_logs`);
      }
      cache.logs = {};
      db.clearAllLogs().catch(() => {});
    }
    cache.allLogs = null;
    this.notify();
  }

  /**
   * Get usage statistics (synchronous).
   */
  static getStats() {
    const allLogs = this.getAllLogs();
    const stats = {};
    allLogs.forEach(log => {
      const type = log.tool || log.type || log.module;
      stats[type] = (stats[type] || 0) + 1;
    });
    return stats;
  }

  // ─── Merge ───────────────────────────────────────────────

  static mergeLogs(local, cloud) {
    const map = new Map();
    [...local, ...cloud].forEach(item => {
      const id = item.uuid || item.id;
      const existing = map.get(id);
      if (!existing) {
        map.set(id, item);
      } else {
        // LWW: keep the entry with the newer updatedAt (or createdAt fallback)
        const existingTime = new Date(existing.updatedAt || existing.createdAt || 0);
        const itemTime = new Date(item.updatedAt || item.createdAt || 0);
        if (itemTime > existingTime) map.set(id, item);
      }
    });
    return Array.from(map.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // ─── Cloud Sync ──────────────────────────────────────────

  static async syncEntryToCloud(moduleName, entry) {
    if (!supabase) return;
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData?.user) return;
      const user = authData.user;

      await supabase.from('user_logs').upsert({
        user_id: user.id,
        module_name: moduleName,
        data: { ...entry, updatedAt: entry.updatedAt || entry.createdAt },
        created_at: entry.createdAt,
        client_id: entry.uuid || entry.id.toString()
      }, { onConflict: 'client_id' });
    } catch (e) {
      console.warn('Cloud sync failed (offline?)', e);
    }
  }

  static async syncWithCloud() {
    if (!supabase) return;
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData?.user) return;
      const user = authData.user;

      console.log('Starting delta cloud sync...');

      // 1. Delta fetch: only get records newer than last sync
      const lastSync = localStorage.getItem('love_gym_last_sync') || '1970-01-01T00:00:00Z';
      const query = supabase.from('user_logs').select('*');
      const { data: cloudLogs, error } = await query.gt('created_at', lastSync);

      if (error) throw error;

      // 2. Group cloud logs by module
      const cloudMap = {};
      (cloudLogs || []).forEach(row => {
        if (!cloudMap[row.module_name]) cloudMap[row.module_name] = [];
        cloudMap[row.module_name].push(row.data);
      });

      // 3. Merge cloud → local (LWW conflict resolution)
      const touchedModules = new Set(Object.keys(cloudMap));
      for (const moduleName of touchedModules) {
        const localLogs = this.getLogs(moduleName);
        const merged = this.mergeLogs(localLogs, cloudMap[moduleName]);

        cache.logs[moduleName] = merged;
        cache.allLogs = null;

        const prepared = merged.map(entry => ({
          ...entry,
          uuid: entry.uuid || entry.id?.toString() || crypto.randomUUID(),
          moduleName,
        }));
        await db.bulkInsert(prepared);

        try {
          localStorage.setItem(`${STORAGE_PREFIX}${moduleName}_logs`, JSON.stringify(merged));
        } catch (e) { /* quota */ }
      }

      // 4. Push local-only entries created after last sync
      for (const moduleName of ALL_MODULES) {
        const localLogs = this.getLogs(moduleName);
        const unsyncedLocal = localLogs.filter(log => {
          const t = log.updatedAt || log.createdAt;
          return t && new Date(t) > new Date(lastSync);
        });
        for (const entry of unsyncedLocal) {
          try {
            await supabase.from('user_logs').upsert({
              user_id: user.id,
              module_name: moduleName,
              data: entry,
              created_at: entry.createdAt,
              client_id: entry.uuid || entry.id?.toString()
            }, { onConflict: 'client_id' });
          } catch (e) { /* individual entry fail is non-fatal */ }
        }
      }

      // 5. Update sync timestamp
      localStorage.setItem('love_gym_last_sync', new Date().toISOString());

      console.log('Delta cloud sync finished');
    } catch (e) {
      console.error('Full sync failed', e);
    }
  }

  // ─── Profile & Stats (stay in localStorage — small data) ─

  static async saveProfile(profile) {
    localStorage.setItem('love_ability_profile', JSON.stringify(profile));
    if (supabase) {
      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData?.user) return;
        const user = authData.user;
        if (user) {
          await supabase.from('user_logs').upsert({
            user_id: user.id,
            module_name: 'profile',
            data: profile,
            client_id: 'user_profile_data',
            created_at: new Date().toISOString()
          }, { onConflict: 'client_id' });
        }
      } catch (e) {
        console.warn('Profile sync failed', e);
      }
    }
  }

  static async saveStats(stats) {
    localStorage.setItem('love_ability_stats', JSON.stringify(stats));
    if (supabase) {
      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData?.user) return;
        const user = authData.user;
        if (user) {
          await supabase.from('user_logs').upsert({
            user_id: user.id,
            module_name: 'stats',
            data: stats,
            client_id: 'user_stats_data',
            created_at: new Date().toISOString()
          }, { onConflict: 'client_id' });
        }
      } catch (e) {
        console.warn('Stats sync failed', e);
      }
    }
  }

  static async syncGlobalData() {
    if (!supabase) return null;
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData?.user) return null;

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
          localStorage.setItem('love_ability_stats', JSON.stringify(row.data));
          syncedData.stats = row.data;
        }
      });
      return syncedData;
    } catch (e) {
      console.error('Global sync failed', e);
      return null;
    }
  }

  // ─── Clear All ───────────────────────────────────────────

  static clearAllData() {
    localStorage.clear();
    cache.logs = {};
    cache.allLogs = null;
    db.clearAllLogs().catch(() => {});
    this.notify();
    if (supabase) supabase.auth.signOut();
  }
}

export default StorageService;
