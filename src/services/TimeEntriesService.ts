import { useAuthStore } from "@/store/useAuthStore";
import type { TimeEntry } from "@/types";


const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3005';
const getToken = () => useAuthStore.getState().token
const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`
}

export const TimeEntriesService = {
    starTimer: async (taskId: string) => {
        await fetch(`${apiUrl}/task/${taskId}/start`, {
            method: "PUT",
            headers
        })
    },

    pauseTimer: async (taskId: string) => {
        await fetch(`${apiUrl}/task/${taskId}/pause`, {
            method: 'PUT',
            headers
        })
    },

    resumeTimer: async (taskId: string) => {
        await fetch(`${apiUrl}/task/${taskId}/resume`, {
            method: 'PUT',
            headers
        })
    },

    entriesByStory: async (storyId: string) => {
        const response = await fetch(`${apiUrl}/stories/${storyId}/entries`, {
            method: 'GET',
            headers
        })

        return response.json().then((data) => data || [])
    },

    updateEntry: async (entry: TimeEntry) => {
        await fetch(`${apiUrl}/entries/${entry.id}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({
                id: entry.id,
                task_id: entry.taskId,
                start_time: entry.startTime,
                end_time: entry.endTime,
            })
        })
    },

    deleteEntry: async (id: string) => {
        await fetch(`${apiUrl}/entries/${id}`, {
            method: 'DELETE',
            headers
        })
    },
}

