import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import './pages.css';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api';

function Profile() {
  const navigate = useNavigate();
  const { isRegistered, userProfile, updateProfile, logout, getDisplayName } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    metodoPago: '',
    contrasena: '',
  });
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [daysToBirthday, setDaysToBirthday] = useState(null);
  const [canClaimBirthday, setCanClaimBirthday] = useState(false);

  useEffect(() => {
    setFormData({
      nombre: userProfile?.nombreUsuario || '',
      apellido: userProfile?.apellidoUsuario || '',
      metodoPago: userProfile?.metodoPago || '',
      contrasena: '',
    });
  }, [userProfile]);

  useEffect(() => {
    if (!userProfile?.fechaNacimiento) {
      setDaysToBirthday(null);
      setCanClaimBirthday(false);
      return;
    }

    const hoy = new Date();
    const parts = userProfile.fechaNacimiento.split('-');
    if (parts.length !== 3) return;
    const year = Number(parts[0]);
    const month = Number(parts[1]) - 1;
    const day = Number(parts[2]);

    const nextBirthday = new Date(hoy.getFullYear(), month, day);
    if (nextBirthday < hoy) nextBirthday.setFullYear(hoy.getFullYear() + 1);

    const diff = Math.ceil((nextBirthday - new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())) / (1000 * 60 * 60 * 24));
    setDaysToBirthday(diff);
    setCanClaimBirthday(diff === 0);
  }, [userProfile]);

  if (!isRegistered) {
    return (
      <>
        <Navbar />
        <main className="profile-page">
          <section className="profile-card">
            <h1>Perfil no disponible</h1>
            <p>Debes iniciar sesión o registrarte para ver tu perfil.</p>
            <div className="profile-actions">
              <Link to="/iniciar-sesion" className="profile-link profile-link--primary">Iniciar sesión</Link>
              <Link to="/registrarse" className="profile-link">Registrarse</Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.metodoPago.trim()) {
      setError('Debes indicar un metodo de pago para guardar cambios.');
      setFeedback('');
      return;
    }

    setIsSaving(true);
    setError('');
    setFeedback('');

    const result = await updateProfile({
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim(),
      metodoPago: formData.metodoPago.trim(),
      contrasena: formData.contrasena.trim() || undefined,
    });

    setIsSaving(false);

    if (!result.ok) {
      setError(result.message || 'No se pudieron guardar los cambios.');
      return;
    }

    setFormData((current) => ({
      ...current,
      contrasena: '',
    }));
    setFeedback('Perfil actualizado correctamente.');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <Navbar />
      <main className="profile-page">
        <section className="profile-layout">
          <aside className="profile-side">
            <div className="profile-avatar">{getDisplayName().charAt(0).toUpperCase()}</div>
            <h1>{getDisplayName()}</h1>
            <p>{userProfile?.correo || 'Sin correo guardado'}</p>
            {daysToBirthday !== null ? (
              <p>
                {canClaimBirthday ? (
                  <strong>¡Feliz cumpleaños! Puedes reclamar 2 entradas gratis hoy.</strong>
                ) : (
                  <>Faltan <strong>{daysToBirthday}</strong> día(s) para tu cumpleaños</>
                )}
              </p>
            ) : null}
            <button type="button" className="profile-logout" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </aside>

          <section className="profile-card">
            <h2>Mis datos</h2>
            <p>Actualiza tus datos en el microservicio de usuarios.</p>

            <form className="profile-form" onSubmit={handleSubmit}>
              <label>
                Nombre
                <input name="nombre" type="text" value={formData.nombre} onChange={handleChange} />
              </label>

              <label>
                Apellido
                <input name="apellido" type="text" value={formData.apellido} onChange={handleChange} />
              </label>

              <label>
                Metodo de pago
                <select name="metodoPago" value={formData.metodoPago} onChange={handleChange}>
                  <option value="">Seleccionar método</option>
                  <option value="Tarjeta">Tarjeta Credito</option>
                  <option value="Tarjeta">Tarjeta Debito</option>
                  <option value="MercadoPago">MercadoPago</option>
                  <option value="Efectivo">Weypay</option>
                  <option value="ApplePay">Apple Pay</option>
                </select>
              </label>

              <label>
                Nueva contraseña (opcional)
                <input name="contrasena" type="password" value={formData.contrasena} onChange={handleChange} />
              </label>

              {error && <p className="auth-error">{error}</p>}
              {feedback && <p>{feedback}</p>}

              <div className="profile-actions">
                <button type="submit" className="profile-link profile-link--primary" disabled={isSaving}>
                  {isSaving ? 'Guardando...' : 'Guardar cambios'}
                </button>
                <Link to="/" className="profile-link">Volver al inicio</Link>
              </div>
            </form>
          </section>
          <section className="profile-card">
            <h2>Beneficio de cumpleaños</h2>
            <p>En tu cumpleaños puedes reclamar 2 entradas gratis.</p>
            <button
              type="button"
              className="profile-link profile-link--primary"
              disabled={!canClaimBirthday}
              onClick={async () => {
                if (!userProfile?.idUsuario) return;
                try {
                  const res = await api.post('/api/entradas/reclamar-cumpleanos', { idUsuario: userProfile.idUsuario });
                  alert('Reclamo realizado: se generaron ' + (res?.ticketIds?.length || 2) + ' tickets.');
                } catch (err) {
                  alert('No se pudo reclamar: ' + (err.message || 'error'));
                }
              }}
            >
              Reclamar 2 entradas gratis
            </button>
          </section>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Profile;