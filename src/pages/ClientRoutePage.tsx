import { lazy, Suspense, useMemo, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Check, Compass, MapPin, Plus, Search, ShoppingBasket, SlidersHorizontal, Sparkles, Store, X } from 'lucide-react';
import { toast } from 'sonner';
import { supermarkets } from '../data/supermarkets';
import {
  getEntrancePoint,
  shoppingItems,
  type OptimizedShoppingRoute,
  type ShoppingItem,
} from '../lib/clientRoute';
import { createNavigationEngine } from '../lib/navigationSdk';
import { useStaffOperations } from '../lib/hooks';

const InteractiveStoreMap = lazy(() => import('../components/InteractiveStoreMap'));
const navigationEngine = createNavigationEngine();

function ClientRoutePage() {
  const [selectedMarketId, setSelectedMarketId] = useState(supermarkets[0]?.id ?? '');
  const [query, setQuery] = useState('');
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [routeSnapshot, setRouteSnapshot] = useState<OptimizedShoppingRoute | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [staffMode, setStaffMode] = useState<'picking' | 'restock'>('picking');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const routeSectionRef = useRef<HTMLDivElement | null>(null);

  const selectedMarket = useMemo(
    () => supermarkets.find((market) => market.id === selectedMarketId) ?? null,
    [selectedMarketId]
  );

  const categories = useMemo(
    () => Array.from(new Set(shoppingItems.map((item) => item.category))).sort(),
    []
  );

  const brands = useMemo(
    () => Array.from(new Set(shoppingItems.map((item) => item.brand))).sort(),
    []
  );

  const activeFilterCount = Number(Boolean(selectedCategory)) + Number(Boolean(selectedBrand));

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return shoppingItems
      .filter((item) => {
        const matchesText =
          !normalized ||
          item.name.toLowerCase().includes(normalized) ||
          item.sectorTitle.toLowerCase().includes(normalized) ||
          item.category.toLowerCase().includes(normalized) ||
          item.brand.toLowerCase().includes(normalized);

        const matchesCategory = !selectedCategory || item.category === selectedCategory;
        const matchesBrand = !selectedBrand || item.brand === selectedBrand;

        return matchesText && matchesCategory && matchesBrand;
      })
      .slice(0, 10);
  }, [query, selectedCategory, selectedBrand]);

  const itemById = useMemo(
    () => new Map<string, ShoppingItem>(shoppingItems.map((item) => [item.id, item])),
    []
  );

  const toggleItem = (itemId: string) => {
    setSelectedItemIds((previous) => {
      const isRemoving = previous.includes(itemId);
      const nextSelection = previous.includes(itemId)
        ? previous.filter((id) => id !== itemId)
        : [...previous, itemId];

      // Keep route state consistent with the exact selection used in optimization.
      setRouteSnapshot(null);
      setCompletedSteps([]);
      if (isRemoving && nextSelection.length === 0) {
        setIsCartOpen(false);
      }

      return nextSelection;
    });
  };

  const handleOptimize = () => {
    const nextRoute = navigationEngine.buildRoute({ selectedItemIds });
    if (nextRoute.steps.length === 0) {
      return;
    }

    setRouteSnapshot(nextRoute);
    setCompletedSteps([]);
    toast.success('Rota pronta.');
    requestAnimationFrame(() => {
      routeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const toggleCompleted = (stepNumber: number) => {
    setCompletedSteps((previous) => {
      const highestCompleted = previous.length > 0 ? Math.max(...previous) : 0;
      const isCompleted = previous.includes(stepNumber);

      if (isCompleted) {
        // Allow undo only on the latest completed step to preserve sequence.
        if (stepNumber !== highestCompleted) {
          return previous;
        }
        return previous.filter((value) => value !== stepNumber);
      }

      // Allow completing only the immediate next step.
      if (stepNumber !== highestCompleted + 1) {
        return previous;
      }

      return [...previous, stepNumber];
    });
  };

  const entrance = getEntrancePoint();
  const routeSteps = routeSnapshot?.steps ?? [];
  const routeComputed = routeSteps.length > 0;
  const routeTotalDistance = routeSnapshot?.totalDistance ?? 0;
  const nextStep = routeSteps.find((step) => !completedSteps.includes(step.step));
  const lastCompletedStep = completedSteps.length > 0 ? Math.max(...completedSteps) : 0;

  const routePoints = routeSnapshot?.polylinePoints ?? [entrance];

  const selectedItems = useMemo(
    () => selectedItemIds.map((itemId) => itemById.get(itemId)).filter(Boolean) as ShoppingItem[],
    [itemById, selectedItemIds]
  );

  const restockQueue = useMemo(() => {
    const counts = new Map<string, number>();
    selectedItems.forEach((item) => {
      counts.set(item.sectorTitle, (counts.get(item.sectorTitle) ?? 0) + 1);
    });

    return Array.from(counts.entries())
      .map(([sector, count]) => ({ sector, count }))
      .sort((a, b) => b.count - a.count);
  }, [selectedItems]);

  const operationsQuery = useStaffOperations(
    staffMode,
    selectedItems.map((item) => item.name)
  );

  const clearSelection = () => {
    setSelectedItemIds([]);
    setCompletedSteps([]);
    setRouteSnapshot(null);
    setIsCartOpen(false);
    setQuery('');
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
  };

  return (
    <section className="route-mobile-scale space-y-4 pb-24 sm:space-y-6 sm:pb-8">
      <header className="rounded-3xl border border-amber-100 bg-gradient-to-br from-white to-amber-50 p-6 shadow-[0_14px_35px_rgba(15,23,42,0.1)]">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-rose-500">Rota Guiada</p>
        <h2 className="mt-2 font-['Fraunces'] text-3xl font-semibold text-slate-900 sm:text-4xl">
          Mapa de percurso para o cliente seguir na loja
        </h2>
        <p className="mt-3 max-w-3xl text-slate-600">
          Selecione os itens, gere a sequencia e acompanhe o caminho no mapa do mercado em tempo
          real de progresso.
        </p>
      </header>

      <div
        className="rounded-3xl border border-slate-200 bg-white p-3 shadow-[0_12px_28px_rgba(15,23,42,0.08)] sm:p-5"
        role="region"
        aria-label="Controles de geracao de rota"
      >
        <div className="mb-3 grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 sm:mb-4 sm:grid-cols-2 sm:items-center sm:justify-between sm:gap-3">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <ShoppingBasket size={14} /> {selectedItemIds.length} itens na rota
          </span>
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Store size={14} /> {selectedMarket ? `${selectedMarket.city} · ${selectedMarket.distance} km` : 'Mercado nao definido'}
          </span>
        </div>

        <div className="grid gap-3 xl:grid-cols-[1.5fr_0.8fr]">
          <div className="space-y-3">
            <div className="space-y-2">
              <label htmlFor="product-search" className="text-sm font-semibold text-slate-700">
                Buscar item e montar lista
              </label>
              <div className="flex items-center gap-2">
                <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2.5 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-200">
                  <Search size={16} className="text-slate-400" />
                  <input
                    id="product-search"
                    type="text"
                    placeholder="Ex.: leite, tomate, arroz"
                    value={query}
                    aria-describedby="route-search-help"
                    onChange={(event) => setQuery(event.target.value)}
                    className="w-full min-w-0 bg-transparent text-sm outline-none"
                  />
                </div>

                <Dialog.Root open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
                  <Dialog.Trigger asChild>
                    <button
                      type="button"
                      className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 text-sm font-semibold text-slate-700 transition hover:border-amber-300 hover:bg-amber-100"
                    >
                      <SlidersHorizontal size={16} />
                      <span className="hidden sm:inline">Filtros</span>
                      {activeFilterCount > 0 ? (
                        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                          {activeFilterCount}
                        </span>
                      ) : null}
                    </button>
                  </Dialog.Trigger>

                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-[2px]" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,26rem)] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-amber-100 bg-white p-4 shadow-[0_24px_60px_rgba(15,23,42,0.22)]">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Dialog.Title className="font-['Fraunces'] text-2xl font-semibold text-slate-900">
                            Filtrar itens
                          </Dialog.Title>
                          <Dialog.Description className="mt-1 text-sm text-slate-600">
                            Refine a lista por categoria e marca sem ocupar a tela principal.
                          </Dialog.Description>
                        </div>
                        <Dialog.Close asChild>
                          <button
                            type="button"
                            aria-label="Fechar filtros"
                            className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-600 transition hover:bg-slate-100"
                          >
                            <X size={16} />
                          </button>
                        </Dialog.Close>
                      </div>

                      <div className="mt-4 grid gap-3">
                        <div className="space-y-2">
                          <label htmlFor="route-category" className="text-sm font-semibold text-slate-700">
                            Categoria
                          </label>
                          <select
                            id="route-category"
                            value={selectedCategory}
                            onChange={(event) => setSelectedCategory(event.target.value)}
                            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                          >
                            <option value="">Todas</option>
                            {categories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="route-brand" className="text-sm font-semibold text-slate-700">
                            Marca
                          </label>
                          <select
                            id="route-brand"
                            value={selectedBrand}
                            onChange={(event) => setSelectedBrand(event.target.value)}
                            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                          >
                            <option value="">Todas</option>
                            {brands.map((brand) => (
                              <option key={brand} value={brand}>
                                {brand}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={clearFilters}
                          className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          Limpar filtros
                        </button>
                        <Dialog.Close asChild>
                          <button
                            type="button"
                            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-700"
                          >
                            Aplicar
                          </button>
                        </Dialog.Close>
                      </div>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>

              </div>
            </div>

            <small id="route-search-help" className="sr-only">
              Digite para ver sugestoes e clique para adicionar item a rota.
            </small>

            {activeFilterCount > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedCategory ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold text-amber-900">
                    Categoria: {selectedCategory}
                  </span>
                ) : null}
                {selectedBrand ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-3 py-1 text-[11px] font-semibold text-rose-800">
                    Marca: {selectedBrand}
                  </span>
                ) : null}
              </div>
            ) : null}

            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                {filteredItems.length} sugestoes visiveis
              </p>
              {query ? <p className="text-xs text-slate-500">Busca ativa</p> : null}
            </div>

            <div className="grid max-h-72 gap-2 overflow-auto pr-1">
              {filteredItems.map((item) => {
                const selected = selectedItemIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={[
                      'rounded-xl border px-3 py-2.5 text-left transition',
                      selected
                        ? 'border-rose-300 bg-rose-50 text-rose-900'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-sky-300 hover:bg-sky-50',
                    ].join(' ')}
                    aria-pressed={selected}
                    onClick={() => toggleItem(item.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <strong className="block text-sm leading-5">{item.name}</strong>
                      <span
                        className={[
                          'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border',
                          selected
                            ? 'border-emerald-300 bg-emerald-100 text-emerald-700'
                            : 'border-slate-300 bg-white/90 text-slate-500',
                        ].join(' ')}
                        aria-label={selected ? 'Item na rota' : 'Adicionar item'}
                      >
                        {selected ? <Check size={13} /> : <Plus size={13} />}
                      </span>
                    </div>
                    <span className="block text-xs opacity-80">
                      {item.sectorTitle} - {item.aisle}
                    </span>
                    <small className="mt-1 block text-[11px] opacity-75">
                      {item.category} · {item.brand}
                    </small>
                  </button>
                );
              })}
            </div>
          </div>

          <aside className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <label htmlFor="market" className="text-sm font-semibold text-slate-700">
              Supermercado
            </label>
            <select
              id="market"
              value={selectedMarketId}
              onChange={(event) => {
                setSelectedMarketId(event.target.value);
                setCompletedSteps([]);
                setRouteSnapshot(null);
              }}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            >
              {supermarkets.map((market) => (
                <option key={market.id} value={market.id}>
                  {market.name} - {market.city}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={handleOptimize}
              disabled={selectedItemIds.length === 0}
            >
              <Sparkles size={16} />
              Gerar rota
            </button>

            <button
              type="button"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white"
              onClick={clearSelection}
            >
              Limpar selecao
            </button>

            <p className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs leading-5 text-slate-600">
              Dica: monte primeiro a lista e depois gere a rota para obter a sequencia otimizada por corredor.
            </p>
          </aside>
        </div>
      </div>

      {routeComputed ? (
        <section
          className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-5 shadow-[0_10px_20px_rgba(16,185,129,0.12)]"
          aria-live="polite"
        >
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">Rota ativa</p>
          <h3 className="mt-2 font-['Fraunces'] text-2xl font-semibold text-emerald-950">
            Trajeto otimizado pronto para execucao
          </h3>
          <div className="mt-3 flex flex-wrap gap-2 text-sm font-semibold text-emerald-900">
            <span className="rounded-full bg-emerald-100 px-3 py-1">{routeSteps.length} paradas</span>
            <span className="rounded-full bg-emerald-100 px-3 py-1">{routeTotalDistance} m estimados</span>
            <span className="rounded-full bg-emerald-100 px-3 py-1">
              Proximo: {nextStep ? nextStep.itemName : 'Finalizado'}
            </span>
          </div>
        </section>
      ) : null}

      <div ref={routeSectionRef} className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <article
          className={[
            'rounded-3xl border bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)]',
            routeComputed ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-200',
          ].join(' ')}
        >
          <header className="mb-4">
            <h3 className="inline-flex items-center gap-2 font-['Fraunces'] text-2xl font-semibold text-slate-900">
              <MapPin size={18} /> Mapa de percurso do cliente
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              {selectedMarket ? selectedMarket.name : 'Mercado nao selecionado'} - entrada e setores estrategicos
            </p>
          </header>

          <Suspense
            fallback={
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                Carregando mapa interativo...
              </div>
            }
          >
            <InteractiveStoreMap
              entrance={entrance}
              routeComputed={routeComputed}
              routePoints={routePoints}
              steps={routeSteps}
              highlightedItemName={nextStep?.itemName}
              marketName={selectedMarket ? selectedMarket.name : 'Mercado'}
            />
          </Suspense>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
          <header>
            <h3 className="inline-flex items-center gap-2 font-['Fraunces'] text-2xl font-semibold text-slate-900">
              <Compass size={18} /> Sequencia recomendada
            </h3>
            <p className="mt-1 text-sm text-slate-600">Marque os itens conforme for passando no corredor.</p>
          </header>

          {routeComputed ? (
            <>
              <div className="mt-4 rounded-2xl bg-slate-100 px-3 py-3 text-sm text-slate-700" aria-live="polite">
                <strong className="mr-1">Proxima parada:</strong>
                <span>
                  {nextStep ? `${nextStep.itemName} (${nextStep.sectorTitle})` : 'Rota concluida. Otimas compras!'}
                </span>
              </div>

              <ul className="mt-3 space-y-2">
                {routeSteps.map((step) => {
                  const done = completedSteps.includes(step.step);
                  const isCheckout = step.itemName === 'Caixa';
                  const canComplete = !done && step.step === nextStep?.step;
                  const canUndo = done && step.step === lastCompletedStep;
                  const isActionable = canComplete || canUndo;
                  return (
                    <li
                      key={`${step.step}-${step.itemName}`}
                      className={[
                        'rounded-xl border transition',
                        isCheckout
                          ? done
                            ? 'border-purple-300 bg-purple-50'
                            : 'border-purple-300 bg-purple-100'
                          : done
                            ? 'border-emerald-200 bg-emerald-50'
                            : 'border-slate-200 bg-white',
                      ].join(' ')}
                    >
                      <button
                        type="button"
                        onClick={() => toggleCompleted(step.step)}
                        disabled={!isActionable}
                        className={[
                          'flex w-full items-center gap-3 px-3 py-2.5 text-left',
                          isActionable ? 'cursor-pointer' : 'cursor-not-allowed opacity-70',
                        ].join(' ')}
                      >
                        <span className={[
                          'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white',
                          isCheckout ? 'bg-purple-600' : 'bg-slate-900',
                        ].join(' ')}>
                          {step.step}
                        </span>
                        <span className="min-w-0 flex-1">
                          <strong className={[
                            'block truncate text-sm',
                            isCheckout ? 'text-purple-900' : 'text-slate-900',
                          ].join(' ')}>
                            {step.itemName}
                            {isCheckout && <span className="ml-2 text-xs font-bold uppercase tracking-wide text-purple-700">(Obrigatório)</span>}
                          </strong>
                          <small className={[
                            'block truncate text-xs',
                            isCheckout ? 'text-purple-700' : 'text-slate-500',
                          ].join(' ')}>
                            {step.sectorTitle} - {step.aisle}
                          </small>
                        </span>
                        <span className={[
                          'text-xs font-semibold',
                          isCheckout ? 'text-purple-700' : 'text-slate-600',
                        ].join(' ')}>
                          {step.distance} m
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <footer className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-100 px-3 py-2.5 text-sm">
                <span className="inline-flex items-center gap-2 font-semibold text-slate-700">
                  <ShoppingBasket size={16} /> {completedSteps.length}/{routeSteps.length} concluidos
                </span>
                <strong className="text-slate-900">Distancia estimada: {routeTotalDistance} m</strong>
              </footer>
            </>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-500">
              Escolha itens e clique em Gerar rota para visualizar o caminho do cliente.
            </div>
          )}
        </article>
      </div>

      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6" aria-label="Carrinho flutuante">
        {isCartOpen ? (
          <section className="w-[min(92vw,22rem)] rounded-2xl border border-rose-100 bg-white p-3 shadow-[0_18px_40px_rgba(15,23,42,0.22)]">
            <header className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-900">Carrinho da rota</p>
                <p aria-live="polite" className="text-xs text-slate-600">
                  {selectedItemIds.length}{' '}
                  {selectedItemIds.length === 1 ? 'item selecionado' : 'itens selecionados'}
                </p>
              </div>
              <button
                type="button"
                aria-label="Fechar carrinho"
                onClick={() => setIsCartOpen(false)}
                className="rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-slate-600 transition hover:bg-slate-100"
              >
                <X size={14} />
              </button>
            </header>

            {selectedItems.length > 0 ? (
              <ul className="mt-3 max-h-52 space-y-2 overflow-auto pr-1">
                {selectedItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                  >
                    <span className="min-w-0 flex-1">
                      <strong className="block truncate text-sm text-slate-900">{item.name}</strong>
                      <small className="block truncate text-xs text-slate-500">
                        {item.sectorTitle} · {item.brand}
                      </small>
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      className="rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                    >
                      Remover
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-xs text-slate-500">Seu carrinho ainda esta vazio.</p>
            )}
          </section>
        ) : null}

        <button
          type="button"
          aria-expanded={isCartOpen}
          aria-label="Abrir carrinho da rota"
          onClick={() => setIsCartOpen((previous) => !previous)}
          className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-amber-500 text-white shadow-[0_10px_30px_rgba(244,63,94,0.35)] transition hover:scale-105"
        >
          <ShoppingBasket size={22} />
          {selectedItemIds.length > 0 ? (
            <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full border border-white bg-slate-900 px-1 text-[10px] font-bold leading-none text-white">
              {selectedItemIds.length > 99 ? '99+' : selectedItemIds.length}
            </span>
          ) : null}
        </button>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.08)]" aria-label="Ferramentas de funcionarios">
        <header>
          <h3 className="font-['Fraunces'] text-2xl font-semibold text-slate-900">Operacao de funcionarios</h3>
          <p className="mt-1 text-sm text-slate-600">
            Use os itens selecionados para separacao online e reabastecimento de prateleiras.
          </p>
        </header>

        <div className="mt-4 inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1" role="tablist" aria-label="Modo de operacao">
          <button
            type="button"
            role="tab"
            aria-selected={staffMode === 'picking'}
            className={[
              'rounded-lg px-3 py-2 text-sm font-semibold transition',
              staffMode === 'picking' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900',
            ].join(' ')}
            onClick={() => setStaffMode('picking')}
          >
            Separacao online
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={staffMode === 'restock'}
            className={[
              'rounded-lg px-3 py-2 text-sm font-semibold transition',
              staffMode === 'restock' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900',
            ].join(' ')}
            onClick={() => setStaffMode('restock')}
          >
            Reabastecimento
          </button>
        </div>

        {staffMode === 'picking' ? (
          <ul className="mt-4 grid gap-2 md:grid-cols-2">
            {operationsQuery.data?.pickingOrder && operationsQuery.data.pickingOrder.length > 0 ? (
              operationsQuery.data.pickingOrder.map((step, index) => (
                <li
                  key={`${step.aisle}-${step.itemName}-${index}`}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                >
                  <strong className="block text-sm text-slate-900">{step.itemName}</strong>
                  <span className="block text-xs text-slate-500">{step.sectorTitle} - {step.aisle}</span>
                  <small className="mt-1 block text-xs text-slate-600">
                    Estoque: {step.stock.available} un · status {step.stock.status}
                  </small>
                </li>
              ))
            ) : routeSteps.length > 0 ? (
              routeSteps.map((step) => (
                <li key={`${step.step}-${step.itemName}`} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <strong className="block text-sm text-slate-900">{step.itemName}</strong>
                  <span className="block text-xs text-slate-500">{step.sectorTitle} - {step.aisle}</span>
                </li>
              ))
            ) : (
              <li className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-sm text-slate-500 md:col-span-2">
                Gere uma rota para exibir a ordem de separacao.
              </li>
            )}
          </ul>
        ) : (
          <ul className="mt-4 grid gap-2 md:grid-cols-2">
            {operationsQuery.data?.restockQueue && operationsQuery.data.restockQueue.length > 0 ? (
              operationsQuery.data.restockQueue.map((item) => (
                <li key={item.sector} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <strong className="block text-sm text-slate-900">
                    {item.sector} ({item.aisle})
                  </strong>
                  <span className="block text-xs text-slate-600">
                    {item.itemCount} item(ns) · criticos: {item.criticalCount} · baixos: {item.lowCount}
                  </span>
                </li>
              ))
            ) : restockQueue.length > 0 ? (
              restockQueue.map((item) => (
                <li key={item.sector} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <strong className="block text-sm text-slate-900">{item.sector}</strong>
                  <span className="block text-xs text-slate-600">
                    {item.count} item(ns) da cesta atual para conferir estoque
                  </span>
                </li>
              ))
            ) : (
              <li className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-sm text-slate-500 md:col-span-2">
                Selecione itens para priorizar setores de reabastecimento.
              </li>
            )}
          </ul>
        )}

        {operationsQuery.isError ? (
          <p className="mt-3 text-xs font-medium text-amber-700">
            Operacao API indisponivel, exibindo calculo local temporario.
          </p>
        ) : null}
      </section>
    </section>
  );
}

export default ClientRoutePage;
