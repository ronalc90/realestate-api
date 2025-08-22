import { useState } from 'react';
import './PropertyFilters.scss';

function PropertyFilters({ onFilterChange }) {
  const [filters, setFilters] = useState({
    name: '',
    address: '',
    price: 1000,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: value,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  return (
    <div className="property-filters">
      <div className="filters-container">
        <h2 className="filters-title">Buscar Propiedades</h2>

        <form className="filters-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              id="name"
              name="name"
              value={filters.name}
              onChange={handleInputChange}
              placeholder="Buscar por nombre..."
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Dirección</label>
            <input
              type="text"
              id="address"
              name="address"
              value={filters.address}
              onChange={handleInputChange}
              placeholder="Buscar por dirección..."
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Precio: ${filters.price.toLocaleString()}</label>
            <div className="price-slider-container">
              <input
                type="range"
                id="price"
                name="price"
                min="50"
                max="1500"
                step="50"
                value={filters.price}
                onChange={handleInputChange}
                className="price-slider"
              />
              <div className="price-labels">
                <span>$50</span>
                <span>$1.500</span>
              </div>
            </div>
          </div>

          <button type="submit" className="search-button">
            Buscar
          </button>
        </form>
      </div>
    </div>
  );
}

export { PropertyFilters };
