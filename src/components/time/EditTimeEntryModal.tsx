import { useState, useEffect } from 'react';
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
import type { TimeEntry } from '../../types';
import { Trash2 } from 'lucide-react';

interface EditTimeEntryModalProps {
  entry: TimeEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  updateEntry: (entry: TimeEntry) => void;
  removeEntry: (id: string) => void;
}

export function EditTimeEntryModal({
  entry,
  open,
  onOpenChange,
  updateEntry,
  removeEntry
}: EditTimeEntryModalProps) {

  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    if (entry && open) {
      setDate(entry.day);
      const start = new Date(entry.startTime);
      setStartTime(start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));

      if (entry.endTime) {
        const end = new Date(entry.endTime);
        setEndTime(end.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
      } else {
        setEndTime('');
      }
    }
  }, [entry, open]);

  const handleSave = () => {
    if (entry && date && startTime && endTime) {
      const startDt = new Date(`${date}T${startTime}:00`);
      const endDt = new Date(`${date}T${endTime}:00`);

      const body = {
        id: entry.id,
        taskId: entry.taskId,
        startTime: startDt.toISOString(),
        endTime: endDt.toISOString(),
        day: date,
      }
      updateEntry(body);
      onOpenChange(false);
    }
  };

  const handleDelete = () => {
    if (entry) {
      removeEntry(entry.id)
      onOpenChange(false);
    }
  };

  if (!entry) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border text-foreground sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Editar Apontamento</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-date">Data</Label>
            <Input
              id="edit-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-background/50 border-border"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-start">Início</Label>
              <Input
                id="edit-start"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="bg-background/50 border-border"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-end">Fim</Label>
              <Input
                id="edit-end"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="bg-background/50 border-border"
              />
            </div>
          </div>
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
