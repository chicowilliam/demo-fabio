import { useEffect, useMemo, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import brandLogo from '../assets/demo-supermercado.svg';
import { useAuth } from '../context/AuthContext';

function AppShell() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const navItems: Array<{ to: string; label: string; end?: boolean }> = [
    { to: '/dashboard', label: 'Guia de Setores', end: true },
    { to: '/dashboard/rota-cliente', label: 'Rota do Cliente' },
    { to: '/dashboard/setor/hortifruti', label: 'Setor em Destaque' },
    { to: '/dashboard/buscar-supermercados', label: 'Buscar Supermercados' },
    { to: '/dashboard/admin', label: 'Painel Admin' },
  ];

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200',
      isActive ? 'bg-rose-100 text-rose-700 shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    ].join(' ');

  const handleLogout = () => {
    logout();
    navigate('/dashboard', { replace: true });
  };

  const currentSection = useMemo(() => {
    if (location.pathname === '/dashboard') {
      return 'Guia de Setores';
    }

    const matched = navItems.find((item) => item.to !== '/dashboard' && location.pathname.startsWith(item.to));
    return matched?.label ?? 'Menu';
  }, [location.pathname]);

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

      <section className="mt-4 md:hidden" aria-label="Menu mobile">
        <div className="rounded-2xl border border-amber-100/80 bg-white/90 p-2 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
          <button
            type="button"
            onClick={() => setIsMobileNavOpen((previous) => !previous)}
            aria-expanded={isMobileNavOpen}
            aria-controls="mobile-dashboard-menu"
            className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left"
          >
            <span className="flex min-w-0 flex-col">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-rose-500">Navegacao</span>
              <span className="truncate text-sm font-semibold text-slate-800">{currentSection}</span>
            </span>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700">
              {isMobileNavOpen ? <X size={18} /> : <Menu size={18} />}
            </span>
          </button>

          <div
            id="mobile-dashboard-menu"
            className={[
              'overflow-hidden transition-all duration-300 ease-out',
              isMobileNavOpen ? 'mt-2 max-h-96 opacity-100' : 'max-h-0 opacity-0',
            ].join(' ')}
          >
            <nav className="grid gap-2 px-1 pb-1 pt-1" aria-label="Navegacao principal mobile">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </section>

      <nav
        className="mt-4 hidden flex-wrap gap-2 rounded-2xl border border-amber-100/80 bg-white/90 p-2 shadow-[0_8px_24px_rgba(15,23,42,0.08)] md:flex"
        aria-label="Navegacao principal"
      >
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <main className="mt-6">
        <Outlet />
      </main>
    </div>
  );
}

export default AppShell;