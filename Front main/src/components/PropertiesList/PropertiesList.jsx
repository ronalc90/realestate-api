import { PropertyCard } from '../PropertyCard/PropertyCard';
import './PropertiesList.scss';

function PropertiesList({
  properties,
  title = 'Propiedades',
  loading = false,
  lastPropertyElementRef,
  loadingMore = false,
}) {
  if (loading) {
    return (
      <div className="properties-list">
        <div className="properties-container">
          <h1 className="properties-title">{title}</h1>
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando propiedades...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="properties-list">
      <div className="properties-container">
        <h1 className="properties-title">{title}</h1>

        {properties.length === 0 ? (
          <div className="no-properties">
            <p>No se encontraron propiedades que coincidan con los filtros.</p>
          </div>
        ) : (
          <div className="properties-grid">
            {properties.map((property, index) => {
              if (properties.length === index + 1) {
                return (
                  <div key={property._id} ref={lastPropertyElementRef}>
                    <PropertyCard property={property} />
                  </div>
                );
              } else {
                return <PropertyCard key={property._id} property={property} />;
              }
            })}
          </div>
        )}

        {loadingMore && (
          <div className="loading-more-container">
            <div className="loading-spinner"></div>
            <p>Cargando más propiedades...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export { PropertiesList };
