import { Link } from 'react-router-dom';
import { sectors } from '../data/sectors';

function DashboardPage() {
  return (
    <section className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-12">
        <article className="lg:col-span-7 rounded-3xl border border-amber-100 bg-gradient-to-br from-white to-amber-50 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.12)]">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-rose-500">Experiencia Cliente</p>
          <h2 className="mt-2 font-['Fraunces'] text-3xl font-semibold text-slate-900 sm:text-4xl">
            Roteiro visual para o cliente seguir na loja
          </h2>
          <p className="mt-3 text-slate-600">
            Ative a rota guiada para transformar sua lista em sequencia de corredores. O cliente
            acompanha cada parada em ordem otimizada, com foco em fluidez e menos ida e volta.
          </p>
          <div className="mt-5">
            <Link
              to="/dashboard/rota-cliente"
              className="inline-flex items-center rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-rose-600"
            >
              Abrir rota do cliente
            </Link>
          </div>
        </article>

        <article className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.1)]">
          <span className="text-sm font-medium text-slate-500">Total de setores</span>
          <strong className="mt-2 block text-4xl font-black text-slate-900">{sectors.length}</strong>
        </article>

        <article className="lg:col-span-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.1)]">
          <span className="text-sm font-medium text-slate-500">Tempo medio com rota</span>
          <strong className="mt-2 block text-4xl font-black text-slate-900">42 min</strong>
        </article>
      </div>

      <article className="rounded-3xl border border-amber-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
        <h3 className="font-['Fraunces'] text-2xl font-semibold text-slate-900">Fluxo rapido de compra</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {['Entrada', 'Hortifruti', 'Mercearia', 'Limpeza', 'Laticinios', 'Checkout'].map((step) => (
            <span
              key={step}
              className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-sky-800"
            >
              {step}
            </span>
          ))}
        </div>
      </article>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sectors.map((sector) => (
          <article
            key={sector.id}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="font-['Fraunces'] text-2xl font-semibold text-slate-900">{sector.title}</h3>
              <span className="rounded-lg bg-amber-100 px-2 py-1 text-xs font-bold text-amber-900">{sector.aisle}</span>
            </div>

            <p className="text-sm text-slate-600">{sector.tip}</p>

            <ul className="mt-4 space-y-2">
              {sector.checklist.slice(0, 3).map((item) => (
                <li key={item} className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-5 flex items-center justify-between gap-3">
              <small className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Tempo medio: {sector.averageTime}
              </small>
              <Link
                to={`/dashboard/setor/${sector.id}`}
                className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-700"
              >
                Ver guia
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default DashboardPage;