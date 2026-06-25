export type Story = {
    id?: string;
    title: string;
    description: string;
};

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done' | 'blocked';
export type TaskPriority = 'baixa' | 'media' | 'alta';

export interface TimeEntry {
    id: string; // UUID
    startTime: string; // ISO string
    endTime?: string; // ISO string
    day: string; // YYYY-MM-DD
}

export type Task = {
    id?: string;
    story_id: string;
    title: string;
    description: string;
    effort: number; // in hours
    status: TaskStatus;
    priority: TaskPriority;
    createdAt?: string;
    doingTime?: number;
    spentHours?: number;
    timeEntries?: TimeEntry[];
    isTimerRunning?: boolean;
    currentTimerStart?: string;
};