import { lazy, Suspense, useMemo, useRef, useState } from 'react';
import { Compass, MapPin, Search, ShoppingBasket, Sparkles, Store } from 'lucide-react';
import { supermarkets } from '../data/supermarkets';
import {
  curatedLists,
  getEntrancePoint,
  shoppingItems,
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
  const [routeComputed, setRouteComputed] = useState(false);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
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

  const optimized = useMemo(() => navigationEngine.buildRoute({ selectedItemIds }), [selectedItemIds]);

  const itemById = useMemo(
    () => new Map<string, ShoppingItem>(shoppingItems.map((item) => [item.id, item])),
    []
  );

  const toggleItem = (itemId: string) => {
    setSelectedItemIds((previous) =>
      previous.includes(itemId) ? previous.filter((id) => id !== itemId) : [...previous, itemId]
    );
  };

  const handleOptimize = () => {
    setRouteComputed(true);
    setCompletedIds([]);
    requestAnimationFrame(() => {
      routeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const toggleCompleted = (itemName: string) => {
    setCompletedIds((previous) =>
      previous.includes(itemName)
        ? previous.filter((name) => name !== itemName)
        : [...previous, itemName]
    );
  };

  const nextStep = optimized.steps.find((step) => !completedIds.includes(step.itemName));
  const entrance = getEntrancePoint();

  const routePoints = routeComputed ? optimized.polylinePoints : [entrance];

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

  const applyCuratedList = (listId: string) => {
    const list = curatedLists.find((item) => item.id === listId);
    if (!list) {
      return;
    }

    const curatedItemIds = shoppingItems.filter(list.match).map((item) => item.id);
    setSelectedItemIds(curatedItemIds.slice(0, 12));
    setRouteComputed(false);
    setCompletedIds([]);
  };

  const clearSelection = () => {
    setSelectedItemIds([]);
    setCompletedIds([]);
    setRouteComputed(false);
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
              onChange={(event) => setSelectedMarketId(event.target.value)}
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
            ) : optimized.steps.length > 0 ? (
              optimized.steps.map((step) => (
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
