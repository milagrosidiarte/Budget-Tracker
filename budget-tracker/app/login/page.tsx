"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

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

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Importante: incluir cookies en la request
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Error al iniciar sesión");
        setLoading(false);
        return;
      }

      // Las cookies http-only se configuran automáticamente en la respuesta
      // No necesitamos hacer nada más con los tokens

      toast.success("¡Iniciaste sesión correctamente!");
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (err) {
      console.error(err);
      toast.error("Error al iniciar sesión. Intenta de nuevo.");
      setLoading(false);
    }
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-600 to-indigo-700 p-4">
        <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Budget Tracker</h1>
          <p className="text-gray-700 mb-6 font-medium">Inicia sesión en tu cuenta</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
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
              <label className="block text-sm font-semibold text-gray-900 mb-2">Contraseña</label>
              <input
                type="password"
                className="border-2 border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white text-gray-900"
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold px-4 py-3 rounded-md w-full transition transform hover:scale-105 active:scale-95"
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>

            <p className="text-center text-sm text-gray-700 font-medium">
              ¿No tienes cuenta?{" "}
              <a href="/register" className="text-blue-600 hover:text-blue-700 font-bold underline">
                Registrate aquí
              </a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}