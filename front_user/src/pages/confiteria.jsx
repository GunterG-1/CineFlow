import "./pages.css";
import { useState } from "react";
import multiply from 'ui-lib';
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useCarrito } from '../contexts/carritoContext';
import { snacks } from '../database/snacks';

function Confiteria() {
  const { agregarAlCarrito } = useCarrito();
  const [notificacion, setNotificacion] = useState(null);

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
                <span className="snack-card__price">${multiply(snack.price, 1).toFixed(3)}</span>
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
