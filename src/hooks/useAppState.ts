import { useState, useCallback, useEffect } from 'react';

// ==================== INTERFACES ====================

export interface SaleItem {
  id: string;
  name: string;
  price: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  total: number;
  paymentMethod: 'cash' | 'credit' | 'debit' | 'pix';
  type: 'service' | 'product';
  createdAt: Date;
  clientName?: string;
}

export interface CashOperation {
  id: string;
  type: "sale" | "withdrawal" | "deposit" | "expense";
  description: string;
  amount: number;
  time: string;
  saleId?: string;
}

export interface CashState {
  isOpen: boolean;
  openedAt: string | null;
  openingBalance: number;
  operations: CashOperation[];
}

export interface Appointment {
  id: string;
  time: string;
  date: string;
  client: string;
  phone: string;
  address?: string;
  distanceKm?: number;
  customerLatitude?: number;
  customerLongitude?: number;
  services: string[];
  employee: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  duration: number;
}

// ==================== STORAGE HELPERS ====================

const STORAGE_KEYS = {
  SALES: 'cleanpro_sales_v1',
  CASH: 'cleanpro_cash_v1',
  APPOINTMENTS: 'cleanpro_appointments_v1',
  THEME: 'cleanpro_theme_v1',
};

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects for sales
      if (key === STORAGE_KEYS.SALES && Array.isArray(parsed)) {
        return parsed.map((sale: Sale) => ({
          ...sale,
          createdAt: new Date(sale.createdAt)
        })) as T;
      }
      return parsed;
    }
  } catch (e) {
    console.error(`Error loading ${key} from storage:`, e);
  }
  return defaultValue;
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

// ==================== MAIN HOOK ====================

export function useAppState() {
  // Sales State
  const [sales, setSales] = useState<Sale[]>(() => 
    loadFromStorage<Sale[]>(STORAGE_KEYS.SALES, [])
  );

  // Cash State
  const [cashState, setCashState] = useState<CashState>(() => 
    loadFromStorage<CashState>(STORAGE_KEYS.CASH, {
      isOpen: false,
      openedAt: null,
      openingBalance: 0,
      operations: [],
    })
  );

  // Appointments State
  const [appointments, setAppointments] = useState<Appointment[]>(() => 
    loadFromStorage<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, [
      {
        id: "1",
        time: "09:00",
        date: new Date().toISOString().split('T')[0],
        client: "Maria Silva",
        phone: "(11) 99999-1234",
        services: ["Higienização Sofá 3 Lugares"],
        employee: "Carlos",
        status: "completed",
        duration: 120
      },
      {
        id: "2",
        time: "14:00",
        date: new Date().toISOString().split('T')[0],
        client: "Construtora Lima",
        phone: "(11) 97777-9012",
        services: ["Limpeza Pós-Obra"],
        employee: "Equipe A",
        status: "confirmed",
        duration: 240
      },
      {
        id: "3",
        time: "15:30",
        date: new Date().toISOString().split('T')[0],
        client: "Patrícia Souza",
        phone: "(11) 96666-3456",
        services: ["Lavagem Interna Automotiva", "Polimento"],
        employee: "Rodrigo",
        status: "pending",
        duration: 180
      },
    ])
  );

  // Theme State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => 
    loadFromStorage<boolean>(STORAGE_KEYS.THEME, false)
  );

  // ==================== EFFECTS - PERSIST TO STORAGE ====================

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SALES, sales);
  }, [sales]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CASH, cashState);
  }, [cashState]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.APPOINTMENTS, appointments);
  }, [appointments]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.THEME, isDarkMode);
    // Identidade visual da marca é sempre dark — mantemos a classe sempre ativa
    document.documentElement.classList.add('dark');
  }, [isDarkMode]);

  // Garante o tema dark no mount
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // ==================== SALES ACTIONS ====================

  const addSale = useCallback((sale: Omit<Sale, 'id' | 'createdAt'>) => {
    const newSale: Sale = {
      ...sale,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setSales(prev => [newSale, ...prev]);

    // Add to cash operations if cash is open
    if (cashState.isOpen) {
      const operation: CashOperation = {
        id: `op_${Date.now()}`,
        type: 'sale',
        description: sale.items.map(i => i.name).join(', '),
        amount: sale.total,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        saleId: newSale.id,
      };
      setCashState(prev => ({
        ...prev,
        operations: [operation, ...prev.operations],
      }));
    }

    return newSale;
  }, [cashState.isOpen]);

  const getTodaySales = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return sales.filter(sale => {
      const saleDate = new Date(sale.createdAt);
      saleDate.setHours(0, 0, 0, 0);
      return saleDate.getTime() === today.getTime();
    });
  }, [sales]);

  // ==================== CASH ACTIONS ====================

  const openCash = useCallback((openingBalance: number) => {
    setCashState({
      isOpen: true,
      openedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      openingBalance,
      operations: [],
    });
  }, []);

  const closeCash = useCallback(() => {
    setCashState(prev => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  const addCashOperation = useCallback((type: 'withdrawal' | 'deposit', amount: number, description: string) => {
    const operation: CashOperation = {
      id: `op_${Date.now()}`,
      type,
      description,
      amount: type === 'withdrawal' ? -amount : amount,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
    setCashState(prev => ({
      ...prev,
      operations: [operation, ...prev.operations],
    }));
  }, []);

  const getCashBalance = useCallback(() => {
    const operationsTotal = cashState.operations.reduce((acc, op) => acc + op.amount, 0);
    return cashState.openingBalance + operationsTotal;
  }, [cashState]);

  // ==================== APPOINTMENT ACTIONS ====================

  const addAppointment = useCallback((appointment: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
    };
    setAppointments(prev => [...prev, newAppointment]);
    return newAppointment;
  }, []);

  const updateAppointmentStatus = useCallback((id: string, status: Appointment['status']) => {
    setAppointments(prev => 
      prev.map(apt => apt.id === id ? { ...apt, status } : apt)
    );
  }, []);

  const getAppointmentsByDate = useCallback((date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateStr);
  }, [appointments]);

  // ==================== COMPUTED VALUES ====================

  const todaySales = getTodaySales();
  const todayRevenue = todaySales.reduce((acc, sale) => acc + sale.total, 0);
  const todayServices = todaySales.filter(s => s.type === 'service').length;
  const todayProducts = todaySales.filter(s => s.type === 'product').length;
  const averageTicket = todaySales.length > 0 ? todayRevenue / todaySales.length : 0;
  const currentCashBalance = getCashBalance();

  return {
    // Sales
    sales,
    todaySales,
    todayRevenue,
    todayServices,
    todayProducts,
    averageTicket,
    addSale,

    // Cash
    cashState,
    currentCashBalance,
    openCash,
    closeCash,
    addCashOperation,

    // Appointments
    appointments,
    addAppointment,
    updateAppointmentStatus,
    getAppointmentsByDate,

    // Theme
    isDarkMode,
    setIsDarkMode,
  };
}
