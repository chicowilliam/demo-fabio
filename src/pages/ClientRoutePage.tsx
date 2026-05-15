import { useMemo, useState } from 'react';
import { Compass, MapPin, Search, ShoppingBasket, Sparkles, Store } from 'lucide-react';
import { supermarkets } from '../data/supermarkets';
import {
  getEntrancePoint,
  optimizeShoppingRoute,
  shoppingItems,
  type ShoppingItem,
} from '../lib/clientRoute';

function ClientRoutePage() {
  const [selectedMarketId, setSelectedMarketId] = useState(supermarkets[0]?.id ?? '');
  const [query, setQuery] = useState('');
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [routeComputed, setRouteComputed] = useState(false);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  const selectedMarket = useMemo(
    () => supermarkets.find((market) => market.id === selectedMarketId) ?? null,
    [selectedMarketId]
  );

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return shoppingItems.slice(0, 8);
    }

    return shoppingItems
      .filter(
        (item) =>
          item.name.toLowerCase().includes(normalized) ||
          item.sectorTitle.toLowerCase().includes(normalized)
      )
      .slice(0, 8);
  }, [query]);

  const optimized = useMemo(
    () => optimizeShoppingRoute(selectedItemIds),
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

      <div className="route-command-bar">
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
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="route-suggestions">
            {filteredItems.map((item) => {
              const selected = selectedItemIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  className={selected ? 'selected' : ''}
                  onClick={() => toggleItem(item.id)}
                >
                  <strong>{item.name}</strong>
                  <span>
                    {item.sectorTitle} - {item.aisle}
                  </span>
                </button>
              );
            })}
          </div>
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

      <div className="route-toolbar">
        <span>
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

          <div className="route-map-stage">
            <svg viewBox="0 0 100 100" className="route-map-svg" aria-hidden="true">
              <rect x="4" y="6" width="92" height="86" rx="4" className="map-wall" />
              <rect x="9" y="15" width="24" height="18" className="map-block" />
              <rect x="40" y="13" width="20" height="18" className="map-block" />
              <rect x="67" y="19" width="20" height="18" className="map-block" />
              <rect x="15" y="48" width="20" height="20" className="map-block" />
              <rect x="44" y="52" width="19" height="18" className="map-block" />
              <rect x="70" y="56" width="18" height="16" className="map-block" />

              <circle cx={entrance.x} cy={entrance.y} r="1.8" className="map-entry" />

              {routeComputed && routePoints.length > 1 ? (
                <polyline
                  points={routePoints.map((point) => `${point.x},${point.y}`).join(' ')}
                  className="map-route"
                />
              ) : null}

              {routeComputed
                ? optimized.steps.map((step) => (
                    <g key={`${step.step}-${step.itemName}`}>
                      <circle cx={step.point.x} cy={step.point.y} r="2.1" className="map-stop" />
                      <text x={step.point.x + 1.8} y={step.point.y - 1.8} className="map-stop-label">
                        {step.step}
                      </text>
                    </g>
                  ))
                : null}
            </svg>
            <div className="map-caption">Entrada principal</div>
          </div>
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
              <div className="route-next-step">
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
    </section>
  );
}

export default ClientRoutePage;
