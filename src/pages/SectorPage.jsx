import { Link, useParams } from 'react-router-dom';
import { sectors } from '../data/sectors';

function SectorPage() {
  const { sectorId } = useParams();
  const sector = sectors.find((item) => item.id === sectorId);

  if (!sector) {
    return (
      <section className="single-sector">
        <h2>Setor não encontrado</h2>
        <p>Esse setor não existe na base do demo.</p>
        <Link to="/">Voltar para o guia</Link>
      </section>
    );
  }

  return (
    <section className="single-sector">
      <p className="brand-eyebrow">{sector.aisle}</p>
      <h2>{sector.title}</h2>
      <p>{sector.tip}</p>

      <div className="single-sector-grid">
        <article>
          <h3>Checklist completo</h3>
          <ul>
            {sector.checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article>
          <h3>Dica operacional</h3>
          <p>
            Separe sacolas por categoria ainda no carrinho para acelerar a organização em casa e
            evitar retrabalho.
          </p>
          <strong>Tempo médio estimado: {sector.averageTime}</strong>
        </article>
      </div>

      <Link to="/" className="back-link">
        Voltar para todos os setores
      </Link>
    </section>
  );
}

export default SectorPage;