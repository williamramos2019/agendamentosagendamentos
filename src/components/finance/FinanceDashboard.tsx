import { TrendingUp, TrendingDown, Plus, Minus, CreditCard, Target } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import type { usePersonalFinance } from "@/hooks/usePersonalFinance";

interface FinanceDashboardProps {
  finance: ReturnType<typeof usePersonalFinance>;
  onAddIncome: () => void;
  onAddExpense: () => void;
}

export function FinanceDashboard({ finance, onAddIncome, onAddExpense }: FinanceDashboardProps) {
  const monthlyBalance = finance.getMonthlyBalance();
  const expensesByCategory = finance.getExpensesByCategory();
  const creditUsed = finance.getCreditCardBalance();
  const creditLimit = finance.getCreditCardLimit();
  const creditPercentage = creditLimit > 0 ? (creditUsed / creditLimit) * 100 : 0;

  // Last 6 months data for bar chart
  const getMonthsData = () => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
      months.push({
        month: monthName,
        entradas: finance.getMonthlyIncome(date),
        saidas: finance.getMonthlyExpenses(date),
      });
    }
    return months;
  };

  const monthsData = getMonthsData();

  return (
    <div className="space-y-4">
      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onAddIncome}
          className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl hover:bg-emerald-500/20 transition-colors"
        >
          <div className="p-2 bg-emerald-500 rounded-xl">
            <Plus className="h-5 w-5 text-white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-foreground">Nova Entrada</p>
            <p className="text-xs text-muted-foreground">Adicionar receita</p>
          </div>
        </button>
        <button
          onClick={onAddExpense}
          className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl hover:bg-red-500/20 transition-colors"
        >
          <div className="p-2 bg-red-500 rounded-xl">
            <Minus className="h-5 w-5 text-white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-foreground">Nova Saída</p>
            <p className="text-xs text-muted-foreground">Adicionar despesa</p>
          </div>
        </button>
      </div>

      {/* Monthly Result */}
      <div className={`p-4 rounded-2xl border ${
        monthlyBalance >= 0 
          ? 'bg-emerald-500/10 border-emerald-500/20' 
          : 'bg-red-500/10 border-red-500/20'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Resultado do Mês</p>
            <p className={`text-2xl font-bold ${monthlyBalance >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {monthlyBalance >= 0 ? '+' : ''} R$ {monthlyBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          {monthlyBalance >= 0 ? (
            <TrendingUp className="h-8 w-8 text-emerald-500" />
          ) : (
            <TrendingDown className="h-8 w-8 text-red-500" />
          )}
        </div>
      </div>

      {/* Credit Card Status */}
      {creditLimit > 0 && (
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Cartão de Crédito</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Utilizado</span>
              <span className="font-medium text-foreground">
                R$ {creditUsed.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} de R$ {creditLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${
                  creditPercentage > 80 ? 'bg-red-500' : creditPercentage > 50 ? 'bg-yellow-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(creditPercentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-right">
              {creditPercentage.toFixed(0)}% do limite
            </p>
          </div>
        </div>
      )}

      {/* Expenses by Category Pie Chart */}
      {expensesByCategory.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-4">
          <h3 className="font-semibold text-foreground mb-4">Gastos por Categoria</h3>
          <div className="flex items-center gap-4">
            <div className="w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={2}
                    dataKey="amount"
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.categoryColor} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2 max-h-32 overflow-y-auto">
              {expensesByCategory.slice(0, 5).map((category, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.categoryColor }}
                  />
                  <span className="text-sm text-foreground flex-1 truncate">{category.categoryName}</span>
                  <span className="text-sm font-medium text-foreground">
                    R$ {category.amount.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Monthly Comparison Bar Chart */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <h3 className="font-semibold text-foreground mb-4">Entradas x Saídas</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthsData}>
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                }}
              />
              <Bar dataKey="entradas" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="saidas" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-xs text-muted-foreground">Entradas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-xs text-muted-foreground">Saídas</span>
          </div>
        </div>
      </div>

      {/* Goals Summary */}
      {finance.goals.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Metas Financeiras</h3>
          </div>
          <div className="space-y-3">
            {finance.goals.slice(0, 3).map(goal => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              return (
                <div key={goal.id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">{goal.name}</span>
                    <span className="text-muted-foreground">{progress.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ width: `${Math.min(progress, 100)}%`, backgroundColor: goal.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
