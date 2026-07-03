import { useEffect, useState } from 'react';
import { api } from '../api';

/**
 * Hook para obtener películas y salas desde el API
 * Combina datos de películas con información de precios de salas
 */
export const usePeliculasYSalas = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setLoading(true);
        
        // Obtener películas
        const respPeliculas = await api.get('/cartelera/peliculas');
    
        // Escuchar eventos de storage para recargar cuando el admin haga cambios
        const onStorage = (e) => {
          if (!e) return;
          if (e.key === 'cine-flow-reload') {
            obtenerDatos();
          }
        };
        window.addEventListener('storage', onStorage);
        const peliculasData = respPeliculas.data?.data || respPeliculas.data || [];

        // Obtener salas
          window.removeEventListener('storage', onStorage);
        };
        const salasData = respSalas.data?.data || respSalas.data || [];

        // Mapear películas a formato esperado por el frontend
        const peliculasConAgenda = peliculasData.map((pelicula) => ({
          id: pelicula.id || pelicula.idPelicula,
          title: pelicula.title || pelicula.titulo,
          genre: pelicula.genre || pelicula.genero,
          price: parseFloat(pelicula.price) || 5990,
          imageSrc: pelicula.imageSrc || pelicula.imagenUrl || '/placeholder.jpg',
          bannerSrc: pelicula.bannerSrc || pelicula.bannerUrl || '/placeholder.jpg',
          description: pelicula.description || pelicula.sinopsis || 'Sin descripción',
          actors: pelicula.actors || pelicula.actores || [],
          funciones: pelicula.funciones || [],
          // Para compatibilidad con el código existente
          agenda: [],
          horarios: [],
        }));

        // Procesar salas
        const salasConPrecio = salasData.map((sala) => ({
          id: sala.id,
          nombre: sala.nombre,
          tipo: sala.tipo,
          precioBase: parseFloat(sala.precioBase),
        }));

        setPeliculas(peliculasConAgenda);
        setSalas(salasConPrecio);
        setError(null);
      } catch (err) {
        console.error('Error obteniendo películas y salas:', err);
        setError(err.message || 'Error al cargar los datos');
        // Fallback a datos locales si falla la API
        setPeliculas([]);
        setSalas([]);
      } finally {
        setLoading(false);
      }
    };

    obtenerDatos();
  }, []);

  /**
   * Obtener funciones para una película específica
   * @param {number} peliculaId - ID de la película
   * @returns {Promise<Array>} Array de funciones con información de sala
   */
  const obtenerFuncionesPorPelicula = async (peliculaId) => {
    try {
      const response = await api.get(`/cartelera/peliculas/${peliculaId}/funciones`);
      return response.data?.data || response.data || [];
    } catch (err) {
      console.error(`Error obteniendo funciones para película ${peliculaId}:`, err);
      return [];
    }
  };

  /**
   * Obtener precio de una sala
   * @param {number} salaId - ID de la sala
   * @returns {number} Precio base de la sala
   */
  const obtenerPrecioSala = (salaId) => {
    const sala = salas.find((s) => s.id === salaId);
    return sala?.precioBase || 5990;
  };

  return {
    peliculas,
    salas,
    loading,
    error,
    obtenerFuncionesPorPelicula,
    obtenerPrecioSala,
  };
};
