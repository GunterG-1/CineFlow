import { Link, useNavigate } from 'react-router-dom';
import './pages.css';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { useCarrito } from '../contexts/carritoContext';
import { useAuth } from '../contexts/AuthContext';

function Carrito() {
  const navigate = useNavigate();
  const { cartItems, removerDelCarrito, actualizarCantidad, obtenerPrecioTotal, obtenerCantidadTotal } = useCarrito();
  const { isRegistered } = useAuth();

  const totalPrice = obtenerPrecioTotal();
  const totalItems = obtenerCantidadTotal();

  return (
    <>
      <Navbar />
      <main className="carrito-page">
        <section className="carrito-container">
          <h1>Carrito de compras</h1>

          {cartItems.length === 0 ? (
            <div className="carrito-empty">
              <p>Tu carrito está vacío</p>
              <Link to="/" className="carrito-empty-link">
                Continuar comprando
              </Link>
            </div>
          ) : (
            <div className="carrito-content">
              <div className="carrito-items">
                {cartItems.map((item) => (
                  <article key={item.id} className="carrito-item">
                    <div className="carrito-item__image">
                      {item.imageSrc ? (
                        <img src={item.imageSrc} alt={item.title} />
                      ) : (
                        <span>Imagen no disponible</span>
                      )}
                    </div>
                    <div className="carrito-item__details">
                      <h3 className="carrito-item__title">{item.title}</h3>
                      <p className="carrito-item__genre">{item.genre}</p>
                      {item.fechaFuncionTexto && item.horario ? (
                        <p className="carrito-item__schedule">{item.fechaFuncionTexto} - {item.horario}</p>
                      ) : item.diaAgendaNombre && item.horario ? (
                        <p className="carrito-item__schedule">{item.diaAgendaNombre} - {item.horario}</p>
                      ) : null}
                      <p className="carrito-item__price">${item.price.toFixed(3)}</p>
                    </div>
                    <div className="carrito-item__quantity">
                      <label htmlFor={`qty-${item.id}`}>Cantidad:</label>
                      <div className="qty-control">
                        <button
                          type="button"
                          onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                          aria-label="Disminuir cantidad"
                        >
                          −
                        </button>
                        <input
                          id={`qty-${item.id}`}
                          type="number"
                          min="1"
                          value={item.cantidad}
                          onChange={(e) =>
                            actualizarCantidad(item.id, Math.max(1, parseInt(e.target.value, 10) || 1))
                          }
                          aria-label={`Cantidad de ${item.title}`}
                        />
                        <button
                          type="button"
                          onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                          aria-label="Aumentar cantidad"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="carrito-item__total">
                      <span>${(item.price * item.cantidad).toFixed(3)}</span>
                    </div>
                    <button
                      type="button"
                      className="carrito-item__remove"
                      onClick={() => removerDelCarrito(item.id)}
                      aria-label={`Remover ${item.title} del carrito`}
                    >
                      ✕
                    </button>
                  </article>
                ))}
              </div>

              <aside className="carrito-summary">
                <div className="summary-section">
                  <h3>Resumen del carrito</h3>
                  <div className="summary-row">
                    <span>Cantidad de artículos:</span>
                    <strong>{totalItems}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <strong>${totalPrice.toFixed(3)}</strong>
                  </div>
                  <div className="summary-row summary-total">
                    <span>Total:</span>
                    <strong>${totalPrice.toFixed(3)}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="carrito-checkout-btn"
                  disabled={!isRegistered || cartItems.length === 0}
                  onClick={() => navigate('/resumen-pedido')}
                >
                  {isRegistered ? 'Proceder al pago' : 'Inicia sesión para comprar'}
                </button>

                <Link to="/" className="carrito-continue-link">
                  ← Continuar comprando
                </Link>
              </aside>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Carrito;
