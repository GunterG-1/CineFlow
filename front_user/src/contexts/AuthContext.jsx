import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api';

const AUTH_STORAGE_KEY = 'cine-flow-auth-state';
const PROFILE_STORAGE_KEY = 'cine-flow-user-profile';

const AuthContext = createContext(null);

const extractProfileData = (payload = {}) => payload?.data ?? payload?.user ?? payload?.usuario ?? payload?.profile ?? payload;

const looksLikeEmail = (value) => typeof value === 'string' && /@/.test(value);

const findEmailCandidate = (payload = {}) => {
  const values = [
    payload.correo,
    payload.email,
    payload.emailAddress,
    payload.apellidoUsuario,
    payload.apellido,
    payload.lastName,
    payload.surname,
    payload.nombreUsuario,
    payload.nombre,
    payload.name,
  ];

  return values.find(looksLikeEmail) || '';
};

const normalizeProfile = (profile = {}) => {
  const payload = extractProfileData(profile);
  const apellidoUsuario = payload.apellidoUsuario ?? payload.apellido ?? payload.lastName ?? payload.surname ?? '';
  const correo = payload.correo ?? payload.email ?? payload.emailAddress ?? (looksLikeEmail(apellidoUsuario) ? apellidoUsuario : findEmailCandidate(payload));

  return {
    idUsuario: payload.idUsuario ?? payload.id ?? null,
    nombreUsuario: payload.nombreUsuario ?? payload.nombre ?? payload.name ?? '',
    apellidoUsuario: looksLikeEmail(apellidoUsuario) && !correo ? '' : apellidoUsuario,
    correo,
    fechaNacimiento: profile.fechaNacimiento ?? profile.birthDate ?? profile.fecha_nacimiento ?? '',
    metodoPago: payload.metodoPago ?? payload.paymentMethod ?? '',
  };
};

const getErrorMessage = (error, fallback = 'Ocurrio un error inesperado') => {
  if (!error?.message) {
    return fallback;
  }

  return error.message;
};

export const AuthProvider = ({ children }) => {
  const [isRegistered, setIsRegistered] = useState(() => {
    try {
      return window.localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [userProfile, setUserProfile] = useState(() => {
    try {
      const storedProfile = window.localStorage.getItem(PROFILE_STORAGE_KEY);
      if (!storedProfile) return null;
      const parsed = JSON.parse(storedProfile);
      return normalizeProfile(parsed);
    } catch {
      try { window.localStorage.removeItem(PROFILE_STORAGE_KEY); } catch(e) {}
      return null;
    }
  });

  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

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
      const exists = await api.get(`/api/usuarios/existe-correo/${encodedEmail}`);
      return Boolean(exists?.exists ?? exists?.existe ?? exists?.data ?? exists);
    } catch {
      return false;
    }
  }, []);

  const markAsRegistered = useCallback(async (profile = {}) => {
    setIsLoadingAuth(true);

    try {
      const alreadyExists = await isRegisteredUser(profile.correo);

      if (alreadyExists) {
        return { ok: false, message: 'El correo ya está registrado' };
      }

      const createdProfile = await api.post('/api/auth/register', {
        nombre: profile.nombre,
        apellido: profile.apellido,
        email: profile.correo,
        password: profile.contrasena,
        fechaNacimiento: profile.fechaNacimiento,
      });

      const profilePayload = extractProfileData(createdProfile);
      return { ok: true, profile: normalizeProfile(profilePayload) };
    } catch (error) {
      return { ok: false, message: getErrorMessage(error, 'No se pudo completar el registro') };
    } finally {
      setIsLoadingAuth(false);
    }
  }, [isRegisteredUser]);

  const loginUser = useCallback(async (email, password) => {
    setIsLoadingAuth(true);

    try {
      const response = await api.post('/api/auth/login', {
        email: email.trim(),
        password,
      });

      const profilePayload = normalizeProfile(response?.user ?? response?.usuario ?? response?.data ?? response);

      if (!response?.success || !profilePayload?.correo) {
        return { ok: false, message: response?.message || response?.mensaje || 'Credenciales inválidas' };
      }

      persistSession(profilePayload);
      return { ok: true };
    } catch (error) {
      return { ok: false, message: getErrorMessage(error, 'No se pudo iniciar sesion') };
    } finally {
      setIsLoadingAuth(false);
    }
  }, [persistSession]);

  const updateProfile = useCallback(async (nextProfile = {}) => {
    if (!userProfile?.idUsuario) {
      return { ok: false, message: 'No se encontró el usuario autenticado' };
    }

    setIsLoadingAuth(true);
    let putResult = null;

    try {
      const payload = {
        nombre: nextProfile.nombre,
        apellido: nextProfile.apellido,
        metodoPago: nextProfile.metodoPago || '',
        ...(nextProfile.contrasena && { contrasena: nextProfile.contrasena })
      };

      putResult = await api.put('/profile', payload);

      // En lugar de definir una función aquí, llamamos a la lógica necesaria
      try {
        const refreshed = await api.get('/profile');
        const refreshedProfile = extractProfileData(refreshed);
        persistSession(refreshedProfile);
        return { ok: true, profile: refreshedProfile };
      } catch (refreshErr) {
        if (putResult) {
          const updatedProfile = extractProfileData(putResult);
          persistSession(updatedProfile);
          return { ok: true, profile: updatedProfile };
        }
        return { ok: false, message: 'Actualización realizada pero no se pudo recuperar el perfil' };
      }
    } catch (error) {
      const message = getErrorMessage(error, 'No se pudo actualizar el perfil');
      return { ok: false, message };
    } finally {
      setIsLoadingAuth(false);
    }
  }, [userProfile, persistSession]); // updateProfile cierra aquí

  // AHORA definimos refreshProfile correctamente en el nivel superior
  const refreshProfile = useCallback(async () => {
    try {
      const refreshed = await api.get('/profile');
      const refreshedProfile = extractProfileData(refreshed);
      persistSession(refreshedProfile);
      return { ok: true, profile: normalizeProfile(refreshedProfile) };
    } catch (error) {
      return { ok: false, message: getErrorMessage(error, 'No se pudo actualizar el perfil') };
    }
  }, [persistSession]);

  const logout = useCallback(() => {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    window.localStorage.removeItem(PROFILE_STORAGE_KEY);
    setIsRegistered(false);
    setUserProfile(null);
  }, []);

  const getDisplayName = useCallback(() => {
    const firstName = userProfile?.nombreUsuario?.trim();
    const lastName = userProfile?.apellidoUsuario?.trim();

    if (firstName && lastName) {
      return `${firstName} ${lastName}`.trim();
    }

    if (firstName) {
      return firstName;
    }

    if (lastName) {
      return lastName;
    }

    const email = userProfile?.correo?.trim();
    if (email) {
      return email.split('@')[0];
    }

    const emailFallback = findEmailCandidate(userProfile);
    if (emailFallback) {
      return emailFallback.split('@')[0];
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
    refreshProfile,
    logout,
  }), [getDisplayName, isLoadingAuth, isRegistered, isRegisteredUser, loginUser, logout, markAsRegistered, persistSession, refreshProfile, updateProfile, userProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};