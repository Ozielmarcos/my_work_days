import { useAuthStore } from "@/store/useAuthStore";
import type { Story, Task } from "@/types";

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3005';

// Retorna o token atualizado sem precisar de um Hook
const getToken = () => useAuthStore.getState().token;

export const KanbanService = {
    fetchInitialData: async (): Promise<Story[]> => {
        const response = await fetch(`${apiUrl}/stories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        return response.json();
    },

    createStory: async (story: Partial<Story>): Promise<Story> => {
        const response = await fetch(`${apiUrl}/stories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(story),
        });

        if (!response.ok) {
            throw new Error('Failed to create story');
        }
        return response.json();
    },

    removeStory: async (id: string): Promise<void> => {
        const response = await fetch(`${apiUrl}/stories/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete story');
        }
    },

    createTask: async (data: Partial<Task>) => {
        const taskData = {
            story_id: data.storyId,
            title: data.title,
            description: data.description,
            status: data.status,
            priority: data.priority,
            effort: data.effort,
        }
        const response = await fetch(`${apiUrl}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(taskData)
        })

        if (!response.ok) {
            throw new Error('Failed to create task');
        }
        return response.json();
    },

    getStoryTasks: async () => {
        const response = await fetch(`${apiUrl}/tasks`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch tasks');
        }
        return response.json();
    }
};