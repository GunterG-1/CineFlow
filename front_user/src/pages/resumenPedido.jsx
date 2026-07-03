import "./pages.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useAuth } from '../contexts/AuthContext';
import { useCarrito } from '../contexts/carritoContext';
import { api } from '../api';
import { formatCLP } from '../utils/format';

const SEAT_ROWS = ['A', 'B', 'C', 'D', 'E', 'F'];
const SEAT_COLUMNS = [1, 2, 3, 4, 5, 6, 7, 8];

const buildFunctionKey = (item) => {
  if (!item) {
    return '';
  }

  const movieId = item.id ?? 'NA';
  const day = item.diaAgenda ?? 0;
  const hour = String(item.horaNum ?? 0).padStart(2, '0');
  const minute = String(item.minutoNum ?? 0).padStart(2, '0');
  return `MOV-${movieId}-D${day}-${hour}${minute}`;
};

const buildRoomName = (item) => {
  if (!item) {
    return '';
  }

  if (item.sala) {
    return item.sala;
  }

  if (item.nombreSala && item.tipoSala) {
    return `${item.nombreSala} - ${item.tipoSala}`;
  }

  if (item.nombreSala) {
    return item.nombreSala;
  }

  if (item.tipoSala) {
    return item.tipoSala;
  }

  const movieId = Number(item.id);
  const hour = Number(item.horaNum);
  const minute = Number(item.minutoNum);

  if (movieId === 1 && hour === 16 && minute === 30) return 'Sala 1 - 2D';
  if (movieId === 1 && hour === 21 && minute === 0) return 'Sala 2 - IMAX';
  if (movieId === 2 && hour === 15 && minute === 0) return 'Sala 3 - 3D';
  if (movieId === 2 && hour === 20 && minute === 15) return 'Sala 1 - 2D';
  if (movieId === 3 && hour === 14 && minute === 45) return 'Sala 2 - IMAX';
  if (movieId === 3 && hour === 19 && minute === 30) return 'Sala 3 - 3D';

  return 'Sala 1 - 2D';
};

function ResumenPedido() {
  const navigate = useNavigate();
  const { isRegistered, getDisplayName, userProfile, updateProfile } = useAuth();
  const { cartItems, obtenerPrecioTotal, vaciarCarrito, agregarAlCarrito } = useCarrito();
  const [aceptoTerminos, setAceptoTerminos] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatError, setSeatError] = useState('');
  const [occupiedSeats, setOccupiedSeats] = useState(new Set());
  const [mostrarRevisionPago, setMostrarRevisionPago] = useState(false);
  const [mostrarOpcionesExtras, setMostrarOpcionesExtras] = useState(false);
  const [indiceExtraActivo, setIndiceExtraActivo] = useState(0);
  const [mensajeExtra, setMensajeExtra] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [confiteriaStatus, setConfiteriaStatus] = useState({ ok: null, message: '' });
  const [snacks, setSnacks] = useState([]);
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [snacksResp, promosResp] = await Promise.all([
          api.get('/confiteria/items'),
            api.get('/confiteria/promotions')
        ]);

        if (!mounted) return;
        const rawSnacks = Array.isArray(snacksResp) ? snacksResp : snacksResp?.data ?? [];
        const rawPromos = Array.isArray(promosResp) ? promosResp : promosResp?.data ?? [];
        const mappedSnacks = (rawSnacks || []).map(item => ({
          id: item.id,
          title: item.nombre || item.title || item.name,
          description: item.descripcion || item.description || '',
          price: Number(item.precio ?? item.price ?? item.valor) || 0,
          emoji: item.emoji || '🍿',
        }));
        const mappedPromos = (rawPromos || []).map(p => ({
          id: p.id,
          title: p.title || p.nombre,
          description: p.description || p.descripcion || '',
          discount: p.discount || p.desc || '',
          emoji: p.emoji || '🎟️',
        }));
        setSnacks(mappedSnacks);
        setPromotions(mappedPromos);
      } catch (err) {
        console.error('Error cargando confitería/promociones:', err);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const totalTickets = cartItems.reduce((total, item) => {
    const esEntrada = Number.isInteger(item.horaNum) && Number.isInteger(item.minutoNum);
    return esEntrada ? total + item.cantidad : total;
  }, 0);
  const entradasDelCarrito = cartItems.filter((item) => Number.isInteger(item.horaNum) && Number.isInteger(item.minutoNum));
  const entradaPrincipal = entradasDelCarrito[0] || null;
  const claveFuncion = buildFunctionKey(entradaPrincipal);
  const roomName = buildRoomName(entradaPrincipal);

  const confiteriaItems = cartItems.filter((item) => item.id >= 101 && item.id <= 110);

  const totalPrice = obtenerPrecioTotal();

  const PURCHASED_SEATS_KEY = 'cine-flow-purchased-seats';

  const getPurchasedSeats = () => {
    if (typeof window === 'undefined') {
      return new Set();
    }

    const stored = window.localStorage.getItem(PURCHASED_SEATS_KEY);
    if (!stored) {
      return new Set();
    }

    try {
      const parsed = JSON.parse(stored);
      return new Set(Array.isArray(parsed) ? parsed : []);
    } catch {
      return new Set();
    }
  };

  const savePurchasedSeats = (seats) => {
    if (typeof window === 'undefined') {
      return;
    }

    const allPurchased = new Set([...getPurchasedSeats(), ...seats]);
    window.localStorage.setItem(PURCHASED_SEATS_KEY, JSON.stringify(Array.from(allPurchased)));
  };

  useEffect(() => {
    let activo = true;

    const cargarDisponibilidad = async () => {
      const purchased = getPurchasedSeats();

      if (!claveFuncion) {
        if (activo) {
          setOccupiedSeats(new Set(purchased));
        }
        return;
      }

      try {
        // CORRECCIÓN: Se eliminó /api
        const respuesta = await api.get(`/entradas/disponibilidad?idFuncion=${idFuncion}`);
        const asientosNoDisponibles = Array.isArray(respuesta?.asientosNoDisponibles) ? respuesta.asientosNoDisponibles : [];

        if (activo) {
          setOccupiedSeats(new Set([...asientosNoDisponibles, ...purchased]));
        }
      } catch {
        if (activo) {
          setOccupiedSeats(new Set(purchased));
        }
      }
    };

    cargarDisponibilidad();

    return () => {
      activo = false;
    };
  }, [entradaPrincipal?.idFuncion]); 

  const handleSeatToggle = (seatId) => {
    setSelectedSeats((current) => {
      if (current.includes(seatId)) {
        return current.filter((seat) => seat !== seatId);
      }

      if (current.length < totalTickets) {
        return [...current, seatId];
      }

      return current;
    });
    setSeatError('');
  };

  const handleProcesarPago = async () => {
    setConfirmando(true);

    if (selectedSeats.length !== totalTickets) {
      setSeatError(`Debes seleccionar ${totalTickets} asiento${totalTickets === 1 ? '' : 's'} antes de continuar.`);
      setConfirmando(false);
      return;
    }

    const metodoElegido = paymentMethod || userProfile?.metodoPago || 'Tarjeta';

    try {
      if (userProfile?.idUsuario && metodoElegido && metodoElegido !== (userProfile?.metodoPago || '')) {
        try {
          await updateProfile({
            nombre: userProfile.nombreUsuario || '',
            apellido: userProfile.apellidoUsuario || '',
            metodoPago: metodoElegido,
          });
        } catch (err) {
          console.warn('No se pudo actualizar el metodo de pago en el perfil:', err);
        }
      }
      if (!entradaPrincipal && confiteriaItems.length > 0) {
        const respuestas = [];
        const mapSnackToComboId = (snackId) => {
          const map = {
            101: 1, 
            102: 2, 
            103: 1, 
            104: 1, 
            105: 2, 
            106: 3, 
          };

          return map[Number(snackId)] ?? Number(snackId);
        };
        for (const item of confiteriaItems) {
          try {
            // CORRECCIÓN: Se eliminó /api
            const orden = await api.post('/confiteria/ordenar', {
              comboId: mapSnackToComboId(item.id),
              cantidad: item.cantidad || 1,
              idUsuario: userProfile?.idUsuario ?? null,
              observaciones: item.observaciones || '',
            });
            respuestas.push(orden);
          } catch (err) {
            console.error('Error creando orden de confitería:', err);
            setConfiteriaStatus({ ok: false, message: err.message || 'No se pudo crear la orden de confitería' });
            throw new Error(err.message || 'No se pudo crear la orden de confitería');
          }
        }

        const totalOrden = respuestas.reduce((s, r) => s + (r?.precioTotal || 0), 0);
        setConfiteriaStatus({ ok: true, message: `Orden de confitería creada (${respuestas.length} items)` });
        const pedido = {
          id: Date.now(),
          usuario: getDisplayName(),
          items: cartItems,
          asientos: [],
          total: totalOrden || totalPrice,
          totalEntradas: 0,
          fecha: new Date().toLocaleDateString('es-ES'),
          hora: new Date().toLocaleTimeString('es-ES'),
          estado: 'Confirmado',
        };

        const pedidos = JSON.parse(localStorage.getItem('cine-flow-pedidos') || '[]');
        pedidos.push(pedido);
        localStorage.setItem('cine-flow-pedidos', JSON.stringify(pedidos));

        vaciarCarrito();
        navigate('/pedido-confirmado', { state: { pedido } });
        return;
      }

      // Flujo: primero crear reserva, luego procesar pago con reservationId + amount
      const funcionId = entradaPrincipal?.idFuncion ?? null;
      if (!funcionId) {
        console.log("DEBUG - Objeto entradaPrincipal:", entradaPrincipal);
const funcionId = entradaPrincipal?.idFuncion ?? null;
        throw new Error('No se pudo identificar la función para reservar');
      }

      // Crear reserva
     const reservaResp = await api.patch('/entradas/reservar', {
  idFuncion: funcionId,
  asientosSeleccionados: selectedSeats,
});

const respuesta = await api.post('/entradas/pagar', {
  idFuncion: funcionId,
  asientosSeleccionados: selectedSeats,
  emailComprador: userProfile?.email || userProfile?.correo || '',
  metodoPago: metodoElegido,
});

      const pedido = {
        id: Date.now(),
        usuario: getDisplayName(),
        items: cartItems,
        asientos: selectedSeats,
        total: respuesta?.precioTotal ?? totalPrice,
        totalEntradas: totalTickets,
        fecha: new Date().toLocaleDateString('es-ES'),
        hora: new Date().toLocaleTimeString('es-ES'),
        estado: 'Confirmado',
      };

      setOccupiedSeats((prev) => new Set([...prev, ...selectedSeats]));

      const pedidos = JSON.parse(localStorage.getItem('cine-flow-pedidos') || '[]');
      pedidos.push(pedido);
      localStorage.setItem('cine-flow-pedidos', JSON.stringify(pedidos));

      vaciarCarrito();
      navigate('/pedido-confirmado', { state: { pedido } });
    } catch (error) {
      setSeatError(error.message || 'No se pudo confirmar la compra');
    } finally {
      setConfirmando(false);
    }
  };

  const handleSolicitarRevisionPago = () => {
    if (selectedSeats.length !== totalTickets) {
      setSeatError(`Debes seleccionar ${totalTickets} asiento${totalTickets === 1 ? '' : 's'} antes de continuar.`);
      return;
    }

    if (!aceptoTerminos) {
      alert('Debes aceptar los términos y condiciones');
      return;
    }

    setMostrarRevisionPago(true);
  };

  const handleAgregarExtra = (snack) => {
    agregarAlCarrito(snack);
    setMensajeExtra(`${snack.title} agregado al carrito`);
    setTimeout(() => setMensajeExtra(''), 1800);
  };

  const moverCarruselExtras = (direccion) => {
    setIndiceExtraActivo((actual) => {
      if (direccion === 'prev') {
        return actual === 0 ? snacks.length - 1 : actual - 1;
      }

      return actual === snacks.length - 1 ? 0 : actual + 1;
    });
  };

  const extraActivo = snacks[indiceExtraActivo];

  return (
    <>
      <Navbar />
      <main className="resumen-page">
        <div className="resumen-container">
          <h1>Resumen de Pedido</h1>

          <div className="resumen-content">
            {/* Detalles del cliente */}
            <section className="resumen-cliente">
              <h2>Detalles del Cliente</h2>
              <div className="cliente-info">
                <p><strong>Usuario:</strong> {getDisplayName()}</p>
                <p><strong>Fecha:</strong> {new Date().toLocaleDateString('es-ES')}</p>
                <p><strong>Hora:</strong> {new Date().toLocaleTimeString('es-ES')}</p>
                <p><strong>Entradas:</strong> {totalTickets}</p>
              </div>
            </section>

            {/* Items del pedido */}
            <section className="resumen-items">
              <h2>Items del Pedido</h2>
              <div className="resumen-items-list">
                {cartItems.map((item) => (
                  <div key={item.id} className="resumen-item-row">
                    <div className="resumen-item-img">
                      <img src={item.imageSrc} alt={item.title} />
                    </div>
                    <div className="resumen-item-details">
                      <h3>{item.title}</h3>
                      <p className="resumen-item-genre">{item.genre || item.description}</p>
                      {item.fechaFuncionTexto && item.horario ? (
                        <p className="resumen-item-schedule">{item.fechaFuncionTexto} - {item.horario}</p>
                      ) : item.diaAgendaNombre && item.horario ? (
                        <p className="resumen-item-schedule">{item.diaAgendaNombre} - {item.horario}</p>
                      ) : null}
                    </div>
                    <div className="resumen-item-cantidad">
                      <span>{item.cantidad} x </span>
                    </div>
                    <div className="resumen-item-precio">
                      <span>{formatCLP(item.price * item.cantidad)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Selección de asientos */}
            <section className="resumen-asientos">
              <div className="resumen-asientos__header">
                <div>
                  <h2>Selecciona tus asientos</h2>
                  <p>
                    Elige {totalTickets} asiento{totalTickets === 1 ? '' : 's'} para continuar con el pago.
                  </p>
                  {entradaPrincipal ? (
                    <p className="resumen-asientos__room">
                      <strong>Sala:</strong> {buildRoomName(entradaPrincipal)}
                    </p>
                  ) : null}
                </div>
                <div className="resumen-asientos__counter">
                  <span>Seleccionados</span>
                  <strong>{selectedSeats.length}/{totalTickets}</strong>
                </div>
              </div>

              <div className="seat-map__screen">Pantalla</div>

              <div className="seat-map">
                {SEAT_ROWS.map((row) => (
                  <div key={row} className="seat-map__row">
                    <span className="seat-map__row-label">{row}</span>
                    <div className="seat-map__grid">
                      {SEAT_COLUMNS.map((column) => {
                        const seatId = `${row}${column}`;
                        const isOccupied = occupiedSeats.has(seatId);
                        const isSelected = selectedSeats.includes(seatId);

                        return (
                          <button
                            key={seatId}
                            type="button"
                            className={`seat ${isOccupied ? 'seat--occupied' : ''} ${isSelected ? 'seat--selected' : ''}`}
                            onClick={() => handleSeatToggle(seatId)}
                            disabled={isOccupied || confirmando}
                            aria-pressed={isSelected}
                            aria-label={`Asiento ${seatId}${isOccupied ? ', ocupado' : ''}`}
                          >
                            {seatId}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="seat-legend">
                <span className="seat-legend__item"><i className="seat seat--available" /> Disponible</span>
                <span className="seat-legend__item"><i className="seat seat--selected" /> Seleccionado</span>
                <span className="seat-legend__item"><i className="seat seat--occupied" /> Ocupado</span>
              </div>

              {seatError ? <p className="seat-error">{seatError}</p> : null}

              {selectedSeats.length > 0 ? (
                <div className="seat-selection-summary">
                  <span>Asientos elegidos:</span>
                  <div className="seat-chips">
                    {selectedSeats.map((seat) => (
                      <span key={seat} className="seat-chip">{seat}</span>
                    ))}
                  </div>
                </div>
              ) : null}
            </section>

            {/* Resumen financiero */}
            <section className="resumen-total">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>{formatCLP(totalPrice)}</span>
              </div>
              <div className="total-row">
                <span>Impuestos (0%):</span>
                <span>$0.000</span>
              </div>
              <div className="total-row final">
                <strong>Total:</strong>
                <strong>{formatCLP(totalPrice)}</strong>
              </div>
            </section>

            {/* Términos y condiciones */}
            <section className="resumen-terminos">
              <label className="terminos-checkbox">
                <input
                  type="checkbox"
                  checked={aceptoTerminos}
                  onChange={(e) => setAceptoTerminos(e.target.checked)}
                  disabled={confirmando}
                />
                <span>
                  Acepto los términos y condiciones de compra y la política de privacidad
                </span>
              </label>
            </section>

            {/* Validación de asientos faltantes */}
            {selectedSeats.length < totalTickets && !mostrarRevisionPago && (
              <div className="resumen-warning">
                <p>⚠️ Falta seleccionar {totalTickets - selectedSeats.length} asiento{totalTickets - selectedSeats.length === 1 ? '' : 's'} para continuar con el pago.</p>
              </div>
            )}

            {/* Botones de acción */}
            <div className="resumen-acciones">
              <button
                className="resumen-volver-btn"
                onClick={() => navigate('/carrito')}
                disabled={confirmando}
              >
                Volver al carrito
              </button>
              <button
                className="resumen-confirmar-btn"
                onClick={handleSolicitarRevisionPago}
                disabled={!aceptoTerminos || confirmando || selectedSeats.length !== totalTickets}
                title={selectedSeats.length !== totalTickets ? `Debes seleccionar ${totalTickets - selectedSeats.length} asiento${totalTickets - selectedSeats.length === 1 ? '' : 's'} más` : ''}
              >
                {confirmando ? 'Procesando...' : 'Ir al pago'}
              </button>
            </div>
          </div>
        </div>
      </main>
      {mostrarRevisionPago ? (
        <div className="payment-review-overlay" onClick={() => setMostrarRevisionPago(false)}>
          <div className="payment-review-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="payment-review-close" onClick={() => setMostrarRevisionPago(false)}>
              ✕
            </button>
            <h2>¿No nos falta nada?</h2>
            <p className="payment-review-copy">
              Revisa tu pedido una vez más antes de proceder con el pago.
            </p>

            <section className="payment-review-promos">
              <h3>Promos disponibles</h3>
              <div className="payment-review-promos-grid">
                {promotions.slice(0, 3).map((promo) => (
                  <article key={promo.id} className="payment-review-promo-card">
                    <div className="payment-review-promo-emoji">{promo.emoji}</div>
                    <div className="payment-review-promo-body">
                      <h4>{promo.title}</h4>
                      <p>{promo.description}</p>
                    </div>
                    <span className="payment-review-promo-badge">{promo.discount}</span>
                  </article>
                ))}
              </div>
            </section>

            <section className="payment-review-extras">
              <button
                type="button"
                className="payment-review-extras-toggle"
                onClick={() => setMostrarOpcionesExtras((current) => !current)}
                disabled={confirmando}
              >
                {mostrarOpcionesExtras ? 'Ocultar opciones para agregar' : 'Ver carrusel de opciones para agregar'}
              </button>

              {mostrarOpcionesExtras && extraActivo ? (
                <div className="payment-review-extras-panel">
                  <div className="payment-review-extras-carousel">
                    <button
                      type="button"
                      className="payment-review-extras-nav"
                      onClick={() => moverCarruselExtras('prev')}
                      aria-label="Opción anterior"
                    >
                      ‹
                    </button>

                    <article className="payment-review-extra-card">
                      <div className="payment-review-extra-emoji">{extraActivo.emoji}</div>
                      <h4>{extraActivo.title}</h4>
                      <p>{extraActivo.description}</p>
                      <strong>{formatCLP(extraActivo.price)}</strong>
                      <button
                        type="button"
                        className="payment-review-extra-add"
                        onClick={() => handleAgregarExtra(extraActivo)}
                        disabled={confirmando}
                      >
                        Agregar
                      </button>
                    </article>

                    <button
                      type="button"
                      className="payment-review-extras-nav"
                      onClick={() => moverCarruselExtras('next')}
                      aria-label="Siguiente opción"
                    >
                      ›
                    </button>
                  </div>

                  <p className="payment-review-extras-index">
                    Opción {indiceExtraActivo + 1} de {snacks.length}
                  </p>
                  {mensajeExtra ? <p className="payment-review-extras-feedback">{mensajeExtra}</p> : null}
                </div>
              ) : null}
            </section>

            <section className="payment-review-method">
              <h3>Método de pago</h3>
              <p>Método guardado: <strong>{userProfile?.metodoPago || 'No tienes método guardado'}</strong></p>
              <label>
                Usar/Seleccionar método de pago
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  <option value="">Seleccionar método</option>
                  <option value="Tarjeta">Tarjeta</option>
                  <option value="MercadoPago">MercadoPago</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="ApplePay">Apple Pay</option>
                </select>
              </label>
            </section>

            <div className="payment-review-summary">
              <div>
                <span>Entradas</span>
                <strong>{totalTickets}</strong>
              </div>
              <div>
                <span>Total</span>
                <strong>{formatCLP(totalPrice)}</strong>
              </div>
            </div>

            <div className="payment-review-actions">
              <button type="button" className="payment-review-secondary" onClick={() => setMostrarRevisionPago(false)}>
                Revisar pedido
              </button>
              <button type="button" className="payment-review-primary" onClick={handleProcesarPago} disabled={confirmando}>
                {confirmando ? 'Procesando...' : 'Sí, proceder al pago'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <Footer />
    </>
  );
}

export default ResumenPedido;