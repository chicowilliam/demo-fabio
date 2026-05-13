import { Link } from 'react-router-dom';
import { sectors } from '../data/sectors';

function DashboardPage() {
  return (
    <section>
      <div className="hero-grid">
        <article className="hero-card hero-main">
          <p className="brand-eyebrow">Planejamento Inteligente</p>
          <h2>Monte sua rota de compras por setor</h2>
          <p>
            Economize tempo seguindo uma ordem eficiente: perecíveis, secos e itens de limpeza.
            Cada cartão mostra tempo médio e itens recomendados.
          </p>
        </article>

        <article className="hero-card hero-metric">
          <span>Total de setores</span>
          <strong>{sectors.length}</strong>
        </article>

        <article className="hero-card hero-metric">
          <span>Tempo médio total</span>
          <strong>42 min</strong>
        </article>
      </div>

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
              <Link to={`/setor/${sector.id}`}>Ver guia</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default DashboardPage;