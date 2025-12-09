import { useState } from "react";
import { ArrowLeft, Plus, ChevronLeft, ChevronRight, Clock, User, Phone, Scissors, Check, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ImportContactsModal } from "@/components/contacts/ImportContactsModal";
import { Contact } from "@/lib/vcardParser";
import { toast } from "sonner";

interface Appointment {
  id: string;
  time: string;
  client: string;
  phone: string;
  services: string[];
  employee: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  duration: number; // in minutes
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    time: "09:00",
    client: "Maria Silva",
    phone: "(11) 99999-1234",
    services: ["Corte Feminino", "Escova"],
    employee: "Ana",
    status: "completed",
    duration: 90
  },
  {
    id: "2",
    time: "10:30",
    client: "Julia Costa",
    phone: "(11) 98888-5678",
    services: ["Coloração"],
    employee: "Carla",
    status: "completed",
    duration: 120
  },
  {
    id: "3",
    time: "14:00",
    client: "Fernanda Lima",
    phone: "(11) 97777-9012",
    services: ["Manicure", "Pedicure"],
    employee: "Bia",
    status: "confirmed",
    duration: 60
  },
  {
    id: "4",
    time: "15:30",
    client: "Patrícia Souza",
    phone: "(11) 96666-3456",
    services: ["Hidratação"],
    employee: "Ana",
    status: "pending",
    duration: 45
  },
  {
    id: "5",
    time: "17:00",
    client: "Camila Rocha",
    phone: "(11) 95555-7890",
    services: ["Corte + Escova"],
    employee: "Carla",
    status: "pending",
    duration: 90
  },
];

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

interface AgendaPageProps {
  onBack: () => void;
}

export function AgendaPage({ onBack }: AgendaPageProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [showImportContacts, setShowImportContacts] = useState(false);
  const [importedContacts, setImportedContacts] = useState<Contact[]>([]);

  const handleImportContacts = (contacts: Contact[]) => {
    setImportedContacts(prev => [...prev, ...contacts]);
    toast.success(`${contacts.length} contatos importados!`);
  };

  // Generate week days
  const getWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDaysArray = getWeekDays();
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const pendingCount = mockAppointments.filter(a => a.status === "pending").length;
  const confirmedCount = mockAppointments.filter(a => a.status === "confirmed" || a.status === "completed").length;

  const getStatusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "completed": return "bg-success/10 text-success border-success/20";
      case "confirmed": return "bg-primary/10 text-primary border-primary/20";
      case "pending": return "bg-warning/10 text-warning-foreground border-warning/20";
      case "cancelled": return "bg-destructive/10 text-destructive border-destructive/20";
    }
  };

  const getStatusLabel = (status: Appointment["status"]) => {
    switch (status) {
      case "completed": return "Concluído";
      case "confirmed": return "Confirmado";
      case "pending": return "Pendente";
      case "cancelled": return "Cancelado";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={onBack} className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-lg text-foreground">Agenda</h1>
            <p className="text-xs text-muted-foreground">
              {confirmedCount} confirmados, {pendingCount} pendentes
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={() => setShowImportContacts(true)}>
            <Upload className="h-4 w-4" />
          </Button>
          <Button size="sm" onClick={() => setShowNewAppointment(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Novo
          </Button>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {/* Week Calendar */}
        <div className="bg-card rounded-2xl border border-border p-4 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <button className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h2 className="font-semibold text-foreground">
              {selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </h2>
            <button className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {weekDaysArray.map((day, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "flex flex-col items-center py-2 rounded-xl transition-all",
                  isSelected(day) && "gradient-primary text-primary-foreground shadow-salon",
                  !isSelected(day) && isToday(day) && "bg-primary/10",
                  !isSelected(day) && !isToday(day) && "hover:bg-muted"
                )}
              >
                <span className={cn(
                  "text-[10px] font-medium mb-1",
                  isSelected(day) ? "text-primary-foreground/80" : "text-muted-foreground"
                )}>
                  {weekDays[day.getDay()]}
                </span>
                <span className={cn(
                  "text-sm font-bold",
                  isSelected(day) ? "text-primary-foreground" : "text-foreground"
                )}>
                  {day.getDate()}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Today Stats */}
        <div className="grid grid-cols-2 gap-3 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="bg-card rounded-xl p-3 border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Próximo</span>
            </div>
            <p className="font-semibold text-foreground">14:00</p>
            <p className="text-xs text-muted-foreground truncate">Fernanda Lima</p>
          </div>
          <div className="bg-card rounded-xl p-3 border border-border">
            <div className="flex items-center gap-2 mb-1">
              <User className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Total do dia</span>
            </div>
            <p className="font-semibold text-foreground">{mockAppointments.length}</p>
            <p className="text-xs text-muted-foreground">agendamentos</p>
          </div>
        </div>

        {/* Appointments List */}
        <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
          <h3 className="font-semibold text-foreground mb-3">Agendamentos</h3>
          <div className="space-y-3">
            {mockAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-card rounded-xl border border-border p-4 hover:shadow-salon transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-foreground">{appointment.time}</span>
                    <span className="text-[10px] text-muted-foreground">{appointment.duration}min</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground truncate">{appointment.client}</h4>
                      <span className={cn(
                        "text-[10px] font-medium px-2 py-0.5 rounded-full border",
                        getStatusColor(appointment.status)
                      )}>
                        {getStatusLabel(appointment.status)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Phone className="h-3 w-3" />
                      <span>{appointment.phone}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Scissors className="h-3 w-3 text-primary" />
                      <span className="text-xs text-foreground">{appointment.services.join(", ")}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{appointment.employee}</span>
                    </div>
                  </div>

                  {appointment.status === "pending" && (
                    <div className="flex gap-1">
                      <button className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center hover:bg-success/20 transition-colors">
                        <Check className="h-4 w-4 text-success" />
                      </button>
                      <button className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center hover:bg-destructive/20 transition-colors">
                        <X className="h-4 w-4 text-destructive" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* New Appointment Modal */}
      {showNewAppointment && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end">
          <div className="w-full bg-background rounded-t-3xl border-t border-border p-6 animate-slide-in-bottom safe-bottom max-h-[80vh] overflow-y-auto">
            <h2 className="font-bold text-lg mb-4">Novo Agendamento</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Cliente</label>
                <input
                  type="text"
                  placeholder="Nome do cliente"
                  className="w-full h-12 px-4 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Telefone</label>
                <input
                  type="tel"
                  placeholder="(11) 99999-9999"
                  className="w-full h-12 px-4 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Data</label>
                  <input
                    type="date"
                    className="w-full h-12 px-4 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Horário</label>
                  <input
                    type="time"
                    className="w-full h-12 px-4 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Serviço</label>
                <select className="w-full h-12 px-4 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Selecione um serviço</option>
                  <option>Corte Feminino</option>
                  <option>Corte Masculino</option>
                  <option>Coloração</option>
                  <option>Escova</option>
                  <option>Manicure</option>
                  <option>Pedicure</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Profissional</label>
                <select className="w-full h-12 px-4 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Selecione um profissional</option>
                  <option>Ana</option>
                  <option>Carla</option>
                  <option>Bia</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setShowNewAppointment(false)}>
                Cancelar
              </Button>
              <Button className="flex-1" onClick={() => setShowNewAppointment(false)}>
                Agendar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Import Contacts Modal */}
      <ImportContactsModal
        isOpen={showImportContacts}
        onClose={() => setShowImportContacts(false)}
        onImport={handleImportContacts}
      />
    </div>
  );
}
