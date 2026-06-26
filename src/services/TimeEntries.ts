import { useAuthStore } from "@/store/useAuthStore";


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
}

