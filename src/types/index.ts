export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
};

export type Story = {
  id: string;
  title: string;
  description: string;
};

export type TaskStatus = "todo" | "in_progress" | "review" | "done" | "blocked";
export type TaskPriority = "baixa" | "media" | "alta";

export type Task = {
  id: string;
  storyId: string;
  title: string;
  description: string;
  effort: number; // in hours
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  doingTime?: number;
};
