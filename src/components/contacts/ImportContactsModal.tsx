import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, FileText, CheckCircle, AlertCircle, User, Phone, Mail, Building } from 'lucide-react';
import { parseVCard, Contact } from '@/lib/vcardParser';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';

interface ImportContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (contacts: Contact[]) => void;
}

type ImportStep = 'upload' | 'preview' | 'success';

export function ImportContactsModal({ isOpen, onClose, onImport }: ImportContactsModalProps) {
  const [step, setStep] = useState<ImportStep>('upload');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Set<number>>(new Set());
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.vcf')) {
      setError('Por favor, selecione um arquivo .vcf válido');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Arquivo muito grande. Máximo 5MB');
      return;
    }

    setError('');
    setFileName(file.name);

    try {
      const content = await file.text();
      const parsedContacts = parseVCard(content);

      if (parsedContacts.length === 0) {
        setError('Nenhum contato encontrado no arquivo');
        return;
      }

      setContacts(parsedContacts);
      setSelectedContacts(new Set(parsedContacts.map((_, i) => i)));
      setStep('preview');
    } catch (err) {
      setError('Erro ao ler o arquivo. Verifique se é um vCard válido.');
    }
  };

  const toggleContact = (index: number) => {
    const newSelected = new Set(selectedContacts);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedContacts(newSelected);
  };

  const toggleAll = () => {
    if (selectedContacts.size === contacts.length) {
      setSelectedContacts(new Set());
    } else {
      setSelectedContacts(new Set(contacts.map((_, i) => i)));
    }
  };

  const handleImport = () => {
    const contactsToImport = contacts.filter((_, i) => selectedContacts.has(i));
    onImport(contactsToImport);
    setStep('success');
    toast.success(`${contactsToImport.length} contatos importados com sucesso!`);
  };

  const handleClose = () => {
    setStep('upload');
    setContacts([]);
    setSelectedContacts(new Set());
    setFileName('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Importar Contatos
          </DialogTitle>
          <DialogDescription>
            {step === 'upload' && 'Selecione um arquivo vCard (.vcf) do seu dispositivo'}
            {step === 'preview' && 'Selecione os contatos que deseja importar'}
            {step === 'success' && 'Importação concluída!'}
          </DialogDescription>
        </DialogHeader>

        {step === 'upload' && (
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".vcf"
              onChange={handleFileSelect}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-40 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                <FileText className="h-7 w-7 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground">Toque para selecionar</p>
                <p className="text-sm text-muted-foreground">arquivo .vcf (máx. 5MB)</p>
              </div>
            </button>

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
              <p className="font-medium mb-1">Como exportar contatos do Android:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Abra o app Contatos</li>
                <li>Menu → Exportar</li>
                <li>Escolha "Exportar para .vcf"</li>
                <li>Salve e selecione aqui</li>
              </ol>
            </div>
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {fileName} • {contacts.length} contatos
              </span>
              <Button variant="ghost" size="sm" onClick={toggleAll}>
                {selectedContacts.size === contacts.length ? 'Desmarcar todos' : 'Selecionar todos'}
              </Button>
            </div>

            <ScrollArea className="h-64 pr-4">
              <div className="space-y-2">
                {contacts.map((contact, index) => (
                  <div
                    key={index}
                    onClick={() => toggleContact(index)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedContacts.has(index)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedContacts.has(index)}
                        onCheckedChange={() => toggleContact(index)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="font-medium truncate">{contact.name}</span>
                        </div>
                        {contact.phone && (
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3 shrink-0" />
                            <span className="truncate">{contact.phone}</span>
                          </div>
                        )}
                        {contact.email && (
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3 shrink-0" />
                            <span className="truncate">{contact.email}</span>
                          </div>
                        )}
                        {contact.organization && (
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <Building className="h-3 w-3 shrink-0" />
                            <span className="truncate">{contact.organization}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep('upload')}>
                Voltar
              </Button>
              <Button
                className="flex-1"
                disabled={selectedContacts.size === 0}
                onClick={handleImport}
              >
                Importar ({selectedContacts.size})
              </Button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-medium text-lg">Importação concluída!</p>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedContacts.size} contatos foram adicionados
              </p>
            </div>
            <Button onClick={handleClose} className="w-full">
              Fechar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
