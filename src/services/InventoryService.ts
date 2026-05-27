import { InventoryProduct, Collaborator, PPEAssignment, StockMovement } from '@/core/types';
import { INITIAL_PRODUCTS, INITIAL_COLLABORATORS, INITIAL_ASSIGNMENTS, INITIAL_MOVEMENTS } from '@/data/inventoryData';

const STORAGE_KEYS = {
  PRODUCTS: 'cleanpro_inventory_products_v1',
  COLLABORATORS: 'cleanpro_inventory_collaborators_v1',
  ASSIGNMENTS: 'cleanpro_inventory_assignments_v1',
  MOVEMENTS: 'cleanpro_inventory_movements_v1',
};

class InventoryService {
  private load<T>(key: string, defaultValue: T): T {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;
    return JSON.parse(stored);
  }

  private save<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Products
  getProducts(): InventoryProduct[] {
    return this.load(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  }

  saveProduct(product: InventoryProduct): void {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.push(product);
    }
    this.save(STORAGE_KEYS.PRODUCTS, products);
  }

  // Collaborators
  getCollaborators(): Collaborator[] {
    return this.load(STORAGE_KEYS.COLLABORATORS, INITIAL_COLLABORATORS);
  }

  saveCollaborator(collaborator: Collaborator): void {
    const collaborators = this.getCollaborators();
    const index = collaborators.findIndex(c => c.id === collaborator.id);
    if (index >= 0) {
      collaborators[index] = collaborator;
    } else {
      collaborators.push(collaborator);
    }
    this.save(STORAGE_KEYS.COLLABORATORS, collaborators);
  }

  // Assignments
  getAssignments(): PPEAssignment[] {
    return this.load(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
  }

  saveAssignment(assignment: PPEAssignment): void {
    const assignments = this.getAssignments();
    const index = assignments.findIndex(a => a.id === assignment.id);
    if (index >= 0) {
      assignments[index] = assignment;
    } else {
      assignments.push(assignment);
    }
    this.save(STORAGE_KEYS.ASSIGNMENTS, assignments);
  }

  // Movements
  getMovements(): StockMovement[] {
    return this.load(STORAGE_KEYS.MOVEMENTS, INITIAL_MOVEMENTS);
  }

  saveMovement(movement: StockMovement): void {
    const movements = this.getMovements();
    movements.unshift(movement);
    this.save(STORAGE_KEYS.MOVEMENTS, movements);
  }

  // Transactions
  deliverPPE(collaboratorId: string, productId: string): void {
    const products = this.getProducts();
    const product = products.find(p => p.id === productId);
    
    if (product && product.quantity > 0) {
      // 1. Reduce stock
      product.quantity -= 1;
      this.saveProduct(product);

      // 2. Create assignment
      const newAssignment: PPEAssignment = {
        id: crypto.randomUUID(),
        collaboratorId,
        productId,
        assignedAt: new Date().toISOString(),
        status: 'active',
      };
      this.saveAssignment(newAssignment);

      // 3. Register movement
      const newMovement: StockMovement = {
        id: crypto.randomUUID(),
        productId,
        type: 'exit',
        quantity: 1,
        reason: `Entrega de EPI para colaborador ID: ${collaboratorId}`,
        date: new Date().toISOString(),
      };
      this.saveMovement(newMovement);
    }
  }

  returnPPE(assignmentId: string): void {
    const assignments = this.getAssignments();
    const assignment = assignments.find(a => a.id === assignmentId);

    if (assignment && assignment.status === 'active') {
      // 1. Update assignment
      assignment.status = 'returned';
      assignment.returnedAt = new Date().toISOString();
      this.saveAssignment(assignment);

      // 2. Increase stock
      const products = this.getProducts();
      const product = products.find(p => p.id === assignment.productId);
      if (product) {
        product.quantity += 1;
        this.saveProduct(product);

        // 3. Register movement
        const newMovement: StockMovement = {
          id: crypto.randomUUID(),
          productId: assignment.productId,
          type: 'entry',
          quantity: 1,
          reason: `Devolução de EPI pelo colaborador ID: ${assignment.collaboratorId}`,
          date: new Date().toISOString(),
        };
        this.saveMovement(newMovement);
      }
    }
  }

  updateStock(productId: string, quantity: number, type: 'entry' | 'exit', reason: string): void {
    const products = this.getProducts();
    const product = products.find(p => p.id === productId);

    if (product) {
      if (type === 'entry') {
        product.quantity += quantity;
      } else {
        product.quantity = Math.max(0, product.quantity - quantity);
      }
      this.saveProduct(product);

      const newMovement: StockMovement = {
        id: crypto.randomUUID(),
        productId,
        type,
        quantity,
        reason,
        date: new Date().toISOString(),
      };
      this.saveMovement(newMovement);
    }
  }
}

export const inventoryService = new InventoryService();
