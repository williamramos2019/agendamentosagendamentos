import { useState, useCallback } from 'react';

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

export interface SalesState {
  sales: Sale[];
  todayRevenue: number;
  todayServices: number;
  todayProducts: number;
  averageTicket: number;
}

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);

  const addSale = useCallback((sale: Omit<Sale, 'id' | 'createdAt'>) => {
    const newSale: Sale = {
      ...sale,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setSales(prev => [newSale, ...prev]);
    return newSale;
  }, []);

  const getTodaySales = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return sales.filter(sale => {
      const saleDate = new Date(sale.createdAt);
      saleDate.setHours(0, 0, 0, 0);
      return saleDate.getTime() === today.getTime();
    });
  }, [sales]);

  const todaySales = getTodaySales();

  const todayRevenue = todaySales.reduce((acc, sale) => acc + sale.total, 0);
  
  const todayServices = todaySales.filter(s => s.type === 'service').length;
  
  const todayProducts = todaySales.filter(s => s.type === 'product').length;
  
  const averageTicket = todaySales.length > 0 
    ? todayRevenue / todaySales.length 
    : 0;

  return {
    sales,
    todaySales,
    todayRevenue,
    todayServices,
    todayProducts,
    averageTicket,
    addSale,
  };
}
