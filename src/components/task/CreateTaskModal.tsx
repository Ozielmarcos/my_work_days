import { useState } from 'react';
import { useKanbanStore } from '../../store/useKanbanStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { TaskPriority, TaskStatus } from '../../types';

interface CreateTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultStatus?: TaskStatus;
}

export function CreateTaskModal({
  open,
  onOpenChange,
  defaultStatus = 'todo',
}: CreateTaskModalProps) {
  const addTask = useKanbanStore((state) => state.addTask);
  const activeStoryId = useKanbanStore((state) => state.activeStoryId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [effort, setEffort] = useState('1');
  const [priority, setPriority] = useState<TaskPriority>('media');
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);

  const handleSubmit = () => {
    if (title.trim() && activeStoryId) {
      addTask({
        storyId: activeStoryId,
        title,
        description,
        effort: parseFloat(effort) || 0,
        priority,
        status,
      });
      setTitle('');
      setDescription('');
      setEffort('1');
      setPriority('media');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border text-foreground sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Tarefa</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="task-title">Título</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-background/50 border-border"
              placeholder="O que precisa ser feito?"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="task-desc">Descrição</Label>
              <span className="text-[10px] text-muted-foreground">{description.length}/1000</span>
            </div>
            <Textarea
              id="task-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 1000))}
              className="bg-background/50 border-border resize-none"
              placeholder="Detalhes da tarefa..."
              rows={4}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Estatus</Label>
              <Select
                value={status}
                onValueChange={(val) => setStatus(val as TaskStatus)}
              >
                <SelectTrigger className="bg-background/50 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">A Fazer</SelectItem>
                  <SelectItem value="in_progress">Em Andamento</SelectItem>
                  <SelectItem value="review">Em Revisão</SelectItem>
                  <SelectItem value="done">Feito</SelectItem>
                  <SelectItem value="blocked">Bloqueado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Prioridade</Label>
              <Select
                value={priority}
                onValueChange={(val) => setPriority(val as TaskPriority)}
              >
                <SelectTrigger className="bg-background/50 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="effort">Esforço Estimado (Horas)</Label>
            <Input
              id="effort"
              type="number"
              min="0"
              step="0.1"
              value={effort}
              onChange={(e) => setEffort(e.target.value)}
              className="bg-background/50 border-border"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={!title.trim() || !activeStoryId}
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Criar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
