import { useState, useEffect } from 'react';
import { useKanbanStore } from '../store/useKanbanStore';
import { fileDatabase } from '../services/fileDatabase';
import { exportService } from '../services/exportService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Dashboard() {
  const fetchInitialData = useKanbanStore((state) => state.fetchInitialData);
  const isLoading = useKanbanStore((state) => state.isLoading);
  const stories = useKanbanStore((state) => state.stories);
  const tasks = useKanbanStore((state) => state.tasks);

  // Rotation state
  const [rotationNeeded, setRotationNeeded] = useState(false);
  const [rotationReason, setRotationReason] = useState('');
  const [email, setEmail] = useState('');
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    fetchInitialData();
    checkRotation();
  }, [fetchInitialData]);

  const checkRotation = async () => {
    const result = await fileDatabase.checkRotationNeeded();
    if (result.needed) {
      setRotationNeeded(true);
      setRotationReason(result.reason || '');
    }
  };

  const handleRotation = async () => {
    if (!email) return;
    setIsRotating(true);
    try {
      await exportService.performRotation(email);
      setRotationNeeded(false);
      fetchInitialData(); // Refresh app
      alert('Backup enviado e sistema resetado com sucesso!');
    } catch (error) {
      console.error('Erro na rotação:', error);
      alert('Erro ao realizar backup dos dados.');
    } finally {
      setIsRotating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-background text-foreground">
        Carregando workspace...
      </div>
    );
  }

  // Calculate stats
  const totalProjects = stories.length;
  const mockTotalUsers = 1;

  // Metrics by project
  const projectMetrics = stories.map((story) => {
    const storyTasks = tasks.filter((t) => t.storyId === story.id);
    const totalCards = storyTasks.length;
    const cardsByStatus = {
      todo: storyTasks.filter((t) => t.status === 'todo').length,
      in_progress: storyTasks.filter((t) => t.status === 'in_progress').length,
      review: storyTasks.filter((t) => t.status === 'review').length,
      done: storyTasks.filter((t) => t.status === 'done').length,
      blocked: storyTasks.filter((t) => t.status === 'blocked').length,
    };
    const totalHours = storyTasks.reduce((sum, task) => sum + (task.effort || 0), 0);

    return {
      ...story,
      totalCards,
      cardsByStatus,
      totalHours,
    };
  });

  return (
    <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-2">
          <span className="text-muted-foreground text-sm font-medium">
            Total de Projetos
          </span>
          <span className="text-3xl font-bold text-foreground">{totalProjects}</span>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-2">
          <span className="text-muted-foreground text-sm font-medium">
            Total de Usuários
          </span>
          <span className="text-3xl font-bold text-foreground">{mockTotalUsers}</span>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-2">
          <span className="text-muted-foreground text-sm font-medium">
            Total de Tarefas
          </span>
          <span className="text-3xl font-bold text-foreground">{tasks.length}</span>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-2">
          <span className="text-muted-foreground text-sm font-medium">Horas Totais</span>
          <span className="text-3xl font-bold text-foreground">
            {tasks.reduce((sum, t) => sum + (t.effort || 0), 0)}h
          </span>
        </div>
      </div>

      {/* Project Breakdown */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-foreground">
          Métricas por Projeto
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projectMetrics.map((project) => (
            <div
              key={project.id}
              className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-foreground">{project.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                    {project.description}
                  </p>
                </div>
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ml-4">
                  {project.totalHours}h Totais
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-2">
                <div className="flex flex-col items-center p-2 bg-background rounded-lg border border-border">
                  <span className="text-xs text-muted-foreground mb-1">To Do</span>
                  <span className="font-bold">{project.cardsByStatus.todo}</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-background rounded-lg border border-border">
                  <span className="text-xs text-muted-foreground mb-1">In Prog</span>
                  <span className="font-bold text-blue-500">
                    {project.cardsByStatus.in_progress}
                  </span>
                </div>
                <div className="flex flex-col items-center p-2 bg-background rounded-lg border border-border">
                  <span className="text-xs text-muted-foreground mb-1">Review</span>
                  <span className="font-bold text-yellow-500">
                    {project.cardsByStatus.review}
                  </span>
                </div>
                <div className="flex flex-col items-center p-2 bg-background rounded-lg border border-border">
                  <span className="text-xs text-muted-foreground mb-1">Done</span>
                  <span className="font-bold text-green-500">
                    {project.cardsByStatus.done}
                  </span>
                </div>
                <div className="flex flex-col items-center p-2 bg-background rounded-lg border border-border">
                  <span className="text-xs text-muted-foreground mb-1">Blocked</span>
                  <span className="font-bold text-red-500">
                    {project.cardsByStatus.blocked}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Rotation Dialog */}
      <Dialog open={rotationNeeded} onOpenChange={setRotationNeeded}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rotação de Dados Necessária</DialogTitle>
            <DialogDescription>
              {rotationReason}. Para continuar, precisamos exportar os dados atuais e resetar o sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail para backup (CSV)</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleRotation} 
              disabled={!email || isRotating}
              className="w-full"
            >
              {isRotating ? 'Processando...' : 'Exportar e Resetar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
