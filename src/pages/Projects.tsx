import { useEffect, useState } from 'react';
import { Board } from '../components/kanban/Board';
import { StorySelector } from '../components/story/StorySelector';
import { CreateTaskModal } from '../components/task/CreateTaskModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { TimeEntriesView } from '../components/time/TimeEntriesView';
import { KanbanService } from '@/services/kanbanService';
import type { Story, Task } from '@/types';

export default function Projects() {
  const [isLoading, setIsLoading] = useState(false)
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true)
        const allStories = await KanbanService.fetchInitialData()
        setStories(allStories)

        if (allStories.length > 0) {
          const firstStoryId = allStories[0].id

          setActiveStoryId(firstStoryId)

          const allTasks = await KanbanService.getStoryTasks(firstStoryId)
          setTasks(allTasks)
        }

      } catch (err) {
        console.error("Erro ao buscar stories", err)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-background text-foreground">
        Carregando workspace...
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      {/* Board Header & Controls */}
      <Tabs defaultValue="board" className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="px-8 py-6 flex flex-col gap-6 shrink-0">
          <div className="flex items-center text-sm text-muted-foreground">
            Projetos <span className="mx-2">›</span>
            <StorySelector
              stories={stories}
              setStories={setStories}
              activeStoryId={activeStoryId}
              setActiveStoryId={setActiveStoryId}
            />
          </div>

          <div className="flex items-center justify-between">
            <TabsList className="bg-background/50 border border-border">
              <TabsTrigger
                value="board"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                Kanban
              </TabsTrigger>
              <TabsTrigger
                value="time"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                Apontamentos
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setIsCreateTaskOpen(true)}
                className="text-primary-foreground font-semibold rounded-lg px-6"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Tarefa
              </Button>
            </div>
          </div>
        </div>

        {/* Tab Contents */}
        <TabsContent value="board" className="flex-1 overflow-x-auto overflow-y-hidden px-8 pb-8 mt-0 border-none p-0 outline-none">
          <Board storyId={activeStoryId} tasks={tasks} setTasks={setTasks} />
        </TabsContent>

        <TabsContent value="time" className="flex-1 overflow-hidden px-0 pb-0 mt-0 border-none p-0 outline-none">
          <TimeEntriesView storyId={activeStoryId} />
        </TabsContent>
      </Tabs>

      <CreateTaskModal
        open={isCreateTaskOpen}
        onOpenChange={setIsCreateTaskOpen}
        storyId={activeStoryId}
        setTasks={setTasks} />
    </div>
  );
}
