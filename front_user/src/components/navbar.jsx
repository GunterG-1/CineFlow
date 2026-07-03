import { useState } from 'react';
import { Link } from 'react-router-dom';
import "./navbar.css";
import { useAuth } from '../contexts/AuthContext';
import { useCarrito } from '../contexts/carritoContext';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isRegistered, getDisplayName } = useAuth();
  const { obtenerCantidadTotal } = useCarrito();
  const totalItems = obtenerCantidadTotal();

  const links = [
    { name: "Carteleria", path: "/" },
    { name: "Confiteria", path: "/confiteria" },
    { name: "Promociones", path: "/promociones" },
    { name: "Cine Flow", path: "/cine-flow" },
  ];

  return (
    <header className="navbar" aria-label="Navegacion principal">
      <div className="navbar__inner">
        <button
          type="button"
          className="navbar__toggle"
          aria-expanded={menuOpen}
          aria-controls="navbar-menu"
          aria-label={menuOpen ? 'Cerrar menu' : 'Abrir menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="navbar__toggle-bar" />
          <span className="navbar__toggle-bar" />
          <span className="navbar__toggle-bar" />
          <span className="navbar__toggle-label">Menu</span>
        </button>

        <Link to="/" className="navbar__brand" aria-label="Ir al inicio">
          <img src="/CineFlow01.png" alt="Cine Flow" className="navbar__logo" />
          <span>Cine Flow</span>
        </Link>

        <nav className={`navbar__menu ${menuOpen ? 'navbar__menu--open' : ''}`} id="navbar-menu" aria-label="Menu principal">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="navbar__link"
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="navbar__actions">
          <Link to="/carrito" className="navbar__cart" aria-label="Ver carrito de compras">
            <span className="navbar__cart-icon">🛒</span>
            {totalItems > 0 && <span className="navbar__cart-badge">{totalItems}</span>}
          </Link>
          {isRegistered ? (
            <Link to="/perfil" className="navbar__profile" aria-label="Ir a mi perfil">
              <span className="navbar__profile-avatar">{getDisplayName().charAt(0).toUpperCase()}</span>
              <div className="navbar__profile-copy">
                <span className="navbar__profile-label">Perfil</span>
                <strong className="navbar__profile-name">{getDisplayName()}</strong>
              </div>
            </Link>
          ) : (
            <>
              <Link to="/iniciar-sesion" className="navbar__btn navbar__btn--ghost">
                Iniciar sesion
              </Link>
              <Link to="/registrarse" className="navbar__btn navbar__btn--primary">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
      {menuOpen ? <button type="button" className="navbar__backdrop" aria-label="Cerrar menu" onClick={() => setMenuOpen(false)} /> : null}
    </header>
  );
};

export default Navbar;
