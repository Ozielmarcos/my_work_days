import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { useAuthStore } from './store/useAuthStore';
import { Toaster } from '@/components/ui/toaster';
import Projects from './pages/Projects';
import { DefaultLayout } from './components/layout/DefaultLayout';

// Setup dark mode by default
function ThemeSetup({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);
  return <>{children}</>;
}

export default function App() {
  const user = useAuthStore((state) => state.user);

  return (
    <ThemeSetup>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route element={user ? <DefaultLayout /> : <Navigate to="/" replace />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projetos" element={<Projects />} />
        </Route>
      </Routes>
      <Toaster />
    </ThemeSetup>
  );
}
