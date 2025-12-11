"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Validaciones
    if (!fullName.trim()) {
      toast.error("Por favor ingresa tu nombre completo");
      setLoading(false);
      return;
    }

    if (!email || !email.includes("@")) {
      toast.error("Por favor ingresa un email válido");
      setLoading(false);
      return;
    }

    if (!password || password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      // Llamar al endpoint del servidor
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          fullName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Error al registrarse");
        setLoading(false);
        return;
      }

      setSuccess(true);
      toast.success("Cuenta creada. Verifica tu email para confirmar");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error("Error al crear la cuenta. Intenta de nuevo.");
      setLoading(false);
    }
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-600 to-indigo-700 p-4">
        <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Crear Cuenta</h1>
          <p className="text-gray-700 mb-6 font-medium">Únete a Budget Tracker</p>

          {success ? (
            <div className="bg-green-100 border-2 border-green-500 text-green-900 p-4 rounded-md text-center">
              <p className="font-bold text-lg">✓ Cuenta creada</p>
              <p className="text-sm mt-2 font-semibold">Verifica tu email para confirmar</p>
              <p className="text-sm mt-2">Redirigiendo...</p>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  className="border-2 border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white text-gray-900"
                  placeholder="Tu nombre"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="border-2 border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white text-gray-900"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  className="border-2 border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white text-gray-900"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  className="border-2 border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white text-gray-900"
                  placeholder="Repite la contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold px-4 py-3 rounded-md w-full transition transform hover:scale-105 active:scale-95"
              >
                {loading ? "Registrando..." : "Crear Cuenta"}
              </button>

              <p className="text-center text-sm text-gray-700 font-medium">
                ¿Ya tienes cuenta?{" "}
                <a href="/login" className="text-blue-600 hover:text-blue-700 font-bold underline">
                  Inicia sesión
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
