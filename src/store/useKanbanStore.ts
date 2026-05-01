import { create } from 'zustand';
import type { Story, Task, TaskStatus, TimeEntry } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { mockApi } from '../services/mockApi';

interface KanbanState {
  stories: Story[];
  tasks: Task[];
  activeStoryId: string | null;
  isLoading: boolean;

  // Actions
  fetchInitialData: () => Promise<void>;
  setActiveStory: (storyId: string) => void;
  addStory: (story: Omit<Story, 'id'>) => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  moveTask: (taskId: string, newStatus: TaskStatus) => Promise<void>;

  // Optimistic UI updates
  optimisticMoveTask: (taskId: string, newStatus: TaskStatus) => void;

  // Timer actions
  startTaskTimer: (taskId: string) => Promise<void>;
  stopTaskTimer: (taskId: string) => Promise<void>;
  updateTimeEntry: (taskId: string, entryId: string, data: Partial<TimeEntry>) => Promise<void>;
  deleteTimeEntry: (taskId: string, entryId: string) => Promise<void>;
}

export const useKanbanStore = create<KanbanState>((set, get) => ({
  stories: [],
  tasks: [],
  activeStoryId: null,
  isLoading: false,

  fetchInitialData: async () => {
    set({ isLoading: true });

    try {
      const [stories, tasks] = await Promise.all([
        mockApi.getStories(),
        mockApi.getTasks(),
      ]);
      set({
        stories,
        tasks,
        activeStoryId: stories.length > 0 ? stories[0].id : null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to fetch data', error);
      set({ isLoading: false });
    }
  },

  setActiveStory: (storyId) => {
    set({ activeStoryId: storyId });
  },

  addStory: async (story) => {
    const newStory = await mockApi.createStory(story);
    set((state) => ({
      stories: [...state.stories, newStory],
      activeStoryId: newStory.id, // Optionally auto-select new story
    }));
  },

  addTask: async (task) => {
    const newTask = await mockApi.createTask(task);
    set((state) => ({ tasks: [...state.tasks, newTask] }));
  },

  updateTask: async (updatedTask) => {
    await mockApi.updateTask(updatedTask);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
    }));
  },

  deleteTask: async (taskId) => {
    await mockApi.deleteTask(taskId);
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== taskId),
    }));
  },

  moveTask: async (taskId, newStatus) => {
    // Backend update
    const task = get().tasks.find((t) => t.id === taskId);

    if (task) {
      const updatedTask = { ...task, status: newStatus };
      await mockApi.updateTask(updatedTask);
      // Ensure state matches backend in case of conflict, though we did optimistic update
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
      }));
    }
  },

  optimisticMoveTask: (taskId, newStatus) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
    }));
  },

  startTaskTimer: async (taskId) => {
    const task = get().tasks.find((t) => t.id === taskId);
    if (task && !task.isTimerRunning) {
      const updatedTask = {
        ...task,
        isTimerRunning: true,
        currentTimerStart: new Date().toISOString(),
      };
      await mockApi.updateTask(updatedTask);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
      }));
    }
  },

  stopTaskTimer: async (taskId) => {
    const task = get().tasks.find((t) => t.id === taskId);
    if (task && task.isTimerRunning && task.currentTimerStart) {
      const now = new Date();
      const startTime = new Date(task.currentTimerStart);
      const diffMs = now.getTime() - startTime.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      const newEntry: TimeEntry = {
        id: uuidv4(),
        startTime: task.currentTimerStart,
        endTime: now.toISOString(),
        day: now.toISOString().split('T')[0],
      };

      const updatedTask = {
        ...task,
        isTimerRunning: false,
        currentTimerStart: undefined,
        spentHours: (task.spentHours || 0) + diffHours,
        timeEntries: [...(task.timeEntries || []), newEntry],
      };

      await mockApi.updateTask(updatedTask);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
      }));
    }
  },

  updateTimeEntry: async (taskId, entryId, data) => {
    const task = get().tasks.find((t) => t.id === taskId);
    if (!task || !task.timeEntries) return;

    const entryIndex = task.timeEntries.findIndex((e) => e.id === entryId);
    if (entryIndex === -1) return;

    const newEntries = [...task.timeEntries];
    newEntries[entryIndex] = { ...newEntries[entryIndex], ...data };

    let totalSpent = 0;
    newEntries.forEach(entry => {
      if (entry.endTime) {
        const start = new Date(entry.startTime).getTime();
        const end = new Date(entry.endTime).getTime();
        totalSpent += (end - start) / (1000 * 60 * 60);
      }
    });

    const updatedTask = {
      ...task,
      timeEntries: newEntries,
      spentHours: totalSpent,
    };

    await mockApi.updateTask(updatedTask);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
    }));
  },

  deleteTimeEntry: async (taskId, entryId) => {
    const task = get().tasks.find((t) => t.id === taskId);
    if (!task || !task.timeEntries) return;

    const newEntries = task.timeEntries.filter((e) => e.id !== entryId);

    let totalSpent = 0;
    newEntries.forEach(entry => {
      if (entry.endTime) {
        const start = new Date(entry.startTime).getTime();
        const end = new Date(entry.endTime).getTime();
        totalSpent += (end - start) / (1000 * 60 * 60);
      }
    });

    const updatedTask = {
      ...task,
      timeEntries: newEntries,
      spentHours: totalSpent,
    };

    await mockApi.updateTask(updatedTask);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
    }));
  },
}));
