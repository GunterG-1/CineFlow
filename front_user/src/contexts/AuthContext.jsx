import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api';

const AUTH_STORAGE_KEY = 'cine-flow-auth-state';
const PROFILE_STORAGE_KEY = 'cine-flow-user-profile';

const AuthContext = createContext(null);

const normalizeProfile = (profile = {}) => ({
  idUsuario: profile.idUsuario ?? profile.id ?? null,
  nombreUsuario: profile.nombreUsuario ?? profile.name ?? '',
  apellidoUsuario: profile.apellidoUsuario ?? profile.lastName ?? '',
  correo: profile.correo ?? profile.email ?? '',
  fechaNacimiento: profile.fechaNacimiento ?? profile.birthDate ?? '',
  metodoPago: profile.metodoPago ?? profile.paymentMethod ?? '',
});

const getErrorMessage = (error, fallback = 'Ocurrio un error inesperado') => {
  if (!error?.message) {
    return fallback;
  }

  return error.message;
};

export const AuthProvider = ({ children }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(AUTH_STORAGE_KEY);
    const storedProfile = window.localStorage.getItem(PROFILE_STORAGE_KEY);

    if (storedValue === 'true') {
      setIsRegistered(true);
    }

    if (storedProfile) {
      try {
        setUserProfile(normalizeProfile(JSON.parse(storedProfile)));
      } catch {
        window.localStorage.removeItem(PROFILE_STORAGE_KEY);
      }
    }
  }, []);

  const persistSession = useCallback((profile = {}) => {
    const normalizedProfile = normalizeProfile(profile);
    window.localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(normalizedProfile));
    setIsRegistered(true);
    setUserProfile(normalizedProfile);
  }, []);

  const isRegisteredUser = useCallback(async (email) => {
    if (!email?.trim()) {
      return false;
    }

    try {
      const encodedEmail = encodeURIComponent(email.trim());
      const exists = await api.get(`/usuarios/existe-correo/${encodedEmail}`);
      return Boolean(exists);
    } catch {
      return false;
    }
  }, []);

  const markAsRegistered = useCallback(async (profile = {}) => {
    setIsLoadingAuth(true);

    try {
      const createdProfile = await api.post('/usuarios/registrar', {
        nombre: profile.nombre,
        apellido: profile.apellido,
        correo: profile.correo,
        contrasena: profile.contrasena,
        confirmarContrasena: profile.confirmarContrasena,
        fechaNacimiento: profile.fechaNacimiento,
      });

      return { ok: true, profile: createdProfile };
    } catch (error) {
      return { ok: false, message: getErrorMessage(error, 'No se pudo completar el registro') };
    } finally {
      setIsLoadingAuth(false);
    }
  }, []);

  const loginUser = useCallback(async (email, password) => {
    setIsLoadingAuth(true);

    try {
      const response = await api.post('/usuarios/login', {
        correo: email.trim(),
        contrasena: password,
      });

      if (!response?.iniciadoSesion || !response?.usuario) {
        return { ok: false, message: response?.mensaje || 'Credenciales invalidas' };
      }

      persistSession(response.usuario);
      return { ok: true };
    } catch (error) {
      return { ok: false, message: getErrorMessage(error, 'No se pudo iniciar sesion') };
    } finally {
      setIsLoadingAuth(false);
    }
  }, [persistSession]);

  const updateProfile = useCallback(async (nextProfile = {}) => {
    if (!userProfile?.idUsuario) {
      return { ok: false, message: 'No se encontro el usuario autenticado' };
    }

    if (!nextProfile?.metodoPago?.trim()) {
      return { ok: false, message: 'El metodo de pago es obligatorio' };
    }

    setIsLoadingAuth(true);

    try {
      // Intentamos actualizar y luego recuperamos el perfil actualizado del backend
      const putResult = await api.put(`/usuarios/${userProfile.idUsuario}/actualizar`, {
        nombre: nextProfile.nombre,
        apellido: nextProfile.apellido,
        metodoPago: nextProfile.metodoPago,
        contrasena: nextProfile.contrasena,
      });

      // Obtener el usuario refrescado para confirmar persistencia
      try {
        const refreshed = await api.get(`/usuarios/${userProfile.idUsuario}`);
        persistSession(refreshed);
        return { ok: true, profile: refreshed };
      } catch (refreshErr) {
        // Si no podemos refrescar, igualmente persistimos la respuesta del PUT si existe
        if (putResult) {
          persistSession(putResult);
          return { ok: true, profile: putResult };
        }
        return { ok: false, message: 'Actualización realizada pero no se pudo recuperar el perfil actualizado' };
      }
    } catch (error) {
      const message = getErrorMessage(error, 'No se pudo actualizar el perfil');
      return { ok: false, message };
    } finally {
      setIsLoadingAuth(false);
    }
  }, [persistSession, userProfile]);

  const logout = useCallback(() => {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    window.localStorage.removeItem(PROFILE_STORAGE_KEY);
    setIsRegistered(false);
    setUserProfile(null);
  }, []);

  const getDisplayName = useCallback(() => {
    if (userProfile?.nombreUsuario?.trim()) {
      return userProfile.nombreUsuario.trim();
    }

    if (userProfile?.correo?.trim()) {
      return userProfile.correo.split('@')[0];
    }

    return 'Usuario';
  }, [userProfile]);

  const value = useMemo(() => ({
    isRegistered,
    isLoadingAuth,
    userProfile,
    getDisplayName,
    markAsRegistered,
    isRegisteredUser,
    loginUser,
    updateProfile,
    logout,
  }), [getDisplayName, isLoadingAuth, isRegistered, isRegisteredUser, loginUser, logout, markAsRegistered, updateProfile, userProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};