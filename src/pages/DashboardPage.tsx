import { Link } from 'react-router-dom';
import { sectors } from '../data/sectors';

function DashboardPage() {
  return (
    <section>
      <div className="hero-grid">
        <article className="hero-card hero-main">
          <p className="brand-eyebrow">Experiência Cliente</p>
          <h2>Roteiro visual para o cliente seguir na loja</h2>
          <p>
            Ative a rota guiada para transformar sua lista em sequência de corredores. O cliente
            acompanha cada parada em ordem otimizada, com foco em fluidez e menos ida e volta.
          </p>
          <div className="hero-main-cta">
            <Link to="/dashboard/rota-cliente">Abrir rota do cliente</Link>
          </div>
        </article>

        <article className="hero-card hero-metric">
          <span>Total de setores</span>
          <strong>{sectors.length}</strong>
        </article>

        <article className="hero-card hero-metric">
          <span>Tempo médio com rota</span>
          <strong>42 min</strong>
        </article>
      </div>

      <article className="route-preview-card">
        <h3>Fluxo rápido de compra</h3>
        <div className="route-preview-track">
          <span>Entrada</span>
          <span>Hortifruti</span>
          <span>Mercearia</span>
          <span>Limpeza</span>
          <span>Laticínios</span>
          <span>Checkout</span>
        </div>
      </article>

      <div className="sectors-grid">
        {sectors.map((sector) => (
          <article key={sector.id} className="sector-card">
            <div className="sector-card-top">
              <h3>{sector.title}</h3>
              <span>{sector.aisle}</span>
            </div>

            <p>{sector.tip}</p>

            <ul>
              {sector.checklist.slice(0, 3).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className="sector-card-bottom">
              <small>Tempo médio: {sector.averageTime}</small>
              <Link to={`/dashboard/setor/${sector.id}`}>Ver guia</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default DashboardPage;