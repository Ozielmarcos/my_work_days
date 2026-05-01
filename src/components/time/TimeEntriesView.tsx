import { useState, useMemo, useEffect } from 'react';
import { useKanbanStore } from '../../store/useKanbanStore';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit2, ArrowUpDown } from 'lucide-react';
import type { TimeEntry } from '../../types';
import { EditTimeEntryModal } from './EditTimeEntryModal';

type FlattenedEntry = TimeEntry & {
  taskId: string;
  taskTitle: string;
};

export function TimeEntriesView() {
  const tasks = useKanbanStore((state) => state.tasks);
  const activeStoryId = useKanbanStore((state) => state.activeStoryId);

  const [dateFilter, setDateFilter] = useState('');
  const [sortField, setSortField] = useState<'date' | 'time'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [editingEntry, setEditingEntry] = useState<{
    taskId: string;
    entry: TimeEntry;
  } | null>(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDateFilter(today);
  }, []);

  const entries = useMemo(() => {
    if (!activeStoryId) return [];

    const storyTasks = tasks.filter((t) => t.storyId === activeStoryId);
    
    let allEntries: FlattenedEntry[] = [];
    storyTasks.forEach((task) => {
      if (task.timeEntries && task.timeEntries.length > 0) {
        task.timeEntries.forEach((entry) => {
          allEntries.push({
            ...entry,
            taskId: task.id,
            taskTitle: task.title,
          });
        });
      }
    });

    if (dateFilter) {
      allEntries = allEntries.filter((e) => e.day === dateFilter);
    }

    allEntries.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'date') {
        comparison = new Date(a.day).getTime() - new Date(b.day).getTime();
      } else if (sortField === 'time') {
        const timeA = a.endTime ? new Date(a.endTime).getTime() - new Date(a.startTime).getTime() : 0;
        const timeB = b.endTime ? new Date(b.endTime).getTime() - new Date(b.startTime).getTime() : 0;
        comparison = timeA - timeB;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return allEntries;
  }, [tasks, activeStoryId, dateFilter, sortField, sortOrder]);

  const toggleSort = (field: 'date' | 'time') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const calculateHours = (start: string, end?: string) => {
    if (!end) return 'Rodando...';
    const diffMs = new Date(end).getTime() - new Date(start).getTime();
    const hours = diffMs / (1000 * 60 * 60);
    return `${hours.toFixed(2)}h`;
  };

  if (!activeStoryId) {
    return <div className="p-8 text-muted-foreground text-center">Nenhum projeto selecionado.</div>;
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="px-8 py-4 flex items-center justify-between border-b border-border">
        <h2 className="text-xl font-semibold text-foreground">Apontamentos</h2>
        <div className="flex items-center gap-4">
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-[180px] bg-card border-border"
            title="Filtrar por data"
          />
          {dateFilter && (
            <Button variant="ghost" onClick={() => setDateFilter('')} className="text-muted-foreground">
              Limpar Filtro
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <div className="rounded-md border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="font-semibold text-foreground">Tarefa</TableHead>
                <TableHead className="font-semibold text-foreground">
                  <Button variant="ghost" onClick={() => toggleSort('date')} className="hover:bg-accent -ml-4">
                    Data
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="font-semibold text-foreground">Início</TableHead>
                <TableHead className="font-semibold text-foreground">Fim</TableHead>
                <TableHead className="font-semibold text-foreground text-right">
                  <Button variant="ghost" onClick={() => toggleSort('time')} className="hover:bg-accent justify-end w-full">
                    Total
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right font-semibold text-foreground">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Nenhum apontamento encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                entries.map((entry, index) => {
                  const startDate = new Date(entry.startTime);
                  const endDate = entry.endTime ? new Date(entry.endTime) : null;
                  return (
                    <TableRow key={index} className="border-border">
                      <TableCell className="font-medium text-foreground">{entry.taskTitle}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {startDate.toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {startDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {endDate ? endDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '-'}
                      </TableCell>
                      <TableCell className="text-right font-mono text-primary font-medium">
                        {calculateHours(entry.startTime, entry.endTime)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingEntry({ taskId: entry.taskId, entry })}
                          className="hover:bg-accent hover:text-accent-foreground"
                          disabled={!entry.endTime} // Cannot edit a running timer
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <EditTimeEntryModal
        taskId={editingEntry?.taskId || null}
        entry={editingEntry?.entry || null}
        open={!!editingEntry}
        onOpenChange={(open) => {
          if (!open) setEditingEntry(null);
        }}
      />
    </div>
  );
}
