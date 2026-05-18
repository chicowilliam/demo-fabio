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
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_14px_32px_rgba(15,23,42,0.08)]">
      <div>
        <h2 className="font-['Fraunces'] text-3xl font-semibold text-slate-900">Buscar Supermercados</h2>
        <p className="mt-2 text-slate-600">Encontre o supermercado ideal perto de voce</p>
      </div>

      {isError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
          <p>Erro ao carregar supermercados: {error?.message}</p>
          <small className="mt-1 block">Tente recarregar a pagina.</small>
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-600">
          <p>Carregando supermercados...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="space-y-2 lg:col-span-2">
              <label htmlFor="search-input" className="text-sm font-semibold text-slate-700">Buscar por nome ou local</label>
              <div className="relative">
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
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                />

                {visibleSuggestions.length > 0 ? (
                  <ul
                    id="supermarket-suggestion-list"
                    role="listbox"
                    className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl"
                  >
                    {visibleSuggestions.map((suggestion: Supermarket, index: number) => (
                      <li key={`${suggestion.id}-${index}`} id={`suggestion-${index}`} role="option" className="list-none">
                        <button
                          type="button"
                          className={[
                            'flex w-full flex-col items-start rounded-lg px-3 py-2 text-left',
                            activeSuggestion === index ? 'bg-sky-100' : 'hover:bg-slate-100',
                          ].join(' ')}
                          onMouseEnter={() => setActiveSuggestion(index)}
                          onClick={() => selectSuggestion(suggestion)}
                        >
                          <strong className="text-sm text-slate-900">{suggestion.name}</strong>
                          <span className="text-xs text-slate-500">
                            {suggestion.city}, {suggestion.state}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="city-select" className="text-sm font-semibold text-slate-700">Cidade</label>
              <select
                id="city-select"
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              >
                <option value="">Todas as cidades</option>
                {cities.map((city: string) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="sort-select" className="text-sm font-semibold text-slate-700">Ordenar por</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                id="sort-select"
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              >
                <option value="distance">Distância</option>
                <option value="rating">Avaliação</option>
                <option value="reviews">Mais avaliado</option>
              </select>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p aria-live="polite" className="text-sm font-medium text-slate-600">
              {filtered.length} supermercado{filtered.length !== 1 ? 's' : ''} encontrado
              {filtered.length !== 1 ? 's' : ''}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
              <p>Nenhum supermercado encontrado com esses critérios.</p>
              <small className="mt-1 block">Tente alterar os filtros ou buscar por outro termo.</small>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((sm: Supermarket) => (
                <article
                  key={sm.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.07)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-['Fraunces'] text-2xl font-semibold text-slate-900">{sm.name}</h3>
                    <div className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
                      <span>★</span>
                      <span>{sm.rating}</span>
                      <span>({sm.reviews})</span>
                    </div>
                  </div>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {sm.city}, {sm.state}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{sm.address}</p>

                  <div className="mt-3 grid gap-2 rounded-xl bg-slate-50 p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-500">Distancia:</span>
                      <span className="font-semibold text-slate-800">{sm.distance} km</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-500">Horario:</span>
                      <span className="font-semibold text-slate-800">{sm.hours}</span>
                    </div>
                  </div>

                  {sm.services && sm.services.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Servicos:</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {sm.services.map((service: string) => (
                          <span key={service} className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-700">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between gap-3">
                    {sm.hasDelivery && (
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        Entrega disponivel
                      </span>
                    )}
                    <a
                      href={`tel:${sm.phone}`}
                      className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
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