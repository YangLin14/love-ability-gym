/**
 * db.js — Lightweight IndexedDB wrapper for Love Ability Gym
 * 
 * Replaces raw localStorage for log storage.
 * Uses native IndexedDB API (no external dependencies).
 * 
 * Schema:
 *   Database: "love_ability_gym_db" (version 1)
 *   Object Store: "logs"
 *     - keyPath: "uuid"
 *     - Indexes: "moduleName", "createdAt", "tool"
 */

const DB_NAME = 'love_ability_gym_db';
const DB_VERSION = 1;
const LOGS_STORE = 'logs';

let dbInstance = null;

/**
 * Open (or create) the database. Returns a cached promise.
 */
function openDB() {
  if (dbInstance) return Promise.resolve(dbInstance);

  // Guard: indexedDB may not be available (test env, old browsers)
  if (typeof indexedDB === 'undefined') {
    return Promise.reject(new Error('IndexedDB not available'));
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(LOGS_STORE)) {
        const store = db.createObjectStore(LOGS_STORE, { keyPath: 'uuid' });
        store.createIndex('moduleName', 'moduleName', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
        store.createIndex('tool', 'tool', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      console.error('IndexedDB open failed', event.target.error);
      reject(event.target.error);
    };
  });
}

/**
 * Generic helper: run a transaction and return result via promise.
 */
function withStore(storeName, mode, callback) {
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, mode);
      const store = tx.objectStore(storeName);
      const result = callback(store);

      tx.oncomplete = () => resolve(result._value);
      tx.onerror = () => reject(tx.error);

      // If callback returns a request, wire up its result
      if (result instanceof IDBRequest) {
        result.onsuccess = () => {
          result._value = result.result;
        };
      }
    });
  });
}

// ─── Public API ────────────────────────────────────────────

/**
 * Add a single log entry.
 * @param {string} moduleName
 * @param {object} entry - Must have a `uuid` field.
 */
export async function addLog(moduleName, entry) {
  const record = { ...entry, moduleName };
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(LOGS_STORE, 'readwrite');
    tx.objectStore(LOGS_STORE).put(record);
    tx.oncomplete = () => resolve(record);
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Get all logs for a specific module, sorted by createdAt descending.
 * @param {string} moduleName
 * @returns {Promise<Array>}
 */
export async function getLogsByModule(moduleName) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(LOGS_STORE, 'readonly');
    const index = tx.objectStore(LOGS_STORE).index('moduleName');
    const request = index.getAll(moduleName);
    request.onsuccess = () => {
      const results = request.result || [];
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      resolve(results);
    };
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get ALL logs across all modules, sorted by createdAt descending.
 * @returns {Promise<Array>}
 */
export async function getAllLogs() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(LOGS_STORE, 'readonly');
    const request = tx.objectStore(LOGS_STORE).getAll();
    request.onsuccess = () => {
      const results = request.result || [];
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      resolve(results);
    };
    request.onerror = () => reject(request.error);
  });
}

/**
 * Clear all logs for a module.
 * @param {string} moduleName
 */
export async function clearLogsByModule(moduleName) {
  const logs = await getLogsByModule(moduleName);
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(LOGS_STORE, 'readwrite');
    const store = tx.objectStore(LOGS_STORE);
    logs.forEach((log) => store.delete(log.uuid));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Clear ALL logs.
 */
export async function clearAllLogs() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(LOGS_STORE, 'readwrite');
    tx.objectStore(LOGS_STORE).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Bulk insert logs (used during migration from localStorage).
 * @param {Array} logs
 */
export async function bulkInsert(logs) {
  if (!logs || logs.length === 0) return;
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(LOGS_STORE, 'readwrite');
    const store = tx.objectStore(LOGS_STORE);
    logs.forEach((log) => store.put(log));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Check if migration from localStorage has already been performed.
 */
export function isMigrated() {
  return localStorage.getItem('love_gym_idb_migrated') === 'true';
}

/**
 * Mark migration as complete.
 */
export function setMigrated() {
  localStorage.setItem('love_gym_idb_migrated', 'true');
}

export { openDB };
