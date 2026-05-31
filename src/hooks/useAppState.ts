import { useState, useEffect } from 'react';

export function useAppState() {
  const [appState, setAppState] = useState(() => {
    const saved = localStorage.getItem('cleanpro_state_v1');
    return saved ? JSON.parse(saved) : {
      sales: [],
      cash: [],
      appointments: [],
      theme: 'dark'
    };
  });

  useEffect(() => {
    localStorage.setItem('cleanpro_state_v1', JSON.stringify(appState));
  }, [appState]);

  const addSale = (sale: any) => {
    setAppState((prev: any) => ({
      ...prev,
      sales: [sale, ...prev.sales]
    }));
  };

  const addCashOperation = (op: any) => {
    setAppState((prev: any) => ({
      ...prev,
      cash: [op, ...prev.cash]
    }));
  };

  return { 
    ...appState, 
    addSale, 
    addCashOperation 
  };
}
