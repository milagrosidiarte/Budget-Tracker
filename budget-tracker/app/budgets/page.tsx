"use client";

import { useState } from "react";
import { useBudgets, useCreateBudget, Budget } from "@/hooks/useBudgets";
import Link from "next/link";

export default function BudgetsPage() {
  const { data: budgets = [], isLoading } = useBudgets();
  const { mutate: createBudget, isPending } = useCreateBudget();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    amount: "",
    period: "monthly" as "monthly" | "yearly" | "custom",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) {
      alert("Por favor completa los campos requeridos");
      return;
    }

    createBudget(
      {
        name: formData.name,
        description: formData.description || undefined,
        amount: parseFloat(formData.amount),
        period: formData.period,
      },
      {
        onSuccess: () => {
          setFormData({ name: "", description: "", amount: "", period: "monthly" });
          setShowForm(false);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Presupuestos</h1>
            <p className="mt-1 text-gray-600">
              Gestiona tus presupuestos y gastos
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showForm ? "Cancelar" : "+ Nuevo Presupuesto"}
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Crear Presupuesto</h2>
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
                    placeholder="ej: Gastos de Alimentación"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monto *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Período
                  </label>
                  <select
                    value={formData.period}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        period: e.target.value as "monthly" | "yearly" | "custom",
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="monthly">Mensual</option>
                    <option value="yearly">Anual</option>
                    <option value="custom">Personalizado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Notas (opcional)"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  {isPending ? "Creando..." : "Crear"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg shadow">
          {isLoading ? (
            <div className="p-6 text-center text-gray-600">
              Cargando presupuestos...
            </div>
          ) : budgets.length === 0 ? (
            <div className="p-6 text-center text-gray-600">
              <p className="mb-4">No hay presupuestos creados</p>
              <button
                onClick={() => setShowForm(true)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Crear el primero
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Monto
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Período
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Creado
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {budgets.map((budget: Budget) => (
                    <tr
                      key={budget.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {budget.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        ${budget.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {budget.period === "monthly"
                          ? "Mensual"
                          : budget.period === "yearly"
                          ? "Anual"
                          : "Personalizado"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(budget.created_at).toLocaleDateString("es-AR")}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Link
                          href={`/budgets/${budget.id}`}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Ver detalles
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
