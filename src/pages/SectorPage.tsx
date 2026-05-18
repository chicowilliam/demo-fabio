import { Link, useParams } from 'react-router-dom';
import { sectors } from '../data/sectors';

function SectorPage() {
  const { sectorId } = useParams<{ sectorId: string }>();
  const sector = sectors.find((item) => item.id === sectorId);

  if (!sector) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.1)]">
        <h2 className="font-['Fraunces'] text-3xl font-semibold text-slate-900">Setor nao encontrado</h2>
        <p className="mt-2 text-slate-600">Esse setor nao existe na base do demo.</p>
        <Link
          to="/dashboard"
          className="mt-5 inline-flex rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-rose-600"
        >
          Voltar para o guia
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.1)]">
      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-rose-500">{sector.aisle}</p>
      <h2 className="font-['Fraunces'] text-4xl font-semibold text-slate-900">{sector.title}</h2>
      <p className="text-slate-600">{sector.tip}</p>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
          <h3 className="font-['Fraunces'] text-2xl font-semibold text-slate-900">Checklist completo</h3>
          <ul className="mt-3 space-y-2">
            {sector.checklist.map((item) => (
              <li key={item} className="rounded-lg bg-white px-3 py-2 text-sm text-slate-700">
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-sky-100 bg-sky-50/70 p-4">
          <h3 className="font-['Fraunces'] text-2xl font-semibold text-slate-900">Dica operacional</h3>
          <p className="mt-3 text-slate-700">
            Separe sacolas por categoria ainda no carrinho para acelerar a organização em casa e
            evitar retrabalho.
          </p>
          <strong className="mt-4 block text-slate-900">Tempo medio estimado: {sector.averageTime}</strong>
        </article>
      </div>

      <Link
        to="/dashboard"
        className="inline-flex rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        Voltar para todos os setores
      </Link>
    </section>
  );
}

export default SectorPage;