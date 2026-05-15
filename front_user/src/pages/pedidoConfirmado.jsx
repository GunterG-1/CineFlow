import "./pages.css";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

function PedidoConfirmado() {
  const location = useLocation();
  const navigate = useNavigate();
  const pedido = location.state?.pedido;
  const asientos = Array.isArray(pedido?.asientos) ? pedido.asientos : [];
  const totalEntradas = pedido?.totalEntradas ?? pedido?.items?.reduce((total, item) => total + item.cantidad, 0) ?? 0;

  if (!pedido) {
    return (
      <>
        <Navbar />
        <main className="confirmacion-page">
          <div className="confirmacion-error">
            <p>No hay información del pedido</p>
            <button onClick={() => navigate('/')}>Volver al inicio</button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="confirmacion-page">
        <div className="confirmacion-container">
          <div className="confirmacion-header">
            <div className="confirmacion-icon">✓</div>
            <h1>¡Pedido Confirmado!</h1>
            <p>Tu compra se ha procesado exitosamente</p>
          </div>

          <div className="confirmacion-content">
            {/* Número de pedido */}
            <section className="confirmacion-numero">
              <h2>Número de Pedido</h2>
              <p className="numero-pedido">#{pedido.id}</p>
            </section>

            {/* Detalles del pedido */}
            <section className="confirmacion-detalles">
              <h2>Detalles del Pedido</h2>
              <div className="detalles-grid">
                <div className="detalle-item">
                  <label>Cliente:</label>
                  <p>{pedido.usuario}</p>
                </div>
                <div className="detalle-item">
                  <label>Fecha:</label>
                  <p>{pedido.fecha}</p>
                </div>
                <div className="detalle-item">
                  <label>Hora:</label>
                  <p>{pedido.hora}</p>
                </div>
                <div className="detalle-item">
                  <label>Estado:</label>
                  <p className="estado-confirmado">{pedido.estado}</p>
                </div>
                <div className="detalle-item">
                  <label>Entradas:</label>
                  <p>{totalEntradas}</p>
                </div>
              </div>
            </section>

            {/* Items comprados */}
            <section className="confirmacion-items">
              <h2>Items Comprados</h2>
              <div className="items-list">
                {pedido.items.map((item) => (
                  <div key={item.id} className="confirmacion-item">
                    <div className="item-img">
                      <img src={item.imageSrc} alt={item.title} />
                    </div>
                    <div className="item-info">
                      <h3>{item.title}</h3>
                      <p>{item.genre || item.description}</p>
                    </div>
                    <div className="item-qty">
                      <span>{item.cantidad}x</span>
                    </div>
                    <div className="item-total">
                      <strong>${(item.price * item.cantidad).toFixed(3)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {asientos.length > 0 ? (
              <section className="confirmacion-asientos">
                <h2>Asientos asignados</h2>
                <div className="confirmacion-asientos__list">
                  {asientos.map((seat) => (
                    <span key={seat} className="confirmacion-asiento-chip">{seat}</span>
                  ))}
                </div>
              </section>
            ) : null}

            {/* Total */}
            <section className="confirmacion-total">
              <div className="total-line">
                <span>Total pagado:</span>
                <strong className="monto-total">${pedido.total.toFixed(3)}</strong>
              </div>
            </section>

            {/* Mensaje informativo */}
            <section className="confirmacion-info">
              <p>
                Se ha enviado un correo de confirmación a tu email. 
                Guarda tu número de pedido para futuras referencias.
              </p>
            </section>

            {/* Botones de acción */}
            <div className="confirmacion-acciones">
              <button className="confirmacion-inicio-btn" onClick={() => navigate('/')}>
                Volver al Inicio
              </button>
              <button className="confirmacion-seguimiento-btn" onClick={() => navigate('/perfil')}>
                Ver Mis Pedidos
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default PedidoConfirmado;
