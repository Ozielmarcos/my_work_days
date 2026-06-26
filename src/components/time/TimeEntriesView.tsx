import { useState, useEffect } from 'react';
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
import { TimeEntriesService } from '@/services/TimeEntriesService';
import { formatHours } from '@/utils/formatHours';

interface ITimeEntriesViewProps {
  storyId: string
}

export function TimeEntriesView({ storyId }: ITimeEntriesViewProps) {
  const [entries, setEntries] = useState([])
  const [dateFilter, setDateFilter] = useState('');
  const [sortField, setSortField] = useState<'date' | 'time'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!storyId) return;

    const loadEntries = async () => {
      try {
        const response = await TimeEntriesService.entriesByStory(storyId);
        setEntries(response);
      } catch (err) {
        console.error("Erro ao buscar apontamentos!", err);
      }
    };

    loadEntries();

    setDateFilter(new Date().toISOString().split("T")[0]);
    setCurrentPage(1);
  }, [storyId]);

  const toggleSort = (field: 'date' | 'time') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const calculateHours = (startTime: string, endTime: string) => {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    return formatHours(end - start);
  };

  const handleUpdateEntry = async (entry: TimeEntry) => {
    try {
      await TimeEntriesService.updateEntry(entry);
      setEntries(entries.map((e) => e.id === entry.id ? entry : e));
    } catch (err) {
      console.error("Erro ao atualizar apontamento!", err);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      await TimeEntriesService.deleteEntry(id);
      setEntries(entries.filter((entry) => entry.id !== id));
    } catch (err) {
      console.error("Erro ao deletar apontamento!", err);
    }
  };

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
            <Button
              variant="ghost"
              onClick={() => setDateFilter('')}
              className="text-muted-foreground"
            >
              Limpar Filtro
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8 pt-2">
        <div className="rounded-md border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="font-semibold text-foreground">Tarefa</TableHead>
                <TableHead className="font-semibold text-foreground">
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort('date')}
                    className="hover:bg-accent -ml-4"
                  >
                    Data
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="font-semibold text-foreground">Início</TableHead>
                <TableHead className="font-semibold text-foreground">Fim</TableHead>
                <TableHead className="font-semibold text-foreground text-right">
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort('time')}
                    className="hover:bg-accent justify-end w-full"
                  >
                    Total
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right font-semibold text-foreground">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Nenhum apontamento encontrado.
                  </TableCell>
                </TableRow>
              ) : (() => {
                const startIndex = (currentPage - 1) * itemsPerPage;
                const pagedEntries = entries.slice(startIndex, startIndex + itemsPerPage);

                return pagedEntries.map((entry, index) => {
                  const startDate = new Date(entry.start_time);
                  const endDate = entry.end_time ? new Date(entry.end_time) : null;
                  return (
                    <TableRow key={index} className="border-border">
                      <TableCell
                        title={entry.task_title}
                        className="font-medium text-foreground" >
                        {entry.task_title}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {startDate.toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {startDate.toLocaleTimeString('pt-BR',
                          { hour: '2-digit', minute: '2-digit' }
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {endDate ? endDate.toLocaleTimeString('pt-BR',
                          { hour: '2-digit', minute: '2-digit' }
                        ) : '-'}
                      </TableCell>
                      <TableCell className="text-right pr-4 font-mono text-primary font-medium">
                        {calculateHours(entry.start_time, entry.end_time)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingEntry(entry)}
                          className="hover:bg-accent hover:text-accent-foreground"
                          disabled={!entry.end_time}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                });
              })()}
            </TableBody>
          </Table>
        </div>

        {entries.length > itemsPerPage && (
          <div className="flex items-center justify-between mt-4 bg-card border border-border p-2 rounded-md shadow-sm">
            <div className="text-sm text-muted-foreground">
              Exibindo
              <span className="font-medium text-foreground">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>
              a
              <span className="font-medium text-foreground">
                {Math.min(currentPage * itemsPerPage, entries.length)}
              </span>
              de
              <span className="font-medium text-foreground">
                {entries.length}
              </span>
              registros
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="h-8 border-border"
              >
                Anterior
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({
                  length: Math.ceil(entries.length / itemsPerPage)
                },
                  (_, i) => i + 1
                ).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setCurrentPage(page)}
                    className={`h-8 w-8 text-xs 
                      ${currentPage === page
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent"}`
                    }
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === Math.ceil(entries.length / itemsPerPage)}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="h-8 border-border"
              >
                Próximo
              </Button>
            </div>
          </div>
        )}
      </div>

      <EditTimeEntryModal
        entry={editingEntry || null}
        open={!!editingEntry}
        updateEntry={handleUpdateEntry}
        removeEntry={handleDeleteEntry}
        onOpenChange={(open) => {
          if (!open) setEditingEntry(null);
        }}
      />
    </div>
  );
}
