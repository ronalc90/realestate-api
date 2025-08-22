import './NavBar.scss';
import { useLocation, Link } from 'react-router-dom';
import { useState } from 'react';

function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <h2 className="logo">CASAYA!</h2>

      {/* Hamburger button */}
      <button
        className={`hamburger ${isMenuOpen ? 'active' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Navigation menu */}
      <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        <li className={`nav-link ${isActive('/') ? 'active' : ''}`}>
          <Link to="/" onClick={closeMenu}>
            Inicio
          </Link>
        </li>
        <li className={`nav-link ${isActive('/properties') ? 'active' : ''}`}>
          <Link to="/properties" onClick={closeMenu}>
            Propiedades
          </Link>
        </li>
        <li className="nav-link">
          <a href="#" onClick={closeMenu}>
            Contacto
          </a>
        </li>
      </ul>
    </nav>
  );
}

export { Navbar };
