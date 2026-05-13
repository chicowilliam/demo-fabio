import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="brand-eyebrow">Demo Profissional</p>
          <h1 className="brand-title">SuperMercado Guia</h1>
        </div>

        <div className="topbar-user">
          <span>Olá, {user?.name}</span>
          <button type="button" onClick={onSignOut} className="ghost-btn">
            Sair
          </button>
        </div>
      </header>

      <nav className="main-nav" aria-label="Navegação principal">
        <NavLink to="/" end>
          Guia de Setores
        </NavLink>
        <NavLink to="/setor/hortifruti">Setor em Destaque</NavLink>
        <NavLink to="/buscar-supermercados">Buscar Supermercados</NavLink>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AppShell;