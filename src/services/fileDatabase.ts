import { fileHelpers } from '../utils/fileHelpers';
import type { Task, Story } from '../types';

const TASKS_FILE = 'tasks.db.json';
const MAX_SIZE_BYTES = 1024 * 1024 * 1024; // 1GB

interface DatabaseContent {
  tasks: Task[];
  stories: Story[];
  lastRotation?: string;
}

export const fileDatabase = {
  /**
   * Loads all data from tasks.db.json.
   */
  loadData: async (): Promise<DatabaseContent> => {
    const data = await fileHelpers.readJSON<DatabaseContent>(TASKS_FILE);
    return data || { tasks: [], stories: [] };
  },

  /**
   * Saves all data to tasks.db.json.
   */
  saveData: async (content: DatabaseContent): Promise<void> => {
    // Check retention before saving
    const size = JSON.stringify(content).length;
    if (size > MAX_SIZE_BYTES) {
      console.warn('Database size limit reached (1GB). Rotation required.');
    }
    await fileHelpers.writeJSON(TASKS_FILE, content);
  },

  /**
   * Gets the current file size.
   */
  getFileSize: async (): Promise<number> => {
    return await fileHelpers.getFileSize(TASKS_FILE);
  },

  /**
   * Checks if the data needs rotation (age or size).
   */
  checkRotationNeeded: async (): Promise<{ needed: boolean; reason?: string }> => {
    const data = await fileDatabase.loadData();
    
    // Check by date
    if (data.tasks.length > 0) {
      const oldestTask = data.tasks.reduce((oldest, current) => {
        return new Date(current.createdAt) < new Date(oldest.createdAt) ? current : oldest;
      }, data.tasks[0]);

      if (fileHelpers.isExpired(oldestTask.createdAt)) {
        return { needed: true, reason: 'Dados com mais de 60 dias' };
      }
    }

    // Check by size
    const size = await fileDatabase.getFileSize();
    if (size >= MAX_SIZE_BYTES) {
      return { needed: true, reason: 'Tamanho do arquivo excedeu 1GB' };
    }

    return { needed: false };
  },

  /**
   * Resets the database (Step 3 of Rotation).
   */
  resetDatabase: async (): Promise<void> => {
    await fileHelpers.deleteFile(TASKS_FILE);
    await fileDatabase.saveData({ tasks: [], stories: [] });
  }
};
