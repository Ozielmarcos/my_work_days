import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { mockApi } from '../services/mockApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError('');

    try {
      const user = await mockApi.validateLogin(email, password);
      if (user) {
        login(user);
        navigate('/dashboard');
      } else {
        setError('E-mail ou senha inválidos');
      }
    } catch (err) {
      setError('Erro ao validar login');
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <Card className="w-full max-w-sm border-none bg-card/50 shadow-2xl backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-white">
            My Work Days
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Digite seu e-mail para entrar no seu workspace
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive text-center font-medium">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/50 border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder='Digite sua senha'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/50 border-border"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full text-primary-foreground">
              Entrar
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
