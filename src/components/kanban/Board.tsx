import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Column } from './Column';
import { TaskCard } from '../task/TaskCard';
import { TaskDetailModal } from '../task/TaskDetailModal';
import type { Task, TaskStatus } from '../../types';
import { KanbanService } from '@/services/kanbanService';
import { TimeEntriesService } from '@/services/TimeEntries';

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'À fazer' },
  { id: 'in_progress', title: 'Fazendo' },
  { id: 'review', title: 'Em revisão' },
  { id: 'done', title: 'Feito' },
  { id: 'blocked', title: 'Bloqueado' },
];

interface IBoardProps {
  storyId: string
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
}

export function Board({ storyId, tasks, setTasks }: IBoardProps) {

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  let filteredTasks: Task[] = []
  if (tasks && tasks.length > 0) {
    filteredTasks = tasks.filter((t) => t && t.story_id === storyId);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = filteredTasks.find((t) => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';
    const isOverColumn = over.data.current?.type === 'Column';

    if (!isActiveTask) return;

    let newStatus: TaskStatus | null = null

    if (isOverTask) {
      const overTask = filteredTasks.find((t) => t.id === overId);

      if (overTask && activeTask?.status !== overTask.status) {
        newStatus = overTask.status
      }
    }

    if (isOverColumn) {
      if (activeTask?.status !== overId) {
        newStatus = overId as TaskStatus
      }
    }

    if (!newStatus) return

    setTasks(prev =>
      prev.map((task) =>
        task.id === activeId
          ? { ...task, status: newStatus }
          : task))
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const isOverColumn = over.data.current?.type === 'Column';
    const isOverTask = over.data.current?.type === 'Task';

    let newStatus: TaskStatus | null = null;

    if (isOverColumn) {
      newStatus = overId as TaskStatus;
    } else if (isOverTask) {
      const overTask = tasks.find((t) => t.id === overId);

      if (overTask) {
        newStatus = overTask.status;
      }
    }

    if (!newStatus) return

    try {
      await KanbanService.moveTask(activeId, newStatus)
    } catch (error) {
      console.error('Failed to move task:', error)
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleStartTimer = async (taskId: string) => {
    await TimeEntriesService.starTimer(taskId)

    setTasks(prev =>
      prev.map((task) =>
        task.id === taskId
          ? {
            ...task,
            isTimerRunning: true,
            currentTimerStart: new Date().toISOString(),
            spentHours: task.spentHours
          }
          : task
      )
    )
  };

  const handlePauseTimer = async (taskId: string) => {
    try {
      if (activeTask?.isTimerRunning) {
        await TimeEntriesService.pauseTimer(taskId)
      } else {
        await TimeEntriesService.resumeTimer(taskId)
      }

      setTasks(prev =>
        prev.map((task) =>
          task.id === taskId
            ? {
              ...task,
              isTimerRunning: !task.isTimerRunning,
              currentTimerStart: task.isTimerRunning ? null : new Date().toISOString(),
              spentHours: task.spentHours
            }
            : task
        )
      )
    } catch (err) {
      console.error("Erro: ", err)
    }
  };

  const handleStopTimer = async (taskId: string) => {
    try {
      await TimeEntriesService.pauseTimer(taskId)

      setTasks(prev =>
        prev.map((task) =>
          task.id === taskId
            ? {
              ...task,
              isTimerRunning: false,
              currentTimerStart: null,
              spentHours: task.spentHours
            } : task
        )
      )
    } catch (err) {
      console.error("Erro: ", err)
    }
  };

  function onTaskClick(task: Task): Task {
    return task
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 h-full pb-4">
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              status={col.id}
              title={col.title}
              tasks={filteredTasks?.filter((t) => t.status === col.id)}
              onTaskClick={handleTaskClick}
              onStartTimer={handleStartTimer}
              onPauseTimer={handlePauseTimer}
              onStopTimer={handleStopTimer}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ?
            <TaskCard
              task={activeTask}
              onClick={() => onTaskClick(activeTask)}
              onStartTimer={handleStartTimer}
              onPauseTimer={handlePauseTimer}
              onStopTimer={handleStopTimer}
            /> : null}
        </DragOverlay>
      </DndContext>

      <TaskDetailModal
        task={selectedTask}
        open={isTaskModalOpen}
        onOpenChange={setIsTaskModalOpen}
      />
    </>
  );
}
