import { Link } from "react-router-dom";

const features = [
  {
    title: "Busca tu alojamiento",
    description:
      "Explora apartamentos, villas, cabañas y lofts en distintos destinos desde un solo lugar.",
  },
  {
    title: "Reserva en minutos",
    description:
      "Selecciona fechas, confirma tu reserva y gestiona tus pagos de forma simple y segura.",
  },
  {
    title: "Conversa con anfitriones",
    description:
      "Chatea en tiempo real con los anfitriones para resolver cualquier duda antes de viajar.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/favicon.svg" alt="StayHub" className="h-8 w-8" />
            <span className="text-xl font-bold text-indigo-600">StayHub</span>
          </div>
          <nav className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-full text-indigo-600 font-medium hover:bg-indigo-50 transition"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
            >
              Crear cuenta
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Encuentra tu alojamiento ideal
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            StayHub es una plataforma para buscar y reservar alojamientos, con
            panel de anfitrión, pagos y chat en tiempo real.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/register"
              className="px-6 py-3 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            >
              Comenzar ahora
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
            >
              Ya tengo cuenta
            </Link>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-gray-200 p-6 shadow-sm"
              >
                <h2 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          <p className="font-medium text-gray-700">
            Proyecto de demostración
          </p>
          <p className="mt-1">
            StayHub es un proyecto educativo y no un servicio comercial real.
            No introduzcas datos personales, contraseñas ni información de
            pago reales.
          </p>
        </div>
      </footer>
    </div>
  );
}
