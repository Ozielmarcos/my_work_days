import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import logo from '@/assets/favicon.png'
import { useAuthStore } from '@/store/useAuthStore'

export function DefaultLayout() {
  const { logout } = useAuthStore()
  const location = useLocation();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const getPageTitle = () => {
    if (location.pathname === '/dashboard') return 'Dashboard';
    if (location.pathname === '/projetos') return 'Projetos';
    return '';
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(document.documentElement.classList.contains('dark'));
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-foreground">
      {/* Sidebar - Matching Image Aesthetic */}
      <aside className="w-[70px] shrink-0 border-r border-border bg-card flex flex-col items-center py-6 gap-6 z-10">
        {!logo ?
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary font-bold text-sm tracking-tighter leading-none mb-4">
            MWD
          </div> :
          <img src={logo} alt='Logo My work days kanban' className='w-12 h-12 rounded-md' title='My Work Days' />
        }
        {/* Implementar após usar backend */}
        {/* <Avatar className="w-10 h-10 border border-border">
          <AvatarImage title={user?.name} src={user?.avatarUrl} />
          <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar> */}

        <nav className="flex flex-col gap-4 mt-4 w-full px-3">
          <Link to="/dashboard" title="Dashboard">
            <div
              className={`p-3 rounded-xl cursor-pointer flex justify-center transition-colors ${location.pathname === '/dashboard' ? 'bg-primary/20 text-primary' : 'hover:bg-white/5 hover:text-foreground text-muted-foreground'}`}
            >
              <LayoutDashboard className="w-5 h-5" />
            </div>
          </Link>
          <Link to="/projetos" title="Kanban Board">
            <div
              className={`p-3 rounded-xl cursor-pointer flex justify-center transition-colors ${location.pathname === '/projetos' ? 'bg-primary/20 text-primary' : 'hover:bg-white/5 hover:text-foreground text-muted-foreground'}`}
            >
              <FolderKanban className="w-5 h-5" />
            </div>
          </Link>
        </nav>

        <div
          title="Sair"
          className="mt-auto p-3 rounded-xl hover:bg-white/5 cursor-pointer text-muted-foreground flex justify-center transition-colors hover:text-foreground"
          onClick={logout}
        >
          <LogOut className="w-5 h-5" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden">
        {/* Top Navbar */}
        <header className="h-[70px] border-b border-border bg-card/40 backdrop-blur-md flex items-center justify-between px-8 shrink-0">
          <div className="flex gap-8 text-3xl font-bold">
            <h1 className="text-primary">{getPageTitle()}</h1>
          </div>
          <div className="flex items-center gap-6 text-muted-foreground">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className='hover:bg-black/90'
            >
              {isDark ? (
                <Moon className="w-5 h-5 cursor-pointer hover:text-foreground transition-colors" />
              ) : (
                <Sun className="w-5 h-5 cursor-pointer hover:text-foreground transition-colors" />
              )}
            </Button>
            {/* <Mail className="w-5 h-5 cursor-pointer hover:text-foreground transition-colors" />
            <Bell className="w-5 h-5 cursor-pointer hover:text-foreground transition-colors" /> */}
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
