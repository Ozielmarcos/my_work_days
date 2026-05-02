import type { Story, Task, User } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { fileDatabase } from './fileDatabase';
import { fileHelpers } from '../utils/fileHelpers';

export const mockApi = {
  validateLogin: async (email: string, password: string): Promise<User | null> => {
    const config = await fileHelpers.readJSON<{ users: (User & { password?: string })[] }>('auth.config.json');
    if (!config) return null;

    const user = config.users.find(u => u.email === email && u.password === password);
    if (!user) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  },

  getStories: async (): Promise<Story[]> => {
    await new Promise(r => setTimeout(r, 300));
    const data = await fileDatabase.loadData();
    return data.stories;
  },

  getTasks: async (): Promise<Task[]> => {
    await new Promise(r => setTimeout(r, 300));
    const data = await fileDatabase.loadData();
    return data.tasks;
  },

  createStory: async (story: Omit<Story, 'id'>): Promise<Story> => {
    await new Promise(r => setTimeout(r, 300));
    const data = await fileDatabase.loadData();
    const newStory: Story = { ...story, id: uuidv4() };
    data.stories.push(newStory);
    await fileDatabase.saveData(data);
    return newStory;
  },

  createTask: async (task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
    await new Promise(r => setTimeout(r, 300));
    const data = await fileDatabase.loadData();
    const newTask: Task = {
      ...task,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    data.tasks.push(newTask);
    await fileDatabase.saveData(data);
    return newTask;
  },

  updateTask: async (updatedTask: Task): Promise<Task> => {
    await new Promise(r => setTimeout(r, 300));
    const data = await fileDatabase.loadData();
    const index = data.tasks.findIndex((t) => t.id === updatedTask.id);

    if (index > -1) {
      data.tasks[index] = updatedTask;
      await fileDatabase.saveData(data);
    }
    return updatedTask;
  },

  deleteTask: async (taskId: string): Promise<void> => {
    await new Promise(r => setTimeout(r, 300));
    const data = await fileDatabase.loadData();
    data.tasks = data.tasks.filter((t) => t.id !== taskId);
    await fileDatabase.saveData(data);
  },

  deleteStory: async (storyId: string): Promise<void> => {
    await new Promise(r => setTimeout(r, 300));
    const data = await fileDatabase.loadData();
    data.stories = data.stories.filter((s) => s.id !== storyId);
    data.tasks = data.tasks.filter((t) => t.storyId !== storyId);
    await fileDatabase.saveData(data);
  },
};
