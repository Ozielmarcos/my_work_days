import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../../types';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, Square, Timer, Pause } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onStartTimer: (taskId: string) => void;
  onPauseTimer: (taskId: string) => void;
  onStopTimer: (taskId: string) => void;
}

export function TaskCard({
  task,
  onClick,
  onStartTimer,
  onPauseTimer,
  onStopTimer,
}: TaskCardProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
    useSortable({
      id: task.id,
      data: {
        type: 'Task',
        task,
      },
    });

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (task.isTimerRunning && task.currentTimerStart) {
      const updateElapsed = () => {
        const start = new Date(task.currentTimerStart!).getTime();
        const now = new Date().getTime();
        setElapsedSeconds((task.spentHours || 0) + Math.floor((now - start) / 1000));
      };
      updateElapsed();
      interval = setInterval(updateElapsed, 1000);
    } else {
      setElapsedSeconds(task.spentHours || 0);
    }
    return () => clearInterval(interval);
  }, [task.isTimerRunning, task.currentTimerStart]);

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'bg-blue-500';
      case 'in_progress':
        return 'bg-orange-500';
      case 'review':
        return 'bg-purple-500';
      case 'done':
        return 'bg-teal-500';
      case 'blocked':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta':
        return 'text-red-500 bg-red-500/10';
      case 'media':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'baixa':
        return 'text-blue-500 bg-blue-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const spentHours = task.spentHours || 0;
  const totalSpentDisplay = spentHours;
  const remainingHours = Math.max(0, task.effort - totalSpentDisplay);

  const formatHours = (h: number) => {
    if (h === 0) return '0';
    return h.toFixed(2).replace(/\.?0+$/, '');
  };

  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return [hrs, mins, secs]
      .map(v => v < 10 ? "0" + v : v)
      .filter((v, i) => v !== "00" || i > 0)
      .join(":");
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 bg-card border-2 border-primary rounded-xl h-[140px] w-full"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      onClick={onClick}
      className={`group relative bg-card border ${task.isTimerRunning ? 'border-primary' : 'border-border'} rounded-xl p-4 cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors shadow-sm mb-3 flex flex-col gap-3`}
    >
      <div className="flex justify-between items-start gap-2">
        <div {...listeners} className='cursor-grab active:cursor-grabbing flex-1'>
          <h3 className="text-sm font-medium text-foreground leading-tight">
            {task.title}
          </h3>
        </div>

        {task.status === 'in_progress' && (
          <div className="flex items-center gap-1 shrink-0">
            {task.isTimerRunning ? (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onPauseTimer(task.id)
                  }}
                  className="p-1.5 rounded-md bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 transition-colors"
                  title="Pausar tempo"
                >
                  <Pause className="w-3.5 h-3.5 fill-current" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onStopTimer(task.id)
                  }}
                  className="p-1.5 rounded-md bg-teal-500/10 text-teal-500 hover:bg-teal-500/20 transition-colors"
                  title="Parar sessão"
                >
                  <Square className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onStartTimer(task.id)
                  }
                  }
                  className="p-1.5 rounded-md bg-blue-500 text-slate-50 hover:bg-blue-500/60 transition-colors"
                  title="Iniciar tempo"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onStopTimer(task.id)
                  }
                  }
                  className="p-1.5 rounded-md bg-red-500 text-slate-50 hover:bg-red-500/60 transition-colors"
                  title="Parar sessão"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {task.description && (
        <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between mt-auto pt-2">
        <div className="flex items-center gap-2">
          {task.status === 'in_progress' && (task.isTimerRunning || (task.doingTime || 0) > 0) && (
            <div className={
              `flex items-center gap-1.5 px-2 py-1 rounded-md border ${task.isTimerRunning
                ? 'bg-primary/10 text-primary border-primary/20'
                : 'bg-muted/50 text-muted-foreground border-border'}`
            }>
              <Timer className="w-3 h-3" />
              <span className="text-[10px] font-mono font-bold">
                {formatTimer(elapsedSeconds)}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-1 text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{formatHours(remainingHours)}h rest</span>
          </div>
          {totalSpentDisplay > 0 && (
            <div className="text-[10px] text-muted-foreground">
              {formatHours(totalSpentDisplay)}h gastas
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-1">
        <Badge
          variant="outline"
          className="text-[10px] px-1.5 py-0 border-border bg-background/50 flex items-center gap-1"
        >
          <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(task.status)}`} />
          <span className="capitalize">{task.status.replace('_', ' ')}</span>
        </Badge>
        <Badge
          variant="outline"
          className={`text-[10px] px-1.5 py-0 border-none ${getPriorityColor(task.priority)}`}
        >
          {task.priority}
        </Badge>
      </div>
    </div>
  );
}
