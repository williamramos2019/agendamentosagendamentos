import { useState } from "react";
import { Search, Filter, TrendingUp, TrendingDown, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Transaction, Category, Account } from "@/hooks/usePersonalFinance";

interface TransactionsListProps {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  onDelete: (id: string) => void;
}

export function TransactionsList({ transactions, categories, accounts, onDelete }: TransactionsListProps) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const getCategoryById = (id: string) => categories.find(c => c.id === id);
  const getAccountById = (id: string) => accounts.find(a => a.id === id);

  const filteredTransactions = transactions
    .filter(t => {
      if (filterType !== 'all' && t.type !== filterType) return false;
      if (search) {
        const category = getCategoryById(t.categoryId);
        const searchLower = search.toLowerCase();
        return (
          category?.name.toLowerCase().includes(searchLower) ||
          t.description?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const groupedByDate = filteredTransactions.reduce((groups, transaction) => {
    const dateKey = format(new Date(transaction.date), 'yyyy-MM-dd');
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  const handleDelete = (id: string) => {
    onDelete(id);
    setShowDeleteConfirm(null);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar movimentação..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2">
        {(['all', 'income', 'expense'] as const).map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filterType === type
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {type === 'all' ? 'Todas' : type === 'income' ? 'Entradas' : 'Saídas'}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      {Object.keys(groupedByDate).length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Nenhuma movimentação encontrada</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByDate).map(([dateKey, dayTransactions]) => (
            <div key={dateKey}>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                {format(new Date(dateKey), "EEEE, dd 'de' MMMM", { locale: ptBR })}
              </p>
              <div className="space-y-2">
                {dayTransactions.map(transaction => {
                  const category = getCategoryById(transaction.categoryId);
                  const account = getAccountById(transaction.accountId);
                  
                  return (
                    <div 
                      key={transaction.id}
                      className="bg-card border border-border rounded-xl p-4 flex items-center gap-3"
                    >
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${category?.color}20` }}
                      >
                        {transaction.type === 'income' ? (
                          <TrendingUp className="h-5 w-5" style={{ color: category?.color }} />
                        ) : (
                          <TrendingDown className="h-5 w-5" style={{ color: category?.color }} />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {category?.name || 'Sem categoria'}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {account?.name} • {transaction.description || 'Sem descrição'}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className={`font-bold ${transaction.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                          {transaction.type === 'income' ? '+' : '-'} R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        {transaction.installments && transaction.currentInstallment && (
                          <p className="text-xs text-muted-foreground">
                            {transaction.currentInstallment}/{transaction.installments}x
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => setShowDeleteConfirm(transaction.id)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-sm flex items-end pb-[72px]">
          <div className="w-full bg-background rounded-t-3xl border-t border-border p-6 animate-slide-in-bottom">
            <h3 className="font-bold text-lg mb-2">Excluir Movimentação</h3>
            <p className="text-muted-foreground mb-6">
              Tem certeza que deseja excluir esta movimentação? Esta ação não pode ser desfeita.
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
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
