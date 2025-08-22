import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPropertyById, getProperties } from '../../api/properties';
import { PropertyCard } from '../../components/PropertyCard/PropertyCard';
import './PropertyDetail.scss';

function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [otherProperties, setOtherProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProperty = async () => {
    try {
      setLoading(true);
      setError(null);

      const propertyData = await getPropertyById(id);

      const transformedProperty = {
        _id: propertyData.Id || id,
        Name: propertyData.Name,
        AddressProperty: propertyData.AddressProperty,
        PriceProperty: propertyData.PriceProperty,
        Image: propertyData.ImageUrl,
        IdOwner: propertyData.IdOwner,
      };

      setProperty(transformedProperty);
    } catch (err) {
      console.error('Error loading property:', err);
      setError('Error al cargar la propiedad. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const loadOtherProperties = async () => {
    try {
      const data = await getProperties(1, 6);

      const transformedProperties = data.items
        .filter((item) => item.Id !== id)
        .slice(0, 6)
        .map((item, index) => ({
          _id: item.Id || `property-${index}`,
          Name: item.Name,
          AddressProperty: item.AddressProperty,
          PriceProperty: item.PriceProperty,
          Image: item.ImageUrl,
          IdOwner: item.IdOwner,
        }));

      setOtherProperties(transformedProperties);
    } catch (err) {
      console.error('Error loading other properties:', err);
    }
  };

  useEffect(() => {
    loadProperty();
    loadOtherProperties();
  }, [id]);

  if (loading) {
    return (
      <div className="property-detail">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando propiedad...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="property-detail">
        <div className="property-detail-error">
          <h2>Error</h2>
          <p>{error}</p>
          <Link to="/properties" className="back-button">
            ← Volver a Propiedades
          </Link>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="property-detail">
        <div className="property-detail-error">
          <h2>Propiedad no encontrada</h2>
          <Link to="/properties" className="back-button">
            ← Volver a Propiedades
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    }
    return `$${price.toLocaleString()}`;
  };

  return (
    <div className="property-detail">
      <div className="back-navigation">
        <div className="back-navigation-container">
          <Link to="/properties" className="back-button">
            ← Volver a Propiedades
          </Link>
        </div>
      </div>

      <div className="property-hero">
        <div className="property-hero-container">
          <div className="property-image-section">
            <img src={property.Image} alt={property.Name} className="main-property-image" />
          </div>

          <div className="property-info-section">
            <div className="property-header">
              <h1 className="property-title">{property.Name}</h1>
              <p className="property-address">{property.AddressProperty}</p>
            </div>

            <div className="property-description">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim id est laborum.
              </p>
            </div>

            <div className="property-details">
              <div className="detail-item">
                <span className="detail-label">Precio:</span>
                <span className="detail-value price">{formatPrice(property.PriceProperty)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Propietario:</span>
                <span className="detail-value">{property.IdOwner}</span>
              </div>
            </div>

            <div className="property-actions">
              <button className="action-button buy-button">COMPRAR</button>
              <button className="action-button contact-button">
                <i className="envelope-icon">✉</i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="more-properties">
        <div className="more-properties-container">
          <h2 className="more-properties-title">Más propiedades</h2>
          <div className="properties-grid">
            {otherProperties.map((prop) => (
              <PropertyCard key={prop._id} property={prop} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export { PropertyDetail };
