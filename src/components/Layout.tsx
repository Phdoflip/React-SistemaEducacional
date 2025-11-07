import { Link, Outlet, useLocation } from "react-router-dom";

export default function Layout() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path)
      ? "text-blue-600"
      : "text-gray-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center sm:text-left">
            Sistema Educacional
          </h1>
          <nav className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6">
            <Link
              to="/courses"
              className={`${isActive(
                "/courses"
              )} hover:text-blue-700 font-medium px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-blue-50`}
            >
              Cursos
            </Link>
            <Link
              to="/classes"
              className={`${isActive(
                "/classes"
              )} hover:text-blue-700 font-medium px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-blue-50`}
            >
              Turmas
            </Link>
            <Link
              to="/students"
              className={`${isActive(
                "/students"
              )} hover:text-blue-700 font-medium px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-blue-50`}
            >
              Estudantes
            </Link>
            <Link
              to="/grades"
              className={`${isActive(
                "/grades"
              )} hover:text-blue-700 font-medium px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-blue-50`}
            >
              Lançar Notas
            </Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-200px)]">
        <Outlet />
      </main>
    </div>
  );
}
