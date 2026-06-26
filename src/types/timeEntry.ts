export interface TimeEntry {
    id: string; // UUID
    taskId?: string;
    taskTitle?: string;
    startTime: string; // ISO string
    endTime?: string; // ISO string
    day: string; // YYYY-MM-DD
}