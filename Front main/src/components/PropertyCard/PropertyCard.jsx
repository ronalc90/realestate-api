import { Link } from 'react-router-dom';
import './PropertyCard.scss';

function PropertyCard({ property }) {
  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    }
    return `$${price.toLocaleString()}`;
  };

  return (
    <div className="property-card">
      <div className="property-image">
        <img src={property.Image} alt={property.Name} />
        <div className="price-tag">{formatPrice(property.PriceProperty)}</div>
      </div>

      <div className="property-info">
        <h3 className="property-title">{property.Name}</h3>
        <p className="property-address">{property.AddressProperty}</p>
        <p className="property-owner">IDPropietario: {property.IdOwner}</p>

        <Link to={`/properties/${property._id}`} className="view-more-btn">
          Ver más
        </Link>
      </div>
    </div>
  );
}

export { PropertyCard };
