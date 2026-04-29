import { useState } from "react";
import { ArrowLeft, Plus, ChevronLeft, ChevronRight, Clock, User, Phone, Scissors, Check, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ImportContactsModal } from "@/components/contacts/ImportContactsModal";
import { Contact } from "@/lib/vcardParser";
import { toast } from "sonner";
import { Appointment } from "@/hooks/useAppState";

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

interface AgendaPageProps {
  onBack: () => void;
  appointments: Appointment[];
  onAddAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  onUpdateStatus: (id: string, status: Appointment['status']) => void;
  getAppointmentsByDate: (date: Date) => Appointment[];
}

export function AgendaPage({ 
  onBack, 
  appointments, 
  onAddAppointment, 
  onUpdateStatus,
  getAppointmentsByDate 
}: AgendaPageProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [showImportContacts, setShowImportContacts] = useState(false);
  const [importedContacts, setImportedContacts] = useState<Contact[]>([]);

  // Form state
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const handleImportContacts = (contacts: Contact[]) => {
    setImportedContacts(prev => [...prev, ...contacts]);
    toast.success(`${contacts.length} contatos importados!`);
  };

  // Generate week days based on selected week
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

  const navigateWeek = (direction: 'prev' | 'next') => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
      return newDate;
    });
  };

  const weekDaysArray = getWeekDays();
  
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const dayAppointments = getAppointmentsByDate(selectedDate);
  const pendingCount = dayAppointments.filter(a => a.status === "pending").length;
  const confirmedCount = dayAppointments.filter(a => a.status === "confirmed" || a.status === "completed").length;

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

  const handleConfirmAppointment = (id: string) => {
    onUpdateStatus(id, 'confirmed');
    toast.success("Agendamento confirmado!");
  };

  const handleCompleteAppointment = (id: string) => {
    onUpdateStatus(id, 'completed');
    toast.success("Atendimento concluído!");
  };

  const handleCancelAppointment = (id: string) => {
    onUpdateStatus(id, 'cancelled');
    toast.error("Agendamento cancelado");
  };

  const handleAddAppointment = () => {
    if (!clientName.trim() || !appointmentDate || !appointmentTime || !selectedService || !selectedEmployee) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    onAddAppointment({
      time: appointmentTime,
      date: appointmentDate,
      client: clientName,
      phone: clientPhone,
      services: [selectedService],
      employee: selectedEmployee,
      status: 'pending',
      duration: 60,
    });

    toast.success("Agendamento criado!");
    setShowNewAppointment(false);
    setClientName("");
    setClientPhone("");
    setAppointmentDate("");
    setAppointmentTime("");
    setSelectedService("");
    setSelectedEmployee("");
  };

  // Find next appointment
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const currentTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  
  const todayAppointments = appointments.filter(apt => apt.date === todayStr);
  const nextAppointment = todayAppointments
    .filter(apt => apt.time > currentTime && apt.status !== 'cancelled')
    .sort((a, b) => a.time.localeCompare(b.time))[0];

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
            <button 
              onClick={() => navigateWeek('prev')}
              className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h2 className="font-semibold text-foreground">
              {selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </h2>
            <button 
              onClick={() => navigateWeek('next')}
              className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
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
            <p className="font-semibold text-foreground">{nextAppointment?.time || "--:--"}</p>
            <p className="text-xs text-muted-foreground truncate">{nextAppointment?.client || "Nenhum"}</p>
          </div>
          <div className="bg-card rounded-xl p-3 border border-border">
            <div className="flex items-center gap-2 mb-1">
              <User className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Total do dia</span>
            </div>
            <p className="font-semibold text-foreground">{dayAppointments.length}</p>
            <p className="text-xs text-muted-foreground">agendamentos</p>
          </div>
        </div>

        {/* Appointments List */}
        <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
          <h3 className="font-semibold text-foreground mb-3">Agendamentos</h3>
          {dayAppointments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">Nenhum agendamento</p>
              <p className="text-xs mt-1">Crie um novo agendamento!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dayAppointments.sort((a, b) => a.time.localeCompare(b.time)).map((appointment) => (
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
                        <button 
                          onClick={() => handleConfirmAppointment(appointment.id)}
                          className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center hover:bg-success/20 transition-colors"
                          title="Confirmar"
                        >
                          <Check className="h-4 w-4 text-success" />
                        </button>
                        <button 
                          onClick={() => handleCancelAppointment(appointment.id)}
                          className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center hover:bg-destructive/20 transition-colors"
                          title="Cancelar"
                        >
                          <X className="h-4 w-4 text-destructive" />
                        </button>
                      </div>
                    )}

                    {appointment.status === "confirmed" && (
                      <button 
                        onClick={() => handleCompleteAppointment(appointment.id)}
                        className="px-3 py-1.5 rounded-lg bg-success/10 text-success text-xs font-medium hover:bg-success/20 transition-colors"
                      >
                        Concluir
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* New Appointment Modal */}
      {showNewAppointment && (
        <div className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-sm flex items-end pb-[72px]">
          <div className="w-full bg-background rounded-t-3xl border-t border-border p-6 animate-slide-in-bottom max-h-[70vh] overflow-y-auto">
            <h2 className="font-bold text-lg mb-4">Novo Agendamento</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Cliente *</label>
                <input
                  type="text"
                  placeholder="Nome do cliente"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Telefone</label>
                <input
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Data *</label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Horário *</label>
                  <input
                    type="time"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Serviço *</label>
                <select 
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Selecione um serviço</option>
                  <option value="Higienização de Sofá">Higienização de Sofá</option>
                  <option value="Higienização de Colchão">Higienização de Colchão</option>
                  <option value="Higienização de Cadeiras">Higienização de Cadeiras</option>
                  <option value="Lavagem Interna Automotiva">Lavagem Interna Automotiva</option>
                  <option value="Polimento + Cristalização">Polimento + Cristalização</option>
                  <option value="Higienização de Bancos de Couro">Higienização de Bancos de Couro</option>
                  <option value="Limpeza Pós-Obra">Limpeza Pós-Obra</option>
                  <option value="Limpeza de Tapetes e Carpetes">Limpeza de Tapetes e Carpetes</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Profissional *</label>
                <select 
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Selecione um profissional</option>
                  <option value="Ana">Ana</option>
                  <option value="Carla">Carla</option>
                  <option value="Bia">Bia</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setShowNewAppointment(false)}>
                Cancelar
              </Button>
              <Button className="flex-1" onClick={handleAddAppointment}>
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
