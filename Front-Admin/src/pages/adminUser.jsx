import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { api } from '../api';
import './adminUsers.css';

const emptyUserForm = {
  nombreUsuario: '',
  apellidoUsuario: '',
  correo: '',
  contrasena: '',
  fechaNacimiento: '',
  metodoPago: '',
};

const normalizeUsers = (users = []) => {
  return Array.isArray(users) ? users : [];
};

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [summary, setSummary] = useState({ total: 0, admins: 0, conPago: 0 });
  const [query, setQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [formState, setFormState] = useState(emptyUserForm);
  const [message, setMessage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadUsers = async () => {
    setIsLoading(true);

    try {
      const response = await api.get('/usuarios');
      const normalizedUsers = normalizeUsers(response);

      setUsers(normalizedUsers);

      try {
        const stats = await api.get('/usuarios/estadisticas');
        setSummary({
          total: stats?.totalUsuarios ?? normalizedUsers.length,
          admins: stats?.usuariosAdmin ?? normalizedUsers.filter((user) => user.isAdmin).length,
          conPago:
            stats?.usuariosConMetodoPago ??
            normalizedUsers.filter((user) => user.metodoPago && user.metodoPago.trim()).length,
        });
      } catch (error) {
        console.warn('No se pudieron cargar las estadísticas de usuarios.', error);
        setSummary({
          total: normalizedUsers.length,
          admins: normalizedUsers.filter((user) => user.isAdmin).length,
          conPago: normalizedUsers.filter((user) => user.metodoPago && user.metodoPago.trim()).length,
        });
      }
    } catch (error) {
      console.error('No se pudieron cargar los usuarios.', error);
      setUsers([]);
      setSummary({ total: 0, admins: 0, conPago: 0 });
      setMessage('No se pudieron cargar los usuarios desde el microservicio.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return users;
    }

    return users.filter((user) => {
      const text = [
        user.nombreUsuario,
        user.apellidoUsuario,
        user.correo,
        user.metodoPago,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return text.includes(normalizedQuery);
    });
  }, [query, users]);

  const showMessage = (text) => {
    setMessage(text);
    window.setTimeout(() => setMessage(null), 2500);
  };

  const clearForm = () => {
    setSelectedUserId(null);
    setFormState(emptyUserForm);
  };

  const selectUser = (user) => {
    setSelectedUserId(user.idUsuario);
    setFormState({
      nombreUsuario: user.nombreUsuario || '',
      apellidoUsuario: user.apellidoUsuario || '',
      correo: user.correo || '',
      contrasena: '',
      fechaNacimiento: user.fechaNacimiento || '',
      metodoPago: user.metodoPago || '',
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      nombreUsuario: formState.nombreUsuario.trim(),
      apellidoUsuario: formState.apellidoUsuario.trim(),
      correo: formState.correo.trim(),
      contrasena: formState.contrasena.trim(),
      fechaNacimiento: formState.fechaNacimiento,
      metodoPago: formState.metodoPago.trim(),
    };

    if (!payload.nombreUsuario || !payload.apellidoUsuario || !payload.correo || (!selectedUserId && !payload.contrasena) || !payload.fechaNacimiento) {
      showMessage('Completa los datos obligatorios antes de guardar.');
      return;
    }

    setIsSaving(true);

    try {
      if (selectedUserId) {
        await api.put(`/usuarios/${selectedUserId}`, payload);
        showMessage('Usuario actualizado correctamente.');
      } else {
        await api.post('/usuarios/registrar-completo', {
          nombre: payload.nombreUsuario,
          apellido: payload.apellidoUsuario,
          email: payload.correo,
          password: payload.contrasena,
          fechaNacimiento: payload.fechaNacimiento,
          metodoPago: payload.metodoPago,
        });
        showMessage('Usuario creado correctamente.');
      }

      clearForm();
      await loadUsers();
    } catch (error) {
      showMessage(error?.message || 'No se pudo guardar el usuario.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (user) => {
    const confirmed = window.confirm(`Eliminar a ${user.nombreUsuario} ${user.apellidoUsuario}?`);

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/usuarios/${user.idUsuario}`);
      showMessage('Usuario eliminado.');
      if (selectedUserId === user.idUsuario) {
        clearForm();
      }
      await loadUsers();
    } catch (error) {
      showMessage(error?.message || 'No se pudo eliminar el usuario.');
    }
  };

  return (
    <>
      <Navbar />
      {message ? <div className="notificacion">{message}</div> : null}
      <main className="admin-users">
        <section className="admin-users__hero">
          <div className="admin-users__copy">
            <span className="admin-users__eyebrow">Usuarios</span>
            <h1>Administra cuentas reales desde el microservicio Usuario</h1>
            <p>
              Este panel ya no depende de datos locales: lee, crea, edita y elimina perfiles a través del gateway y el BFF.
            </p>
          </div>

          <div className="admin-users__stats">
            <article className="admin-users__stat">
              <span>Total</span>
              <strong>{summary.total}</strong>
            </article>
            <article className="admin-users__stat">
              <span>Admins</span>
              <strong>{summary.admins}</strong>
            </article>
            <article className="admin-users__stat">
              <span>Con pago</span>
              <strong>{summary.conPago}</strong>
            </article>
          </div>
        </section>

        <section className="admin-users__toolbar">
          <label className="admin-users__search">
            <span>Buscar usuario</span>
            <input
              type="search"
              placeholder="Nombre, correo o método de pago"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>

          <div className="admin-users__toolbar-actions">
            <button type="button" className="admin-users__button admin-users__button--ghost" onClick={loadUsers} disabled={isLoading}>
              {isLoading ? 'Cargando...' : 'Refrescar'}
            </button>
            <button type="button" className="admin-users__button admin-users__button--ghost" onClick={clearForm}>
              Nuevo usuario
            </button>
          </div>
        </section>

        <section className="admin-users__layout">
          <form className="admin-users__form" onSubmit={handleSubmit}>
            <div className="admin-users__form-header">
              <div>
                <span className="admin-users__eyebrow">{selectedUserId ? 'Editar usuario' : 'Crear usuario'}</span>
                <h2>{selectedUserId ? 'Actualizar perfil' : 'Registrar una cuenta nueva'}</h2>
              </div>
              {selectedUserId ? (
                <button type="button" className="admin-users__button admin-users__button--ghost" onClick={clearForm}>
                  Cancelar
                </button>
              ) : null}
            </div>

            <div className="admin-users__grid">
              <label>
                <span>Nombre</span>
                <input
                  type="text"
                  value={formState.nombreUsuario}
                  onChange={(event) => setFormState((current) => ({ ...current, nombreUsuario: event.target.value }))}
                />
              </label>

              <label>
                <span>Apellido</span>
                <input
                  type="text"
                  value={formState.apellidoUsuario}
                  onChange={(event) => setFormState((current) => ({ ...current, apellidoUsuario: event.target.value }))}
                />
              </label>

              <label className="admin-users__field--full">
                <span>Correo</span>
                <input
                  type="email"
                  value={formState.correo}
                  onChange={(event) => setFormState((current) => ({ ...current, correo: event.target.value }))}
                />
              </label>

              <label>
                <span>Contraseña {selectedUserId ? '(opcional)' : '(requerida)'}</span>
                <input
                  type="password"
                  value={formState.contrasena}
                  onChange={(event) => setFormState((current) => ({ ...current, contrasena: event.target.value }))}
                />
              </label>

              <label>
                <span>Fecha de nacimiento</span>
                <input
                  type="date"
                  value={formState.fechaNacimiento}
                  onChange={(event) => setFormState((current) => ({ ...current, fechaNacimiento: event.target.value }))}
                />
              </label>

              <label className="admin-users__field--full">
                <span>Método de pago</span>
                <input
                  type="text"
                  value={formState.metodoPago}
                  onChange={(event) => setFormState((current) => ({ ...current, metodoPago: event.target.value }))}
                  placeholder="Tarjeta, transferencia, etc."
                />
              </label>
            </div>

            <div className="admin-users__actions">
              <button type="submit" className="admin-users__button admin-users__button--primary" disabled={isSaving}>
                {isSaving ? 'Guardando...' : selectedUserId ? 'Actualizar usuario' : 'Crear usuario'}
              </button>
              <button type="button" className="admin-users__button admin-users__button--ghost" onClick={clearForm}>
                Limpiar
              </button>
            </div>
          </form>

          <section className="admin-users__list">
            <div className="admin-users__list-header">
              <div>
                <span className="admin-users__eyebrow">Listado</span>
                <h2>Usuarios registrados</h2>
              </div>
              <p>{filteredUsers.length} resultados</p>
            </div>

            <div className="admin-users__cards">
              {filteredUsers.map((user) => (
                <article
                  key={user.idUsuario}
                  className={`admin-users__card ${selectedUserId === user.idUsuario ? 'admin-users__card--active' : ''}`}
                  onClick={() => selectUser(user)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      selectUser(user);
                    }
                  }}
                >
                  <div className="admin-users__card-top">
                    <div>
                      <h3>{user.nombreUsuario} {user.apellidoUsuario}</h3>
                      <p>{user.correo}</p>
                    </div>
                    <span className={`admin-users__badge ${user.isAdmin ? 'admin-users__badge--admin' : ''}`}>
                      {user.isAdmin ? 'Admin' : 'Cliente'}
                    </span>
                  </div>

                  <div className="admin-users__meta">
                    <span>Nacimiento: {user.fechaNacimiento || 'Sin dato'}</span>
                    <span>Pago: {user.metodoPago || 'No registrado'}</span>
                  </div>

                  <div className="admin-users__card-actions" onClick={(event) => event.stopPropagation()}>
                    <button type="button" className="admin-users__button admin-users__button--ghost" onClick={() => selectUser(user)}>
                      Editar
                    </button>
                    <button type="button" className="admin-users__button admin-users__button--danger" onClick={() => handleDelete(user)}>
                      Eliminar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default AdminUsers;