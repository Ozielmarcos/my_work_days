import { useState, useEffect } from 'react';
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
import type { Task, TaskPriority, TaskStatus } from '../../types';
import { Trash2 } from 'lucide-react';

interface TaskDetailModalProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskDetailModal({ task, open, onOpenChange }: TaskDetailModalProps) {
  const updateTask = useKanbanStore((state) => state.updateTask);
  const deleteTask = useKanbanStore((state) => state.deleteTask);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [effort, setEffort] = useState('1');
  const [priority, setPriority] = useState<TaskPriority>('media');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setEffort(task.effort.toString());
      setPriority(task.priority);
      setStatus(task.status);
      setCurrentPage(1); // Reset page when task changes
    }
  }, [task]);

  const handleSave = () => {
    if (task && title.trim()) {
      updateTask({
        ...task,
        title,
        description,
        effort: parseFloat(effort) || 0,
        priority,
        status,
      });
      onOpenChange(false);
    }
  };

  const handleDelete = () => {
    if (task) {
      deleteTask(task.id);
      onOpenChange(false);
    }
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border text-foreground sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-title">Título</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-background/50 border-border"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="edit-desc">Descrição</Label>
              <span className="text-[10px] text-muted-foreground">{description.length}/1000</span>
            </div>
            <Textarea
              id="edit-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 1000))}
              className="bg-background/50 border-border resize-none"
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
            <Label htmlFor="edit-effort">Esforço Estimado (Horas)</Label>
            <Input
              id="edit-effort"
              type="number"
              min="0"
              step="0.1"
              value={effort}
              onChange={(e) => setEffort(e.target.value)}
              className="bg-background/50 border-border"
            />
          </div>

          {task.timeEntries && task.timeEntries.length > 0 && (() => {
            const totalEntries = task.timeEntries.length;
            const totalPages = Math.ceil(totalEntries / itemsPerPage);
            const startIndex = (currentPage - 1) * itemsPerPage;
            const pagedEntries = [...task.timeEntries].reverse().slice(startIndex, startIndex + itemsPerPage);

            return (
              <div className="mt-2 border-t border-border pt-4">
                <Label className="mb-2 block">Histórico de Horas Gastas</Label>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {pagedEntries.map((entry, idx) => {
                    const start = new Date(entry.startTime);
                    const end = entry.endTime ? new Date(entry.endTime) : null;
                    const timeSpent = end 
                      ? ((end.getTime() - start.getTime()) / (1000 * 60 * 60)).toFixed(2)
                      : 'Rodando...';
                    
                    return (
                      <div key={idx} className="flex justify-between items-center text-sm p-2 rounded-md bg-background/50 border border-border">
                        <div className="text-muted-foreground text-xs">
                          {start.toLocaleDateString()} • {start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} até {end ? end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '...'}
                        </div>
                        <div className="font-mono text-primary font-medium">
                          {end ? `+${timeSpent}h` : '...'}
                        </div>
                      </div>
                    );
                  })}
                  
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4 px-1">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className="h-7 text-xs border-border"
                      >
                        Anterior
                      </Button>
                      <span className="text-[10px] text-muted-foreground">
                        Página {currentPage} de {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="h-7 text-xs border-border"
                      >
                        Próximo
                      </Button>
                    </div>
                  )}

                  <div className="text-right text-sm font-semibold pt-2 text-foreground">
                    Total Gasto: {(task.spentHours || 0).toFixed(2)}h
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
        <DialogFooter className="flex justify-between sm:justify-between w-full">
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-none"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-transparent border-border"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="text-primary-foreground"
            >
              Salvar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
