import { lazy, Suspense, useMemo, useState } from 'react';
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

  const optimized = useMemo(
    () => navigationEngine.buildRoute({ selectedItemIds }),
    [selectedItemIds]
  );

  const itemById = useMemo(
    () => new Map<string, ShoppingItem>(shoppingItems.map((item) => [item.id, item])),
    []
  );

  const toggleItem = (itemId: string) => {
    setSelectedItemIds((previous) =>
      previous.includes(itemId)
        ? previous.filter((id) => id !== itemId)
        : [...previous, itemId]
    );
  };

  const handleOptimize = () => {
    setRouteComputed(true);
    setCompletedIds([]);
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
    <section className="client-route-page">
      <header className="route-page-header">
        <p className="brand-eyebrow">Rota Guiada</p>
        <h2>Mapa de percurso para o cliente seguir na loja</h2>
        <p>
          Selecione os itens, gere a sequência e acompanhe o caminho no mapa do mercado em tempo
          real de progresso.
        </p>
      </header>

      <div className="route-command-bar" role="region" aria-label="Controles de geração de rota">
        <div className="route-field">
          <label htmlFor="market">Supermercado</label>
          <select
            id="market"
            value={selectedMarketId}
            onChange={(event) => setSelectedMarketId(event.target.value)}
          >
            {supermarkets.map((market) => (
              <option key={market.id} value={market.id}>
                {market.name} - {market.city}
              </option>
            ))}
          </select>
          {selectedMarket ? (
            <div className="route-market-meta">
              <Store size={14} />
              <span>
                {selectedMarket.city} · {selectedMarket.distance} km
              </span>
            </div>
          ) : null}
        </div>

        <div className="route-field route-search">
          <label htmlFor="product-search">Buscar item</label>
          <div className="route-search-box">
            <Search size={16} />
            <input
              id="product-search"
              type="text"
              placeholder="Ex.: leite, tomate, arroz"
              value={query}
              aria-describedby="route-search-help"
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <small id="route-search-help" className="sr-only">
            Digite para ver sugestões e clique para adicionar item à rota.
          </small>
          <div className="route-suggestions">
            {filteredItems.map((item) => {
              const selected = selectedItemIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  className={selected ? 'selected' : ''}
                  aria-pressed={selected}
                  onClick={() => toggleItem(item.id)}
                >
                  <strong>{item.name}</strong>
                  <span>
                    {item.sectorTitle} - {item.aisle}
                  </span>
                  <small>
                    {item.category} · {item.brand}
                  </small>
                </button>
              );
            })}
          </div>
        </div>

        <div className="route-field route-filters">
          <label htmlFor="route-category">Categoria</label>
          <select
            id="route-category"
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            <option value="">Todas</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <label htmlFor="route-brand">Marca</label>
          <select id="route-brand" value={selectedBrand} onChange={(event) => setSelectedBrand(event.target.value)}>
            <option value="">Todas</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="optimize-button"
          onClick={handleOptimize}
          disabled={selectedItemIds.length === 0}
        >
          <Sparkles size={16} />
          Gerar rota
        </button>
      </div>

      <section className="curated-lists" aria-label="Listas de compras curadas">
        <header>
          <h3>Listas curadas por perfil</h3>
          <p>Monte a cesta por categoria, marca e objetivo de compra.</p>
        </header>
        <div className="curated-list-grid">
          {curatedLists.map((list) => (
            <article key={list.id}>
              <h4>{list.title}</h4>
              <p>{list.description}</p>
              <button type="button" onClick={() => applyCuratedList(list.id)}>
                Aplicar lista
              </button>
            </article>
          ))}
        </div>
      </section>

      <div className="route-toolbar">
        <span aria-live="polite">
          <ShoppingBasket size={16} /> {selectedItemIds.length} itens selecionados
        </span>
        <button type="button" className="ghost-btn" onClick={clearSelection}>
          Limpar seleção
        </button>
      </div>

      <div className="route-board">
        <article className="route-map-card">
          <header>
            <h3>
              <MapPin size={18} /> Mapa de percurso do cliente
            </h3>
            <p>
              {selectedMarket ? selectedMarket.name : 'Mercado não selecionado'} - entrada e setores
              estratégicos
            </p>
          </header>

          <Suspense fallback={<div className="route-map-loading">Carregando mapa interativo...</div>}>
            <InteractiveStoreMap
              entrance={entrance}
              routeComputed={routeComputed}
              routePoints={routePoints}
              steps={optimized.steps}
              highlightedItemName={nextStep?.itemName}
              marketName={selectedMarket ? selectedMarket.name : 'Mercado'}
            />
          </Suspense>
        </article>

        <article className="route-steps-card">
          <header>
            <h3>
              <Compass size={18} /> Sequência recomendada
            </h3>
            <p>Marque os itens conforme for passando no corredor.</p>
          </header>

          {routeComputed && optimized.steps.length > 0 ? (
            <>
              <div className="route-next-step" aria-live="polite">
                <strong>Próxima parada:</strong>
                <span>
                  {nextStep
                    ? `${nextStep.itemName} (${nextStep.sectorTitle})`
                    : 'Rota concluída. Ótimas compras!'}
                </span>
              </div>

              <ul className="route-step-list">
                {optimized.steps.map((step) => {
                  const done = completedIds.includes(step.itemName);
                  return (
                    <li key={`${step.step}-${step.itemName}`} className={done ? 'done' : ''}>
                      <button type="button" onClick={() => toggleCompleted(step.itemName)}>
                        <span className="step-index">{step.step}</span>
                        <span className="step-main">
                          <strong>{step.itemName}</strong>
                          <small>
                            {step.sectorTitle} - {step.aisle}
                          </small>
                        </span>
                        <span className="step-distance">{step.distance} m</span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <footer className="route-summary">
                <span>
                  <ShoppingBasket size={16} /> {completedIds.length}/{optimized.steps.length} concluídos
                </span>
                <strong>Distância estimada: {optimized.totalDistance} m</strong>
              </footer>
            </>
          ) : (
            <div className="route-empty">
              <p>Escolha itens e clique em Gerar rota para visualizar o caminho do cliente.</p>
            </div>
          )}

          {selectedItemIds.length > 0 ? (
            <div className="route-selected-items">
              {selectedItemIds.map((itemId) => {
                const item = itemById.get(itemId);
                if (!item) {
                  return null;
                }

                return (
                  <button key={itemId} type="button" onClick={() => toggleItem(itemId)}>
                    {item.name}
                  </button>
                );
              })}
            </div>
          ) : null}
        </article>
      </div>

      <section className="staff-tools" aria-label="Ferramentas de funcionários">
        <header>
          <h3>Operação de funcionários</h3>
          <p>Use os itens selecionados para separação online e reabastecimento de prateleiras.</p>
        </header>

        <div className="staff-mode-switch" role="tablist" aria-label="Modo de operação">
          <button
            type="button"
            role="tab"
            aria-selected={staffMode === 'picking'}
            className={staffMode === 'picking' ? 'active' : ''}
            onClick={() => setStaffMode('picking')}
          >
            Separação online
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={staffMode === 'restock'}
            className={staffMode === 'restock' ? 'active' : ''}
            onClick={() => setStaffMode('restock')}
          >
            Reabastecimento
          </button>
        </div>

        {staffMode === 'picking' ? (
          <ul className="staff-list">
            {operationsQuery.data?.pickingOrder && operationsQuery.data.pickingOrder.length > 0 ? (
              operationsQuery.data.pickingOrder.map((step, index) => (
                <li key={`${step.aisle}-${step.itemName}-${index}`}>
                  <strong>{step.itemName}</strong>
                  <span>{step.sectorTitle} - {step.aisle}</span>
                  <small>
                    Estoque: {step.stock.available} un · status {step.stock.status}
                  </small>
                </li>
              ))
            ) : optimized.steps.length > 0 ? (
              optimized.steps.map((step) => (
                <li key={`${step.step}-${step.itemName}`}>
                  <strong>{step.itemName}</strong>
                  <span>{step.sectorTitle} - {step.aisle}</span>
                </li>
              ))
            ) : (
              <li className="empty">Gere uma rota para exibir a ordem de separação.</li>
            )}
          </ul>
        ) : (
          <ul className="staff-list">
            {operationsQuery.data?.restockQueue && operationsQuery.data.restockQueue.length > 0 ? (
              operationsQuery.data.restockQueue.map((item) => (
                <li key={item.sector}>
                  <strong>
                    {item.sector} ({item.aisle})
                  </strong>
                  <span>
                    {item.itemCount} item(ns) · críticos: {item.criticalCount} · baixos: {item.lowCount}
                  </span>
                </li>
              ))
            ) : restockQueue.length > 0 ? (
              restockQueue.map((item) => (
                <li key={item.sector}>
                  <strong>{item.sector}</strong>
                  <span>{item.count} item(ns) da cesta atual para conferir estoque</span>
                </li>
              ))
            ) : (
              <li className="empty">Selecione itens para priorizar setores de reabastecimento.</li>
            )}
          </ul>
        )}

        {operationsQuery.isError ? (
          <p className="staff-note">Operação API indisponível, exibindo cálculo local temporário.</p>
        ) : null}
      </section>
    </section>
  );
}

export default ClientRoutePage;
