import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, PlayCircle, Send, ShoppingCart, Users, Zap, PhoneCall } from 'lucide-react';

export default function LandingPage() {
  const [contact, setContact] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [statusMessage, setStatusMessage] = useState('');

  const onSubmitContact = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage('Contato registrado no demo. Podemos ligar essa secao ao backend quando quiser.');
    setContact({ name: '', email: '', company: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_8%_12%,rgba(14,165,233,0.18),transparent_30%),radial-gradient(circle_at_90%_8%,rgba(251,191,36,0.32),transparent_36%),linear-gradient(to_bottom,#f8fafc,#fff7ed_48%,#ffffff)] pb-10">
      <header className="sticky top-0 z-30 border-b border-white/60 bg-white/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1380px] items-center justify-between gap-3 px-4 py-3 md:px-6">
          <div className="inline-flex items-center gap-2 text-slate-900">
            <ShoppingCart className="h-5 w-5 text-rose-500" />
            <span className="font-['Fraunces'] text-xl font-semibold">Meu Guia</span>
          </div>

          <nav className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="rounded-xl bg-rose-500 px-3 py-2 text-sm font-bold text-white transition hover:bg-rose-600"
            >
              Ir para Dashboard
            </Link>
            <Link
              to="/dashboard/admin"
              className="hidden rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:inline-flex"
            >
              Admin
            </Link>
            <Link
              to="/dashboard/buscar-supermercados"
              className="hidden rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:inline-flex"
            >
              Buscar
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-[1380px] gap-6 px-4 pt-8 md:px-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="relative overflow-hidden rounded-[2rem] border border-amber-100 bg-white/90 p-6 shadow-[0_24px_48px_rgba(15,23,42,0.12)] sm:p-8">
          <div className="pointer-events-none absolute inset-0 opacity-80">
            <img src="/images/produce/apple_cut_v2.png" alt="" className="absolute left-3 top-4 w-12 rotate-[-12deg] sm:w-16" />
            <img src="/images/produce/tomato_cut_v2.png" alt="" className="absolute right-8 top-6 w-11 rotate-[8deg] sm:w-16" />
            <img src="/images/produce/carrot_cut_v2.png" alt="" className="absolute left-12 bottom-8 w-12 rotate-[16deg] sm:w-16" />
            <img src="/images/produce/banana_cut_v2.png" alt="" className="absolute right-5 bottom-12 w-12 rotate-[-8deg] sm:w-16" />
          </div>

          <p className="relative text-xs font-extrabold uppercase tracking-[0.16em] text-rose-500">
            Wayfinding para supermercado
          </p>
          <h1 className="relative mt-2 font-['Fraunces'] text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
            Seu mercado com rota,
            <br />
            <span className="text-sky-700">lista e decisao rapida</span>
          </h1>
          <p className="relative mt-4 max-w-2xl text-slate-600">
            Organize compras por categoria, localize produtos com mais clareza e entregue uma
            experiencia digital que ajuda clientes e equipe a circular pela loja sem friccao.
          </p>

          <div className="relative mt-6 flex flex-wrap items-center gap-2">
            <Link
              to="/dashboard"
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-700"
            >
              Explorar o dashboard
            </Link>
            <a
              href="#video-explicativo"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Ver demonstracao
            </a>
          </div>

          <div className="relative mt-5 flex flex-wrap gap-2">
            {[
              'Listas por categoria e marca',
              'Mapa com corredores e prateleiras',
              'Operacao de picking e reabastecimento',
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.1)]">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-rose-500">Resumo da plataforma</p>
          <div className="mt-3 rounded-2xl bg-slate-900 p-4 text-white">
            <strong className="block text-lg">Experiencia web inspirada em grocery tech</strong>
            <ul className="mt-2 space-y-1 text-sm text-slate-200">
              <li>Hero com proposta de valor clara e CTA imediato.</li>
              <li>Video autoexplicativo para reduzir curva de entendimento.</li>
              <li>Formulario para captar operacoes interessadas.</li>
            </ul>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <article className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Tempo medio</span>
              <strong className="mt-1 block text-2xl font-black text-emerald-900">-42 min</strong>
            </article>
            <article className="rounded-xl border border-sky-200 bg-sky-50 p-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-sky-700">Aderencia mobile</span>
              <strong className="mt-1 block text-2xl font-black text-sky-900">100%</strong>
            </article>
          </div>
        </aside>
      </section>

      <section className="mx-auto mt-8 w-full max-w-[1380px] px-4 md:px-6">
        <h2 className="font-['Fraunces'] text-3xl font-semibold text-slate-900">Como funciona</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="inline-flex rounded-xl bg-rose-100 p-2 text-rose-600">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="mt-2 font-semibold text-slate-900">Organize por setores</h3>
            <p className="mt-1 text-sm text-slate-600">Veja produtos agrupados por corredor para reduzir indecisao e manter uma compra fluida.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="inline-flex rounded-xl bg-amber-100 p-2 text-amber-700">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="mt-2 font-semibold text-slate-900">Planejamento inteligente</h3>
            <p className="mt-1 text-sm text-slate-600">A lista vira um percurso em ordem eficiente, evitando voltas e economizando minutos reais.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="inline-flex rounded-xl bg-sky-100 p-2 text-sky-700">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="mt-2 font-semibold text-slate-900">Encontre supermercados</h3>
            <p className="mt-1 text-sm text-slate-600">Compare opcoes proximas e escolha o melhor ponto para executar sua rota guiada.</p>
          </article>
        </div>
      </section>

      <section id="video-explicativo" className="mx-auto mt-8 grid w-full max-w-[1380px] gap-4 px-4 md:px-6 xl:grid-cols-[1fr_1.05fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-rose-500">Video autoexplicativo</p>
          <h2 className="mt-2 font-['Fraunces'] text-3xl font-semibold text-slate-900">Veja como a jornada funciona do hero ate a rota na loja</h2>
          <p className="mt-3 text-slate-600">A ideia aqui e deixar a web explicar o produto rapidamente em poucos segundos.</p>

          <div className="mt-4 space-y-2">
            <article className="flex gap-3 rounded-xl bg-slate-50 p-3">
              <PlayCircle className="mt-0.5 h-5 w-5 shrink-0 text-slate-700" />
              <div>
                <strong className="text-sm text-slate-900">Narrativa direta</strong>
                <p className="text-sm text-slate-600">Produto, beneficio e uso real mostrados sem excesso de texto.</p>
              </div>
            </article>
            <article className="flex gap-3 rounded-xl bg-slate-50 p-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-slate-700" />
              <div>
                <strong className="text-sm text-slate-900">Contexto visual de loja</strong>
                <p className="text-sm text-slate-600">Mapa, corredor, setor e fluxo aparecem de forma concreta.</p>
              </div>
            </article>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-black shadow-[0_18px_36px_rgba(15,23,42,0.2)]">
          <iframe
            src="https://www.youtube.com/embed/KpQLy6CdfeU?rel=0"
            title="Demonstracao de experiencia de grocery mapping"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="aspect-video h-full w-full"
          />
        </div>
      </section>

      <section className="mx-auto mt-8 grid w-full max-w-[1380px] gap-4 px-4 md:px-6 xl:grid-cols-[1fr_1.05fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-rose-500">Formulario de contato</p>
          <h2 className="mt-2 font-['Fraunces'] text-3xl font-semibold text-slate-900">Fale com a equipe e adapte o fluxo para sua operacao</h2>
          <p className="mt-3 text-slate-600">Secao objetiva com leitura limpa no desktop e no mobile.</p>

          <div className="mt-4 space-y-2">
            <article className="flex gap-3 rounded-xl bg-slate-50 p-3">
              <PhoneCall className="mt-0.5 h-5 w-5 shrink-0 text-slate-700" />
              <div>
                <strong className="text-sm text-slate-900">Contato comercial</strong>
                <p className="text-sm text-slate-600">Mapeamento, implantacao e experiencia digital para a loja.</p>
              </div>
            </article>
            <article className="flex gap-3 rounded-xl bg-slate-50 p-3">
              <Users className="mt-0.5 h-5 w-5 shrink-0 text-slate-700" />
              <div>
                <strong className="text-sm text-slate-900">Contato operacional</strong>
                <p className="text-sm text-slate-600">Picking, reabastecimento e orientacao em rota otimizada.</p>
              </div>
            </article>
          </div>
        </div>

        <form className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm" onSubmit={onSubmitContact}>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-sm font-medium text-slate-700 sm:col-span-2">
              Nome
              <input
                type="text"
                value={contact.name}
                onChange={(event) => setContact((current) => ({ ...current, name: event.target.value }))}
                placeholder="Seu nome"
                required
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </label>

            <label className="space-y-1 text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                value={contact.email}
                onChange={(event) => setContact((current) => ({ ...current, email: event.target.value }))}
                placeholder="voce@empresa.com"
                required
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </label>

            <label className="space-y-1 text-sm font-medium text-slate-700">
              Empresa
              <input
                type="text"
                value={contact.company}
                onChange={(event) => setContact((current) => ({ ...current, company: event.target.value }))}
                placeholder="Nome do supermercado"
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </label>

            <label className="space-y-1 text-sm font-medium text-slate-700 sm:col-span-2">
              Objetivo
              <textarea
                value={contact.message}
                onChange={(event) => setContact((current) => ({ ...current, message: event.target.value }))}
                placeholder="Quero melhorar lista, rota do cliente, picking ou operacao mobile."
                rows={5}
                required
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </label>
          </div>

          <button
            type="submit"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-rose-600"
          >
            <Send className="h-4 w-4" /> Enviar interesse
          </button>

          {statusMessage ? (
            <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800" aria-live="polite">
              {statusMessage}
            </p>
          ) : null}
        </form>
      </section>

      <section className="mx-auto mt-8 w-full max-w-[1380px] px-4 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-slate-900 px-6 py-5 text-white">
          <h2 className="font-['Fraunces'] text-3xl font-semibold">Pronto para comprar com rota guiada?</h2>
          <Link
            to="/dashboard"
            className="rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-rose-600"
          >
            Ir para dashboard
          </Link>
        </div>
      </section>

      <footer className="mx-auto mt-8 w-full max-w-[1380px] px-4 text-center text-sm text-slate-500 md:px-6">
        <p>&copy; 2025 Meu Guia do Supermercado. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
