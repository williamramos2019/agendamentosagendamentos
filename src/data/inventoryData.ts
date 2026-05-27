import { InventoryProduct, Collaborator, PPEAssignment, StockMovement } from '@/core/types';

export const INITIAL_PRODUCTS: InventoryProduct[] = [
  {
    id: 'p1',
    code: 'EPI001',
    name: 'Máscara Respiratória PFF2',
    quantity: 45,
    minQuantity: 10,
    category: 'EPI',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p2',
    code: 'EPI002',
    name: 'Luvas de Nitrilo (Par)',
    quantity: 88,
    minQuantity: 20,
    category: 'EPI',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p3',
    code: 'EPI003',
    name: 'Óculos de Proteção',
    quantity: 12,
    minQuantity: 5,
    category: 'EPI',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p4',
    code: 'PRD001',
    name: 'Protetor de Tecido (Frasco)',
    quantity: 8,
    minQuantity: 5,
    category: 'Produto',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p5',
    code: 'PRD002',
    name: 'Cera de Carnaúba',
    quantity: 4,
    minQuantity: 3,
    category: 'Produto',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p6',
    code: 'PRD003',
    name: 'Kit Higienização Couro',
    quantity: 6,
    minQuantity: 2,
    category: 'Produto',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p7',
    code: 'PRD004',
    name: 'Aromatizante Automotivo',
    quantity: 15,
    minQuantity: 10,
    category: 'Produto',
    status: 'active',
    createdAt: new Date().toISOString(),
  }
];

export const INITIAL_COLLABORATORS: Collaborator[] = [
  {
    id: 'c1',
    name: 'Carlos Silva',
    role: 'Técnico em Higienização',
    department: 'Operacional',
    phone: '(31) 91234-5678',
    email: 'carlos@cleanpro.com.br',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'c2',
    name: 'Rodrigo Santos',
    role: 'Especialista Estética Automotiva',
    department: 'Operacional',
    phone: '(31) 92345-6789',
    email: 'rodrigo@cleanpro.com.br',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'c3',
    name: 'Equipe A - Pós-Obra',
    role: 'Equipe Limpeza Pós-Obra',
    department: 'Limpeza Pesada',
    phone: '(31) 93456-7890',
    email: 'equipea@cleanpro.com.br',
    isActive: true,
    createdAt: new Date().toISOString(),
  }
];

export const INITIAL_ASSIGNMENTS: PPEAssignment[] = [
  {
    id: 'a1',
    collaboratorId: 'c1',
    productId: 'p1',
    assignedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'active',
  },
  {
    id: 'a2',
    collaboratorId: 'c1',
    productId: 'p3',
    assignedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: 'active',
  }
];

export const INITIAL_MOVEMENTS: StockMovement[] = [
  {
    id: 'm1',
    productId: 'p1',
    type: 'exit',
    quantity: 5,
    reason: 'Entrega de EPI para colaborador',
    date: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'm2',
    productId: 'p4',
    type: 'entry',
    quantity: 10,
    reason: 'Compra de fornecedor',
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
  }
];
