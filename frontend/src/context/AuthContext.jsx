import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchMe, getToken, setToken, signInRequest, signUpRequest } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // On first load, check the saved login (if any) with the server.
  useEffect(() => {
    let alive = true;
    if (!getToken()) { setReady(true); return undefined; }
    fetchMe()
      .then((d) => { if (alive) setUser(d.user); })
      .catch((err) => { if (alive && err.status === 401) setToken(''); })
      .finally(() => { if (alive) setReady(true); });
    return () => { alive = false; };
  }, []);

  // Any API call that comes back "401" means the login expired.
  useEffect(() => {
    const onExpired = () => { setToken(''); setUser(null); };
    window.addEventListener('ac:unauthorized', onExpired);
    return () => window.removeEventListener('ac:unauthorized', onExpired);
  }, []);

  const finish = useCallback((data) => { setToken(data.token); setUser(data.user); return data.user; }, []);
  const signIn = useCallback(async (payload) => finish(await signInRequest(payload)), [finish]);
  const signUp = useCallback(async (payload) => finish(await signUpRequest(payload)), [finish]);
  const signOut = useCallback(() => {
    setToken('');
    setUser(null);
    try { sessionStorage.removeItem('lastBooking'); } catch { /* storage unavailable */ }
  }, []);

  const value = useMemo(() => ({ user, ready, signIn, signUp, signOut }), [user, ready, signIn, signUp, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
