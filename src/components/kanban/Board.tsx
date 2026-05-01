import { useState } from 'react';
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
import { useKanbanStore } from '../../store/useKanbanStore';
import { Column } from './Column';
import { TaskCard } from '../task/TaskCard';
import { TaskDetailModal } from '../task/TaskDetailModal';
import type { Task, TaskStatus } from '../../types';

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'Á fazer' },
  { id: 'in_progress', title: 'Fazendo' },
  { id: 'review', title: 'em Revisão' },
  { id: 'done', title: 'Feito' },
  { id: 'blocked', title: 'Bloqueado' },
];

export function Board() {
  const tasks = useKanbanStore((state) => state.tasks);
  const activeStoryId = useKanbanStore((state) => state.activeStoryId);
  const moveTask = useKanbanStore((state) => state.moveTask);
  const optimisticMoveTask = useKanbanStore((state) => state.optimisticMoveTask);

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const filteredTasks = tasks.filter((t) => t.storyId === activeStoryId);

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

    if (isOverTask) {
      const overTask = filteredTasks.find((t) => t.id === overId);

      if (overTask && activeTask?.status !== overTask.status) {
        optimisticMoveTask(activeId as string, overTask.status);
      }
    }

    if (isOverColumn) {
      if (activeTask?.status !== overId) {
        optimisticMoveTask(activeId as string, overId as TaskStatus);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const isActiveTask = active.data.current?.type === 'Task';
    if (!isActiveTask) return;

    const isOverColumn = over.data.current?.type === 'Column';
    const isOverTask = over.data.current?.type === 'Task';

    if (isOverColumn) {
      moveTask(activeId, overId as TaskStatus);
    } else if (isOverTask) {
      const overTask = tasks.find((t) => t.id === overId);

      if (overTask) {
        moveTask(activeId, overTask.status);
      }
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

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
              tasks={filteredTasks.filter((t) => t.status === col.id)}
              onTaskClick={handleTaskClick}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} onClick={() => {}} /> : null}
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
