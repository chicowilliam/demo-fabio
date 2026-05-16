import { useMemo, useState } from 'react';
import { useSupermarketSuggestions, useSupermarkets } from '../lib/hooks';
import { useDebouncedValue } from '../lib/useDebouncedValue';

type Supermarket = {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  distance: number;
  rating: number;
  reviews: number;
  hours: string;
  phone: string;
  hasDelivery?: boolean;
  services?: string[];
};

export default function SearchSupermarketsPage() {
  const supermarketsQuery = useSupermarkets();
  const [searchText, setSearchText] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [sortBy, setSortBy] = useState('distance');
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const supermarkets = (supermarketsQuery.data ?? []) as Supermarket[];
  const isLoading = supermarketsQuery.isLoading;
  const isError = supermarketsQuery.isError;
  const error = supermarketsQuery.error as Error | null;

  const debouncedSearch = useDebouncedValue(searchText, 220);
  const suggestionsQuery = useSupermarketSuggestions(debouncedSearch);
  const suggestions = (suggestionsQuery.data ?? []) as Supermarket[];

  const cities = useMemo(
    () => [...new Set(supermarkets.map((sm: Supermarket) => sm.city))].sort() as string[],
    [supermarkets]
  );

  const filtered = useMemo(() => {
    let result = supermarkets.filter((sm: Supermarket) => {
      const matchesText =
        sm.name.toLowerCase().includes(searchText.toLowerCase()) ||
        sm.city.toLowerCase().includes(searchText.toLowerCase()) ||
        sm.address.toLowerCase().includes(searchText.toLowerCase());

      const matchesCity = !filterCity || sm.city === filterCity;

      return matchesText && matchesCity;
    });

    if (sortBy === 'distance') {
      result.sort((a: Supermarket, b: Supermarket) => a.distance - b.distance);
    } else if (sortBy === 'rating') {
      result.sort((a: Supermarket, b: Supermarket) => b.rating - a.rating);
    } else if (sortBy === 'reviews') {
      result.sort((a: Supermarket, b: Supermarket) => b.reviews - a.reviews);
    }

    return result;
  }, [supermarkets, searchText, filterCity, sortBy]);

  const visibleSuggestions = useMemo(() => {
    if (!showSuggestions || searchText.trim().length < 2) {
      return [] as Supermarket[];
    }

    return suggestions;
  }, [showSuggestions, searchText, suggestions]);

  const selectSuggestion = (suggestion: Supermarket) => {
    setSearchText(suggestion.name);
    setFilterCity(suggestion.city);
    setShowSuggestions(false);
    setActiveSuggestion(-1);
  };

  const onSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (visibleSuggestions.length === 0) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveSuggestion((prev) => (prev + 1) % visibleSuggestions.length);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveSuggestion((prev) => (prev <= 0 ? visibleSuggestions.length - 1 : prev - 1));
      return;
    }

    if (event.key === 'Enter' && activeSuggestion >= 0) {
      event.preventDefault();
      selectSuggestion(visibleSuggestions[activeSuggestion]);
      return;
    }

    if (event.key === 'Escape') {
      setShowSuggestions(false);
      setActiveSuggestion(-1);
    }
  };

  return (
    <section className="search-page">
      <div className="search-header">
        <h2>Buscar Supermercados</h2>
        <p>Encontre o supermercado ideal perto de você</p>
      </div>

      {isError && (
        <div className="error-state">
          <p>Erro ao carregar supermercados: {error?.message}</p>
          <small>Tente recarregar a página.</small>
        </div>
      )}

      {isLoading ? (
        <div className="loading-state">
          <p>Carregando supermercados...</p>
        </div>
      ) : (
        <>
          <div className="search-filters">
            <div className="filter-group">
              <label htmlFor="search-input">Buscar por nome ou local</label>
              <div className="suggestion-combobox">
                <input
                  id="search-input"
                  type="text"
                  role="combobox"
                  aria-expanded={visibleSuggestions.length > 0}
                  aria-controls="supermarket-suggestion-list"
                  aria-activedescendant={
                    activeSuggestion >= 0 ? `suggestion-${activeSuggestion}` : undefined
                  }
                  value={searchText}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => {
                    // Delay permite clique com mouse nos itens antes de esconder.
                    window.setTimeout(() => setShowSuggestions(false), 120);
                  }}
                  onKeyDown={onSearchKeyDown}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setShowSuggestions(true);
                    setActiveSuggestion(-1);
                  }}
                  placeholder="Ex.: Pão de Açúcar, São Paulo..."
                />

                {visibleSuggestions.length > 0 ? (
                  <ul id="supermarket-suggestion-list" role="listbox" className="suggestion-list">
                    {visibleSuggestions.map((suggestion: Supermarket, index: number) => (
                      <li key={`${suggestion.id}-${index}`} id={`suggestion-${index}`} role="option">
                        <button
                          type="button"
                          className={activeSuggestion === index ? 'active' : ''}
                          onMouseEnter={() => setActiveSuggestion(index)}
                          onClick={() => selectSuggestion(suggestion)}
                        >
                          <strong>{suggestion.name}</strong>
                          <span>
                            {suggestion.city}, {suggestion.state}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>

            <div className="filter-group">
              <label htmlFor="city-select">Cidade</label>
              <select
                id="city-select"
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
              >
                <option value="">Todas as cidades</option>
                {cities.map((city: string) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="sort-select">Ordenar por</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} id="sort-select">
                <option value="distance">Distância</option>
                <option value="rating">Avaliação</option>
                <option value="reviews">Mais avaliado</option>
              </select>
            </div>
          </div>

          <div className="results-header">
            <p aria-live="polite">
              {filtered.length} supermercado{filtered.length !== 1 ? 's' : ''} encontrado
              {filtered.length !== 1 ? 's' : ''}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum supermercado encontrado com esses critérios.</p>
              <small>Tente alterar os filtros ou buscar por outro termo.</small>
            </div>
          ) : (
            <div className="supermarkets-grid">
              {filtered.map((sm: Supermarket) => (
                <article key={sm.id} className="supermarket-card">
                  <div className="sm-header">
                    <h3>{sm.name}</h3>
                    <div className="sm-rating">
                      <span className="star">★</span>
                      <span className="rating-value">{sm.rating}</span>
                      <span className="reviews-count">({sm.reviews})</span>
                    </div>
                  </div>

                  <p className="sm-location">
                    {sm.city}, {sm.state}
                  </p>
                  <p className="sm-address">{sm.address}</p>

                  <div className="sm-details">
                    <div className="detail-item">
                      <span className="label">Distância:</span>
                      <span className="value">{sm.distance} km</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Horário:</span>
                      <span className="value">{sm.hours}</span>
                    </div>
                  </div>

                  {sm.services && sm.services.length > 0 && (
                    <div className="sm-services">
                      <p className="services-label">Serviços:</p>
                      <div className="services-list">
                        {sm.services.map((service: string) => (
                          <span key={service} className="service-tag">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="sm-footer">
                    {sm.hasDelivery && <span className="delivery-badge">📦 Entrega disponível</span>}
                    <a href={`tel:${sm.phone}`} className="call-link">
                      Ligar
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}