import { lazy, Suspense, useMemo, useRef, useState } from 'react';
import { Compass, MapPin, Search, ShoppingBasket, Sparkles, Store } from 'lucide-react';
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
      const nextSelection = previous.includes(itemId)
        ? previous.filter((id) => id !== itemId)
        : [...previous, itemId];

      // Keep route state consistent with the exact selection used in optimization.
      setRouteSnapshot(null);
      setCompletedSteps([]);

      return nextSelection;
    });
  };

  const handleOptimize = () => {
    const nextRoute = navigationEngine.buildRoute({ selectedItemIds });
    setRouteSnapshot(nextRoute);
    setCompletedSteps([]);
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
    setQuery('');
  };

  return (
    <section className="space-y-6">
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
        className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_12px_28px_rgba(15,23,42,0.08)] sm:p-5"
        role="region"
        aria-label="Controles de geracao de rota"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <ShoppingBasket size={14} /> {selectedItemIds.length} itens na rota
          </span>
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Store size={14} /> {selectedMarket ? `${selectedMarket.city} · ${selectedMarket.distance} km` : 'Mercado nao definido'}
          </span>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.5fr_0.8fr]">
          <div className="space-y-3">
            <label htmlFor="product-search" className="text-sm font-semibold text-slate-700">
              Buscar item e montar lista
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2.5 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-200">
              <Search size={16} className="text-slate-400" />
              <input
                id="product-search"
                type="text"
                placeholder="Ex.: leite, tomate, arroz"
                value={query}
                aria-describedby="route-search-help"
                onChange={(event) => setQuery(event.target.value)}
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
            <small id="route-search-help" className="sr-only">
              Digite para ver sugestoes e clique para adicionar item a rota.
            </small>

            <div className="grid gap-2 sm:grid-cols-2">
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

            <div className="grid max-h-64 gap-2 overflow-auto pr-1 sm:grid-cols-2">
              {filteredItems.map((item) => {
                const selected = selectedItemIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={[
                      'rounded-xl border p-3 text-left transition',
                      selected
                        ? 'border-rose-300 bg-rose-50 text-rose-900'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-sky-300 hover:bg-sky-50',
                    ].join(' ')}
                    aria-pressed={selected}
                    onClick={() => toggleItem(item.id)}
                  >
                    <strong className="block text-sm">{item.name}</strong>
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

            <p className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
              Dica: monte primeiro a lista e depois gere a rota para obter a sequencia otimizada por corredor.
            </p>
          </aside>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.06)]" aria-label="Resumo do carrinho">
        <div className="flex items-start gap-3 sm:items-center">
          <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white">
            <ShoppingBasket size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900">Carrinho da rota</p>
            <p aria-live="polite" className="text-xs text-slate-600">
              {selectedItemIds.length} {selectedItemIds.length === 1 ? 'item selecionado' : 'itens selecionados'}
            </p>
          </div>
        </div>

        {selectedItemIds.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedItemIds.map((itemId) => {
              const item = itemById.get(itemId);
              if (!item) {
                return null;
              }

              return (
                <button
                  key={itemId}
                  type="button"
                  onClick={() => toggleItem(itemId)}
                  className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                >
                  {item.name}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="mt-3 text-xs text-slate-500">Seu carrinho ainda esta vazio.</p>
        )}
      </section>

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
