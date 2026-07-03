import "./pages.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useEffect, useState } from 'react';
import { api } from '../api';

function Promociones() {
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const resp = await api.get('/confiteria/promotions');
        const list = Array.isArray(resp) ? resp : resp?.data ?? [];
        if (!mounted) return;
        setPromotions(list);
      } catch (err) {
        console.error('Error cargando promociones:', err);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <>
      <Navbar />
      <main className="promociones">
        <section className="promociones__header">
          <h1>Promociones</h1>
          <p>Aprovecha nuestras mejores ofertas y descuentos exclusivos</p>
        </section>

        <section className="promociones__list">
          {promotions.map((promo) => (
            <article key={promo.id} className="promo-card">
              <div className="promo-card__emoji" aria-label="emoji">{promo.emoji || '🎟️'}</div>
              <div className="promo-card__content">
                <h3 className="promo-card__title">{promo.title}</h3>
                <p className="promo-card__description">{promo.description}</p>
              </div>
              <div className="promo-card__badge">{promo.discount}</div>
              <button className="promo-card__btn">Ver más</button>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Promociones;
