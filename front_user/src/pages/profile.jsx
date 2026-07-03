import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import './pages.css';
import { useAuth } from '../contexts/AuthContext';

const PAYMENT_METHOD_OPTIONS = [
  'Efectivo',
  'Tarjeta de débito',
  'Tarjeta de crédito',
  'Transferencia bancaria',
  'Mercado Pago',
  'PayPal',
];

const getBirthdayInfo = (fechaNacimiento) => {
  if (!fechaNacimiento) {
    return null;
  }

  const birthDate = new Date(`${fechaNacimiento}T00:00:00`);

  if (Number.isNaN(birthDate.getTime())) {
    return null;
  }

  const today = new Date();
  const currentYear = today.getFullYear();
  const month = birthDate.getMonth();
  const day = birthDate.getDate();

  let nextBirthday = new Date(currentYear, month, day);

  if (nextBirthday < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
    nextBirthday = new Date(currentYear + 1, month, day);
  }

  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diffDays = Math.ceil((nextBirthday - startOfToday) / (1000 * 60 * 60 * 24));
  const isToday = diffDays === 0;

  return {
    isToday,
    diffDays,
    nextBirthdayLabel: nextBirthday.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
  };
};

function Profile() {
  const navigate = useNavigate();
  const { isRegistered, userProfile, updateProfile, logout, getDisplayName } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    metodoPago: '',
    contrasena: '',
    confirmarContrasena: '',
  });
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const birthdayInfo = getBirthdayInfo(userProfile?.fechaNacimiento);

  useEffect(() => {
    setFormData({
      nombre: userProfile?.nombreUsuario || '',
      apellido: userProfile?.apellidoUsuario || '',
      metodoPago: userProfile?.metodoPago || '',
      contrasena: '',
    });
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
    if (formData.contrasena && formData.contrasena !== formData.confirmarContrasena) {
      setError('Las contraseñas no coinciden.');
      setFeedback('');
      return;
    }

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
      confirmarContrasena: '',
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
            <p>{userProfile?.fechaNacimiento ? `Cumpleaños: ${userProfile.fechaNacimiento}` : 'Fecha de nacimiento no disponible'}</p>
            <button type="button" className="profile-logout" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </aside>

          <div className="profile-content">
            <section className="profile-card profile-birthday-card">
              <h2>Beneficio de cumpleaños</h2>
              <p>
                Tu beneficio se calcula a partir de la fecha de nacimiento registrada en tu cuenta.
              </p>

              {birthdayInfo ? (
                <div className="birthday-benefit">
                  <div className="birthday-benefit__badge">
                    {birthdayInfo.isToday ? 'Activo hoy' : `Faltan ${birthdayInfo.diffDays} días`}
                  </div>
                  <div className="birthday-benefit__content">
                    <strong>
                      {birthdayInfo.isToday
                        ? 'Hoy puedes activar tu beneficio de cumpleaños.'
                        : `Tu próximo cumpleaños es el ${birthdayInfo.nextBirthdayLabel}.`}
                    </strong>
                    <span>
                      {birthdayInfo.isToday
                        ? 'Puedes aprovechar tu beneficio especial durante el día de hoy.'
                        : 'Vuelve en esa fecha para canjear tu beneficio especial.'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="birthday-benefit birthday-benefit--empty">
                  <strong>No tenemos tu fecha de nacimiento cargada.</strong>
                  <span>Guárdala en tu cuenta para habilitar el beneficio de cumpleaños.</span>
                </div>
              )}
            </section>

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
                    <option value="">Selecciona un metodo de pago</option>
                    {PAYMENT_METHOD_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Nueva contraseña (opcional)
                  <input name="contrasena" type="password" value={formData.contrasena} onChange={handleChange} />
                </label>
                <label>
                    Confirmar nueva contraseña
                  <input 
                    name="confirmarContrasena" 
                    type="password" 
                    value={formData.confirmarContrasena || ''} 
                    onChange={handleChange} 
                  />
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
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Profile;