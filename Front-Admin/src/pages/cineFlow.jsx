import "./pages.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

function CineFlow() {
  return (
    <>
      <Navbar />
      <main className="cineflow">
        <section className="cineflow__hero">
          <div className="cineflow__hero-content">
            <h1>Bienvenido a Cine Flow</h1>
            <p>Tu plataforma favorita para disfrutar del cine en línea</p>
          </div>
        </section>

        <section className="cineflow__features">
          <div className="feature">
            <div className="feature__icon">🎬</div>
            <h3>Películas Premium</h3>
            <p>Acceso a las últimas películas en cartelera</p>
          </div>

          <div className="feature">
            <div className="feature__icon">🍿</div>
            <h3>Confitería Online</h3>
            <p>Ordena tus snacks favoritos desde casa</p>
          </div>

          <div className="feature">
            <div className="feature__icon">💰</div>
            <h3>Ofertas Especiales</h3>
            <p>Disfruta de promociones exclusivas todos los días</p>
          </div>

          <div className="feature">
            <div className="feature__icon">📱</div>
            <h3>Acceso Fácil</h3>
            <p>Navega desde cualquier dispositivo</p>
          </div>
        </section>

        <section className="cineflow__about">
          <h2>¿Qué es Cine Flow?</h2>
          <p>
            Cine Flow es tu plataforma integral para disfrutar del cine de manera
            cómoda y segura. Reserva tus entradas, compra snacks y aprovecha
            promociones especiales, todo en un solo lugar.
          </p>
          <p>
            Con una interfaz intuitiva y opciones de pago seguras, hacemos que tu
            experiencia en el cine sea más fácil que nunca.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default CineFlow;
