import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useKanbanStore } from '../../store/useKanbanStore';
import { exportService } from '../../services/exportService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileDown, Mail, CheckCircle2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportModal({ open, onOpenChange }: ExportModalProps) {
  const user = useAuthStore((state) => state.user);
  const tasks = useKanbanStore((state) => state.tasks);
  const stories = useKanbanStore((state) => state.stories);
  const { toast } = useToast();

  const [exportType, setExportType] = useState<'current' | 'other'>('current');
  const [customEmail, setCustomEmail] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleExport = async () => {
    const targetEmail = exportType === 'current' ? user?.email : customEmail;
    
    if (exportType === 'other' && (!targetEmail || !targetEmail.includes('@'))) {
      toast({
        title: "E-mail inválido",
        description: "Por favor, informe um endereço de e-mail válido.",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    
    try {
      const csvContent = exportService.convertToCSV(tasks, stories);
      
      // Simulate sending email
      await exportService.sendViaEmail(targetEmail!, csvContent);
      
      // Trigger download as backup
      exportService.downloadCSV(
        csvContent, 
        `meu_relatorio_work_days_${new Date().toISOString().split('T')[0]}.csv`
      );

      setIsSuccess(true);
      toast({
        title: "Exportação concluída",
        description: `O relatório foi enviado para ${targetEmail}.`,
      });

      setTimeout(() => {
        onOpenChange(false);
        // Reset state after closing
        setTimeout(() => {
          setIsSuccess(false);
          setIsExporting(false);
          setExportType('current');
          setCustomEmail('');
        }, 300);
      }, 2000);
      
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: `Não foi possível gerar o relatório. Tente novamente. Erro: ${error}`,
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border text-foreground sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileDown className="w-5 h-5 text-primary" />
            Exportar Relatório
          </DialogTitle>
          <DialogDescription>
            Escolha como deseja receber o relatório completo das suas tarefas e projetos em formato CSV.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-10 flex flex-col items-center justify-center gap-4 text-center">
            <CheckCircle2 className="w-16 h-16 text-teal-500 animate-in zoom-in duration-300" />
            <div>
              <h4 className="text-lg font-semibold">Sucesso!</h4>
              <p className="text-sm text-muted-foreground">Relatório gerado e enviado com sucesso.</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 py-4">
            <div className="space-y-4">
              <Label>Para onde devemos enviar?</Label>
              
              <div className="grid gap-3">
                <div 
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${exportType === 'current' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-background/50 hover:border-primary/50'}`}
                  onClick={() => setExportType('current')}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${exportType === 'current' ? 'border-primary' : 'border-muted-foreground'}`}>
                    {exportType === 'current' && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Meu e-mail de login</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <Mail className={`w-4 h-4 ${exportType === 'current' ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>

                <div 
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${exportType === 'other' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-background/50 hover:border-primary/50'}`}
                  onClick={() => setExportType('other')}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${exportType === 'other' ? 'border-primary' : 'border-muted-foreground'}`}>
                    {exportType === 'other' && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Informar outro e-mail</p>
                  </div>
                  <Input 
                    placeholder="exemplo@email.com"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    disabled={exportType === 'current'}
                    className={`h-8 text-xs mt-2 ${exportType === 'other' ? 'bg-background' : 'bg-transparent border-transparent'}`}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {!isSuccess && (
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isExporting}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleExport} 
              disabled={isExporting}
              className="bg-primary text-primary-foreground min-w-[120px]"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Exportando...
                </>
              ) : (
                'Exportar e Enviar'
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
