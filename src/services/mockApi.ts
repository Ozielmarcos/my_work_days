import type { Story, Task } from '../types';
import { initialStories, initialTasks } from '../mock/initialData';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
  STORIES: 'kanban_stories',
  TASKS: 'kanban_tasks',
};

// Initialize localStorage with mock data if empty
const initializeData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.STORIES)) {
    localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(initialStories));
  }

  if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(initialTasks));
  }
};

initializeData();

export const mockApi = {
  getStories: (): Promise<Story[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stories = JSON.parse(localStorage.getItem(STORAGE_KEYS.STORIES) || '[]');
        resolve(stories);
      }, 300); // Simulate network delay
    });
  },

  getTasks: (): Promise<Task[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]');
        resolve(tasks);
      }, 300);
    });
  },

  createStory: (story: Omit<Story, 'id'>): Promise<Story> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stories = JSON.parse(localStorage.getItem(STORAGE_KEYS.STORIES) || '[]');
        const newStory: Story = { ...story, id: uuidv4() };
        stories.push(newStory);
        localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(stories));
        resolve(newStory);
      }, 300);
    });
  },

  createTask: (task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]');
        const newTask: Task = {
          ...task,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
        };
        tasks.push(newTask);
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
        resolve(newTask);
      }, 300);
    });
  },

  updateTask: (updatedTask: Task): Promise<Task> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tasks: Task[] = JSON.parse(
          localStorage.getItem(STORAGE_KEYS.TASKS) || '[]',
        );
        const index = tasks.findIndex((t) => t.id === updatedTask.id);

        if (index > -1) {
          tasks[index] = updatedTask;
          localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
        }
        resolve(updatedTask);
      }, 300);
    });
  },

  deleteTask: (taskId: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let tasks: Task[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]');
        tasks = tasks.filter((t) => t.id !== taskId);
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
        resolve();
      }, 300);
    });
  },
};
