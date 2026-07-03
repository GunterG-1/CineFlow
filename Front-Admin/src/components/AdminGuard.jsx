import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Simple guard: allows access only to authenticated users that are marked as admin.
// Admin detection order:
// 1. `userProfile.isAdmin === true` (if provided by backend)
// 2. localStorage key `cine-flow-is-admin` === 'true' (manual override)
// 3. fallback to deny access
export default function AdminGuard({ children }) {
  const { isRegistered, userProfile } = useAuth();

  const isAdminProfile = userProfile?.isAdmin === true;

  if (!isRegistered) {
    return <Navigate to="/iniciar-sesion" replace />;
  }

  if (!isAdminProfile) {
    return <Navigate to="/" replace />;
  }

  return children;
}
