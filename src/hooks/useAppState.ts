import { useState, useCallback, useEffect } from 'react';
import { Appointment, Sale, CashState, CashOperation, SaleItem } from '@/core/types';
export type { Appointment, Sale, CashState, CashOperation, SaleItem };
import { appointmentRepository } from '@/repositories/AppointmentRepository';
import { saleRepository } from '@/repositories/SaleRepository';
import { cashRepository } from '@/repositories/CashRepository';
import { toast } from 'sonner';

// ==================== STORAGE KEYS (Legacy/Fallback) ====================
const STORAGE_KEYS = {
  THEME: 'cleanpro_theme_v1',
};

export function useAppState() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [cashState, setCashState] = useState<CashState>({
    isOpen: false,
    openedAt: null,
    openingBalance: 0,
    operations: [],
  });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => 
    localStorage.getItem(STORAGE_KEYS.THEME) === 'true'
  );
  const [isLoading, setIsLoading] = useState(true);

  // ==================== INITIAL DATA FETCH ====================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appts, sls, ops] = await Promise.all([
          appointmentRepository.getAll(),
          saleRepository.getAll(),
          cashRepository.getOperations()
        ]);
        
        setAppointments(appts);
        setSales(sls);
        
        // Recover cash state from localStorage (or we could store it in DB too)
        const storedCash = localStorage.getItem('cleanpro_cash_session');
        if (storedCash) {
          const parsed = JSON.parse(storedCash);
          setCashState({
            ...parsed,
            operations: ops.filter(op => op.time >= (parsed.openedAt || ''))
          });
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // ==================== THEME PERSISTENCE ====================
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, String(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // ==================== SALES ACTIONS ====================
  const addSale = useCallback(async (saleData: Omit<Sale, 'id' | 'createdAt'>) => {
    try {
      const newSale = await saleRepository.create(saleData);
      setSales(prev => [newSale, ...prev]);

      if (cashState.isOpen) {
        const operation: Omit<CashOperation, 'id'> = {
          type: 'sale',
          description: saleData.items.map(i => i.name).join(', '),
          amount: saleData.total,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          saleId: newSale.id,
        };
        const newOp = await cashRepository.createOperation(operation);
        setCashState(prev => ({
          ...prev,
          operations: [newOp, ...prev.operations],
        }));
      }
      return newSale;
    } catch (error) {
      toast.error("Erro ao salvar venda");
      throw error;
    }
  }, [cashState.isOpen]);

  // ==================== CASH ACTIONS ====================
  const openCash = useCallback((openingBalance: number) => {
    const newState = {
      isOpen: true,
      openedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      openingBalance,
      operations: [],
    };
    setCashState(newState);
    localStorage.setItem('cleanpro_cash_session', JSON.stringify(newState));
  }, []);

  const closeCash = useCallback(() => {
    setCashState(prev => ({ ...prev, isOpen: false }));
    localStorage.removeItem('cleanpro_cash_session');
  }, []);

  const addCashOperation = useCallback(async (type: 'withdrawal' | 'deposit', amount: number, description: string) => {
    try {
      const operation: Omit<CashOperation, 'id'> = {
        type,
        description,
        amount: type === 'withdrawal' ? -amount : amount,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      const newOp = await cashRepository.createOperation(operation);
      setCashState(prev => ({
        ...prev,
        operations: [newOp, ...prev.operations],
      }));
    } catch (error) {
      toast.error("Erro ao registrar operação de caixa");
    }
  }, []);

  // ==================== APPOINTMENT ACTIONS ====================
  const addAppointment = useCallback(async (appointment: Omit<Appointment, 'id'>) => {
    try {
      const newAppt = await appointmentRepository.create(appointment);
      setAppointments(prev => [...prev, newAppt]);
      return newAppt;
    } catch (error) {
      toast.error("Erro ao agendar");
      throw error;
    }
  }, []);

  const updateAppointmentStatus = useCallback(async (id: string, status: Appointment['status']) => {
    try {
      await appointmentRepository.updateStatus(id, status);
      setAppointments(prev => 
        prev.map(apt => apt.id === id ? { ...apt, status } : apt)
      );
    } catch (error) {
      toast.error("Erro ao atualizar status");
    }
  }, []);

  const getAppointmentsByDate = useCallback((date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateStr);
  }, [appointments]);

  // ==================== COMPUTED VALUES ====================
  const todayRevenue = sales
    .filter(s => new Date(s.createdAt).toDateString() === new Date().toDateString())
    .reduce((acc, s) => acc + s.total, 0);

  const currentCashBalance = cashState.openingBalance + cashState.operations.reduce((acc, op) => acc + op.amount, 0);

  return {
    sales,
    appointments,
    cashState,
    currentCashBalance,
    todayRevenue,
    isLoading,
    isDarkMode,
    setIsDarkMode,
    addSale,
    openCash,
    closeCash,
    addCashOperation,
    addAppointment,
    updateAppointmentStatus,
    getAppointmentsByDate,
  };
}
