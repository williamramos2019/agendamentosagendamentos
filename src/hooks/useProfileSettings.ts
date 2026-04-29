import { useState, useEffect } from 'react';

// Types
export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  avatarUrl?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}

export interface SalonInfo {
  name: string;
  cnpj?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  whatsapp: string;
  email: string;
  openingHours: string;
  logoUrl?: string;
  isPublic: boolean;
  onlineBookingEnabled: boolean;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  commission: number;
  permissions: string[];
  isActive: boolean;
  avatarUrl?: string;
  createdAt: Date;
}

export interface Subscription {
  planName: string;
  status: 'active' | 'inactive' | 'cancelled' | 'past_due';
  renewalDate: Date;
  amount: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
}

export interface PaymentHistory {
  id: string;
  date: Date;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  description: string;
}

export interface NotificationSettings {
  emailEnabled: boolean;
  whatsappEnabled: boolean;
  pushEnabled: boolean;
  appointmentAlerts: boolean;
  paymentAlerts: boolean;
  reportAlerts: boolean;
  reminderHoursBefore: number;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange: Date;
  connectedDevices: Array<{
    id: string;
    name: string;
    lastAccess: Date;
    isCurrent: boolean;
  }>;
  accessHistory: Array<{
    id: string;
    date: Date;
    device: string;
    location: string;
  }>;
}

const STORAGE_KEYS = {
  profile: 'cleanpro_settings_profile_v1',
  salon: 'cleanpro_settings_company_v1',
  employees: 'cleanpro_settings_employees_v1',
  subscription: 'cleanpro_settings_subscription_v1',
  notifications: 'cleanpro_settings_notifications_v1',
  security: 'cleanpro_settings_security_v1',
  primaryColor: 'cleanpro_settings_primary_color_v1',
};

const DEFAULT_PROFILE: UserProfile = {
  id: '1',
  fullName: 'Auto Limpeza Pro',
  email: '',
  phone: '(31) 98025-2882',
  whatsapp: '(31) 98025-2882',
  isEmailVerified: true,
  isPhoneVerified: false,
};

const DEFAULT_SALON: SalonInfo = {
  name: 'Auto Limpeza Pro',
  cnpj: '',
  address: 'Atendimento em São José da Lapa, Vespasiano e região',
  city: 'São José da Lapa',
  state: 'MG',
  zipCode: '01234-567',
  phone: '(31) 98025-2882',
  whatsapp: '(31) 98025-2882',
  email: '',
  openingHours: 'Seg-Sex: 8h às 18h | Sáb: 8h às 14h',
  isPublic: true,
  onlineBookingEnabled: true,
};

const DEFAULT_EMPLOYEES: Employee[] = [
  {
    id: '1',
    name: 'Carlos Silva',
    role: 'Técnico em Higienização',
    phone: '(11) 91234-5678',
    email: 'carlos@cleanpro.com.br',
    commission: 30,
    permissions: ['sales', 'appointments'],
    isActive: true,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Rodrigo Santos',
    role: 'Especialista Estética Automotiva',
    phone: '(11) 92345-6789',
    email: 'rodrigo@cleanpro.com.br',
    commission: 35,
    permissions: ['sales', 'appointments'],
    isActive: true,
    createdAt: new Date('2024-03-20'),
  },
  {
    id: '3',
    name: 'Equipe A - Pós-Obra',
    role: 'Equipe Limpeza Pós-Obra',
    phone: '(11) 93456-7890',
    email: 'equipea@cleanpro.com.br',
    commission: 25,
    permissions: ['appointments'],
    isActive: true,
    createdAt: new Date('2024-06-10'),
  },
];

const DEFAULT_SUBSCRIPTION: Subscription = {
  planName: 'Plano Pro',
  status: 'active',
  renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  amount: 99.90,
  billingCycle: 'monthly',
  features: ['Até 5 funcionários', 'Relatórios avançados', 'Agenda ilimitada', 'Suporte prioritário'],
};

const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  emailEnabled: true,
  whatsappEnabled: true,
  pushEnabled: true,
  appointmentAlerts: true,
  paymentAlerts: true,
  reportAlerts: false,
  reminderHoursBefore: 24,
};

const DEFAULT_SECURITY: SecuritySettings = {
  twoFactorEnabled: false,
  lastPasswordChange: new Date('2024-10-01'),
  connectedDevices: [
    { id: '1', name: 'iPhone 14', lastAccess: new Date(), isCurrent: true },
    { id: '2', name: 'Chrome - Windows', lastAccess: new Date(Date.now() - 86400000), isCurrent: false },
  ],
  accessHistory: [
    { id: '1', date: new Date(), device: 'iPhone 14', location: 'São Paulo, SP' },
    { id: '2', date: new Date(Date.now() - 86400000), device: 'Chrome - Windows', location: 'São Paulo, SP' },
  ],
};

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

export function useProfileSettings() {
  const [profile, setProfile] = useState<UserProfile>(() => 
    loadFromStorage(STORAGE_KEYS.profile, DEFAULT_PROFILE)
  );
  const [salon, setSalon] = useState<SalonInfo>(() => 
    loadFromStorage(STORAGE_KEYS.salon, DEFAULT_SALON)
  );
  const [employees, setEmployees] = useState<Employee[]>(() => 
    loadFromStorage(STORAGE_KEYS.employees, DEFAULT_EMPLOYEES)
  );
  const [subscription] = useState<Subscription>(() => 
    loadFromStorage(STORAGE_KEYS.subscription, DEFAULT_SUBSCRIPTION)
  );
  const [notifications, setNotifications] = useState<NotificationSettings>(() => 
    loadFromStorage(STORAGE_KEYS.notifications, DEFAULT_NOTIFICATIONS)
  );
  const [security, setSecurity] = useState<SecuritySettings>(() => 
    loadFromStorage(STORAGE_KEYS.security, DEFAULT_SECURITY)
  );
  const [primaryColor, setPrimaryColor] = useState<string>(() => 
    loadFromStorage(STORAGE_KEYS.primaryColor, '#0EA5FF')
  );

  // Persist to localStorage
  useEffect(() => saveToStorage(STORAGE_KEYS.profile, profile), [profile]);
  useEffect(() => saveToStorage(STORAGE_KEYS.salon, salon), [salon]);
  useEffect(() => saveToStorage(STORAGE_KEYS.employees, employees), [employees]);
  useEffect(() => saveToStorage(STORAGE_KEYS.notifications, notifications), [notifications]);
  useEffect(() => saveToStorage(STORAGE_KEYS.security, security), [security]);
  useEffect(() => saveToStorage(STORAGE_KEYS.primaryColor, primaryColor), [primaryColor]);

  // Profile actions
  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  // Salon actions
  const updateSalon = (updates: Partial<SalonInfo>) => {
    setSalon(prev => ({ ...prev, ...updates }));
  };

  // Employee actions
  const addEmployee = (employee: Omit<Employee, 'id' | 'createdAt'>) => {
    const newEmployee: Employee = {
      ...employee,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setEmployees(prev => [...prev, newEmployee]);
    return newEmployee;
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
  };

  const toggleEmployeeStatus = (id: string) => {
    setEmployees(prev => prev.map(e => 
      e.id === id ? { ...e, isActive: !e.isActive } : e
    ));
  };

  // Notification actions
  const updateNotifications = (updates: Partial<NotificationSettings>) => {
    setNotifications(prev => ({ ...prev, ...updates }));
  };

  // Security actions
  const toggleTwoFactor = () => {
    setSecurity(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }));
  };

  const removeDevice = (deviceId: string) => {
    setSecurity(prev => ({
      ...prev,
      connectedDevices: prev.connectedDevices.filter(d => d.id !== deviceId),
    }));
  };

  const logoutAllDevices = () => {
    setSecurity(prev => ({
      ...prev,
      connectedDevices: prev.connectedDevices.filter(d => d.isCurrent),
    }));
  };

  // Payment history (mock data)
  const paymentHistory: PaymentHistory[] = [
    { id: '1', date: new Date(), amount: 99.90, status: 'paid', description: 'Plano Pro - Dezembro' },
    { id: '2', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), amount: 99.90, status: 'paid', description: 'Plano Pro - Novembro' },
    { id: '3', date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), amount: 99.90, status: 'paid', description: 'Plano Pro - Outubro' },
  ];

  return {
    // State
    profile,
    salon,
    employees,
    subscription,
    notifications,
    security,
    primaryColor,
    paymentHistory,

    // Actions
    updateProfile,
    updateSalon,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    toggleEmployeeStatus,
    updateNotifications,
    toggleTwoFactor,
    removeDevice,
    logoutAllDevices,
    setPrimaryColor,
  };
}
