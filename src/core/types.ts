export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

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
  accessToken?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl?: string;
  author?: string;
  tags?: string[];
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  source?: string;
  status: string;
  createdAt: string;
}
