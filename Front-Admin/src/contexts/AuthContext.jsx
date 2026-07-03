import { createContext, useCallback, useContext, useMemo, useState } from 'react';
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

const getErrorMessage = (error, fallback = 'Ocurrió un error inesperado') => {
  return error?.response?.data?.mensaje || error?.response?.data?.message || error?.message || fallback;
};

export const AuthProvider = ({ children }) => {
  const [isRegistered, setIsRegistered] = useState(() => {
    try { return window.localStorage.getItem(AUTH_STORAGE_KEY) === 'true'; } catch { return false; }
  });

  const [userProfile, setUserProfile] = useState(() => {
    try {
      const storedProfile = window.localStorage.getItem(PROFILE_STORAGE_KEY);
      if (!storedProfile) return null;
      const parsed = JSON.parse(storedProfile);
      const normalized = normalizeProfile(parsed);
      const isAdmin = parsed?.isAdmin ?? (normalized.correo || '').toLowerCase().endsWith('@duocuc.cl');
      return { ...normalized, isAdmin };
    } catch {
      return null;
    }
  });

  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  const persistSession = useCallback((profile = {}) => {
    const normalizedProfile = normalizeProfile(profile);
    const isAdmin = (normalizedProfile.correo || '').toLowerCase().endsWith('@duocuc.cl');
    const profileWithAdmin = { ...normalizedProfile, isAdmin };
    window.localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileWithAdmin));
    setIsRegistered(true);
    setUserProfile(profileWithAdmin);
  }, []);

  // --- Funciones añadidas para arreglar tus errores ---

  const isRegisteredUser = useCallback(async (email) => {
    if (!email?.trim()) return false;
    try {
      const encodedEmail = encodeURIComponent(email.trim());
      const exists = await api.get(`/usuarios/existe-correo/${encodedEmail}`);
      return Boolean(exists);
    } catch { return false; }
  }, []);

  const markAsRegistered = useCallback(async (profile = {}) => {
    setIsLoadingAuth(true);
    try {
      const createdProfile = await api.post('/usuarios/registrar', {
        nombre: profile.nombre,
        apellido: profile.apellido,
        correo: profile.correo,
        contrasena: profile.contrasena,
        fechaNacimiento: profile.fechaNacimiento,
      });
      persistSession(createdProfile);
      return { ok: true, profile: createdProfile };
    } catch (error) {
      return { ok: false, message: getErrorMessage(error) };
    } finally {
      setIsLoadingAuth(false);
    }
  }, [persistSession]);

  const getDisplayName = useCallback(() => {
    if (userProfile?.nombreUsuario?.trim()) return userProfile.nombreUsuario.trim();
    if (userProfile?.correo?.trim()) return userProfile.correo.split('@')[0];
    return 'Usuario';
  }, [userProfile]);

  // --- Fin de funciones añadidas ---

  const loginUser = useCallback(async (email, password) => {
    setIsLoadingAuth(true);
    try {
      const response = await api.post('/usuarios/login', {
        correo: email.trim(),
        contrasena: password,
      });

      if (!response?.iniciadoSesion || !response?.usuario) {
        return { ok: false, message: response?.mensaje || 'Credenciales inválidas' };
      }

      persistSession(response.usuario);
      return { ok: true };
    } catch (error) {
      return { ok: false, message: getErrorMessage(error, 'No se pudo iniciar sesión') };
    } finally {
      setIsLoadingAuth(false);
    }
  }, [persistSession]);

  const updateProfile = useCallback(async (nextProfile = {}) => {
    if (!userProfile?.idUsuario) return { ok: false, message: 'No se encontró el usuario' };
    setIsLoadingAuth(true);
    try {
      const payload = {
        nombre: nextProfile.nombre,
        apellido: nextProfile.apellido,
        metodoPago: nextProfile.metodoPago || '',
        ...(nextProfile.contrasena && { contrasena: nextProfile.contrasena })
      };
      const updatedProfile = await api.put(`/usuarios/${userProfile.idUsuario}/actualizar`, payload);
      persistSession(updatedProfile);
      return { ok: true, profile: updatedProfile };
    } catch (error) {
      return { ok: false, message: getErrorMessage(error) };
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

  const value = useMemo(() => ({
    isRegistered,
    isLoadingAuth,
    userProfile,
    getDisplayName,      // Ahora existe
    markAsRegistered,    // Ahora existe
    isRegisteredUser,    // Ahora existe
    loginUser,
    updateProfile,
    logout,
  }), [getDisplayName, isLoadingAuth, isRegistered, isRegisteredUser, loginUser, logout, markAsRegistered, updateProfile, userProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};