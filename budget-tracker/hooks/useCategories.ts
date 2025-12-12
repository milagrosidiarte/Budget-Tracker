import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Tipos
export interface Category {
  id: string;
  user_id: string;
  name: string;
  type?: string;
  color: string;
  created_at: string;
}

export interface CreateCategoryInput {
  name: string;
  color?: string;
}

// Mapeo de tipos a colores (ya no se usa)
export const TYPE_COLORS: Record<string, string> = {
  personal: "#3B82F6",    // Azul
  negocios: "#10B981",    // Verde
  otro: "#F59E0B",        // Ámbar
};

// Hook para obtener categorías del usuario
export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error al obtener categorías");
      return response.json();
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}

// Hook para crear una categoría
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCategoryInput) => {
      console.log("[useCreateCategory] Enviando:", data);
      
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      console.log("[useCreateCategory] Status:", response.status);
      
      if (!response.ok) {
        const error = await response.json();
        console.error("[useCreateCategory] Error response:", error);
        throw new Error(error.error || "Error al crear categoría");
      }

      const result = await response.json();
      console.log("[useCreateCategory] Éxito:", result);
      return result;
    },
    onSuccess: () => {
      console.log("[useCreateCategory] onSuccess - invalidando query");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoría creada correctamente");
    },
    onError: (error: Error) => {
      console.error("[useCreateCategory] onError:", error);
      toast.error(error.message);
    },
  });
}

// Hook para actualizar una categoría
export function useUpdateCategory(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<CreateCategoryInput>) => {
      const response = await fetch(`/api/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al actualizar categoría");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoría actualizada correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Hook para eliminar una categoría
export function useDeleteCategory(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al eliminar categoría");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoría eliminada correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
