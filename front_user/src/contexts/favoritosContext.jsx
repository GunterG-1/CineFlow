import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const FavoritosContext = createContext();

export function FavoritosProvider({ children }) {
  const [favoritos, setFavoritos] = useState(() => {
    try {
      const saved = localStorage.getItem('cine-flow-favoritos');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const guardarEnLocalStorage = useCallback((items) => {
    localStorage.setItem('cine-flow-favoritos', JSON.stringify(items));
  }, []);

  const agregarAFavoritos = useCallback((pelicula) => {
    setFavoritos((prev) => {
      if (prev.some((p) => p.id === pelicula.id)) {
        return prev;
      }
      const updated = [...prev, pelicula];
      guardarEnLocalStorage(updated);
      return updated;
    });
  }, [guardarEnLocalStorage]);

  const removerDeFavoritos = useCallback((peliculaId) => {
    setFavoritos((prev) => {
      const updated = prev.filter((p) => p.id !== peliculaId);
      guardarEnLocalStorage(updated);
      return updated;
    });
  }, [guardarEnLocalStorage]);

  const esFavorito = useCallback((peliculaId) => {
    return favoritos.some((p) => p.id === peliculaId);
  }, [favoritos]);

  const obtenerFavoritos = useCallback(() => {
    return favoritos;
  }, [favoritos]);

  const toggleFavorito = useCallback((pelicula) => {
    if (esFavorito(pelicula.id)) {
      removerDeFavoritos(pelicula.id);
    } else {
      agregarAFavoritos(pelicula);
    }
  }, [esFavorito, removerDeFavoritos, agregarAFavoritos]);

  const value = useMemo(
    () => ({
      favoritos,
      agregarAFavoritos,
      removerDeFavoritos,
      esFavorito,
      obtenerFavoritos,
      toggleFavorito,
    }),
    [favoritos, agregarAFavoritos, removerDeFavoritos, esFavorito, obtenerFavoritos, toggleFavorito]
  );

  return <FavoritosContext.Provider value={value}>{children}</FavoritosContext.Provider>;
}

export function useFavoritos() {
  const context = useContext(FavoritosContext);
  if (!context) {
    throw new Error('useFavoritos debe usarse dentro de FavoritosProvider');
  }
  return context;
}
