import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomeUser from './pages/homeUser';
import AdminMovies from './pages/adminMovies';
import AdminUsers from './pages/adminUser';
import AdminGuard from './components/AdminGuard';
import Confiteria from './pages/confiteria';
import Promociones from './pages/promociones';
import CineFlow from './pages/cineFlow';
import Login from './pages/login';
import Register from './pages/register';
import Profile from './pages/profile';
import Carrito from './pages/carrito';
import ResumenPedido from './pages/resumenPedido';
import PedidoConfirmado from './pages/pedidoConfirmado';
import { AuthProvider } from './contexts/AuthContext';
import { CarritoProvider } from './contexts/carritoContext';
import { FavoritosProvider } from './contexts/favoritosContext';
import { MovieCatalogProvider } from './contexts/movieCatalogContext';

function App() {
  return (
    <Router>
      <MovieCatalogProvider>
        <AuthProvider>
          <FavoritosProvider>
            <CarritoProvider>
              <div className="app-shell">
                <Routes>
                  <Route path="/" element={<HomeUser />} />
                  <Route
                    path="/admin"
                    element={
                      <AdminGuard>
                        <AdminMovies />
                      </AdminGuard>
                    }
                  />
                  <Route
                    path="/admin/usuarios"
                    element={
                      <AdminGuard>
                        <AdminUsers />
                      </AdminGuard>
                    }
                  />
                  <Route path="/cartelera" element={<HomeUser />} />
                  <Route path="/confiteria" element={<Confiteria />} />
                  <Route path="/promociones" element={<Promociones />} />
                  <Route path="/cine-flow" element={<CineFlow />} />
                  <Route path="/iniciar-sesion" element={<Login />} />
                  <Route path="/registrarse" element={<Register />} />
                  <Route path="/perfil" element={<Profile />} />
                  <Route path="/carrito" element={<Carrito />} />
                  <Route path="/resumen-pedido" element={<ResumenPedido />} />
                  <Route path="/pedido-confirmado" element={<PedidoConfirmado />} />
                </Routes>
              </div>
            </CarritoProvider>
          </FavoritosProvider>
        </AuthProvider>
      </MovieCatalogProvider>
    </Router>
  );
}

export default App;
