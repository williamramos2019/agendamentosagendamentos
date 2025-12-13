import { useState } from "react";
import { Plus, Wallet, Building2, CreditCard, Edit2, Trash2, X } from "lucide-react";
import type { Account } from "@/hooks/usePersonalFinance";

interface AccountsViewProps {
  accounts: Account[];
  onAdd: (account: Omit<Account, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<Account>) => void;
  onDelete: (id: string) => void;
}

const accountTypes = [
  { id: 'wallet', label: 'Carteira', icon: Wallet, color: '#22c55e' },
  { id: 'bank', label: 'Conta Bancária', icon: Building2, color: '#3b82f6' },
  { id: 'credit_card', label: 'Cartão de Crédito', icon: CreditCard, color: '#8b5cf6' },
] as const;

export function AccountsView({ accounts, onAdd, onUpdate, onDelete }: AccountsViewProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState<'wallet' | 'bank' | 'credit_card'>('wallet');
  const [balance, setBalance] = useState("");
  const [creditLimit, setCreditLimit] = useState("");
  const [dueDay, setDueDay] = useState("");
  const [closingDay, setClosingDay] = useState("");

  const getIcon = (accountType: string) => {
    switch (accountType) {
      case 'wallet': return Wallet;
      case 'bank': return Building2;
      case 'credit_card': return CreditCard;
      default: return Wallet;
    }
  };

  const resetForm = () => {
    setName("");
    setType('wallet');
    setBalance("");
    setCreditLimit("");
    setDueDay("");
    setClosingDay("");
    setEditingAccount(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (account: Account) => {
    setEditingAccount(account);
    setName(account.name);
    setType(account.type);
    setBalance(account.balance.toString());
    setCreditLimit(account.creditLimit?.toString() || "");
    setDueDay(account.dueDay?.toString() || "");
    setClosingDay(account.closingDay?.toString() || "");
    setShowModal(true);
  };

  const handleSubmit = () => {
    const accountData = {
      name,
      type,
      balance: parseFloat(balance) || 0,
      color: accountTypes.find(t => t.id === type)?.color || '#64748b',
      icon: type === 'wallet' ? 'Wallet' : type === 'bank' ? 'Building2' : 'CreditCard',
      ...(type === 'credit_card' && {
        creditLimit: parseFloat(creditLimit) || 0,
        dueDay: parseInt(dueDay) || 10,
        closingDay: parseInt(closingDay) || 3,
      }),
    };

    if (editingAccount) {
      onUpdate(editingAccount.id, accountData);
    } else {
      onAdd(accountData);
    }

    setShowModal(false);
    resetForm();
  };

  const totalBalance = accounts
    .filter(a => a.type !== 'credit_card')
    .reduce((sum, a) => sum + a.balance, 0);

  const totalDebt = accounts
    .filter(a => a.type === 'credit_card')
    .reduce((sum, a) => sum + Math.abs(a.balance), 0);

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
          <p className="text-sm text-muted-foreground">Saldo Disponível</p>
          <p className="text-xl font-bold text-emerald-500">
            R$ {totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
          <p className="text-sm text-muted-foreground">Fatura Cartão</p>
          <p className="text-xl font-bold text-red-500">
            R$ {totalDebt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Add Account Button */}
      <button
        onClick={openAddModal}
        className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-2xl text-muted-foreground hover:border-primary hover:text-primary transition-colors"
      >
        <Plus className="h-5 w-5" />
        <span className="font-medium">Adicionar Conta</span>
      </button>

      {/* Accounts List */}
      <div className="space-y-3">
        {accounts.map(account => {
          const Icon = getIcon(account.type);
          return (
            <div 
              key={account.id}
              className="bg-card border border-border rounded-2xl p-4"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: account.color }}
                >
                  <Icon className="h-6 w-6" />
                </div>
                
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{account.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {account.type === 'wallet' && 'Carteira'}
                    {account.type === 'bank' && 'Conta Bancária'}
                    {account.type === 'credit_card' && 'Cartão de Crédito'}
                  </p>
                </div>

                <div className="text-right">
                  <p className={`font-bold ${account.balance >= 0 ? 'text-foreground' : 'text-red-500'}`}>
                    R$ {account.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  {account.type === 'credit_card' && account.creditLimit && (
                    <p className="text-xs text-muted-foreground">
                      Limite: R$ {account.creditLimit.toLocaleString('pt-BR')}
                    </p>
                  )}
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => openEditModal(account)}
                    className="p-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(account.id)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {account.type === 'credit_card' && (
                <div className="mt-3 pt-3 border-t border-border flex gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Vencimento:</span>
                    <span className="ml-1 font-medium text-foreground">Dia {account.dueDay}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fechamento:</span>
                    <span className="ml-1 font-medium text-foreground">Dia {account.closingDay}</span>
                  </div>
                </div>
              )}
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
                {editingAccount ? 'Editar Conta' : 'Nova Conta'}
              </h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 hover:bg-muted rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Account Type */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Tipo de Conta</label>
                <div className="grid grid-cols-3 gap-2">
                  {accountTypes.map(accountType => (
                    <button
                      key={accountType.id}
                      onClick={() => setType(accountType.id)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-colors ${
                        type === accountType.id 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <accountType.icon className="h-6 w-6" style={{ color: accountType.color }} />
                      <span className="text-xs font-medium text-foreground">{accountType.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Nome da Conta</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Nubank, Itaú, Carteira..."
                  className="w-full p-4 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Balance */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  {type === 'credit_card' ? 'Fatura Atual' : 'Saldo Atual'}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    placeholder="0,00"
                    className="w-full pl-12 pr-4 py-4 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Credit Card Fields */}
              {type === 'credit_card' && (
                <>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Limite de Crédito</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={creditLimit}
                        onChange={(e) => setCreditLimit(e.target.value)}
                        placeholder="5.000,00"
                        className="w-full pl-12 pr-4 py-4 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
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
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Dia do Fechamento</label>
                      <input
                        type="number"
                        value={closingDay}
                        onChange={(e) => setClosingDay(e.target.value)}
                        placeholder="3"
                        min="1"
                        max="31"
                        className="w-full p-4 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!name}
              className="w-full mt-6 py-4 bg-primary text-primary-foreground rounded-xl font-bold disabled:opacity-50"
            >
              {editingAccount ? 'Salvar Alterações' : 'Adicionar Conta'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
