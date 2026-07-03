import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import { crearAgendaSemanal, formatearDiaAgenda } from '../utils/horarios';

const CATALOG_STORAGE_KEY = 'cine-flow-catalog-admin';

const MovieCatalogContext = createContext(null);

const normalizeHorarios = (horarios = []) => {
  if (!Array.isArray(horarios)) {
    return [];
  }

  return horarios
    .map((horario) => {
      const hora = Number(horario?.hora);
      const minuto = Number(horario?.minuto);

      if (!Number.isFinite(hora) || !Number.isFinite(minuto)) {
        return null;
      }

      return { hora, minuto };
    })
    .filter(Boolean);
};

const extractHorariosFromAgenda = (agenda = []) => {
  if (!Array.isArray(agenda)) {
    return [];
  }

  const firstDayWithSchedules = agenda.find((day) => Array.isArray(day?.horarios) && day.horarios.length > 0);
  return normalizeHorarios(firstDayWithSchedules?.horarios || []);
};

const buildAgendaFromHorarios = (horarios = []) => {
  const normalizedHorarios = normalizeHorarios(horarios);
  const horarioBase = normalizedHorarios.length > 0 ? normalizedHorarios : [{ hora: 16, minuto: 0 }];

  return crearAgendaSemanal({
    1: horarioBase,
    2: horarioBase,
    3: horarioBase,
    4: horarioBase,
    5: horarioBase,
    6: horarioBase,
    7: horarioBase,
  });
};

const normalizeAgenda = (agenda = [], horarios = []) => {
  if (!Array.isArray(agenda) || agenda.length === 0) {
    return buildAgendaFromHorarios(horarios);
  }

  return agenda.map((day) => {
    const dia = Number(day?.dia) || 1;

    return {
      dia,
      nombre: day?.nombre || formatearDiaAgenda(dia),
      horarios: normalizeHorarios(day?.horarios?.length ? day.horarios : horarios),
    };
  });
};

const normalizeMovie = (movie = {}, fallbackId = Date.now()) => {
  const horarios = normalizeHorarios(movie.horarios?.length ? movie.horarios : extractHorariosFromAgenda(movie.agenda));

  // Soportar propiedades devueltas por Java (español) y el shape del frontend (inglés)
  const idVal = movie.id ?? movie.idPelicula ?? fallbackId;
  const titleVal = (movie.title || movie.titulo || '').toString().trim() || 'Sin titulo';
  const genreVal = (movie.genre || movie.genero || '').toString().trim() || 'Sin genero';
  const descriptionVal = (movie.description || movie.sinopsis || '').toString().trim() || '';
  const actorsVal = Array.isArray(movie.actors) ? movie.actors : (typeof movie.actores === 'string' ? movie.actores.split(',').map(s=>s.trim()).filter(Boolean) : movie.actores || []);
  const imageSrcVal = (movie.imageSrc || movie.imagenUrl || movie.imagen || movie.image || '').toString().trim();
  const bannerSrcVal = (movie.bannerSrc || movie.bannerUrl || movie.banner || imageSrcVal).toString().trim();
  const visibleVal = (movie.isVisible !== undefined) ? movie.isVisible : (movie.visible !== undefined ? movie.visible : (movie.enCartelera !== undefined ? movie.enCartelera : true));
  const priceVal = Number.isFinite(Number(movie.price ?? movie.precio)) ? Number(movie.price ?? movie.precio) : 0;

  return {
    id: idVal,
    title: titleVal,
    genre: genreVal,
    price: priceVal,
    imageSrc: imageSrcVal || '',
    bannerSrc: bannerSrcVal || imageSrcVal || '',
    description: descriptionVal,
    actors: Array.isArray(actorsVal) ? actorsVal.map(a => String(a).trim()).filter(Boolean) : [],
    horarios: horarios.length > 0 ? horarios : [{ hora: 16, minuto: 0 }],
    agenda: normalizeAgenda(movie.agenda, horarios),
    isVisible: visibleVal !== false,
  };
};

const normalizeCatalog = (catalog = []) => {
  if (!Array.isArray(catalog) || catalog.length === 0) {
    return [];
  }

  return catalog.map((movie) => normalizeMovie(movie, movie.id ?? movie.idPelicula ?? Date.now()));
};

const createNextId = (catalog) => {
  return catalog.reduce((maxId, movie) => {
    const currentId = Number(movie.id) || 0;
    return Math.max(maxId, currentId);
  }, 0) + 1;
};

export const MovieCatalogProvider = ({ children }) => {
  const [movies, setMovies] = useState(() => {
    if (typeof window === 'undefined') return [];
    const storedCatalog = window.localStorage.getItem(CATALOG_STORAGE_KEY);
    if (!storedCatalog) return [];
    try {
      return normalizeCatalog(JSON.parse(storedCatalog));
    } catch {
      window.localStorage.removeItem(CATALOG_STORAGE_KEY);
      return [];
    }
  });

  // Cargar películas desde BFF y sincronizar con localStorage
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const resp = await api.get('/cartelera/peliculas');
        const list = Array.isArray(resp) ? resp : resp?.data ?? [];
        if (!mounted) return;
        const normalized = normalizeCatalog(list);
        setMovies(normalized);
        try { window.localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(normalized)); } catch {}
      } catch (err) {
        console.error('No se pudieron cargar películas desde API, usando cache/local si existe', err);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    window.localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(movies));
  }, [movies]);

  const addMovie = useCallback((movieData = {}) => {
    return (async () => {
      try {
        const payload = {
          title: movieData.title,
          genre: movieData.genre,
          classification: movieData.classification,
          duration: Number(movieData.duration),
          imageSrc: movieData.imageSrc,
          bannerSrc: movieData.bannerSrc,
          description: movieData.description,
          actors: movieData.actors,
          isVisible: movieData.isVisible,
        };

        const resp = await api.post('/cartelera/peliculas', payload);
        const created = resp?.data ?? resp;
        const normalized = normalizeMovie(created, created?.id ?? created?.idPelicula ?? Date.now());
        setMovies((current) => {
          const next = [...current, normalized];
          try { window.localStorage.setItem('cine-flow-reload', String(Date.now())); } catch {}
          return next;
        });
        return normalized;
      } catch (err) {
        console.error('Error creando película en BFF, guardando localmente:', err);
        let nextMovie = null;
        setMovies((currentMovies) => {
          nextMovie = normalizeMovie(movieData, createNextId(currentMovies));
          return [...currentMovies, nextMovie];
        });
        return nextMovie;
      }
    })();
  }, []);

  const updateMovie = useCallback((movieId, movieData = {}) => {
    return (async () => {
      try {
        const payload = {
          title: movieData.title,
          genre: movieData.genre,
          classification: movieData.classification,
          duration: Number(movieData.duration),
          imageSrc: movieData.imageSrc,
          bannerSrc: movieData.bannerSrc,
          description: movieData.description,
          actors: movieData.actors,
          enCartelera: movieData.isVisible,
        };

        const resp = await api.put(`/cartelera/peliculas/${movieId}`, payload);
        const updated = resp?.data ?? resp;
        const normalized = normalizeMovie(updated, movieId);
        setMovies((current) => {
          const next = current.map((m) => (m.id === movieId ? normalized : m));
          try { window.localStorage.setItem('cine-flow-reload', String(Date.now())); } catch {}
          return next;
        });
        return normalized;
      } catch (err) {
        console.error('Error actualizando película en BFF, actualizando localmente:', err);
        let updatedMovie = null;
        setMovies((currentMovies) => currentMovies.map((movie) => {
          if (movie.id !== movieId) return movie;
          updatedMovie = normalizeMovie({ ...movie, ...movieData, id: movieId }, movieId);
          return updatedMovie;
        }));
        return updatedMovie;
      }
    })();
  }, []);

  const removeMovie = useCallback((movieId) => {
    (async () => {
      try {
        await api.delete(`/cartelera/peliculas/${movieId}`);
      } catch (err) {
        console.warn('Error eliminando en BFF, aplicando eliminación local:', err);
      }
      setMovies((currentMovies) => currentMovies.filter((movie) => movie.id !== movieId));
    })();
  }, []);

  const toggleMovieVisibility = useCallback((movieId) => {
    return (async () => {
      const movie = movies.find((m) => m.id === movieId);
      if (!movie) return null;
      const newVisibility = !movie.isVisible;
      try {
        await api.put(`/cartelera/peliculas/${movieId}`, { enCartelera: newVisibility });
      } catch (err) {
        console.warn('Error toggling visibility in BFF, updating local only:', err);
      }
      let toggledMovie = null;
      setMovies((currentMovies) => currentMovies.map((m) => {
        if (m.id !== movieId) return m;
        toggledMovie = { ...m, isVisible: newVisibility };
        return toggledMovie;
      }));
      return toggledMovie;
    })();
  }, [movies]);

  const resetCatalog = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(CATALOG_STORAGE_KEY);
    }

    setMovies([]);
  }, []);

  const visibleMovies = useMemo(() => movies.filter((movie) => movie.isVisible !== false), [movies]);
  const featuredSlides = useMemo(() => {
    // Generar slides simples a partir de las primeras películas visibles
    return visibleMovies.slice(0, 3).map((movie, idx) => ({ id: idx + 1, movieId: movie.id, imageSrc: movie.bannerSrc || movie.imageSrc, background: 'linear-gradient(115deg, #0f5bd7 0%, #38bdf8 20%)' }));
  }, [visibleMovies]);

  const value = useMemo(() => ({
    movies,
    visibleMovies,
    featuredSlides,
    addMovie,
    createFunction: async (functionData = {}) => {
      try {
        const payload = {
          movieId: Number(functionData.movieId ?? functionData.peliculaId),
          roomId: Number(functionData.roomId ?? functionData.salaId),
          format: functionData.format ?? functionData.formato ?? '2D',
          fecha: functionData.fecha,
          hora: functionData.hora,
          price: functionData.price ?? functionData.precio,
        };

        // Llamada al BFF (usa API_BASE_URL ya configurado)
        const resp = await api.post('/cartelera/funciones', payload);
        return resp;
      } catch (err) {
        console.error('Error creando función desde context:', err);
        throw err;
      }
    },
    updateMovie,
    removeMovie,
    toggleMovieVisibility,
    resetCatalog,
  }), [addMovie, featuredSlides, movies, removeMovie, resetCatalog, toggleMovieVisibility, updateMovie, visibleMovies]);

  return <MovieCatalogContext.Provider value={value}>{children}</MovieCatalogContext.Provider>;
};

export const useMovieCatalog = () => {
  const context = useContext(MovieCatalogContext);

  if (!context) {
    throw new Error('useMovieCatalog must be used within a MovieCatalogProvider');
  }

  return context;
};