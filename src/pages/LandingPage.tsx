import { Link } from 'react-router-dom';
import { MapPin, Zap, Users, ShoppingCart } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="landing-shell landing-header-row">
          <div className="landing-brand">
            <ShoppingCart className="landing-brand-icon" />
            <span>Meu Guia</span>
          </div>

          <nav className="landing-nav">
            <>
              <Link to="/dashboard" className="landing-cta-primary">
                Ir para Dashboard
              </Link>

              <Link to="/dashboard/buscar-supermercados" className="landing-nav-link">
                Buscar
              </Link>
            </>
          </nav>
        </div>
      </header>

      <section className="landing-hero">
        <div className="landing-shell">
          <div className="landing-floating-scene" aria-hidden="true">
            <img src="/images/produce/apple_cut_v2.png" alt="" className="float-item float-a" />
            <img src="/images/produce/tomato_cut_v2.png" alt="" className="float-item float-b" />
            <img src="/images/produce/carrot_cut_v2.png" alt="" className="float-item float-c" />
            <img src="/images/produce/banana_cut_v2.png" alt="" className="float-item float-d" />
            <img src="/images/produce/bread_cut_v2.png" alt="" className="float-item float-e" />
            <img src="/images/produce/fish_cut_v2.png" alt="" className="float-item float-f" />
            <img src="/images/produce/pao_frances_cut_v2.png" alt="" className="float-item float-g" />
          </div>

          <div className="landing-hero-center">
            <p className="brand-eyebrow">Inicio</p>
            <h1>
              Compre inteligente,
              <br />
              <span>economize tempo</span>
            </h1>
            <p>
              Uma rota visual para o cliente seguir no mercado, com sequência otimizada de
              corredores e menos deslocamento.
            </p>

            <div className="landing-hero-actions">
              <Link to="/dashboard" className="landing-cta-primary">
                Entrar no dashboard agora
              </Link>

              <a href="#features" className="landing-cta-secondary">
                Saiba mais
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="landing-features">
        <div className="landing-shell">
          <h2>Como funciona</h2>
          <div className="landing-features-grid">
            <article className="landing-feature-card">
              <div className="landing-feature-icon bg-rose-soft">
                <MapPin className="w-6 h-6" />
              </div>
              <h3>Organize por setores</h3>
              <p>
                Veja produtos agrupados por corredor para reduzir indecisao e manter uma compra
                fluida.
              </p>
            </article>

            <article className="landing-feature-card">
              <div className="landing-feature-icon bg-sun-soft">
                <Zap className="w-6 h-6" />
              </div>
              <h3>Planejamento inteligente</h3>
              <p>
                A lista vira um percurso em ordem eficiente, evitando voltas e economizando minutos
                reais no mercado.
              </p>
            </article>

            <article className="landing-feature-card">
              <div className="landing-feature-icon bg-ocean-soft">
                <Users className="w-6 h-6" />
              </div>
              <h3>Encontre supermercados</h3>
              <p>Compare opcoes proximas e escolha o melhor ponto para executar sua rota guiada.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="landing-stats">
        <div className="landing-shell landing-stats-grid">
          <article>
            <strong>1000+</strong>
            <span>Supermercados cadastrados</span>
          </article>
          <article>
            <strong>50+</strong>
            <span>Setores disponiveis</span>
          </article>
          <article>
            <strong>42 min</strong>
            <span>Tempo medio economizado</span>
          </article>
        </div>
      </section>

      <section className="landing-cta-band">
        <div className="landing-shell">
          <h2>Pronto para comprar com rota guiada?</h2>
          <Link to="/dashboard" className="landing-cta-primary">
            Ir para dashboard
          </Link>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-shell">
          <p>&copy; 2025 Meu Guia do Supermercado. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
