import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Tipos
export interface Budget {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  amount: number;
  period: "monthly" | "yearly" | "custom";
  start_date: string;
  end_date?: string;
  color?: string;
  is_archived?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CreateBudgetInput {
  name: string;
  description?: string;
  amount: number;
  period: "monthly" | "yearly" | "custom";
  start_date?: string;
  end_date?: string;
  color?: string;
}

// Hook para obtener presupuestos
export function useBudgets() {
  return useQuery<Budget[]>({
    queryKey: ["budgets"],
    queryFn: async () => {
      const response = await fetch("/api/budgets", { 
        credentials: "include" 
      });
      if (!response.ok) throw new Error("Error al obtener presupuestos");
      return response.json();
    },
  });
}

// Hook para obtener un presupuesto específico
export function useBudget(id: string) {
  return useQuery<Budget>({
    queryKey: ["budgets", id],
    queryFn: async () => {
      console.log(`[HOOK] useBudget: fetching budget ${id}`);
      const response = await fetch(`/api/budgets/${id}`, { 
        credentials: "include" 
      });
      
      console.log(`[HOOK] useBudget response status: ${response.status}`);
      
      if (!response.ok) {
        const error = await response.json();
        console.error(`[HOOK] useBudget error:`, error);
        throw new Error(`Error al obtener presupuesto: ${error.error || response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`[HOOK] useBudget: success`, data.id);
      return data;
    },
    enabled: !!id,
  });
}

// Hook para crear presupuesto
export function useCreateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBudgetInput) => {
      try {
        const response = await fetch("/api/budgets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        });
        const responseData = await response.json();
        
        if (!response.ok) {
          console.error("Error response:", responseData);
          throw new Error(responseData.error || "Error al crear presupuesto");
        }
        return responseData;
      } catch (error) {
        console.error("Mutation error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      toast.success("Presupuesto creado correctamente");
    },
    onError: (error: Error) => {
      console.error("Error creating budget:", error);
      toast.error(error.message || "Error al crear presupuesto");
    },
  });
}

// Hook para actualizar presupuesto
export function useUpdateBudget(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<CreateBudgetInput>) => {
      const response = await fetch(`/api/budgets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Error al actualizar presupuesto");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["budgets", id] });
      toast.success("Presupuesto actualizado correctamente");
    },
    onError: () => {
      toast.error("Error al actualizar presupuesto");
    },
  });
}

// Hook para eliminar presupuesto
export function useDeleteBudget(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/budgets/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error al eliminar presupuesto");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      toast.success("Presupuesto eliminado correctamente");
    },
    onError: () => {
      toast.error("Error al eliminar presupuesto");
    },
  });
}
