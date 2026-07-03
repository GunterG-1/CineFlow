import "./pages.css";
import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useCarrito } from '../contexts/carritoContext';
import { api } from '../api';
import { formatCLP } from '../utils/format';

function Confiteria() {
  const { agregarAlCarrito } = useCarrito();
  const [notificacion, setNotificacion] = useState(null);
  const [snacks, setSnacks] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const resp = await api.get('/confiteria/items');
        const raw = Array.isArray(resp) ? resp : resp?.data ?? [];
        if (!mounted) return;
        const list = (raw || []).map(item => ({
          id: item.id,
          title: item.nombre || item.title || item.name,
          description: item.descripcion || item.description || item.desc || '',
          price: Number(item.precio ?? item.price ?? item.valor) || 0,
          emoji: item.emoji || '🍿',
          rutaImagen: item.rutaImagen || item.ruta_imagen || item.image || null
        }));
        setSnacks(list);
      } catch (err) {
        console.error('No se pudieron cargar items de confitería desde API', err);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const handleAgregarSnack = (snack) => {
    agregarAlCarrito(snack);
    setNotificacion(`${snack.title} agregado al carrito 🛒`);
    setTimeout(() => setNotificacion(null), 2500);
  };

  return (
    <>
      <Navbar />
      {notificacion && <div className="notificacion">{notificacion}</div>}
      <main className="confiteria">
        <section className="confiteria__header">
          <h1>Confitería</h1>
          <p>Disfruta de deliciosas opciones mientras disfrutas tu película</p>
        </section>

        <section className="confiteria__grid">
          {snacks.map((snack) => (
            <article key={snack.id} className="snack-card">
              <div className="snack-card__emoji">{snack.emoji}</div>
              <h3 className="snack-card__name">{snack.title}</h3>
              <p className="snack-card__items">{snack.description}</p>
              <div className="snack-card__footer">
                <span className="snack-card__price">{formatCLP(snack.price)}</span>
                <button className="snack-card__btn" onClick={() => handleAgregarSnack(snack)}>
                  Añadir
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Confiteria;
