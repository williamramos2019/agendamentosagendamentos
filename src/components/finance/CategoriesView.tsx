import { useState } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import type { Category } from "@/hooks/usePersonalFinance";

interface CategoriesViewProps {
  categories: Category[];
  onAdd: (category: Omit<Category, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<Category>) => void;
  onDelete: (id: string) => boolean;
}

const colors = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
  '#ec4899', '#f43f5e', '#64748b',
];

export function CategoriesView({ categories, onAdd, onUpdate, onDelete }: CategoriesViewProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState(colors[0]);
  const [type, setType] = useState<'income' | 'expense' | 'both'>('expense');

  const incomeCategories = categories.filter(c => c.type === 'income' || c.type === 'both');
  const expenseCategories = categories.filter(c => c.type === 'expense' || c.type === 'both');

  const resetForm = () => {
    setName("");
    setColor(colors[0]);
    setType('expense');
    setEditingCategory(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (category: Category) => {
    if (category.isDefault) return;
    setEditingCategory(category);
    setName(category.name);
    setColor(category.color);
    setType(category.type);
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!name) return;

    const categoryData = {
      name,
      color,
      type,
      icon: 'Tag',
    };

    if (editingCategory) {
      onUpdate(editingCategory.id, categoryData);
    } else {
      onAdd(categoryData);
    }

    setShowModal(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    const success = onDelete(id);
    if (!success) {
      // Could show a toast here
    }
  };

  const CategoryCard = ({ category }: { category: Category }) => (
    <div 
      className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl"
    >
      <div 
        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
        style={{ backgroundColor: category.color }}
      >
        {category.name.charAt(0)}
      </div>
      <span className="flex-1 font-medium text-foreground">{category.name}</span>
      {!category.isDefault && (
        <div className="flex gap-1">
          <button
            onClick={() => openEditModal(category)}
            className="p-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(category.id)}
            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}
      {category.isDefault && (
        <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded-full">
          Padrão
        </span>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Add Category Button */}
      <button
        onClick={openAddModal}
        className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-2xl text-muted-foreground hover:border-primary hover:text-primary transition-colors"
      >
        <Plus className="h-5 w-5" />
        <span className="font-medium">Nova Categoria</span>
      </button>

      {/* Expense Categories */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Categorias de Despesa</h3>
        <div className="space-y-2">
          {expenseCategories.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>

      {/* Income Categories */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Categorias de Receita</h3>
        <div className="space-y-2">
          {incomeCategories.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-sm flex items-end pb-[72px]">
          <div className="w-full bg-background rounded-t-3xl border-t border-border p-6 animate-slide-in-bottom">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 hover:bg-muted rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Nome</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Streaming, Academia..."
                  className="w-full p-4 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Type */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Tipo</label>
                <div className="flex gap-2">
                  {(['expense', 'income', 'both'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                        type === t 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {t === 'expense' ? 'Despesa' : t === 'income' ? 'Receita' : 'Ambos'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Cor</label>
                <div className="flex flex-wrap gap-2">
                  {colors.map(c => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-10 h-10 rounded-xl transition-all ${
                        color === c ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!name}
              className="w-full mt-6 py-4 bg-primary text-primary-foreground rounded-xl font-bold disabled:opacity-50"
            >
              {editingCategory ? 'Salvar Alterações' : 'Criar Categoria'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
