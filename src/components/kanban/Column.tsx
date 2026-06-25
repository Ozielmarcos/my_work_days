import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task, TaskStatus } from '../../types';
import { TaskCard } from '../task/TaskCard';

interface ColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export function Column({ status, title, tasks, onTaskClick }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: {
      type: 'Column',
      status,
    },
  });

  const getStatusBorder = (status: TaskStatus) => {
    switch (status) {
      case 'todo':
        return 'border-blue-500/20';
      case 'in_progress':
        return 'border-green-500/20';
      case 'review':
        return 'border-purple-500/20';
      case 'done':
        return 'border-teal-500/20';
      case 'blocked':
        return 'border-red-500/20';
      default:
        return 'border-border';
    }
  };

  return (
    <div
      className={`flex flex-col w-[320px] shrink-0 bg-background/50 border border-border/50 rounded-2xl ${getStatusBorder(status)} overflow-hidden`}
    >
      <div className="p-4 border-b border-border/50 flex items-center justify-between bg-card/30">
        <h2 className="font-medium text-sm text-foreground flex items-center gap-3">
          {title}
          <span className="text-muted-foreground text-xs font-normal">
            {tasks.length}
          </span>
        </h2>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 p-3 overflow-y-auto transition-colors ${isOver ? 'bg-accent/5' : ''}`}
      >
        {tasks && tasks.length > 0 && (
          <SortableContext
            items={tasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-0 min-h-[150px]">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  );
}
