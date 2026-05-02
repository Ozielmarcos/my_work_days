/**
 * Simulates a local file system using IndexedDB
 */

const DB_NAME = 'MyWorkDaysFS';
const STORE_NAME = 'files';

const getDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'path' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const fileHelpers = {
  /**
   * Reads a JSON file. 
   * If it's auth.config.json, it fetches from public/.
   * If it's tasks.db.json, it reads from IndexedDB.
   */
  readJSON: async <T>(filePath: string): Promise<T | null> => {
    if (filePath.includes('auth.config.json')) {
      try {
        const response = await fetch('/auth.config.json');
        if (!response.ok) return null;
        return await response.json();
      } catch (e) {
        console.error('Error reading auth.config.json:', e);
        return null;
      }
    }

    const db = await getDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(filePath);
      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result.data as T);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => resolve(null);
    });
  },

  /**
   * Writes data to a JSON "file" in IndexedDB.
   */
  writeJSON: async (filePath: string, data: any): Promise<void> => {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put({
        path: filePath,
        data,
        updatedAt: new Date().toISOString(),
        size: JSON.stringify(data).length // Estimation in bytes
      });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  /**
   * Deletes a "file" from IndexedDB.
   */
  deleteFile: async (filePath: string): Promise<void> => {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(filePath);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  /**
   * Gets the size of a "file" in bytes.
   */
  getFileSize: async (filePath: string): Promise<number> => {
    const db = await getDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(filePath);
      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result.size || 0);
        } else {
          resolve(0);
        }
      };
      request.onerror = () => resolve(0);
    });
  },

  /**
   * Checks if a date is older than 60 days.
   */
  isExpired: (dateISO: string): boolean => {
    const date = new Date(dateISO);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 60;
  }
};
