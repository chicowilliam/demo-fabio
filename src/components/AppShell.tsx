import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import brandLogo from '../assets/demo-supermercado.svg';
import { useAuth } from '../context/AuthContext';

function AppShell() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200',
      isActive ? 'bg-rose-100 text-rose-700 shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    ].join(' ');

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-[1380px] px-4 pb-10 pt-6 md:px-6">
      <header className="rounded-3xl border border-amber-100/80 bg-white/95 p-5 shadow-[0_14px_40px_rgba(15,23,42,0.12)] backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={brandLogo}
              alt="Logo Meu Guia do Super"
              className="h-12 w-12 rounded-xl border border-amber-100 bg-white p-1.5"
            />
          <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-rose-500">Demo Profissional</p>
              <h1 className="font-['Fraunces'] text-[clamp(1.25rem,2.4vw,2rem)] font-semibold text-slate-900">
                Meu Guia do Super
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
              {user ? `Logado como ${user.name}` : 'Modo aberto para demonstracao'}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <nav
        className="mt-4 flex flex-wrap gap-2 rounded-2xl border border-amber-100/80 bg-white/90 p-2 shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
        aria-label="Navegacao principal"
      >
        <NavLink to="/dashboard" end className={navLinkClass}>
          Guia de Setores
        </NavLink>
        <NavLink to="/dashboard/rota-cliente" className={navLinkClass}>
          Rota do Cliente
        </NavLink>
        <NavLink to="/dashboard/setor/hortifruti" className={navLinkClass}>
          Setor em Destaque
        </NavLink>
        <NavLink to="/dashboard/buscar-supermercados" className={navLinkClass}>
          Buscar Supermercados
        </NavLink>
        <NavLink to="/dashboard/admin" className={navLinkClass}>
          Painel Admin
        </NavLink>
      </nav>

      <main className="mt-6">
        <Outlet />
      </main>
    </div>
  );
}

export default AppShell;