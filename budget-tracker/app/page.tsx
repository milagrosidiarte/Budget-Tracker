"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">💰 Budget Tracker</h1>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-6 py-2 text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Gestiona tus presupuestos de forma inteligente
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Budget Tracker te ayuda a controlar tus gastos, establecer límites de presupuesto y tomar decisiones financieras más informadas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg transition transform hover:scale-105"
            >
              Comenzar gratis
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 font-semibold text-lg transition"
            >
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Características principales
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition">
              <div className="text-4xl mb-4">📊</div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Presupuestos por categoría</h4>
              <p className="text-gray-600">
                Crea presupuestos personalizados para diferentes categorías de gasto y controla tu dinero de forma detallada.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition">
              <div className="text-4xl mb-4">📈</div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Seguimiento en tiempo real</h4>
              <p className="text-gray-600">
                Visualiza tus gastos en tiempo real y recibe notificaciones cuando te acerques a tus límites de presupuesto.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition">
              <div className="text-4xl mb-4">🔒</div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Seguridad garantizada</h4>
              <p className="text-gray-600">
                Tus datos están protegidos con encriptación de nivel empresarial. Tu privacidad es nuestra prioridad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl font-bold text-gray-900 mb-8">
                ¿Por qué elegir Budget Tracker?
              </h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <span className="text-2xl">✨</span>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Fácil de usar</h4>
                    <p className="text-gray-600">Interfaz intuitiva que no requiere experiencia previa</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Rápido y responsivo</h4>
                    <p className="text-gray-600">Acceso instantáneo a tus datos desde cualquier dispositivo</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-2xl">💡</span>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Análisis inteligente</h4>
                    <p className="text-gray-600">Obtén insights sobre tus hábitos de gasto</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-2xl">🆓</span>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Completamente gratuito</h4>
                    <p className="text-gray-600">Sin cargos ocultos ni límites de uso</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg p-8 text-white">
              <div className="bg-white/20 rounded-lg p-6 backdrop-blur">
                <h4 className="text-2xl font-bold mb-4">Ejemplo de presupuesto</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Alimentación</span>
                    <span className="font-bold">$500 / $600</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full" style={{ width: "83%" }}></div>
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <span>Transporte</span>
                    <span className="font-bold">$150 / $300</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full" style={{ width: "50%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-6">
            Toma control de tu dinero hoy mismo
          </h3>
          <p className="text-xl mb-8 text-blue-100">
            Únete a miles de usuarios que ya están mejorando sus finanzas con Budget Tracker
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-semibold text-lg transition transform hover:scale-105"
            >
              Crear cuenta gratis
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-blue-700 font-semibold text-lg transition"
            >
              Inicia sesión
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-gray-300">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h5 className="text-white font-bold mb-4">Budget Tracker</h5>
              <p>Gestiona tus presupuestos de forma inteligente y toma mejores decisiones financieras.</p>
            </div>
            <div>
              <h5 className="text-white font-bold mb-4">Producto</h5>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">Características</a></li>
                <li><a href="#" className="hover:text-white transition">Precios</a></li>
                <li><a href="#" className="hover:text-white transition">Seguridad</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-4">Empresa</h5>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">Acerca de</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-4">Legal</h5>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">Privacidad</a></li>
                <li><a href="#" className="hover:text-white transition">Términos</a></li>
                <li><a href="#" className="hover:text-white transition">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p>&copy; 2025 Budget Tracker. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
