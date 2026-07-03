import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './pages.css';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (location.state?.registrationSuccess) {
      setSuccessMessage('Cuenta creada con exito. Inicia sesion para continuar.');
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    const result = await loginUser(email, password);
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.message || 'El correo o contraseña son incorrectos');
      return;
    }

    navigate('/');
  };

  return (
    <>
      <Navbar />
      <main className="auth-page">
        <section className="auth-card">
          <h1>Iniciar sesión</h1>
          <p>Ingresa para poder comprar entradas y acceder a todas las funciones.</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <input 
              name="email" 
              type="email" 
              placeholder="Correo electrónico" 
              aria-label="Correo electrónico" 
              required 
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
                setSuccessMessage('');
              }}
            />
            <input 
              name="password" 
              type="password" 
              placeholder="Contraseña" 
              aria-label="Contraseña" 
              required 
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
                setSuccessMessage('');
              }}
            />
            {successMessage && <p className="auth-success">{successMessage}</p>}
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" disabled={isSubmitting || !email || !password}>
              {isSubmitting ? 'Ingresando...' : 'Entrar'}
            </button>
          </form>
          <p className="auth-switch">
            ¿No tienes cuenta? <Link to="/registrarse">Registrarse</Link>
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Login;