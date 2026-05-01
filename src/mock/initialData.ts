import type { Story, Task } from "../types";

export const initialStories: Story[] = [
  { id: "s1", title: "User Authentication", description: "Implement login, registration, and password recovery." },
  { id: "s2", title: "Dashboard Redesign", description: "Revamp the main dashboard to match the new dark theme." },
  { id: "s3", title: "Payment Integration", description: "Integrate Stripe for handling subscription payments." },
];

export const initialTasks: Task[] = [
  { id: "t1", storyId: "s1", title: "Setup OAuth providers", description: "Google and GitHub login.", effort: 8, status: "todo", priority: "alta", createdAt: new Date().toISOString() },
  { id: "t2", storyId: "s1", title: "Create login form UI", description: "Use shadcn components.", effort: 4, status: "in_progress", priority: "media", createdAt: new Date().toISOString() },
  { id: "t3", storyId: "s1", title: "Write authentication API tests", description: "Jest tests for endpoints.", effort: 6, status: "review", priority: "alta", createdAt: new Date().toISOString() },
  { id: "t4", storyId: "s1", title: "Design database schema for users", description: "Add columns for OAuth IDs.", effort: 2, status: "done", priority: "alta", createdAt: new Date().toISOString() },
  
  { id: "t5", storyId: "s2", title: "Implement dark mode toggle", description: "Use Tailwind class strategy.", effort: 3, status: "done", priority: "baixa", createdAt: new Date().toISOString() },
  { id: "t6", storyId: "s2", title: "Create custom scrollbars", description: "Match the premium dark theme.", effort: 1, status: "review", priority: "baixa", createdAt: new Date().toISOString() },
  { id: "t7", storyId: "s2", title: "Fix header scroll transition", description: "Flicker when scrolling.", effort: 4, status: "in_progress", priority: "media", createdAt: new Date().toISOString() },
  { id: "t8", storyId: "s2", title: "Refactor sidebar navigation", description: "Update icons and active states.", effort: 5, status: "todo", priority: "media", createdAt: new Date().toISOString() },
  
  { id: "t9", storyId: "s3", title: "Stripe webhook handler", description: "Handle successful payments.", effort: 8, status: "blocked", priority: "alta", createdAt: new Date().toISOString() },
  { id: "t10", storyId: "s3", title: "Update pricing page", description: "Show new subscription tiers.", effort: 4, status: "todo", priority: "media", createdAt: new Date().toISOString() },
];
