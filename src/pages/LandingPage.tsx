import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, PlayCircle, Send, ShoppingCart, Users, Zap, PhoneCall } from 'lucide-react';
import heroImage from '../assets/supermercado-demo.png';

export default function LandingPage() {
  const [contact, setContact] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const isTickingRef = useRef(false);
  const [activeHowItWorksCard, setActiveHowItWorksCard] = useState(0);
  const howItWorksCarouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateHeaderVisibility = () => {
      const currentScrollY = window.scrollY || 0;
      const delta = currentScrollY - lastScrollYRef.current;

      if (Math.abs(delta) < 6) {
        isTickingRef.current = false;
        return;
      }

      if (currentScrollY <= 24) {
        setIsHeaderVisible(true);
      } else if (delta > 0) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
      isTickingRef.current = false;
    };

    const handleScroll = () => {
      if (isTickingRef.current) {
        return;
      }

      isTickingRef.current = true;
      window.requestAnimationFrame(updateHeaderVisibility);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const onSubmitContact = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage('Contato registrado no demo. Podemos ligar essa secao ao backend quando quiser.');
    setContact({ name: '', email: '', company: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_8%_12%,rgba(14,165,233,0.18),transparent_30%),radial-gradient(circle_at_90%_8%,rgba(251,191,36,0.32),transparent_36%),linear-gradient(to_bottom,#f8fafc,#fff7ed_48%,#ffffff)] pb-10">
      <style>{`
        @keyframes heroFloat {
          0% { transform: translate3d(0, 0, 0) rotate(0deg); }
          50% { transform: translate3d(0, -10px, 0) rotate(1deg); }
          100% { transform: translate3d(0, 0, 0) rotate(0deg); }
        }
      `}</style>

      <header className={`sticky top-0 z-30 border-b border-white/60 bg-white/85 backdrop-blur transition-transform duration-300 ease-out ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="mx-auto flex w-full max-w-[1380px] items-center justify-between gap-2 px-4 py-3 md:gap-3 md:px-6">
          <div className="inline-flex items-center gap-2 text-slate-900">
            <ShoppingCart className="h-5 w-5 text-rose-500" />
            <span className="font-['Fraunces'] text-xl font-semibold">Meu Guia</span>
          </div>

          <nav className="hidden items-center gap-2 md:flex">
            <Link
              to="/dashboard"
              className="rounded-xl bg-rose-500 px-2.5 py-2 text-xs font-bold text-white transition hover:bg-rose-600 sm:px-3 sm:text-sm"
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

      <section className="mx-auto w-full max-w-[1380px] px-4 pt-8 md:px-6 md:pt-12">
        <div className="relative flex min-h-[28rem] flex-col items-center justify-center overflow-visible rounded-3xl pt-14 pb-24 text-center sm:min-h-[32rem] sm:pt-16 sm:pb-28 md:min-h-[36rem] md:rounded-none md:pt-20 md:pb-32">
          {/* Frutas flutuando */}
          <img
            src="/images/produce/apple_cut_v2.png"
            alt="Maçã"
            className="pointer-events-none absolute -left-10 top-12 hidden w-14 animate-[heroFloat_3.2s_ease-in-out_infinite] sm:-left-12 sm:top-10 sm:w-16 md:left-[-60px] md:block md:w-20"
            style={{ animationTimingFunction: 'cubic-bezier(.4,0,.2,1)', animationDuration: '1.8s' }}
          />
          <img
            src="/images/produce/banana_cut_v2.png"
            alt="Banana"
            className="pointer-events-none absolute -right-8 top-20 hidden w-12 animate-[heroFloat_3.1s_ease-in-out_infinite] sm:-right-10 sm:top-24 sm:w-14 md:right-[-50px] md:block md:w-16"
            style={{ animationTimingFunction: 'cubic-bezier(.4,0,.2,1)', animationDuration: '1.7s' }}
          />
          <img
            src="/images/produce/broccoli_cut_v2.png"
            alt="Brócolis"
            className="pointer-events-none absolute left-1/4 top-[-24px] hidden w-12 animate-[heroFloat_3.3s_ease-in-out_infinite] md:top-[-40px] md:block md:w-16"
            style={{ animationTimingFunction: 'cubic-bezier(.4,0,.2,1)', animationDuration: '2.0s' }}
          />
          <img
            src="/images/produce/tomato_cut_v2.png"
            alt="Tomate"
            className="pointer-events-none absolute right-1/4 top-[-20px] hidden w-11 animate-[heroFloat_3.0s_ease-in-out_infinite] md:top-[-36px] md:block md:w-14"
            style={{ animationTimingFunction: 'cubic-bezier(.4,0,.2,1)', animationDuration: '1.6s' }}
          />
          <img
            src="/images/produce/pao_frances_cut_v2.png"
            alt="Pão"
            className="pointer-events-none absolute left-[6%] bottom-[-10px] hidden w-12 animate-[heroFloat_3.4s_ease-in-out_infinite] md:left-[12%] md:bottom-[-36px] md:block md:w-16"
            style={{ animationTimingFunction: 'cubic-bezier(.4,0,.2,1)', animationDuration: '2.1s' }}
          />
          <img
            src="/images/produce/fish_cut_v2.png"
            alt="Peixe"
            className="pointer-events-none absolute right-[4%] bottom-[-12px] hidden w-14 animate-[heroFloat_3.6s_ease-in-out_infinite] md:right-[10%] md:bottom-[-40px] md:block md:w-20"
            style={{ animationTimingFunction: 'cubic-bezier(.4,0,.2,1)', animationDuration: '2.3s' }}
          />
          {/* Título central */}
          <h1 className="relative z-10 font-['Fraunces'] text-[3.7rem] font-medium leading-[0.92] text-stone-900 drop-shadow-[0_8px_18px_rgba(0,0,0,0.08)] sm:text-6xl md:text-7xl lg:text-8xl">
            Meu Guia
            <br />
            <span className="font-light">Rota & Lista</span>
          </h1>
          {/* Botões principais */}
          <div className="relative z-10 mt-8 hidden w-full max-w-md flex-col items-stretch justify-center gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center md:flex">
            <Link
              to="/dashboard"
              className="rounded-xl bg-rose-500 px-6 py-3 text-center text-base font-bold text-white shadow transition hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-400"
            >
              Ir para Dashboard
            </Link>
            <a
              href="#video-explicativo"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-center text-base font-semibold text-slate-700 shadow transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-400"
            >
              Ver demonstração
            </a>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="mx-auto mt-16 w-full max-w-[1380px] px-4 sm:mt-20 md:px-6">
        <h2 className="font-['Fraunces'] text-3xl font-semibold text-slate-900 text-center md:text-4xl lg:text-5xl">Como funciona</h2>
        <div className="mt-8 md:hidden">
          <div
            ref={howItWorksCarouselRef}
            className="-mx-4 flex snap-x snap-mandatory overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            onScroll={(event) => {
              const container = event.currentTarget;
              const index = Math.round(container.scrollLeft / container.clientWidth);
              setActiveHowItWorksCard(Math.max(0, Math.min(2, index)));
            }}
          >
            <article className="min-w-full snap-center px-1">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="inline-flex rounded-xl bg-rose-100 p-2 text-rose-600">
                  <MapPin className="h-5 w-5" />
                </div>
                <h3 className="mt-2 font-semibold text-slate-900">Organize por setores</h3>
                <p className="mt-1 text-sm text-slate-600">Veja produtos agrupados por corredor para reduzir indecisao e manter uma compra fluida.</p>
              </div>
            </article>
            <article className="min-w-full snap-center px-1">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="inline-flex rounded-xl bg-amber-100 p-2 text-amber-700">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="mt-2 font-semibold text-slate-900">Planejamento inteligente</h3>
                <p className="mt-1 text-sm text-slate-600">A lista vira um percurso em ordem eficiente, evitando voltas e economizando minutos reais.</p>
              </div>
            </article>
            <article className="min-w-full snap-center px-1">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="inline-flex rounded-xl bg-sky-100 p-2 text-sky-700">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="mt-2 font-semibold text-slate-900">Encontre supermercados</h3>
                <p className="mt-1 text-sm text-slate-600">Compare opcoes proximas e escolha o melhor ponto para executar sua rota guiada.</p>
              </div>
            </article>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2" aria-label="Indicadores do carrossel Como funciona">
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                type="button"
                aria-label={`Ir para card ${index + 1}`}
                onClick={() => {
                  const container = howItWorksCarouselRef.current;
                  if (!container) {
                    return;
                  }
                  container.scrollTo({ left: container.clientWidth * index, behavior: 'smooth' });
                  setActiveHowItWorksCard(index);
                }}
                className={`h-2.5 w-2.5 rounded-full transition ${activeHowItWorksCard === index ? 'bg-rose-500' : 'bg-slate-300'}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-3">
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

      <section id="sobre-app" className="mx-auto mt-16 w-full max-w-[1380px] px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-rose-500">Sobre a aplicação</p>
            <h2 className="mt-3 font-['Fraunces'] text-2xl font-semibold text-slate-900 sm:text-3xl">Experiência de compra inteligente e otimizada</h2>
            <p className="mt-4 text-slate-600">O Meu Guia é uma plataforma que transforma a forma como você compra em supermercados. Combinamos mapeamento digital de loja, inteligência de rota e integração com listas personalizadas para oferecer uma experiência fluida e sem fricção.</p>
            
            <div className="mt-6 space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100">
                    <MapPin className="h-5 w-5 text-rose-600" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Navegação precisa</h4>
                  <p className="text-sm text-slate-600">Localize produtos com exatidão em cada corredor e setor</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                    <Zap className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Otimização de tempo</h4>
                  <p className="text-sm text-slate-600">Reduza o tempo de compra em até 50% com rotas inteligentes</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100">
                    <ShoppingCart className="h-5 w-5 text-sky-600" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Experiência simples</h4>
                  <p className="text-sm text-slate-600">Interface intuitiva para clientes e operadores</p>
                </div>
              </div>
            </div>

            <Link
              to="/dashboard"
              className="mt-8 inline-flex items-center rounded-xl bg-rose-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-rose-600"
            >
              Explorar a aplicação
            </Link>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
            <img
              src={heroImage}
              alt="Pessoas comprando no supermercado"
              className="h-full w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </section>

      <section id="video-explicativo" className="mx-auto mt-10 grid w-full max-w-[1380px] gap-4 px-4 md:mt-8 md:px-6 xl:grid-cols-[1fr_1.05fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-rose-500">Video autoexplicativo</p>
          <h2 className="mt-2 font-['Fraunces'] text-2xl font-semibold text-slate-900 sm:text-3xl">Veja como a jornada funciona do hero ate a rota na loja</h2>
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

      <section id="contato-comercial" className="mx-auto mt-10 grid w-full max-w-[1380px] gap-4 px-4 md:mt-8 md:px-6 xl:grid-cols-[1fr_1.05fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-rose-500">Formulario de contato</p>
          <h2 className="mt-2 font-['Fraunces'] text-2xl font-semibold text-slate-900 sm:text-3xl">Fale com a equipe e adapte o fluxo para sua operacao</h2>
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

        <form className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5" onSubmit={onSubmitContact}>
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

      <section className="mx-auto mt-10 w-full max-w-[1380px] px-4 md:mt-8 md:px-6">
        <div className="flex flex-col items-stretch justify-between gap-3 rounded-3xl border border-slate-200 bg-slate-900 px-4 py-5 text-white sm:flex-row sm:items-center sm:px-6">
          <h2 className="text-center font-['Fraunces'] text-2xl font-semibold sm:text-left sm:text-3xl">Pronto para comprar com rota guiada?</h2>
          <Link
            to="/dashboard"
            className="rounded-xl bg-rose-500 px-4 py-2.5 text-center text-sm font-bold text-white transition hover:bg-rose-600"
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
