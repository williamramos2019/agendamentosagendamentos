import { useState } from "react";
import { 
  Wallet, TrendingUp, TrendingDown, ArrowUpDown, 
  Plus, PieChart, BarChart3, CreditCard, Target,
  Receipt, RefreshCw, Bell
} from "lucide-react";
import { usePersonalFinance } from "@/hooks/usePersonalFinance";
import { FinanceDashboard } from "@/components/finance/FinanceDashboard";
import { TransactionsList } from "@/components/finance/TransactionsList";
import { AddTransactionModal } from "@/components/finance/AddTransactionModal";
import { AccountsView } from "@/components/finance/AccountsView";
import { CategoriesView } from "@/components/finance/CategoriesView";
import { GoalsView } from "@/components/finance/GoalsView";
import { RecurringView } from "@/components/finance/RecurringView";
import { FloatingActionButton } from "@/components/FloatingActionButton";

type TabType = 'dashboard' | 'transactions' | 'accounts' | 'categories' | 'goals' | 'recurring';

interface FinancasPageProps {
  onBack?: () => void;
  openExpenseOnMount?: boolean;
}

export default function FinancasPage({ onBack, openExpenseOnMount }: FinancasPageProps) {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [showAddModal, setShowAddModal] = useState(openExpenseOnMount || false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  
  const finance = usePersonalFinance();

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Resumo', icon: PieChart },
    { id: 'transactions' as TabType, label: 'Movimentações', icon: ArrowUpDown },
    { id: 'accounts' as TabType, label: 'Contas', icon: CreditCard },
    { id: 'categories' as TabType, label: 'Categorias', icon: Receipt },
    { id: 'goals' as TabType, label: 'Metas', icon: Target },
    { id: 'recurring' as TabType, label: 'Fixas', icon: RefreshCw },
  ];

  const handleAddTransaction = (type: 'income' | 'expense') => {
    setTransactionType(type);
    setShowAddModal(true);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 pt-12 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Finanças Pessoais</h1>
            <p className="text-primary-foreground/80 text-sm">Controle seus gastos</p>
          </div>
          <button className="p-2 rounded-full bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors relative">
            <Bell className="h-5 w-5" />
            {finance.alerts.filter(a => !a.isRead).length > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {finance.alerts.filter(a => !a.isRead).length}
              </span>
            )}
          </button>
        </div>

        {/* Balance Card */}
        <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-4">
          <p className="text-primary-foreground/80 text-sm mb-1">Saldo Total</p>
          <p className="text-3xl font-bold">
            R$ {finance.getTotalBalance().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          
          <div className="flex gap-4 mt-4">
            <div className="flex-1 bg-emerald-500/20 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-emerald-300" />
                <span className="text-xs text-primary-foreground/80">Entradas</span>
              </div>
              <p className="font-bold text-emerald-300">
                R$ {finance.getMonthlyIncome().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="flex-1 bg-red-500/20 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className="h-4 w-4 text-red-300" />
                <span className="text-xs text-primary-foreground/80">Saídas</span>
              </div>
              <p className="font-bold text-red-300">
                R$ {finance.getMonthlyExpenses().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 -mt-4">
        <div className="bg-card rounded-2xl shadow-lg p-2 flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-max flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'dashboard' && (
          <FinanceDashboard 
            finance={finance} 
            onAddIncome={() => handleAddTransaction('income')}
            onAddExpense={() => handleAddTransaction('expense')}
          />
        )}
        {activeTab === 'transactions' && (
          <TransactionsList 
            transactions={finance.transactions}
            categories={finance.categories}
            accounts={finance.accounts}
            onDelete={finance.deleteTransaction}
          />
        )}
        {activeTab === 'accounts' && (
          <AccountsView 
            accounts={finance.accounts}
            onAdd={finance.addAccount}
            onUpdate={finance.updateAccount}
            onDelete={finance.deleteAccount}
          />
        )}
        {activeTab === 'categories' && (
          <CategoriesView 
            categories={finance.categories}
            onAdd={finance.addCategory}
            onUpdate={finance.updateCategory}
            onDelete={finance.deleteCategory}
          />
        )}
        {activeTab === 'goals' && (
          <GoalsView 
            goals={finance.goals}
            onAdd={finance.addGoal}
            onUpdate={finance.updateGoal}
            onDelete={finance.deleteGoal}
          />
        )}
        {activeTab === 'recurring' && (
          <RecurringView 
            expenses={finance.recurringExpenses}
            categories={finance.categories}
            accounts={finance.accounts}
            onAdd={finance.addRecurringExpense}
            onUpdate={finance.updateRecurringExpense}
            onDelete={finance.deleteRecurringExpense}
          />
        )}
      </div>

      {/* FAB */}
      <FloatingActionButton 
        onClick={() => handleAddTransaction('expense')} 
        icon={<Plus className="h-6 w-6" />}
      />

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        type={transactionType}
        onTypeChange={setTransactionType}
        categories={finance.categories}
        accounts={finance.accounts}
        onAdd={finance.addTransaction}
      />
    </div>
  );
}
