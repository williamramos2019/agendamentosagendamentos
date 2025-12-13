import { useState } from "react";
import { X, TrendingUp, TrendingDown, Wallet, Building2, CreditCard, Banknote } from "lucide-react";
import type { Category, Account, Transaction } from "@/hooks/usePersonalFinance";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'income' | 'expense';
  onTypeChange: (type: 'income' | 'expense') => void;
  categories: Category[];
  accounts: Account[];
  onAdd: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
}

const paymentMethods = [
  { id: 'cash', label: 'Dinheiro', icon: Banknote },
  { id: 'pix', label: 'Pix', icon: Wallet },
  { id: 'debit', label: 'Débito', icon: Building2 },
  { id: 'credit', label: 'Crédito', icon: CreditCard },
] as const;

export function AddTransactionModal({ 
  isOpen, 
  onClose, 
  type, 
  onTypeChange,
  categories, 
  accounts, 
  onAdd 
}: AddTransactionModalProps) {
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [accountId, setAccountId] = useState(accounts[0]?.id || "");
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'pix' | 'debit' | 'credit'>('pix');
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [installments, setInstallments] = useState(1);

  const filteredCategories = categories.filter(c => c.type === type || c.type === 'both');

  const resetForm = () => {
    setAmount("");
    setCategoryId("");
    setAccountId(accounts[0]?.id || "");
    setPaymentMethod('pix');
    setDescription("");
    setDate(new Date().toISOString().split('T')[0]);
    setInstallments(1);
  };

  const handleSubmit = () => {
    const numAmount = parseFloat(amount.replace(/[^\d,]/g, '').replace(',', '.'));
    if (!numAmount || !categoryId || !accountId) return;

    if (installments > 1 && paymentMethod === 'credit') {
      // Create multiple transactions for installments
      const installmentAmount = numAmount / installments;
      for (let i = 0; i < installments; i++) {
        const installmentDate = new Date(date);
        installmentDate.setMonth(installmentDate.getMonth() + i);
        
        onAdd({
          type,
          amount: installmentAmount,
          date: installmentDate,
          categoryId,
          accountId,
          paymentMethod,
          description: description || undefined,
          installments,
          currentInstallment: i + 1,
        });
      }
    } else {
      onAdd({
        type,
        amount: numAmount,
        date: new Date(date),
        categoryId,
        accountId,
        paymentMethod,
        description: description || undefined,
      });
    }

    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-x-0 bottom-0 z-[70] bg-background rounded-t-3xl border-t border-border shadow-lg animate-slide-in-bottom max-h-[85vh] flex flex-col mb-[72px]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-bold text-lg">Nova Movimentação</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Type Toggle */}
          <div className="flex gap-2 p-1 bg-muted rounded-xl">
            <button
              onClick={() => onTypeChange('income')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-colors ${
                type === 'income' 
                  ? 'bg-emerald-500 text-white' 
                  : 'text-muted-foreground'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              Entrada
            </button>
            <button
              onClick={() => onTypeChange('expense')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-colors ${
                type === 'expense' 
                  ? 'bg-red-500 text-white' 
                  : 'text-muted-foreground'
              }`}
            >
              <TrendingDown className="h-4 w-4" />
              Saída
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Valor</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                className="w-full pl-12 pr-4 py-4 text-2xl font-bold bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Data</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-4 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Categoria</label>
            <div className="grid grid-cols-4 gap-2">
              {filteredCategories.slice(0, 8).map(category => (
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
            <div className="flex gap-2">
              {accounts.map(account => (
                <button
                  key={account.id}
                  onClick={() => setAccountId(account.id)}
                  className={`flex-1 flex items-center gap-2 p-3 rounded-xl border transition-colors ${
                    accountId === account.id 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: account.color }}
                  >
                    {account.type === 'wallet' && <Wallet className="h-4 w-4" />}
                    {account.type === 'bank' && <Building2 className="h-4 w-4" />}
                    {account.type === 'credit_card' && <CreditCard className="h-4 w-4" />}
                  </div>
                  <span className="text-sm font-medium truncate">{account.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Forma de Pagamento</label>
            <div className="grid grid-cols-4 gap-2">
              {paymentMethods.map(method => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-colors ${
                    paymentMethod === method.id 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <method.icon className="h-5 w-5 text-foreground" />
                  <span className="text-xs text-foreground">{method.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Installments (only for credit) */}
          {paymentMethod === 'credit' && type === 'expense' && (
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Parcelas</label>
              <select
                value={installments}
                onChange={(e) => setInstallments(parseInt(e.target.value))}
                className="w-full p-4 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(n => (
                  <option key={n} value={n}>{n}x {amount && `de R$ ${(parseFloat(amount.replace(',', '.')) / n).toFixed(2)}`}</option>
                ))}
              </select>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Descrição (opcional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Almoço no restaurante"
              className="w-full p-4 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <button
            onClick={handleSubmit}
            disabled={!amount || !categoryId || !accountId}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-colors ${
              type === 'income' 
                ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                : 'bg-red-500 text-white hover:bg-red-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {type === 'income' ? 'Adicionar Entrada' : 'Adicionar Saída'}
          </button>
        </div>
      </div>
    </div>
  );
}
