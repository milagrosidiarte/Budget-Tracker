import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function DashboardPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <Link
            href="/api/logout"
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded-md transition"
          >
            Cerrar sesión
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-gray-600 mb-8">Bienvenido a Budget Tracker</p>

          {user ? (
            <div className="space-y-4">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-xl font-semibold text-gray-900">{user.email}</p>
              </div>

              <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
                <p className="text-sm text-gray-600">Nombre</p>
                <p className="text-xl font-semibold text-gray-900">
                  {user.user_metadata?.full_name || "No registrado"}
                </p>
              </div>

              <div className="mt-8">
                <p className="text-gray-700 font-medium">
                  🎉 Próximamente: Gestión de presupuestos y transacciones
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">Cargando...</p>
          )}
        </div>
      </div>
    </div>
  );
}
