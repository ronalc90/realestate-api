import { Link } from 'react-router-dom';
import './NotFound.scss';

function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found-container">
        <div className="not-found-content">
          <div className="error-icon">
            <span className="error-number">404</span>
            <div className="error-symbol">?</div>
          </div>

          <h1 className="error-title">¡Oops! Página no encontrada</h1>

          <p className="error-description">
            La página que estás buscando no existe o ha sido movida. No te preocupes, te ayudamos a
            encontrar lo que necesitas.
          </p>

          <div className="error-actions">
            <Link to="/properties" className="primary-button">
              Ver Propiedades
            </Link>
            <Link to="/" className="secondary-button">
              Ir al Inicio
            </Link>
          </div>

          <div className="error-help">
            <p>¿Necesitas ayuda? Contacta con nuestro equipo de soporte</p>
            <a href="mailto:example@gmail.com" className="contact-link">
              example@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export { NotFound };
