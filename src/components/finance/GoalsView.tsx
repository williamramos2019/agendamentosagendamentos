import { useState } from "react";
import { Plus, Target, Edit2, Trash2, X, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { FinancialGoal } from "@/hooks/usePersonalFinance";

interface GoalsViewProps {
  goals: FinancialGoal[];
  onAdd: (goal: Omit<FinancialGoal, 'id' | 'createdAt'>) => void;
  onUpdate: (id: string, updates: Partial<FinancialGoal>) => void;
  onDelete: (id: string) => void;
}

const goalColors = [
  '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#eab308'
];

export function GoalsView({ goals, onAdd, onUpdate, onDelete }: GoalsViewProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);
  const [showAddValueModal, setShowAddValueModal] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [color, setColor] = useState(goalColors[0]);
  const [addValue, setAddValue] = useState("");

  const resetForm = () => {
    setName("");
    setTargetAmount("");
    setCurrentAmount("");
    setDeadline("");
    setColor(goalColors[0]);
    setEditingGoal(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (goal: FinancialGoal) => {
    setEditingGoal(goal);
    setName(goal.name);
    setTargetAmount(goal.targetAmount.toString());
    setCurrentAmount(goal.currentAmount.toString());
    setDeadline(goal.deadline.toISOString().split('T')[0]);
    setColor(goal.color);
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!name || !targetAmount || !deadline) return;

    const goalData = {
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount) || 0,
      deadline: new Date(deadline),
      color,
    };

    if (editingGoal) {
      onUpdate(editingGoal.id, goalData);
    } else {
      onAdd(goalData);
    }

    setShowModal(false);
    resetForm();
  };

  const handleAddValue = (goalId: string) => {
    const value = parseFloat(addValue);
    if (!value) return;

    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      onUpdate(goalId, { currentAmount: goal.currentAmount + value });
    }
    
    setShowAddValueModal(null);
    setAddValue("");
  };

  return (
    <div className="space-y-4">
      {/* Add Goal Button */}
      <button
        onClick={openAddModal}
        className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-2xl text-muted-foreground hover:border-primary hover:text-primary transition-colors"
      >
        <Plus className="h-5 w-5" />
        <span className="font-medium">Nova Meta</span>
      </button>

      {/* Empty State */}
      {goals.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Nenhuma meta criada</p>
          <p className="text-sm">Crie metas para acompanhar seus objetivos financeiros</p>
        </div>
      )}

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map(goal => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const remaining = goal.targetAmount - goal.currentAmount;
          const isCompleted = progress >= 100;

          return (
            <div 
              key={goal.id}
              className="bg-card border border-border rounded-2xl p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${goal.color}20` }}
                  >
                    <Target className="h-6 w-6" style={{ color: goal.color }} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{goal.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Até {format(new Date(goal.deadline), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEditModal(goal)}
                    className="p-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(goal.id)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className="font-medium text-foreground">{Math.min(progress, 100).toFixed(0)}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ 
                      width: `${Math.min(progress, 100)}%`, 
                      backgroundColor: goal.color 
                    }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground font-medium">
                    R$ {goal.currentAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-muted-foreground">
                    de R$ {goal.targetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Status and Action */}
              {isCompleted ? (
                <div className="flex items-center gap-2 p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                  <TrendingUp className="h-5 w-5" />
                  <span className="font-medium">Meta alcançada! 🎉</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex-1 text-sm text-muted-foreground">
                    Faltam R$ {remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <button
                    onClick={() => setShowAddValueModal(goal.id)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium text-sm"
                  >
                    Adicionar Valor
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-sm flex items-end pb-[72px]">
          <div className="w-full bg-background rounded-t-3xl border-t border-border p-6 animate-slide-in-bottom max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">
                {editingGoal ? 'Editar Meta' : 'Nova Meta'}
              </h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 hover:bg-muted rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Nome da Meta</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Reserva de emergência, Viagem..."
                  className="w-full p-4 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Target Amount */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Valor da Meta</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="10.000,00"
                    className="w-full pl-12 pr-4 py-4 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Current Amount */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Valor Atual (opcional)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                    placeholder="0,00"
                    className="w-full pl-12 pr-4 py-4 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Deadline */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Prazo</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full p-4 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Color */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Cor</label>
                <div className="flex gap-2">
                  {goalColors.map(c => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-10 h-10 rounded-xl transition-all ${
                        color === c ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!name || !targetAmount || !deadline}
              className="w-full mt-6 py-4 bg-primary text-primary-foreground rounded-xl font-bold disabled:opacity-50"
            >
              {editingGoal ? 'Salvar Alterações' : 'Criar Meta'}
            </button>
          </div>
        </div>
      )}

      {/* Add Value Modal */}
      {showAddValueModal && (
        <div className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-sm flex items-end pb-[72px]">
          <div className="w-full bg-background rounded-t-3xl border-t border-border p-6 animate-slide-in-bottom">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Adicionar Valor</h2>
              <button onClick={() => { setShowAddValueModal(null); setAddValue(""); }} className="p-2 hover:bg-muted rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
              <input
                type="text"
                inputMode="decimal"
                value={addValue}
                onChange={(e) => setAddValue(e.target.value)}
                placeholder="0,00"
                className="w-full pl-12 pr-4 py-4 text-xl font-bold bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
            </div>

            <button
              onClick={() => handleAddValue(showAddValueModal)}
              disabled={!addValue}
              className="w-full mt-4 py-4 bg-primary text-primary-foreground rounded-xl font-bold disabled:opacity-50"
            >
              Adicionar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
