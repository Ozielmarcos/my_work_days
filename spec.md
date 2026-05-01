Crie uma aplicação frontend chamada “My Work Days”, que funcione como um sistema Kanban de tarefas vinculado a histórias, com foco em uso diário em uma software house.

Stack obrigatória
React (sem frameworks como Next.js)
TypeScript
Tailwind CSS
shadcn/ui para componentes visuais
React DnD ou @dnd-kit para drag and drop
Gerenciamento de estado simples (Context API ou Zustand)
Objetivo da aplicação

Permitir que o usuário:

Faça login (mockado)
Crie histórias
Crie tarefas vinculadas a uma história
Visualize tarefas em um quadro Kanban
Arraste tarefas entre colunas (status)
Telas obrigatórias
1. Tela de Login
Campos:
Email
Senha
Botão de login
Não precisa autenticação real (mockar)
Ao logar → redirecionar para /dashboard
Armazenar usuário fake em localStorage
2. Dashboard (Kanban)

Estrutura principal da aplicação.

Colunas (status das tarefas):
A Fazer
Em Andamento
Em Revisão
Feito
Bloqueado

Cada coluna deve:

Exibir cards de tarefas
Permitir drag and drop entre colunas
Atualizar o status da tarefa ao mover
Modelos de dados (mock)
Usuário
type User = {
  id: string;
  name: string;
  email: string;
};
História
type Story = {
  id: string;
  title: string;
  description: string;
};
Tarefa
type Task = {
  id: string;
  storyId: string;
  title: string;
  description: string;
  effort: number; // estimativa (ex: horas ou pontos)
  status: "todo" | "in_progress" | "review" | "done" | "blocked";
  priority: "low" | "medium" | "high"; // adicional
  createdAt: string;
};
Funcionalidades obrigatórias
Histórias
Criar nova história
Listar histórias
Selecionar uma história ativa
Filtrar tarefas pela história selecionada
Tarefas
Criar tarefa vinculada a uma história
Editar tarefa
Excluir tarefa
Visualizar detalhes da tarefa (modal ou drawer)
Drag and Drop
Implementar movimentação entre colunas
Ao soltar:
Atualizar status no estado global
Persistir em localStorage
Componentes (usar shadcn/ui)

Utilizar os componentes da shadcn sempre que possível:

Button
Input
Card
Dialog (modal)
Select
Badge
Toast (feedback de ações)
Estrutura de pastas

Organizar o projeto assim:

src/
  components/
    ui/
    kanban/
    story/
    task/
  pages/
    Login.tsx
    Dashboard.tsx
  hooks/
  store/
  services/
  mock/
  types/
  utils/
Mock de dados

Criar dados iniciais simulando uso real:

1 usuário logado
2 a 3 histórias
8 a 12 tarefas distribuídas entre os status

Persistir tudo em:

localStorage

Criar um serviço fake:

services/mockApi.ts

Com funções como:

getStories()
getTasks()
createTask()
updateTask()
moveTask()
UI/UX
Layout responsivo
Dashboard com scroll horizontal
Cards com:
título
esforço
prioridade (badge colorido)
Destaque visual por status
Feedback ao mover tarefa
Extras (se possível)
Filtro por prioridade
Contador de tarefas por coluna
Tema dark/light
Requisitos importantes
Código limpo e organizado
Componentização reutilizável
Tipagem forte com TypeScript
Evitar complexidade desnecessária
Não usar backend real
Tudo deve funcionar de forma isolada
Resultado esperado

Uma aplicação frontend funcional onde seja possível:

Fazer login (mock)
Criar histórias
Criar tarefas
Visualizar em um Kanban
Arrastar tarefas entre colunas
Simular fluxo real de trabalho diário