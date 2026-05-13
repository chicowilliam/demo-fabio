import { useMemo, useState } from 'react';
import { supermarkets } from '../data/supermarkets';

function SearchSupermarketsPage() {
  const [searchText, setSearchText] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [sortBy, setSortBy] = useState('distance');

  const cities = useMemo(
    () => [...new Set(supermarkets.map((sm) => sm.city))].sort(),
    []
  );

  const filtered = useMemo(() => {
    let result = supermarkets.filter((sm) => {
      const matchesText =
        sm.name.toLowerCase().includes(searchText.toLowerCase()) ||
        sm.city.toLowerCase().includes(searchText.toLowerCase()) ||
        sm.address.toLowerCase().includes(searchText.toLowerCase());

      const matchesCity = !filterCity || sm.city === filterCity;

      return matchesText && matchesCity;
    });

    if (sortBy === 'distance') {
      result.sort((a, b) => a.distance - b.distance);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'reviews') {
      result.sort((a, b) => b.reviews - a.reviews);
    }

    return result;
  }, [searchText, filterCity, sortBy]);

  return (
    <section className="search-page">
      <div className="search-header">
        <h2>Buscar Supermercados</h2>
        <p>Encontre o supermercado ideal perto de você</p>
      </div>

      <div className="search-filters">
        <div className="filter-group">
          <label htmlFor="search-input">Buscar por nome ou local</label>
          <input
            id="search-input"
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Ex.: Pão de Açúcar, São Paulo..."
          />
        </div>

        <div className="filter-group">
          <label htmlFor="city-select">Cidade</label>
          <select
            id="city-select"
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
          >
            <option value="">Todas as cidades</option>
            {cities.map((city) => (
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
        <p>
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
          {filtered.map((sm) => (
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
                    {sm.services.map((service) => (
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
    </section>
  );
}

export default SearchSupermarketsPage;