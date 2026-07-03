import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './pages.css';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
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
              }}
            />
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