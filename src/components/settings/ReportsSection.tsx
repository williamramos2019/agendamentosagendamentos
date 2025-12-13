import { useState } from "react";
import { FileText, Users, Calendar, DollarSign, Download, Filter, FileSpreadsheet, File } from "lucide-react";
import { toast } from "sonner";

type ReportType = 'clients' | 'appointments' | 'financial' | 'employees';
type ExportFormat = 'pdf' | 'excel' | 'csv';

export function ReportsSection() {
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [format, setFormat] = useState<ExportFormat>('pdf');

  const reports = [
    { id: 'clients' as ReportType, label: 'Clientes', icon: Users, description: 'Lista de clientes cadastrados' },
    { id: 'appointments' as ReportType, label: 'Agendamentos', icon: Calendar, description: 'Histórico de agendamentos' },
    { id: 'financial' as ReportType, label: 'Financeiro', icon: DollarSign, description: 'Receitas e despesas' },
    { id: 'employees' as ReportType, label: 'Funcionários', icon: Users, description: 'Desempenho da equipe' },
  ];

  const formats = [
    { id: 'pdf' as ExportFormat, label: 'PDF', icon: File },
    { id: 'excel' as ExportFormat, label: 'Excel', icon: FileSpreadsheet },
    { id: 'csv' as ExportFormat, label: 'CSV', icon: FileText },
  ];

  const handleExport = () => {
    if (!selectedReport || !startDate || !endDate) {
      toast.error("Selecione o relatório e o período");
      return;
    }

    // Simulate export
    toast.success(`Relatório exportado em ${format.toUpperCase()}!`);
  };

  return (
    <div className="space-y-6">
      {/* Report Type Selection */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Tipo de Relatório
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {reports.map(report => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-colors ${
                selectedReport === report.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <report.icon className={`h-6 w-6 ${
                selectedReport === report.id ? 'text-primary' : 'text-muted-foreground'
              }`} />
              <span className="font-medium text-sm text-foreground">{report.label}</span>
              <span className="text-xs text-muted-foreground text-center">{report.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Período
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Data Inicial</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-4 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Data Final</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-4 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex gap-2 mt-3">
          {['7 dias', '30 dias', '90 dias', 'Ano'].map((label, idx) => {
            const days = [7, 30, 90, 365][idx];
            return (
              <button
                key={label}
                onClick={() => {
                  const end = new Date();
                  const start = new Date();
                  start.setDate(start.getDate() - days);
                  setStartDate(start.toISOString().split('T')[0]);
                  setEndDate(end.toISOString().split('T')[0]);
                }}
                className="flex-1 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-medium hover:bg-muted/80 transition-colors"
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Export Format */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Formato de Exportação
        </h3>
        <div className="flex gap-2">
          {formats.map(f => (
            <button
              key={f.id}
              onClick={() => setFormat(f.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-colors ${
                format === f.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/50'
              }`}
            >
              <f.icon className="h-5 w-5" />
              <span className="font-medium">{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      {selectedReport && (
        <div className="bg-muted/50 rounded-xl p-4">
          <h4 className="font-medium text-foreground mb-2">Prévia do Relatório</h4>
          <p className="text-sm text-muted-foreground">
            Relatório de <strong>{reports.find(r => r.id === selectedReport)?.label}</strong>
            {startDate && endDate && (
              <> no período de <strong>{new Date(startDate).toLocaleDateString('pt-BR')}</strong> a <strong>{new Date(endDate).toLocaleDateString('pt-BR')}</strong></>
            )}
            {format && <> em formato <strong>{format.toUpperCase()}</strong></>}
          </p>
        </div>
      )}

      {/* Export Button */}
      <button
        onClick={handleExport}
        disabled={!selectedReport || !startDate || !endDate}
        className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground rounded-xl font-bold disabled:opacity-50"
      >
        <Download className="h-5 w-5" />
        Exportar Relatório
      </button>

      {/* Info */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <p className="text-sm text-blue-600 dark:text-blue-400">
          <strong>Dica:</strong> Os relatórios são gerados com base nos dados registrados no sistema. 
          Para dados mais precisos, mantenha suas informações atualizadas.
        </p>
      </div>
    </div>
  );
}
