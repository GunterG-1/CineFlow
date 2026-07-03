import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import './adminMovies.css';
import { useMovieCatalog } from '../contexts/movieCatalogContext';


const emptyFormState = {
  title: '',
  genre: '',
  classification: 'PG-13',
  duration: '120',
  imageSrc: '',
  bannerSrc: '',
  description: '',
  actorsText: '',
  isVisible: true,
};

const resolveMediaUrl = (src = '') => {
  if (!src) {
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="18" fill="%23999"%3ESin imagen%3C/text%3E%3C/svg%3E';
  }
  
  // Si es una URL externa (comienza con http/https), devolverla tal cual
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  
  // Si es una ruta local, prepend con la URL base del servidor
  const baseUrl = process.env.REACT_APP_BFF_URL || 'http://localhost:4000';
  return `${baseUrl}${src}`;
};


function AdminMovies() {
  const { movies, addMovie, createFunction, updateMovie, removeMovie, toggleMovieVisibility, resetCatalog } = useMovieCatalog();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const [editingId, setEditingId] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const edit = params.get('edit');
      return edit ? Number(edit) : null;
    } catch {
      return null;
    }
  });
  const [formState, setFormState] = useState(emptyFormState);
  
  const [functionFormState, setFunctionFormState] = useState({
    movieId: '',
    roomId: '1',
    format: 'TWO_D',
    fecha: '',
    hora: ''
    
  });
  const [message, setMessage] = useState(null);

  const showMessage = (text) => {
    setMessage(text);
    window.setTimeout(() => setMessage(null), 2500);
  };

  const handleImageUpload = async (event, imageType) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar que sea imagen
    if (!file.type.startsWith('image/')) {
      showMessage('Solo se permiten archivos de imagen');
      return;
    }

    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showMessage('La imagen no debe superar 5MB');
      return;
    }

    try {
      // Crear FormData para enviar el archivo
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', imageType === 'banner' ? 'banner' : 'assets');

      // Enviar a la API
      const bffUrl = process.env.REACT_APP_BFF_URL || 'http://localhost:4000';
      const response = await fetch(`${bffUrl}/cartelera/media`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success && result.url) {
        // Guardar la URL en el estado del formulario
        if (imageType === 'banner') {
          setFormState((current) => ({ ...current, bannerSrc: result.url }));
          showMessage('Banner cargado correctamente');
        } else {
          setFormState((current) => ({ ...current, imageSrc: result.url }));
          showMessage('Imagen cargada correctamente');
        }
      } else {
        showMessage('Error al procesar la respuesta del servidor');
      }
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      showMessage('Error al subir la imagen: ' + error.message);
    }
  };

  const catalogStats = useMemo(() => ({
    total: movies.length,
    visibles: movies.filter((movie) => movie.isVisible !== false).length,
    ocultas: movies.filter((movie) => movie.isVisible === false).length,
  }), [movies]);

  const filteredMovies = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return movies;
    }

    return movies.filter((movie) => {
      return [movie.title, movie.genre, movie.description]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [movies, query]);
  const resetForm = () => {
    setEditingId(null);
    setFormState(emptyFormState);
    try {
      const params = new URLSearchParams(location.search);
      if (params.has('edit')) {
        params.delete('edit');
        navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
      }
    } catch (e) {
      // noop
    }
  };

  const resetFunctionForm = () => {
    setFunctionFormState((current) => ({
      ...current,
      movieId: movies[0]?.id ? String(movies[0].id) : '',
      roomId: '1',
      format: 'TWO_D',
      fecha: '', // <--- Limpiar
    hora:''
    }));
  };

  useEffect(() => {
    if (!functionFormState.movieId && movies[0]?.id) {
      setFunctionFormState((current) => ({
        ...current,
        movieId: String(movies[0].id),
      }));
    }
  }, [functionFormState.movieId, movies]);

  // Si editingId viene en la URL (o cambia), restaurar el formulario con los datos de la película
  useEffect(() => {
    if (!editingId) return;
    const movie = movies.find((m) => Number(m.id) === Number(editingId));
    if (!movie) return;
    setFormState({
      title: movie.title,
      genre: movie.genre,
      classification: movie.classification || 'PG-13',
      duration: String(movie.duration || 120),
      imageSrc: movie.imageSrc || '',
      bannerSrc: movie.bannerSrc || '',
      description: movie.description,
      actorsText: movie.actors?.join(', ') || '',
      isVisible: movie.isVisible !== false,
    });
  }, [editingId, movies]);

  const handleEdit = (movie) => {
    setEditingId(movie.id);
    setFormState({
      title: movie.title,
      genre: movie.genre,
      classification: movie.classification || 'PG-13',
      duration: String(movie.duration || 120),
      imageSrc: movie.imageSrc || '',
      bannerSrc: movie.bannerSrc || '',
      description: movie.description,
      actorsText: movie.actors?.join(', ') || '',
      isVisible: movie.isVisible !== false,
    });
    try {
      const params = new URLSearchParams(location.search);
      params.set('edit', String(movie.id));
      navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
    } catch (e) {
      // noop
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const title = formState.title.trim();
    const genre = formState.genre.trim();
    const classification = formState.classification.trim();
    const duration = Math.round(Number(formState.duration));

    if (!title || !genre || !classification || !Number.isFinite(duration)) {
      showMessage('Completa el título, género, clasificación y duración antes de guardar.');
      return;
    }

    // Este objeto ahora coincide exactamente con lo que el MoviesService espera
    const payload = {
      title: title,
      genre: genre,
      classification: classification,
      duration: duration,
      imageSrc: formState.imageSrc.trim(),
      bannerSrc: formState.bannerSrc.trim(),
      description: formState.description.trim(),
      actors: formState.actorsText.split(',').map(a => a.trim()).filter(Boolean),
      isVisible: formState.isVisible,
    };

    try {
      if (editingId) {
        // Incluir el id en el payload para asegurar que el backend actualice el registro correcto
        const updatePayload = { ...payload, id: editingId };
        await updateMovie(editingId, updatePayload);
        showMessage(`Película actualizada: ${title}`);
      } else {
        const nuevaPelicula = await addMovie(payload);
        const nuevoId = nuevaPelicula?.id || nuevaPelicula?.idPelicula;

        if (formState.isVisible && nuevoId) {
          const funcionesBase = [
            { diasOffset: 1, hora: 15, minuto: 0, roomId: 1, format: '2D', },
            { diasOffset: 2, hora: 19, minuto: 30, roomId: 2, format: 'IMAX' }
          ];

          for (const func of funcionesBase) {
            const fecha = new Date();
            fecha.setDate(fecha.getDate() + func.diasOffset);
            
            // Extraer AÑO, MES y DÍA limpios para la fecha
            const year = fecha.getFullYear();
            const month = String(fecha.getMonth() + 1).padStart(2, '0');
            const day = String(fecha.getDate()).padStart(2, '0');
            const fechaStr = `${year}-${month}-${day}`;

            // Extraer HORA y MINUTO limpios
            const horaStr = `${String(func.hora).padStart(2, '0')}:${String(func.minuto).padStart(2, '0')}`;

            // Enviar exactamente lo que pide el BFF y Java
            await createFunction({
              peliculaId: nuevoId,
              salaId: func.roomId,
              formato: func.format,
              fecha: fechaStr,
              hora: horaStr
            });
          }
          showMessage(`¡Éxito! Película guardada y funciones programadas.`);
        } else {
          showMessage(`Película guardada.`);
        }
      }
      resetForm();
    } catch (error) {
      console.error("Error en handleSubmit:", error);
      showMessage('Hubo un error al guardar. Revisa la consola.');
    }
  };
const handleFunctionSubmit = async (event) => {
  event.preventDefault();

  // Validación actualizada
  if (!functionFormState.movieId || !functionFormState.roomId || !functionFormState.fecha || !functionFormState.hora) {
    showMessage('Completa todos los campos antes de guardar.');
    return;
  }

  const movie = movies.find((item) => Number(item.id) === Number(functionFormState.movieId));

  if (!movie) {
    showMessage('Selecciona una película válida.');
    return;
  }

  try {
    // Aquí preparamos el objeto para tu backend Java
    const payload = {
      peliculaId: Number(functionFormState.movieId),
      salaId: Number(functionFormState.roomId),
      fecha: functionFormState.fecha, // Se mapeará a LocalDate en Java
      hora: functionFormState.hora     // Se mapeará a LocalTime en Java
    };

    const createdFunction = await createFunction(payload);

    showMessage(`Función creada para ${movie.title}.`);
    resetFunctionForm();
  } catch (error) {
    console.error(error);
    showMessage('No se pudo crear la función. Revisa el backend.');
  }
};

  const handleDelete = (movie) => {
    const confirmDelete = window.confirm(`¿Eliminar ${movie.title} de la cartelera?`);
    if (!confirmDelete) return;

    removeMovie(movie.id);
    if (editingId === movie.id) resetForm();
    showMessage(`Película eliminada: ${movie.title}`);
  };

  const handleToggleVisibility = (movie) => {
    const nextMovie = toggleMovieVisibility(movie.id);
    showMessage(nextMovie?.isVisible ? `${movie.title} ya está visible en cartelera.` : `${movie.title} quedó oculta de cartelera.`);
  };

  const handleResetCatalog = () => {
    resetCatalog();
    resetForm();
  };

  return (
    <>
      <Navbar />
      {message ? <div className="notificacion">{message}</div> : null}
      <main className="admin-panel">
        <section className="admin-panel__hero">
          <div className="admin-panel__hero-copy">
            <span className="admin-panel__eyebrow">Modo admin</span>
            <h1>Gestiona la cartelera en un solo lugar</h1>
            <p>
              Agrega, actualiza, oculta o elimina películas sin tocar el flujo público.
              Luego programa funciones con días, horarios, salas y precios específicos.
            </p>
          </div>

          <div className="admin-panel__stats">
            <article className="admin-stat">
              <span>Total</span>
              <strong>{catalogStats.total}</strong>
            </article>
            <article className="admin-stat">
              <span>Visibles</span>
              <strong>{catalogStats.visibles}</strong>
            </article>
            <article className="admin-stat">
              <span>Ocultas</span>
              <strong>{catalogStats.ocultas}</strong>
            </article>
          </div>
        </section>

        <section className="admin-panel__toolbar">
          <label className="admin-search">
            <span>Buscar película</span>
            <input
              type="search"
              placeholder="Título, género o descripción"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>

          <button type="button" className="admin-button admin-button--ghost" onClick={handleResetCatalog}>
            Recargar de Base de Datos
          </button>
        </section>

        <section className="admin-panel__layout">
          {/* FORMULARIO DE PELÍCULA */}
          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="admin-form__header">
              <div>
                <span className="admin-form__eyebrow">{editingId ? 'Editar película' : 'Nueva película'}</span>
                <h2>{editingId ? 'Actualizar detalle de película' : 'Crear una película para la cartelera'}</h2>
              </div>
              {editingId ? (
                <button type="button" className="admin-button admin-button--ghost" onClick={resetForm}>
                  Cancelar edición
                </button>
              ) : null}
            </div>

            <div className="admin-form__grid">
              <label>
                <span>Título</span>
                <input
                  type="text"
                  value={formState.title}
                  onChange={(event) => setFormState((current) => ({ ...current, title: event.target.value }))}
                  placeholder="Nombre de la película"
                />
              </label>

              <label>
                <span>Género</span>
                <input
                  type="text"
                  value={formState.genre}
                  onChange={(event) => setFormState((current) => ({ ...current, genre: event.target.value }))}
                  placeholder="Acción, drama, ciencia ficción"
                />
              </label>

              <label>
                <span>Clasificación</span>
                <select
                  value={formState.classification}
                  onChange={(event) => setFormState((current) => ({ ...current, classification: event.target.value }))}
                >
                  <option value="G">G (Apta para todos)</option>
                  <option value="PG">PG (Parental Guidance)</option>
                  <option value="PG-13">PG-13</option>
                  <option value="R">R (Menores requieren acompañante)</option>
                  <option value="NC-17">NC-17 (Mayores de 18)</option>
                </select>
              </label>

              <label>
                <span>Duración (minutos)</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={formState.duration}
                  onChange={(event) => setFormState((current) => ({ ...current, duration: event.target.value }))}
                  placeholder="120"
                />
              </label>

              {/* INPUTS DE URLS DE IMÁGENES */}
              <label>
                <span>Imagen principal</span>
                <div className="admin-form__input-group">
                  <input 
                    type="text" 
                    value={formState.imageSrc}
                    placeholder="Ej: https://midominio.com/supergirl.jpg o sube un archivo" 
                    onChange={(event) => setFormState((current) => ({ ...current, imageSrc: event.target.value }))} 
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'image')}
                    style={{ display: 'none' }}
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="admin-button admin-button--ghost" style={{ cursor: 'pointer', marginTop: '8px', display: 'inline-block' }}>
                    📤 Subir imagen
                  </label>
                </div>
                <small className="admin-form__hint">Pega una URL directa O sube un archivo.</small>
                {formState.imageSrc ? (
                  <img className="admin-form__preview" src={resolveMediaUrl(formState.imageSrc)} alt="Vista previa" />
                ) : null}
              </label>

              <label>
                <span>Banner</span>
                <div className="admin-form__input-group">
                  <input 
                    type="text" 
                    value={formState.bannerSrc}
                    placeholder="Ej: https://midominio.com/banner.webp o sube un archivo" 
                    onChange={(event) => setFormState((current) => ({ ...current, bannerSrc: event.target.value }))} 
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'banner')}
                    style={{ display: 'none' }}
                    id="banner-upload"
                  />
                  <label htmlFor="banner-upload" className="admin-button admin-button--ghost" style={{ cursor: 'pointer', marginTop: '8px', display: 'inline-block' }}>
                    📤 Subir banner
                  </label>
                </div>
                <small className="admin-form__hint">Pega una URL directa O sube un archivo.</small>
                {formState.bannerSrc ? (
                  <img className="admin-form__preview" src={resolveMediaUrl(formState.bannerSrc)} alt="Vista previa banner" />
                ) : null}
              </label>

              <label className="admin-form__field--full">
                <span>Descripción / Sinopsis</span>
                <textarea
                  rows="4"
                  value={formState.description}
                  onChange={(event) => setFormState((current) => ({ ...current, description: event.target.value }))}
                  placeholder="Describe brevemente la película"
                />
              </label>

              <label className="admin-form__field--full">
                <span>Actores principales</span>
                <input
                  type="text"
                  value={formState.actorsText}
                  onChange={(event) => setFormState((current) => ({ ...current, actorsText: event.target.value }))}
                  placeholder="Actor 1, Actor 2, Actor 3"
                />
              </label>

              <label className="admin-toggle">
                <input
                  type="checkbox"
                  checked={formState.isVisible}
                  onChange={(event) => setFormState((current) => ({ ...current, isVisible: event.target.checked }))}
                />
                <span>Mostrar en cartelera (Creará funciones por defecto automáticamente)</span>
              </label>
            </div>

            <div className="admin-form__actions">
              <button type="submit" className="admin-button admin-button--primary">
                {editingId ? 'Guardar cambios' : 'Agregar película'}
              </button>
              <button type="button" className="admin-button admin-button--ghost" onClick={resetForm}>
                Limpiar formulario
              </button>
            </div>
          </form>

          {/* FORMULARIO DE FUNCIONES MANUALES */}
          <section className="admin-function-panel admin-list">
            <div className="admin-list__header">
              <div>
                <span className="admin-form__eyebrow">Nueva función</span>
                <h2>Programar una función manual en Cartelera</h2>
              </div>
              <p>Agrega más días, horarios o salas a tus películas existentes.</p>
            </div>

            <form className="admin-form__grid admin-function-panel__grid" onSubmit={handleFunctionSubmit}>
              <label>
                <span>Película</span>
                <select
                  value={functionFormState.movieId}
                  onChange={(event) => setFunctionFormState((current) => ({ ...current, movieId: event.target.value }))}
                >
                  <option value="">Selecciona una película</option>
                  {movies.map((movie) => (
                    <option key={movie.id} value={movie.id}>
                      {movie.title} ({movie.classification})
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Sala</span>
                <select
                  value={functionFormState.roomId}
                  onChange={(event) => setFunctionFormState((current) => ({ ...current, roomId: event.target.value }))}
                >
                  <option value="">Selecciona una sala</option>
                  <option value="1">Sala 1 (2D)</option>
                  <option value="2">Sala 2 (IMAX)</option>
                  <option value="3">Sala 3 (3D)</option>
                </select>
              </label>

              <label>
                <span>Formato / Tipo</span>
                <select
                  value={functionFormState.format}
                  onChange={(event) => setFunctionFormState((current) => ({ ...current, format: event.target.value }))}
                >
                  <option value="TWO_D">2D</option>
                  <option value="THREE_D">3D</option>
                  <option value="IMAX">IMAX</option>
                </select>
              </label>

              <label>
              <span>Fecha</span>
              <input
                type="date"
                required
                value={functionFormState.fecha}
                onChange={(event) => setFunctionFormState((current) => ({ ...current, fecha: event.target.value }))}
              />
            </label>

            <label>
              <span>Hora</span>
              <input
                type="time"
                required
                value={functionFormState.hora}
                onChange={(event) => setFunctionFormState((current) => ({ ...current, hora: event.target.value }))}
              />
            </label>

              <div className="admin-form__actions admin-form__actions--compact">
                <button type="submit" className="admin-button admin-button--primary">
                  Crear función extra
                </button>
                <button type="button" className="admin-button admin-button--ghost" onClick={resetFunctionForm}>
                  Limpiar
                </button>
              </div>
            </form>
          </section>

          {/* CATÁLOGO DE PELÍCULAS */}
          <section className="admin-list">
            <div className="admin-list__header">
              <div>
                <span className="admin-form__eyebrow">Catálogo</span>
                <h2>Películas registradas</h2>
              </div>
              <p>{filteredMovies.length} resultados</p>
            </div>

            <div className="admin-list__grid">
              {filteredMovies.map((movie) => (
                <article key={movie.id} className={`admin-movie-card ${movie.isVisible === false ? 'admin-movie-card--hidden' : ''}`}>
                  <div className="admin-movie-card__poster">
                    {movie.imageSrc ? <img src={resolveMediaUrl(movie.imageSrc)} alt={movie.title} /> : <span>Sin imagen</span>}
                    <span className={`admin-movie-card__badge ${movie.isVisible === false ? 'admin-movie-card__badge--hidden' : ''}`}>
                      {movie.isVisible === false ? 'Oculta' : 'Visible'}
                    </span>
                  </div>

                  <div className="admin-movie-card__copy">
                    <h3>{movie.title}</h3>
                    <p className="admin-movie-card__genre">{movie.genre}</p>
                    <p className="admin-movie-card__classification">{movie.classification}</p>
                    <p className="admin-movie-card__description">{movie.description}</p>
                    <div className="admin-movie-card__meta">
                      <span>{movie.duration} min</span>
                      <span>{movie.actors?.length || 0} actores</span>
                      {Number.isFinite(Number(movie.totalButacas)) && <span>{movie.totalButacas} asientos por función</span>}
                    </div>
                  </div>

                  <div className="admin-movie-card__actions">
                    <button type="button" className="admin-button admin-button--ghost" onClick={() => handleEdit(movie)}>
                      Editar
                    </button>
                    <button type="button" className="admin-button admin-button--ghost" onClick={() => handleToggleVisibility(movie)}>
                      {movie.isVisible === false ? 'Mostrar' : 'Ocultar'}
                    </button>
                    <button type="button" className="admin-button admin-button--danger" onClick={() => handleDelete(movie)}>
                      Eliminar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default AdminMovies;