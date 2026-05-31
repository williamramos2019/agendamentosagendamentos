import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { saleRepository } from "@/repositories/SaleRepository";
import { Sale } from "@/core/types";
import { toast } from "sonner";
import { useCash } from "./useCash";

export function useSales() {
  const queryClient = useQueryClient();
  const { cashState, addCashOperation } = useCash();

  const { data: sales = [], isLoading } = useQuery({
    queryKey: ["sales"],
    queryFn: () => saleRepository.getAll(),
  });

  const addSaleMutation = useMutation({
    mutationFn: async (saleData: Omit<Sale, 'id' | 'createdAt'>) => {
      const newSale = await saleRepository.create(saleData);
      
      if (cashState.isOpen) {
        await addCashOperation(
          'sale' as any, // Using 'sale' type for cash operation
          saleData.total,
          `Venda: ${saleData.items.map(i => i.name).join(', ')}`
        );
      }
      
      return newSale;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["cash-operations"] });
      toast.success("Venda registrada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao registrar venda");
    },
  });

  const todayRevenue = sales
    .filter(s => new Date(s.createdAt).toDateString() === new Date().toDateString())
    .reduce((acc, s) => acc + s.total, 0);

  return {
    sales,
    isLoading,
    addSale: addSaleMutation.mutateAsync,
    todayRevenue,
  };
}
