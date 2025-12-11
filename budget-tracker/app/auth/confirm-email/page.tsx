"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { createClient } from "@/lib/supabase-client";

export default function ConfirmEmailPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      toast.success("Sesión cerrada");
      setTimeout(() => router.push("/login"), 1000);
    } catch {
      toast.error("Error al cerrar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="text-5xl mb-4">📧</div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Confirma tu Email</h1>
          <p className="text-gray-700 mb-6">
            Hemos enviado un enlace de confirmación a tu email. Por favor, revisa tu bandeja de entrada y haz clic en el enlace para confirmar tu cuenta.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 text-left">
            <p className="text-sm text-gray-700">
              <strong>💡 Nota:</strong> Si no ves el email en los próximos minutos, revisa tu carpeta de spam.
            </p>
          </div>

          <button
            onClick={handleLogout}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold px-4 py-3 rounded-md w-full transition"
          >
            {loading ? "Cerrando sesión..." : "Cerrar sesión"}
          </button>

          <p className="text-xs text-gray-500 mt-4">
            Una vez confirmes tu email, podrás acceder a tu dashboard
          </p>
        </div>
      </div>
    </>
  );
}
