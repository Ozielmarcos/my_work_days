import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Trash, Download } from 'lucide-react';
import { ExportModal } from '../export/ExportModal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { KanbanService } from '@/services/kanbanService';
import type { Story } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface IStorySelectorProps {
  stories: Story[]
  setStories: React.Dispatch<React.SetStateAction<Story[]>>
  activeStoryId: string | null
  setActiveStoryId: (id: string) => void
}

export function StorySelector({
  stories,
  activeStoryId,
  setActiveStoryId,
  setStories }: IStorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { toast } = useToast()


  const handleCreateStory = async () => {
    if (title.trim()) {
      const newStory = await KanbanService.createStory({ title, description })
      setStories(prev => [...prev, newStory])
      setActiveStoryId(newStory.id)
      setTitle('');
      setDescription('');
      setIsOpen(false);
    }
  };

  const handleDeleteStory = () => {
    if (!activeStoryId) return;
    const story = stories.find(s => s.id === activeStoryId);
    if (story && window.confirm(
      `Deseja realmente excluir o projeto "${story.title}"?` +
      `Todas as tarefas associadas serão removidas.`)) {
      try {
        KanbanService.removeStory(activeStoryId);
        const updateStoryList = stories.filter(s => s.id !== activeStoryId);
        setStories(updateStoryList)

        if (updateStoryList.length > 0) {
          setActiveStoryId(updateStoryList[0].id)
        } else {
          setActiveStoryId(null)
        }
      } catch (err) {
        toast({
          title: "Erro ao excluir projeto",
          description: "Tente novamente mais tarde",
          variant: "destructive"
        })
      }
    }
  };

  return (
    <div className="items-center gap-3 inline-flex">
      <Select value={activeStoryId || undefined}
        onValueChange={(value) => setActiveStoryId(value as string)}>
        <SelectTrigger className="w-[280px] bg-card/50 border-border h-8 text-sm">
          <SelectValue placeholder="Selecione um projeto..." />
        </SelectTrigger>
        <SelectContent className="bg-card border-border text-foreground">
          {stories.map((story) => (
            <SelectItem key={story.id} value={story.id}>
              {story.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="py-2 px-5 bg-teal-500 hover:bg-teal-600 rounded-full border-none text-white font-medium transition-all shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" /> Novo Projeto
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-card border-border text-foreground sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crie um novo projeto</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-background/50 border-border"
                placeholder="Carrinho de compras MVP"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="desc">Descrição</Label>
              <Input
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-background/50 border-border"
                placeholder="Descrição curta do projeto"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateStory} className="text-primary-foreground">
              Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {activeStoryId && (
        <Button
          onClick={handleDeleteStory}
          variant="destructive"
          title="Excluir projeto selecionado"
          className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg p-2 transition-all border-none"
        >
          <Trash className="w-4 h-4" />
        </Button>
      )}

      <Button
        onClick={() => setIsExportOpen(true)}
        variant="outline"
        title="Exportar dados (CSV)"
        className="bg-card/50 border-border text-muted-foreground hover:text-primary hover:border-primary/50 rounded-lg p-2 transition-all"
      >
        <Download className="w-4 h-4" />
      </Button>

      <ExportModal
        open={isExportOpen}
        onOpenChange={setIsExportOpen}
      />
    </div>
  );
}
