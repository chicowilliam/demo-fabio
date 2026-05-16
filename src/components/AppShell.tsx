import { NavLink, Outlet } from 'react-router-dom';
import brandLogo from '../assets/demo-supermercado.svg';

function AppShell() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <img src={brandLogo} alt="Logo Meu Guia do Super" className="brand-logo" />
          <div>
            <p className="brand-eyebrow">Demo Profissional</p>
            <h1 className="brand-title">Meu Guia do Super</h1>
          </div>
        </div>

        <div className="topbar-user">
          <span>Modo aberto para demonstração</span>
        </div>
      </header>

      <nav className="main-nav" aria-label="Navegação principal">
        <NavLink to="/dashboard" end>
          Guia de Setores
        </NavLink>
        <NavLink to="/dashboard/rota-cliente">Rota do Cliente</NavLink>
        <NavLink to="/dashboard/setor/hortifruti">Setor em Destaque</NavLink>
        <NavLink to="/dashboard/buscar-supermercados">Buscar Supermercados</NavLink>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AppShell;