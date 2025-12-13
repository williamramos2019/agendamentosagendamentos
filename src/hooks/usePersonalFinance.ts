import { useState, useEffect } from 'react';

// Types
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  date: Date;
  categoryId: string;
  accountId: string;
  paymentMethod: 'cash' | 'pix' | 'debit' | 'credit';
  description?: string;
  attachmentUrl?: string;
  isRecurring?: boolean;
  recurringId?: string;
  installments?: number;
  currentInstallment?: number;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense' | 'both';
  isDefault?: boolean;
}

export interface Account {
  id: string;
  name: string;
  type: 'wallet' | 'bank' | 'credit_card';
  balance: number;
  creditLimit?: number;
  dueDay?: number;
  closingDay?: number;
  color: string;
  icon: string;
}

export interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
  categoryId: string;
  accountId: string;
  dueDay: number;
  isActive: boolean;
  lastPaidDate?: Date;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  color: string;
  createdAt: Date;
}

export interface Alert {
  id: string;
  type: 'due_date' | 'limit' | 'negative_balance' | 'invoice_closing';
  message: string;
  date: Date;
  isRead: boolean;
  relatedId?: string;
}

const STORAGE_KEYS = {
  transactions: 'ra_finance_transactions',
  categories: 'ra_finance_categories',
  accounts: 'ra_finance_accounts',
  recurring: 'ra_finance_recurring',
  goals: 'ra_finance_goals',
  alerts: 'ra_finance_alerts',
};

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Alimentação', icon: 'Utensils', color: '#ef4444', type: 'expense', isDefault: true },
  { id: '2', name: 'Aluguel', icon: 'Home', color: '#f97316', type: 'expense', isDefault: true },
  { id: '3', name: 'Água', icon: 'Droplets', color: '#3b82f6', type: 'expense', isDefault: true },
  { id: '4', name: 'Luz', icon: 'Lightbulb', color: '#eab308', type: 'expense', isDefault: true },
  { id: '5', name: 'Internet', icon: 'Wifi', color: '#8b5cf6', type: 'expense', isDefault: true },
  { id: '6', name: 'Transporte', icon: 'Car', color: '#06b6d4', type: 'expense', isDefault: true },
  { id: '7', name: 'Saúde', icon: 'Heart', color: '#ec4899', type: 'expense', isDefault: true },
  { id: '8', name: 'Lazer', icon: 'Gamepad2', color: '#10b981', type: 'expense', isDefault: true },
  { id: '9', name: 'Educação', icon: 'GraduationCap', color: '#6366f1', type: 'expense', isDefault: true },
  { id: '10', name: 'Outros', icon: 'MoreHorizontal', color: '#64748b', type: 'both', isDefault: true },
  { id: '11', name: 'Salário', icon: 'Banknote', color: '#22c55e', type: 'income', isDefault: true },
  { id: '12', name: 'Freelance', icon: 'Briefcase', color: '#14b8a6', type: 'income', isDefault: true },
  { id: '13', name: 'Investimentos', icon: 'TrendingUp', color: '#a855f7', type: 'income', isDefault: true },
];

const DEFAULT_ACCOUNTS: Account[] = [
  { id: '1', name: 'Carteira', type: 'wallet', balance: 0, color: '#22c55e', icon: 'Wallet' },
  { id: '2', name: 'Conta Bancária', type: 'bank', balance: 0, color: '#3b82f6', icon: 'Building2' },
  { id: '3', name: 'Cartão de Crédito', type: 'credit_card', balance: 0, creditLimit: 5000, dueDay: 10, closingDay: 3, color: '#8b5cf6', icon: 'CreditCard' },
];

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;
    return JSON.parse(stored, (k, v) => {
      if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(v)) {
        return new Date(v);
      }
      return v;
    });
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to storage:', error);
  }
}

export function usePersonalFinance() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => 
    loadFromStorage(STORAGE_KEYS.transactions, [])
  );
  const [categories, setCategories] = useState<Category[]>(() => 
    loadFromStorage(STORAGE_KEYS.categories, DEFAULT_CATEGORIES)
  );
  const [accounts, setAccounts] = useState<Account[]>(() => 
    loadFromStorage(STORAGE_KEYS.accounts, DEFAULT_ACCOUNTS)
  );
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>(() => 
    loadFromStorage(STORAGE_KEYS.recurring, [])
  );
  const [goals, setGoals] = useState<FinancialGoal[]>(() => 
    loadFromStorage(STORAGE_KEYS.goals, [])
  );
  const [alerts, setAlerts] = useState<Alert[]>(() => 
    loadFromStorage(STORAGE_KEYS.alerts, [])
  );

  // Persist to localStorage
  useEffect(() => saveToStorage(STORAGE_KEYS.transactions, transactions), [transactions]);
  useEffect(() => saveToStorage(STORAGE_KEYS.categories, categories), [categories]);
  useEffect(() => saveToStorage(STORAGE_KEYS.accounts, accounts), [accounts]);
  useEffect(() => saveToStorage(STORAGE_KEYS.recurring, recurringExpenses), [recurringExpenses]);
  useEffect(() => saveToStorage(STORAGE_KEYS.goals, goals), [goals]);
  useEffect(() => saveToStorage(STORAGE_KEYS.alerts, alerts), [alerts]);

  // Transaction actions
  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
    
    // Update account balance
    updateAccountBalance(transaction.accountId, transaction.type === 'income' ? transaction.amount : -transaction.amount);
    
    return newTransaction;
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTransaction = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
      updateAccountBalance(transaction.accountId, transaction.type === 'income' ? -transaction.amount : transaction.amount);
    }
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Category actions
  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = { ...category, id: crypto.randomUUID() };
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCategory = (id: string) => {
    const category = categories.find(c => c.id === id);
    if (category?.isDefault) return false;
    setCategories(prev => prev.filter(c => c.id !== id));
    return true;
  };

  // Account actions
  const addAccount = (account: Omit<Account, 'id'>) => {
    const newAccount: Account = { ...account, id: crypto.randomUUID() };
    setAccounts(prev => [...prev, newAccount]);
    return newAccount;
  };

  const updateAccount = (id: string, updates: Partial<Account>) => {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const updateAccountBalance = (id: string, amount: number) => {
    setAccounts(prev => prev.map(a => 
      a.id === id ? { ...a, balance: a.balance + amount } : a
    ));
  };

  const deleteAccount = (id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
  };

  // Goal actions
  const addGoal = (goal: Omit<FinancialGoal, 'id' | 'createdAt'>) => {
    const newGoal: FinancialGoal = { ...goal, id: crypto.randomUUID(), createdAt: new Date() };
    setGoals(prev => [...prev, newGoal]);
    return newGoal;
  };

  const updateGoal = (id: string, updates: Partial<FinancialGoal>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  // Recurring expense actions
  const addRecurringExpense = (expense: Omit<RecurringExpense, 'id'>) => {
    const newExpense: RecurringExpense = { ...expense, id: crypto.randomUUID() };
    setRecurringExpenses(prev => [...prev, newExpense]);
    return newExpense;
  };

  const updateRecurringExpense = (id: string, updates: Partial<RecurringExpense>) => {
    setRecurringExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteRecurringExpense = (id: string) => {
    setRecurringExpenses(prev => prev.filter(e => e.id !== id));
  };

  // Computed values
  const getMonthTransactions = (date: Date = new Date()) => {
    const month = date.getMonth();
    const year = date.getFullYear();
    return transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === month && tDate.getFullYear() === year;
    });
  };

  const getMonthlyIncome = (date: Date = new Date()) => {
    return getMonthTransactions(date)
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getMonthlyExpenses = (date: Date = new Date()) => {
    return getMonthTransactions(date)
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getMonthlyBalance = (date: Date = new Date()) => {
    return getMonthlyIncome(date) - getMonthlyExpenses(date);
  };

  const getTotalBalance = () => {
    return accounts.reduce((sum, a) => sum + a.balance, 0);
  };

  const getExpensesByCategory = (date: Date = new Date()) => {
    const monthTransactions = getMonthTransactions(date).filter(t => t.type === 'expense');
    const byCategory: Record<string, number> = {};
    
    monthTransactions.forEach(t => {
      byCategory[t.categoryId] = (byCategory[t.categoryId] || 0) + t.amount;
    });
    
    return Object.entries(byCategory).map(([categoryId, amount]) => {
      const category = categories.find(c => c.id === categoryId);
      return {
        categoryId,
        categoryName: category?.name || 'Outros',
        categoryColor: category?.color || '#64748b',
        amount,
      };
    }).sort((a, b) => b.amount - a.amount);
  };

  const getCreditCardBalance = () => {
    return accounts
      .filter(a => a.type === 'credit_card')
      .reduce((sum, a) => sum + Math.abs(a.balance), 0);
  };

  const getCreditCardLimit = () => {
    return accounts
      .filter(a => a.type === 'credit_card')
      .reduce((sum, a) => sum + (a.creditLimit || 0), 0);
  };

  return {
    // State
    transactions,
    categories,
    accounts,
    recurringExpenses,
    goals,
    alerts,
    
    // Transaction actions
    addTransaction,
    updateTransaction,
    deleteTransaction,
    
    // Category actions
    addCategory,
    updateCategory,
    deleteCategory,
    
    // Account actions
    addAccount,
    updateAccount,
    updateAccountBalance,
    deleteAccount,
    
    // Goal actions
    addGoal,
    updateGoal,
    deleteGoal,
    
    // Recurring expense actions
    addRecurringExpense,
    updateRecurringExpense,
    deleteRecurringExpense,
    
    // Computed values
    getMonthTransactions,
    getMonthlyIncome,
    getMonthlyExpenses,
    getMonthlyBalance,
    getTotalBalance,
    getExpensesByCategory,
    getCreditCardBalance,
    getCreditCardLimit,
  };
}
