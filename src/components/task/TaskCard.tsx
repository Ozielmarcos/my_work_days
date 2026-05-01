import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../../types";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo": return "bg-blue-500";
      case "in_progress": return "bg-orange-500";
      case "review": return "bg-purple-500";
      case "done": return "bg-teal-500";
      case "blocked": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta": return "text-red-500 bg-red-500/10";
      case "media": return "text-yellow-500 bg-yellow-500/10";
      case "baixa": return "text-blue-500 bg-blue-500/10";
      default: return "text-gray-500 bg-gray-500/10";
    }
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
      {...listeners}
      onClick={onClick}
      className="group relative bg-card border border-border rounded-xl p-4 cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors shadow-sm mb-3 flex flex-col gap-3"
    >
      <div className="flex justify-between items-start gap-2">
        <h3 className="text-sm font-medium text-foreground leading-tight">{task.title}</h3>
      </div>
      
      {task.description && (
        <p className="text-xs text-muted-foreground line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-auto pt-2">
        <div className="flex -space-x-2">
           {/* Mock avatars */}
           <Avatar className="w-6 h-6 border-2 border-card">
              <AvatarImage src={`https://i.pravatar.cc/150?u=${task.id}1`} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <Avatar className="w-6 h-6 border-2 border-card">
              <AvatarImage src={`https://i.pravatar.cc/150?u=${task.id}2`} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
        </div>
        
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{task.effort}h</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-1">
        <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-border bg-background/50 flex items-center gap-1">
          <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(task.status)}`} />
          <span className="capitalize">{task.status.replace("_", " ")}</span>
        </Badge>
        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 border-none ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </Badge>
      </div>
    </div>
  );
}
