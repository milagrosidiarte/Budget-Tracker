"use client";

import { useState } from "react";
import { useCategories, useCreateCategory, useDeleteCategory } from "@/hooks/useCategories";
import Link from "next/link";

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", color: "#3B82F6" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[handleSubmit] Form data:", formData);
    
    if (!formData.name.trim()) {
      alert("Por favor ingresa un nombre para la categoría");
      return;
    }

    console.log("[handleSubmit] Creando categoría:", formData);
    createCategory(
      { name: formData.name, color: formData.color },
      {
        onSuccess: () => {
          console.log("[handleSubmit] Éxito - reseteando formulario");
          setFormData({ name: "", color: "#3B82F6" });
          setShowForm(false);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium"
        >
          <span className="text-xl">←</span> Volver al Dashboard
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
            <p className="mt-1 text-gray-600">
              Crea y gestiona tus categorías de gastos
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showForm ? "Cancelar" : "+ Nueva Categoría"}
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Crear Categoría</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ej: Comida, Transporte"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                      className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.color}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isCreating ? "Creando..." : "Crear Categoría"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="p-6 text-center text-gray-600">Cargando categorías...</div>
          ) : categories.length === 0 ? (
            <div className="p-6 text-center text-gray-600">
              No tienes categorías creadas. ¡Crea tu primera categoría!
            </div>
          ) : (
            <div className="divide-y">
              {categories.map((category) => (
                <CategoryItem key={category.id} category={category} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CategoryItem({
  category,
}: {
  category: { id: string; name: string; color?: string };
}) {
  const { mutate: deleteCategory } = useDeleteCategory(category.id);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    if (confirm(`¿Deseas eliminar la categoría "${category.name}"?`)) {
      setIsDeleting(true);
      deleteCategory(undefined, {
        onSuccess: () => setIsDeleting(false),
        onError: () => setIsDeleting(false),
      });
    }
  };

  return (
    <div className="p-4 flex items-center justify-between hover:bg-gray-50">
      <div className="flex items-center gap-3">
        <div
          className="w-6 h-6 rounded-full"
          style={{ backgroundColor: category.color || "#3B82F6" }}
        />
        <span className="font-medium text-gray-900">{category.name}</span>
      </div>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      >
        {isDeleting ? "Eliminando..." : "Eliminar"}
      </button>
    </div>
  );
}
