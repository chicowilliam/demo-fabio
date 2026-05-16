import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell';
import LandingPage from './pages/LandingPage';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const SectorPage = lazy(() => import('./pages/SectorPage'));
const SearchSupermarketsPage = lazy(() => import('./pages/SearchSupermarketsPage'));
const ClientRoutePage = lazy(() => import('./pages/ClientRoutePage'));

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Navigate to="/dashboard" replace />} />

      <Route path="/dashboard" element={<AppShell />}>
        <Route
          index
          element={
            <Suspense fallback={<p>Carregando dashboard...</p>}>
              <DashboardPage />
            </Suspense>
          }
        />
        <Route
          path="setor/:sectorId"
          element={
            <Suspense fallback={<p>Carregando setor...</p>}>
              <SectorPage />
            </Suspense>
          }
        />
        <Route
          path="buscar-supermercados"
          element={
            <Suspense fallback={<p>Carregando busca...</p>}>
              <SearchSupermarketsPage />
            </Suspense>
          }
        />
        <Route
          path="rota-cliente"
          element={
            <Suspense fallback={<p>Carregando rota...</p>}>
              <ClientRoutePage />
            </Suspense>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;