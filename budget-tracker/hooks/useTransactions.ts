import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Tipos
export interface Transaction {
  id: string;
  budget_id: string;
  user_id: string;
  category?: string;
  amount: number;
  type: "expense" | "income";
  description?: string;
  notes?: string;
  date: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateTransactionInput {
  amount: number;
  type?: "expense" | "income";
  category?: string;
  description?: string;
  date: string;
  notes?: string;
}

// Hook para obtener transacciones de un presupuesto
export function useTransactions(budgetId: string) {
  return useQuery<Transaction[]>({
    queryKey: ["transactions", budgetId],
    queryFn: async () => {
      const response = await fetch(`/api/budgets/${budgetId}/transactions`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error al obtener transacciones");
      return response.json();
    },
    enabled: !!budgetId,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook para obtener una transacción específica
export function useTransaction(budgetId: string, id: string) {
  return useQuery<Transaction>({
    queryKey: ["transactions", budgetId, id],
    queryFn: async () => {
      const response = await fetch(
        `/api/budgets/${budgetId}/transactions/${id}`,
        { credentials: "include" }
      );
      if (!response.ok) throw new Error("Error al obtener transacción");
      return response.json();
    },
    enabled: !!id && !!budgetId,
  });
}

// Hook para crear transacción
export function useCreateTransaction(budgetId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTransactionInput) => {
      try {
        const response = await fetch(`/api/budgets/${budgetId}/transactions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        });
        const responseData = await response.json();
        
        if (!response.ok) {
          console.error("Error response:", responseData);
          throw new Error(responseData.error || "Error al crear transacción");
        }
        return responseData;
      } catch (error) {
        console.error("Mutation error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions", budgetId],
      });
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      toast.success("Transacción creada correctamente");
    },
    onError: (error: Error) => {
      console.error("Error creating transaction:", error);
      toast.error(error.message || "Error al crear transacción");
    },
  });
}

// Hook para actualizar transacción
export function useUpdateTransaction(budgetId: string, id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<CreateTransactionInput>) => {
      const response = await fetch(
        `/api/budgets/${budgetId}/transactions/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error("Error al actualizar transacción");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", budgetId] });
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      toast.success("Transacción actualizada correctamente");
    },
    onError: () => {
      toast.error("Error al actualizar transacción");
    },
  });
}

// Hook para eliminar transacción
export function useDeleteTransaction(budgetId: string, id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `/api/budgets/${budgetId}/transactions/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Error al eliminar transacción");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions", budgetId],
      });
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      toast.success("Transacción eliminada correctamente");
    },
    onError: () => {
      toast.error("Error al eliminar transacción");
    },
  });
}
