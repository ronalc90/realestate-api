import { useState, useEffect, useRef, useCallback } from 'react';
import { getProperties } from '../../api/properties';
import { PropertyFilters } from '../../components/PropertyFilters/PropertyFilters';
import { PropertiesList as PropertiesListComponent } from '../../components/PropertiesList/PropertiesList';

function PropertiesList() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
  });
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef();

  const loadProperties = async (page = 1, pageSize = 20, append = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      const data = await getProperties(page, pageSize);

      const transformedProperties = data.items.map((item, index) => ({
        _id: item.Id || `property-${index}`,
        Name: item.Name,
        AddressProperty: item.AddressProperty,
        PriceProperty: item.PriceProperty,
        Image: item.ImageUrl,
        IdOwner: item.IdOwner,
      }));

      if (append) {
        setProperties((prev) => [...prev, ...transformedProperties]);
        setFilteredProperties((prev) => [...prev, ...transformedProperties]);
      } else {
        setProperties(transformedProperties);
        setFilteredProperties(transformedProperties);
      }

      setPagination({
        page: data.page,
        pageSize: data.pageSize,
        total: data.total,
      });
    } catch (err) {
      console.error('Error loading properties:', err);
      setError('Error al cargar las propiedades. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleFilterChange = (filters) => {
    let filtered = properties;

    if (filters.name) {
      filtered = filtered.filter((property) =>
        property.Name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.address) {
      filtered = filtered.filter((property) =>
        property.AddressProperty.toLowerCase().includes(filters.address.toLowerCase())
      );
    }

    if (filters.price) {
      const maxPrice = filters.price * 1000;
      filtered = filtered.filter((property) => property.PriceProperty <= maxPrice);
    }

    setFilteredProperties(filtered);
  };

  const loadMoreProperties = useCallback(() => {
    if (!loadingMore && pagination.page * pagination.pageSize < pagination.total) {
      const nextPage = pagination.page + 1;
      loadProperties(nextPage, pagination.pageSize, true);
    }
  }, [loadingMore, pagination, pagination.page, pagination.pageSize, pagination.total]);

  const lastPropertyElementRef = useCallback(
    (node) => {
      if (loading || loadingMore) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && pagination.page * pagination.pageSize < pagination.total) {
          loadMoreProperties();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, loadingMore, pagination, loadMoreProperties]
  );

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => loadProperties()} className="retry-button">
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="properties-page">
      <PropertyFilters onFilterChange={handleFilterChange} />
      <PropertiesListComponent
        properties={filteredProperties}
        title="Propiedades"
        loading={loading}
        lastPropertyElementRef={lastPropertyElementRef}
        loadingMore={loadingMore}
      />
    </div>
  );
}

export { PropertiesList };
