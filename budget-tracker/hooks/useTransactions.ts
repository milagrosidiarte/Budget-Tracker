import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getAuthHeaders } from "@/lib/auth-utils";

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
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/budgets/${budgetId}/transactions`, {
        headers,
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
      const headers = await getAuthHeaders();
      const response = await fetch(
        `/api/budgets/${budgetId}/transactions/${id}`,
        { headers }
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
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/budgets/${budgetId}/transactions`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Error al crear transacción");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions", budgetId],
      });
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      toast.success("Transacción creada correctamente");
    },
    onError: () => {
      toast.error("Error al crear transacción");
    },
  });
}

// Hook para actualizar transacción
export function useUpdateTransaction(budgetId: string, id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<CreateTransactionInput>) => {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `/api/budgets/${budgetId}/transactions/${id}`,
        {
          method: "PATCH",
          headers,
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
      const headers = await getAuthHeaders();
      const response = await fetch(
        `/api/budgets/${budgetId}/transactions/${id}`,
        {
          method: "DELETE",
          headers,
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
