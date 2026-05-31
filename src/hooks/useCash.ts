import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cashRepository } from "@/repositories/CashRepository";
import { CashState, CashOperation } from "@/core/types";
import { toast } from "sonner";
import { useState, useCallback, useEffect } from "react";

const CASH_SESSION_KEY = 'cleanpro_cash_session';

export function useCash() {
  const queryClient = useQueryClient();
  const [cashState, setCashState] = useState<CashState>(() => {
    const stored = localStorage.getItem(CASH_SESSION_KEY);
    return stored ? JSON.parse(stored) : {
      isOpen: false,
      openedAt: null,
      openingBalance: 0,
      operations: [],
    };
  });

  const { data: operations = [] } = useQuery({
    queryKey: ["cash-operations"],
    queryFn: () => cashRepository.getOperations(),
    select: (data) => {
      if (!cashState.isOpen || !cashState.openedAt) return [];
      return data.filter(op => op.time >= cashState.openedAt!);
    }
  });

  useEffect(() => {
    if (cashState.isOpen) {
      localStorage.setItem(CASH_SESSION_KEY, JSON.stringify(cashState));
    } else {
      localStorage.removeItem(CASH_SESSION_KEY);
    }
  }, [cashState]);

  const openCash = useCallback((openingBalance: number) => {
    setCashState({
      isOpen: true,
      openedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      openingBalance,
      operations: [],
    });
    toast.success("Caixa aberto");
  }, []);

  const closeCash = useCallback(() => {
    setCashState(prev => ({ ...prev, isOpen: false }));
    toast.success("Caixa fechado");
  }, []);

  const addOperationMutation = useMutation({
    mutationFn: async ({ type, amount, description }: { type: string, amount: number, description: string }) => {
      const operation: Omit<CashOperation, 'id'> = {
        type: type as any,
        description,
        amount: type === 'withdrawal' ? -amount : amount,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      return cashRepository.createOperation(operation);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cash-operations"] });
    },
    onError: () => {
      toast.error("Erro ao registrar operação");
    }
  });

  const currentCashBalance = cashState.openingBalance + operations.reduce((acc, op) => acc + op.amount, 0);

  return {
    cashState: { ...cashState, operations },
    currentCashBalance,
    openCash,
    closeCash,
    addCashOperation: (type: string, amount: number, description: string) => 
      addOperationMutation.mutateAsync({ type, amount, description }),
  };
}
