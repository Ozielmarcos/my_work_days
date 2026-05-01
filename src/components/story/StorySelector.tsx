import { useKanbanStore } from '../../store/useKanbanStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
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

export function StorySelector() {
  const stories = useKanbanStore((state) => state.stories);
  const activeStoryId = useKanbanStore((state) => state.activeStoryId);
  const setActiveStory = useKanbanStore((state) => state.setActiveStory);
  const addStory = useKanbanStore((state) => state.addStory);

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateStory = () => {
    if (title.trim()) {
      addStory({ title, description });
      setTitle('');
      setDescription('');
      setIsOpen(false);
    }
  };

  return (
    <div className="items-center gap-3 inline-flex">
      <Select value={activeStoryId || undefined} onValueChange={setActiveStory}>
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
            className="py-2 px-5 bg-teal-400 rounded-full border-border hover:bg-accent text-accent-foreground"
          >
            <Plus className="w-4 h-4" /> Novo Projeto
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
    </div>
  );
}
