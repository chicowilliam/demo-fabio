import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AppShell from './components/AppShell';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const SectorPage = lazy(() => import('./pages/SectorPage'));
const SearchSupermarketsPage = lazy(() => import('./pages/SearchSupermarketsPage'));
const ClientRoutePage = lazy(() => import('./pages/ClientRoutePage'));

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
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