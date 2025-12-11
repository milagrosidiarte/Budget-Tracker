"use client";

import { useState } from "react";
import { useBudget, useDeleteBudget } from "@/hooks/useBudgets";
import { useTransactions, useCreateTransaction } from "@/hooks/useTransactions";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PageProps {
  params: {
    id: string;
  };
}

export default function BudgetDetailsPage({ params }: PageProps) {
  const router = useRouter();
  const { data: budget, isLoading } = useBudget(params.id);
  const { data: transactions = [] } = useTransactions(params.id);
  const { mutate: deleteBudget } = useDeleteBudget(params.id);
  const { mutate: createTransaction, isPending: isCreatingTransaction } =
    useCreateTransaction(params.id);

  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactionForm, setTransactionForm] = useState({
    description: "",
    amount: "",
    type: "expense" as "expense" | "income",
    category: "other",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const totalSpent = transactions.reduce(
    (sum, trans) => sum + (trans.type === "expense" ? trans.amount : -trans.amount),
    0
  );
  const percentageUsed = budget ? (totalSpent / budget.amount) * 100 : 0;

  const handleDeleteBudget = () => {
    if (confirm("¿Estás seguro de que deseas eliminar este presupuesto?")) {
      deleteBudget(undefined, {
        onSuccess: () => {
          router.push("/budgets");
        },
      });
    }
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionForm.description || !transactionForm.amount) {
      alert("Por favor completa los campos requeridos");
      return;
    }

    createTransaction(
      {
        description: transactionForm.description,
        amount: parseFloat(transactionForm.amount),
        type: transactionForm.type,
        category: transactionForm.category,
        date: transactionForm.date,
        notes: transactionForm.notes || undefined,
      },
      {
        onSuccess: () => {
          setTransactionForm({
            description: "",
            amount: "",
            type: "expense",
            category: "other",
            date: new Date().toISOString().split("T")[0],
            notes: "",
          });
          setShowTransactionForm(false);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-gray-600">Cargando presupuesto...</div>
      </div>
    );
  }

  if (!budget) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-red-600">Presupuesto no encontrado</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          href="/budgets"
          className="mb-6 inline-flex items-center text-blue-600 hover:text-blue-700"
        >
          ← Volver a Presupuestos
        </Link>

        {/* Budget Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{budget.name}</h1>
              {budget.description && (
                <p className="text-gray-600 mt-1">{budget.description}</p>
              )}
            </div>
            <button
              onClick={handleDeleteBudget}
              className="mt-4 sm:mt-0 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Eliminar
            </button>
          </div>

          {/* Budget Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Presupuesto Total</p>
              <p className="text-2xl font-bold text-blue-600">
                ${budget.amount.toFixed(2)}
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Gastado</p>
              <p className="text-2xl font-bold text-orange-600">
                ${totalSpent.toFixed(2)}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Disponible</p>
              <p className="text-2xl font-bold text-green-600">
                ${(budget.amount - totalSpent).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">
                Uso del Presupuesto
              </p>
              <p className="text-sm text-gray-600">{percentageUsed.toFixed(1)}%</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  percentageUsed > 100 ? "bg-red-600" : "bg-blue-600"
                }`}
                style={{ width: `${Math.min(percentageUsed, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Details */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Período</p>
              <p className="font-medium text-gray-900">
                {budget.period === "monthly"
                  ? "Mensual"
                  : budget.period === "yearly"
                  ? "Anual"
                  : "Personalizado"}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Fecha Inicio</p>
              <p className="font-medium text-gray-900">
                {new Date(budget.start_date).toLocaleDateString("es-AR")}
              </p>
            </div>
            {budget.end_date && (
              <div>
                <p className="text-gray-600">Fecha Fin</p>
                <p className="font-medium text-gray-900">
                  {new Date(budget.end_date).toLocaleDateString("es-AR")}
                </p>
              </div>
            )}
            <div>
              <p className="text-gray-600">Creado</p>
              <p className="font-medium text-gray-900">
                {new Date(budget.created_at).toLocaleDateString("es-AR")}
              </p>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Transacciones</h2>
            <button
              onClick={() => setShowTransactionForm(!showTransactionForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              {showTransactionForm ? "Cancelar" : "+ Agregar"}
            </button>
          </div>

          {/* Transaction Form */}
          {showTransactionForm && (
            <form onSubmit={handleAddTransaction} className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción *
                  </label>
                  <input
                    type="text"
                    value={transactionForm.description}
                    onChange={(e) =>
                      setTransactionForm({
                        ...transactionForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ej: Compra de alimentos"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monto *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={transactionForm.amount}
                    onChange={(e) =>
                      setTransactionForm({
                        ...transactionForm,
                        amount: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo
                  </label>
                  <select
                    value={transactionForm.type}
                    onChange={(e) =>
                      setTransactionForm({
                        ...transactionForm,
                        type: e.target.value as "expense" | "income",
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="expense">Gasto</option>
                    <option value="income">Ingreso</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría
                  </label>
                  <select
                    value={transactionForm.category}
                    onChange={(e) =>
                      setTransactionForm({
                        ...transactionForm,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="other">Otro</option>
                    <option value="food">Comida</option>
                    <option value="transport">Transporte</option>
                    <option value="entertainment">Entretenimiento</option>
                    <option value="utilities">Servicios</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={transactionForm.date}
                    onChange={(e) =>
                      setTransactionForm({
                        ...transactionForm,
                        date: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas (opcional)
                  </label>
                  <input
                    type="text"
                    value={transactionForm.notes}
                    onChange={(e) =>
                      setTransactionForm({
                        ...transactionForm,
                        notes: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Notas adicionales"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTransactionForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isCreatingTransaction}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  {isCreatingTransaction ? "Agregando..." : "Agregar"}
                </button>
              </div>
            </form>
          )}

          {/* Transactions List */}
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <p>No hay transacciones registradas</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Descripción
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                      Monto
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(transaction.date).toLocaleDateString("es-AR")}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {transaction.category}
                      </td>
                      <td
                        className={`px-6 py-4 text-sm font-medium text-right ${
                          transaction.type === "expense"
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {transaction.type === "expense" ? "-" : "+"}$
                        {transaction.amount.toFixed(2)}
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
