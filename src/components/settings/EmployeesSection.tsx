import { useState } from "react";
import { Plus, User, Phone, Mail, Percent, Edit2, Trash2, X, ToggleLeft, ToggleRight } from "lucide-react";
import type { Employee } from "@/hooks/useProfileSettings";
import { toast } from "sonner";

interface EmployeesSectionProps {
  employees: Employee[];
  onAdd: (employee: Omit<Employee, 'id' | 'createdAt'>) => void;
  onUpdate: (id: string, updates: Partial<Employee>) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

const roles = ['Técnico em Higienização', 'Especialista Estética Automotiva', 'Equipe Pós-Obra', 'Auxiliar de Limpeza', 'Motorista/Operacional', 'Atendente', 'Gerente', 'Supervisor'];
const permissions = [
  { id: 'sales', label: 'Vendas' },
  { id: 'appointments', label: 'Agendamentos' },
  { id: 'cash', label: 'Caixa' },
  { id: 'reports', label: 'Relatórios' },
];

export function EmployeesSection({ employees, onAdd, onUpdate, onDelete, onToggleStatus }: EmployeesSectionProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [commission, setCommission] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const resetForm = () => {
    setName("");
    setRole("");
    setPhone("");
    setEmail("");
    setCommission("");
    setSelectedPermissions([]);
    setEditingEmployee(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (employee: Employee) => {
    setEditingEmployee(employee);
    setName(employee.name);
    setRole(employee.role);
    setPhone(employee.phone);
    setEmail(employee.email);
    setCommission(employee.commission.toString());
    setSelectedPermissions(employee.permissions);
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!name || !role) return;

    const employeeData = {
      name,
      role,
      phone,
      email,
      commission: parseFloat(commission) || 0,
      permissions: selectedPermissions,
      isActive: true,
    };

    if (editingEmployee) {
      onUpdate(editingEmployee.id, employeeData);
      toast.success("Funcionário atualizado!");
    } else {
      onAdd(employeeData);
      toast.success("Funcionário adicionado!");
    }

    setShowModal(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    setShowDeleteConfirm(null);
    toast.success("Funcionário removido");
  };

  const togglePermission = (permId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permId) 
        ? prev.filter(p => p !== permId)
        : [...prev, permId]
    );
  };

  const activeEmployees = employees.filter(e => e.isActive);
  const inactiveEmployees = employees.filter(e => !e.isActive);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-emerald-500">{activeEmployees.length}</p>
          <p className="text-xs text-muted-foreground">Ativos</p>
        </div>
        <div className="bg-muted rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-muted-foreground">{inactiveEmployees.length}</p>
          <p className="text-xs text-muted-foreground">Inativos</p>
        </div>
      </div>

      {/* Add Button */}
      <button
        onClick={openAddModal}
        className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary hover:text-primary transition-colors"
      >
        <Plus className="h-5 w-5" />
        <span className="font-medium">Adicionar Funcionário</span>
      </button>

      {/* Employees List */}
      <div className="space-y-3">
        {employees.map(employee => (
          <div 
            key={employee.id}
            className={`bg-card border rounded-xl p-4 transition-opacity ${
              employee.isActive ? 'border-border' : 'border-border opacity-60'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                {employee.avatarUrl ? (
                  <img src={employee.avatarUrl} alt={employee.name} className="w-full h-full rounded-xl object-cover" />
                ) : (
                  <User className="h-6 w-6 text-primary" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground truncate">{employee.name}</p>
                  {!employee.isActive && (
                    <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                      Inativo
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{employee.role}</p>
              </div>

              <div className="text-right">
                <p className="font-bold text-primary">{employee.commission}%</p>
                <p className="text-xs text-muted-foreground">Comissão</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex gap-4 mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                <span>{employee.phone}</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                <span className="truncate">{employee.email}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
              <button
                onClick={() => onToggleStatus(employee.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                  employee.isActive 
                    ? 'bg-muted text-muted-foreground hover:bg-muted/80' 
                    : 'bg-emerald-500/10 text-emerald-500'
                }`}
              >
                {employee.isActive ? (
                  <><ToggleRight className="h-4 w-4" /> Desativar</>
                ) : (
                  <><ToggleLeft className="h-4 w-4" /> Ativar</>
                )}
              </button>
              <button
                onClick={() => openEditModal(employee)}
                className="p-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(employee.id)}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-sm flex items-end pb-[72px]">
          <div className="w-full bg-background rounded-t-3xl border-t border-border p-6 animate-slide-in-bottom max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">
                {editingEmployee ? 'Editar Funcionário' : 'Novo Funcionário'}
              </h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 hover:bg-muted rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Nome Completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome do funcionário"
                  className="w-full p-4 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Cargo</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-4 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Selecione o cargo</option>
                  {roles.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Telefone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full p-4 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Comissão (%)</label>
                  <input
                    type="number"
                    value={commission}
                    onChange={(e) => setCommission(e.target.value)}
                    placeholder="40"
                    min="0"
                    max="100"
                    className="w-full p-4 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                  className="w-full p-4 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Permissões</label>
                <div className="flex flex-wrap gap-2">
                  {permissions.map(perm => (
                    <button
                      key={perm.id}
                      onClick={() => togglePermission(perm.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedPermissions.includes(perm.id)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {perm.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!name || !role}
              className="w-full mt-6 py-4 bg-primary text-primary-foreground rounded-xl font-bold disabled:opacity-50"
            >
              {editingEmployee ? 'Salvar Alterações' : 'Adicionar Funcionário'}
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-sm flex items-end pb-[72px]">
          <div className="w-full bg-background rounded-t-3xl border-t border-border p-6 animate-slide-in-bottom">
            <h3 className="font-bold text-lg mb-2">Remover Funcionário</h3>
            <p className="text-muted-foreground mb-6">
              Tem certeza que deseja remover este funcionário? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-3 rounded-xl border border-border text-foreground font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 py-3 rounded-xl bg-destructive text-destructive-foreground font-medium"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
