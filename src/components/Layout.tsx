import { Link, Outlet, useLocation } from "react-router-dom";
import { GraduationCap } from "lucide-react";

export default function Layout() {
  const location = useLocation();

  const isActive = (path: string) => (location.pathname.startsWith(path) ? "active" : "");

  return (
    <div className="layout-container">
      <header className="header">
        <div className="header-content">
          <h1 className="header-title">
            <GraduationCap size={36} /> Sistema Educacional
          </h1>

          <nav className="header-nav">
            {[
              { path: "/courses", label: "Cursos" },
              { path: "/classes", label: "Turmas" },
              { path: "/students", label: "Estudantes" },
              { path: "/grades", label: "Lançar Notas" },
            ].map(({ path, label }) => (
              <Link key={path} to={path} className={`nav-link ${isActive(path)}`}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        © {new Date().getFullYear()} Sistema Educacional — Desenvolvido com ❤️
      </footer>
    </div>
  );
}
