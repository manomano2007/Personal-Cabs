import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

// Everything except /auth sits behind this: signed-out visitors are sent to Sign In / Sign Up first.
export default function RequireAuth() {
  const { user, ready } = useAuth();
  const location = useLocation();

  if (!ready) {
    return <div className="auth-loading" role="status" aria-label="Loading"><Loader2 size={28} className="spin" /></div>;
  }
  if (!user) {
    return <Navigate to="/auth" replace state={{ from: `${location.pathname}${location.search}` }} />;
  }
  return <Outlet />;
}
