import { useEffect, useState } from "react";
import { useKanbanStore } from "../store/useKanbanStore";
import { useAuthStore } from "../store/useAuthStore";
import { Board } from "../components/kanban/Board";
import { StorySelector } from "../components/story/StorySelector";
import { CreateTaskModal } from "../components/task/CreateTaskModal";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, FolderKanban, Library, Contact, LogOut, Bell, Mail, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Dashboard() {
  const fetchInitialData = useKanbanStore((state) => state.fetchInitialData);
  const isLoading = useKanbanStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-background text-foreground">Carregando workspace...</div>;
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-foreground">
      {/* Sidebar - Matching Image Aesthetic */}
      <aside className="w-[70px] shrink-0 border-r border-border bg-[#0A0A0A] flex flex-col items-center py-6 gap-6 z-10">
        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary font-bold text-sm tracking-tighter leading-none mb-4">
          MWD
        </div>
        
        <Avatar className="w-10 h-10 border border-border">
          <AvatarImage src={user?.avatarUrl} />
          <AvatarFallback>{user?.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>

        <nav className="flex flex-col gap-4 mt-4 w-full px-3">
          <div className="p-3 rounded-xl hover:bg-white/5 cursor-pointer text-muted-foreground flex justify-center transition-colors">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div className="p-3 rounded-xl bg-primary/20 text-primary cursor-pointer flex justify-center transition-colors">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div className="p-3 rounded-xl hover:bg-white/5 cursor-pointer text-muted-foreground flex justify-center transition-colors">
            <Users className="w-5 h-5" />
          </div>
          <div className="p-3 rounded-xl hover:bg-white/5 cursor-pointer text-muted-foreground flex justify-center transition-colors">
            <Library className="w-5 h-5" />
          </div>
          <div className="p-3 rounded-xl hover:bg-white/5 cursor-pointer text-muted-foreground flex justify-center transition-colors">
            <Contact className="w-5 h-5" />
          </div>
        </nav>

        <div className="mt-auto p-3 rounded-xl hover:bg-white/5 cursor-pointer text-muted-foreground flex justify-center transition-colors" onClick={logout}>
          <LogOut className="w-5 h-5" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden">
        {/* Top Navbar */}
        <header className="h-[70px] border-b border-border bg-card/40 backdrop-blur-md flex items-center justify-between px-8 shrink-0">
          <div className="flex gap-8 text-sm font-medium">
            <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Dashboard</span>
            <span className="text-primary cursor-pointer">Projetos</span>
          </div>
          <div className="flex items-center gap-6 text-muted-foreground">
            <Mail className="w-5 h-5 cursor-pointer hover:text-foreground transition-colors" />
            <Bell className="w-5 h-5 cursor-pointer hover:text-foreground transition-colors" />
            <Button variant="outline" size="sm" className="bg-transparent border-border hover:bg-accent hover:text-accent-foreground text-xs rounded-full px-4 h-8">
              Configurações <span className="ml-1 text-[10px]">›</span>
            </Button>
          </div>
        </header>

        {/* Board Header & Controls */}
        <div className="px-8 py-6 flex flex-col gap-6 shrink-0">
          <div className="flex items-center text-sm text-muted-foreground">
            Projetos <span className="mx-2">›</span> 
            <StorySelector />
          </div>
          
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Kanban Board</h1>
            <div className="flex items-center gap-4">
              <Button onClick={() => setIsCreateTaskOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg px-6">
                <Plus className="w-4 h-4 mr-2" />
                Criar Tarefa
              </Button>
            </div>
          </div>
        </div>

        {/* Board Area */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden px-8 pb-8">
          <Board />
        </div>
      </main>
      
      <CreateTaskModal open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen} />
    </div>
  );
}
