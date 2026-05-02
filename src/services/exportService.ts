import type { Task, Story } from '../types';
import { fileDatabase } from './fileDatabase';

export const exportService = {
  /**
   * Converts tasks to CSV format with detailed information.
   */
  convertToCSV: (tasks: Task[], stories: Story[]): string => {
    const headers = ['Projeto', 'Tarefa', 'Descrição', 'Status', 'Prioridade', 'Esforço Estimado (h)', 'Total Gasto (h)', 'Criado em'];
    
    const rows = tasks.map(t => {
      const story = stories.find(s => s.id === t.storyId);
      return [
        `"${(story?.title || 'N/A').replace(/"/g, '""')}"`,
        `"${t.title.replace(/"/g, '""')}"`,
        `"${(t.description || '').replace(/"/g, '""')}"`,
        t.status,
        t.priority,
        t.effort.toFixed(2),
        (t.spentHours || 0).toFixed(2),
        new Date(t.createdAt).toLocaleDateString()
      ];
    });

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  },

  /**
   * Triggers a browser download of the CSV content.
   */
  downloadCSV: (csvContent: string, fileName: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  /**
   * Simulates sending an email with the CSV attachment.
   */
  sendViaEmail: async (email: string, csvContent: string): Promise<boolean> => {
    console.log(`[SIMULATION] Sending email to ${email}...${csvContent}`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`[SIMULATION] Email sent successfully to ${email}`);
        resolve(true);
      }, 1500);
    });
  },

  /**
   * Full rotation flow.
   */
  performRotation: async (email: string): Promise<void> => {
    const data = await fileDatabase.loadData();
    const csvContent = exportService.convertToCSV(data.tasks, data.stories);
    
    const sent = await exportService.sendViaEmail(email, csvContent);
    
    if (sent) {
      exportService.downloadCSV(csvContent, `work_days_backup_${new Date().toISOString().split('T')[0]}.csv`);
      await fileDatabase.resetDatabase();
    }
  }
};
