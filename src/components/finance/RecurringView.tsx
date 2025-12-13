import { useState } from "react";
import { Plus, RefreshCw, Edit2, Trash2, X, Calendar, Check } from "lucide-react";
import type { RecurringExpense, Category, Account } from "@/hooks/usePersonalFinance";

interface RecurringViewProps {
  expenses: RecurringExpense[];
  categories: Category[];
  accounts: Account[];
  onAdd: (expense: Omit<RecurringExpense, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<RecurringExpense>) => void;
  onDelete: (id: string) => void;
}

export function RecurringView({ expenses, categories, accounts, onAdd, onUpdate, onDelete }: RecurringViewProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<RecurringExpense | null>(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [accountId, setAccountId] = useState(accounts[0]?.id || "");
  const [dueDay, setDueDay] = useState("");

  const getCategoryById = (id: string) => categories.find(c => c.id === id);
  const getAccountById = (id: string) => accounts.find(a => a.id === id);

  const resetForm = () => {
    setName("");
    setAmount("");
    setCategoryId("");
    setAccountId(accounts[0]?.id || "");
    setDueDay("");
    setEditingExpense(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (expense: RecurringExpense) => {
    setEditingExpense(expense);
    setName(expense.name);
    setAmount(expense.amount.toString());
    setCategoryId(expense.categoryId);
    setAccountId(expense.accountId);
    setDueDay(expense.dueDay.toString());
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!name || !amount || !categoryId || !dueDay) return;

    const expenseData = {
      name,
      amount: parseFloat(amount),
      categoryId,
      accountId,
      dueDay: parseInt(dueDay),
      isActive: true,
    };

    if (editingExpense) {
      onUpdate(editingExpense.id, expenseData);
    } else {
      onAdd(expenseData);
    }

    setShowModal(false);
    resetForm();
  };

  const markAsPaid = (expense: RecurringExpense) => {
    onUpdate(expense.id, { lastPaidDate: new Date() });
  };

  const toggleActive = (expense: RecurringExpense) => {
    onUpdate(expense.id, { isActive: !expense.isActive });
  };

  const now = new Date();
  const currentDay = now.getDate();

  // Sort by due day
  const sortedExpenses = [...expenses].sort((a, b) => a.dueDay - b.dueDay);

  const totalMonthly = expenses
    .filter(e => e.isActive)
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-4">
      {/* Total Card */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Mensal Fixo</p>
            <p className="text-2xl font-bold text-foreground">
              R$ {totalMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <RefreshCw className="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>

      {/* Add Button */}
      <button
        onClick={openAddModal}
        className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-2xl text-muted-foreground hover:border-primary hover:text-primary transition-colors"
      >
        <Plus className="h-5 w-5" />
        <span className="font-medium">Nova Despesa Fixa</span>
      </button>

      {/* Empty State */}
      {expenses.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Nenhuma despesa fixa cadastrada</p>
          <p className="text-sm">Adicione suas contas recorrentes</p>
        </div>
      )}

      {/* Expenses List */}
      <div className="space-y-3">
        {sortedExpenses.map(expense => {
          const category = getCategoryById(expense.categoryId);
          const account = getAccountById(expense.accountId);
          const isPaid = expense.lastPaidDate && 
            new Date(expense.lastPaidDate).getMonth() === now.getMonth() &&
            new Date(expense.lastPaidDate).getFullYear() === now.getFullYear();
          const isOverdue = !isPaid && expense.dueDay < currentDay;
          const isDueSoon = !isPaid && expense.dueDay >= currentDay && expense.dueDay <= currentDay + 3;

          return (
            <div 
              key={expense.id}
              className={`bg-card border rounded-2xl p-4 transition-colors ${
                !expense.isActive ? 'opacity-50 border-border' :
                isOverdue ? 'border-red-500' :
                isDueSoon ? 'border-yellow-500' :
                isPaid ? 'border-emerald-500' :
                'border-border'
              }`}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: category?.color || '#64748b' }}
                >
                  {expense.name.charAt(0)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground truncate">{expense.name}</p>
                    {isPaid && (
                      <span className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full">
                        Pago
                      </span>
                    )}
                    {isOverdue && (
                      <span className="text-xs px-2 py-0.5 bg-red-500/10 text-red-500 rounded-full">
                        Vencido
                      </span>
                    )}
                    {isDueSoon && (
                      <span className="text-xs px-2 py-0.5 bg-yellow-500/10 text-yellow-500 rounded-full">
                        Próximo
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Vence dia {expense.dueDay} • {account?.name}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="font-bold text-red-500">
                    R$ {expense.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                {!isPaid && expense.isActive && (
                  <button
                    onClick={() => markAsPaid(expense)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-500/10 text-emerald-500 rounded-xl font-medium text-sm"
                  >
                    <Check className="h-4 w-4" />
                    Marcar como Pago
                  </button>
                )}
                <button
                  onClick={() => toggleActive(expense)}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <RefreshCw className={`h-4 w-4 ${expense.isActive ? '' : 'line-through'}`} />
                </button>
                <button
                  onClick={() => openEditModal(expense)}
                  className="p-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(expense.id)}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-sm flex items-end pb-[72px]">
          <div className="w-full bg-background rounded-t-3xl border-t border-border p-6 animate-slide-in-bottom max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">
                {editingExpense ? 'Editar Despesa Fixa' : 'Nova Despesa Fixa'}
              </h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 hover:bg-muted rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Nome</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Aluguel, Netflix, Academia..."
                  className="w-full p-4 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Valor Mensal</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0,00"
                    className="w-full pl-12 pr-4 py-4 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Due Day */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Dia do Vencimento</label>
                <input
                  type="number"
                  value={dueDay}
                  onChange={(e) => setDueDay(e.target.value)}
                  placeholder="10"
                  min="1"
                  max="31"
                  className="w-full p-4 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Categoria</label>
                <div className="grid grid-cols-4 gap-2">
                  {categories.filter(c => c.type === 'expense' || c.type === 'both').slice(0, 8).map(category => (
                    <button
                      key={category.id}
                      onClick={() => setCategoryId(category.id)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-colors ${
                        categoryId === category.id 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs"
                        style={{ backgroundColor: category.color }}
                      >
                        {category.name.charAt(0)}
                      </div>
                      <span className="text-xs text-foreground truncate w-full text-center">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Account */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Conta</label>
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full p-4 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {accounts.map(account => (
                    <option key={account.id} value={account.id}>{account.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!name || !amount || !categoryId || !dueDay}
              className="w-full mt-6 py-4 bg-primary text-primary-foreground rounded-xl font-bold disabled:opacity-50"
            >
              {editingExpense ? 'Salvar Alterações' : 'Adicionar Despesa'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
