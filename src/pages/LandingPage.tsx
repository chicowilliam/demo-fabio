import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPin, Zap, Users, ShoppingCart } from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header
        className="sticky top-0 z-50 backdrop-blur"
        style={{ backgroundColor: 'rgba(255, 250, 242, 0.92)', borderBottom: '1px solid var(--line)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-8 h-8 text-accent" />
            <span className="font-fraunces text-2xl font-bold" style={{ color: 'var(--ink)' }}>
              Meu Guia
            </span>
          </div>
          <nav className="flex items-center gap-3 md:gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition"
                  style={{ background: 'var(--accent)', color: '#fff' }}
                >
                  Ir para Dashboard
                </Link>
                <Link
                  to="/dashboard/buscar-supermercados"
                  className="hidden md:inline text-sm font-semibold"
                  style={{ color: 'var(--ink-soft)' }}
                >
                  Buscar
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg font-semibold transition"
                style={{ background: 'var(--accent)', color: '#fff' }}
              >
                Entrar
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="brand-eyebrow">Inicio</p>
        <h1 className="font-fraunces text-5xl sm:text-6xl font-bold mb-6" style={{ color: 'var(--ink)' }}>
          Compre Inteligente,<br />
          <span style={{ color: 'var(--accent)' }}>Economize Tempo</span>
        </h1>
        <p className="text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--ink-soft)' }}>
          Organize suas compras por setor, encontre os melhores supermercados e deixe o planejamento
          inteligente otimizar sua rota de compras.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="px-10 py-4 rounded-xl font-extrabold transition inline-block shadow-lg text-lg"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              Entrar no Dashboard Agora
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-8 py-3 rounded-lg font-medium transition inline-block"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              Começar Agora
            </Link>
          )}
          <a
            href="#features"
            className="px-8 py-3 rounded-lg font-semibold transition inline-block"
            style={{ border: '2px solid var(--accent)', color: 'var(--accent)' }}
          >
            Saiba Mais
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="font-fraunces text-4xl font-bold text-center mb-16" style={{ color: 'var(--ink)' }}>
          Como Funciona
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-8 rounded-2xl transition" style={{ background: 'var(--surface)', border: '1px solid var(--line)', boxShadow: 'var(--shadow)' }}>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: 'rgba(239, 71, 111, 0.12)' }}>
              <MapPin className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-fraunces text-2xl font-bold mb-3" style={{ color: 'var(--ink)' }}>
              Organize por Setores
            </h3>
            <p style={{ color: 'var(--ink-soft)' }}>
              Veja todos os produtos organizados por setor. Frutas, laticínios, congelados e muito
              mais, tudo estruturado para facilitar sua compra.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 rounded-2xl transition" style={{ background: 'var(--surface)', border: '1px solid var(--line)', boxShadow: 'var(--shadow)' }}>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: 'rgba(255, 209, 102, 0.22)' }}>
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-fraunces text-2xl font-bold mb-3" style={{ color: 'var(--ink)' }}>
              Planejamento Inteligente
            </h3>
            <p style={{ color: 'var(--ink-soft)' }}>
              Nossa IA otimiza sua lista de compras, sugerindo a melhor ordem de produtos para
              economizar tempo na loja.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 rounded-2xl transition" style={{ background: 'var(--surface)', border: '1px solid var(--line)', boxShadow: 'var(--shadow)' }}>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: 'rgba(17, 138, 178, 0.15)' }}>
              <Users className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-fraunces text-2xl font-bold mb-3" style={{ color: 'var(--ink)' }}>
              Encontre Supermercados
            </h3>
            <p style={{ color: 'var(--ink-soft)' }}>
              Busque supermercados próximos a você, compare avaliações e encontre as melhores
              ofertas da região.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16" style={{ background: 'var(--ink)', color: '#fff' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="font-fraunces text-4xl font-bold text-accent mb-2">1000+</div>
              <p style={{ color: '#b9c7d8' }}>Supermercados Cadastrados</p>
            </div>
            <div>
              <div className="font-fraunces text-4xl font-bold text-accent mb-2">50+</div>
              <p style={{ color: '#b9c7d8' }}>Setores Disponíveis</p>
            </div>
            <div>
              <div className="font-fraunces text-4xl font-bold text-accent mb-2">42 min</div>
              <p style={{ color: '#b9c7d8' }}>Tempo Médio Economizado</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="font-fraunces text-4xl font-bold mb-6" style={{ color: 'var(--ink)' }}>
          Pronto para Comprar Inteligente?
        </h2>
        {isAuthenticated ? (
          <Link
            to="/dashboard"
            className="inline-block px-10 py-4 rounded-xl font-extrabold text-lg shadow-lg transition"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            Ir para Dashboard
          </Link>
        ) : (
          <Link
            to="/login"
            className="inline-block px-8 py-3 rounded-lg font-medium transition"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            Criar Conta Gratuita
          </Link>
        )}
      </section>

      {/* Footer */}
      <footer className="py-8" style={{ background: 'var(--ink)', borderTop: '1px solid #173f5f' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" style={{ color: '#b9c7d8' }}>
          <p>&copy; 2025 Meu Guia do Supermercado. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
