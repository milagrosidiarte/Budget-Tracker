"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { useBudgets } from "@/hooks/useBudgets";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const { data: budgets = [] } = useBudgets();
  const [user, setUser] = useState<{ user_metadata?: { full_name?: string }; email?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Cargando...</div>
      </div>
    );
  }

  // Calculate statistics
  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Budget Tracker</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Hola, {user?.user_metadata?.full_name || "Usuario"}
          </h2>
          <p className="text-gray-600 mt-2">
            {user?.email}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Total Presupuestos</p>
            <p className="text-3xl font-bold text-blue-600">{budgets.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Total Presupuestado</p>
            <p className="text-3xl font-bold text-green-600">
              ${totalBudget.toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Transacciones</p>
            <p className="text-3xl font-bold text-purple-600">0</p>
          </div>
        </div>

        {/* Recent Budgets */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              Presupuestos Recientes
            </h3>
            <Link
              href="/budgets"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Ver todos →
            </Link>
          </div>

          {budgets.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <p className="mb-4">No hay presupuestos creados</p>
              <Link
                href="/budgets"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Crear presupuesto
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {budgets.slice(0, 5).map((budget) => (
                <div
                  key={budget.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{budget.name}</p>
                    <p className="text-sm text-gray-600">
                      ${budget.amount.toFixed(2)} - {budget.period}
                    </p>
                  </div>
                  <Link
                    href={`/budgets/${budget.id}`}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Ver detalles
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            ℹ️ Cómo usar Budget Tracker
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>1. Ve a la sección de Presupuestos para crear un nuevo presupuesto</li>
            <li>2. Luego puedes agregar transacciones a cada presupuesto</li>
            <li>
              3. Visualiza tu progreso y controla tus gastos en tiempo real
            </li>
            <li>4. Analiza tus patrones de gasto por categoría</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
