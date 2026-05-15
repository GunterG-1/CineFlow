import "./pages.css";
import { useRef, useState } from "react";
import Navbar from "../components/navbar";
import Carousel from "../components/carousel";
import Footer from "../components/footer";
import HorariosModal from "../components/horariosModal";
import { useAuth } from '../contexts/AuthContext';
import { useFavoritos } from '../contexts/favoritosContext';
import { useCarrito } from '../contexts/carritoContext';
import { movies, featuredSlides } from '../database/movies';
import { formatearHora } from '../database/horarios';

function HomeUser() {
  const { isRegistered } = useAuth();
  const { toggleFavorito, esFavorito } = useFavoritos();
  const { agregarAlCarrito } = useCarrito();
  const [notificacion, setNotificacion] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [peliculaSeleccionada, setPeliculaSeleccionada] = useState(null);
  const horarioProcesadoRef = useRef(false);

  const handleToggleFavorito = (movie) => {
    toggleFavorito(movie);
    const esAhora = !esFavorito(movie.id);
    const mensaje = esAhora
      ? `${movie.title} agregado a favoritos ⭐`
      : `${movie.title} removido de favoritos`;
    setNotificacion(mensaje);
    setTimeout(() => setNotificacion(null), 2500);
  };

  const handleComprarEntrada = (movie) => {
    if (!isRegistered) {
      setNotificacion('Primero debes iniciar sesión o registrarte para comprar entradas');
      setTimeout(() => setNotificacion(null), 2500);
      return;
    }

    setPeliculaSeleccionada(movie);
    horarioProcesadoRef.current = false;
    setModalAbierto(true);
  };

  const handleClickSlide = (slide) => {
    const movie = movies.find((item) => item.id === slide.movieId);

    if (!movie) {
      return;
    }

    handleComprarEntrada(movie);
  };

  const handleSeleccionarHorario = ({ dia, nombreDia, fechaFuncionTexto, horario }) => {
    if (horarioProcesadoRef.current || !peliculaSeleccionada) {
      return;
    }

    horarioProcesadoRef.current = true;
    const horaFormateada = formatearHora(horario.hora, horario.minuto);
    const peliculaConHorario = {
      ...peliculaSeleccionada,
      diaAgenda: dia,
      diaAgendaNombre: nombreDia,
      fechaFuncionTexto,
      horario: horaFormateada,
      horaNum: horario.hora,
      minutoNum: horario.minuto,
    };
    agregarAlCarrito(peliculaConHorario);
    setNotificacion(`${peliculaSeleccionada.title} - ${fechaFuncionTexto || nombreDia} a las ${horaFormateada} agregado al carrito 🛒`);
    setModalAbierto(false);
    setTimeout(() => setNotificacion(null), 2500);
  };

  return (
    <>
      <Navbar />
      {notificacion && <div className="notificacion">{notificacion}</div>}
      <main className="home-user">
        <section className="home-user__header">
          <h1>Bienvenido a Cine Flow!</h1>
          <p>Donde ir al cine, se convierte en una experiencia inolvidable</p>
        </section>

        {!isRegistered ? (
          <section className="home-user__access-note">
            <p>Para comprar entradas primero debes iniciar sesión o registrarte.</p>
          </section>
        ) : null}

        <Carousel slides={featuredSlides} onSlideClick={handleClickSlide} />

        <section className="home-user__grid">
          {movies.map((movie) => (
            <article key={movie.id} className="movie-card">
              <button
                className="movie-card__favorite"
                onClick={() => handleToggleFavorito(movie)}
                title={esFavorito(movie.id) ? 'Remover de favoritos' : 'Agregar a favoritos'}
              >
                {esFavorito(movie.id) ? '★' : '☆'}
              </button>
              <div className="movie-card__poster">
                {movie.imageSrc ? (
                  <img src={movie.imageSrc} alt={movie.title} className="movie-card__image" />
                ) : (
                  <span>Imagen no disponible</span>
                )}
              </div>
              <h3 className="movie-card__title">{movie.title}</h3>
              <p className="movie-card__genre">{movie.genre}</p>
              <div className="movie-card__footer">
                <span className="movie-card__rating">${movie.price.toFixed(3)}</span>
                <button
                  className="movie-card__btn"
                  disabled={!isRegistered}
                  onClick={() => handleComprarEntrada(movie)}
                >
                  {isRegistered ? 'Comprar entrada' : 'Registrate para comprar'}
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
      <Footer />
      {modalAbierto && peliculaSeleccionada && (
        <HorariosModal
          pelicula={peliculaSeleccionada}
          onClose={() => setModalAbierto(false)}
          onSelectHorario={handleSeleccionarHorario}
        />
      )}
    </>
  );
}

export default HomeUser;
