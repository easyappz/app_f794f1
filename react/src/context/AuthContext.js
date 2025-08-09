import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authApi from '../api/auth';
import * as usersApi from '../api/users';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      const t = localStorage.getItem('token');
      return t || '';
    } catch (e) {
      return '';
    }
  });
  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isWorking, setIsWorking] = useState(false);

  const applyToken = useCallback((t) => {
    if (t) {
      localStorage.setItem('token', t);
      setToken(t);
    } else {
      localStorage.removeItem('token');
      setToken('');
    }
  }, []);

  const fetchMe = useCallback(async () => {
    try {
      const res = await usersApi.getMe();
      if (res && res.success && res.user) {
        setUser(res.user);
        return { ok: true, user: res.user };
      }
      return { ok: false, message: (res && res.message) ? res.message : 'Не удалось получить профиль' };
    } catch (e) {
      return { ok: false, message: 'Ошибка загрузки профиля' };
    }
  }, []);

  const logout = useCallback(() => {
    applyToken('');
    setUser(null);
  }, [applyToken]);

  const login = useCallback(async (email, password) => {
    setIsWorking(true);
    try {
      const res = await authApi.login({ email, password });
      if (res && res.token) {
        applyToken(res.token);
        const me = await fetchMe();
        if (!me.ok) {
          logout();
          return { ok: false, message: me.message };
        }
        return { ok: true };
      }
      return { ok: false, message: (res && res.message) ? res.message : 'Ошибка входа' };
    } catch (e) {
      return { ok: false, message: 'Ошибка сети' };
    } finally {
      setIsWorking(false);
    }
  }, [applyToken, fetchMe, logout]);

  const register = useCallback(async ({ email, password, displayName }) => {
    setIsWorking(true);
    try {
      const res = await authApi.register({ email, password, displayName });
      if (res && res.token) {
        applyToken(res.token);
        const me = await fetchMe();
        if (!me.ok) {
          logout();
          return { ok: false, message: me.message };
        }
        return { ok: true };
      }
      return { ok: false, message: (res && res.message) ? res.message : 'Ошибка регистрации' };
    } catch (e) {
      return { ok: false, message: 'Ошибка сети' };
    } finally {
      setIsWorking(false);
    }
  }, [applyToken, fetchMe, logout]);

  useEffect(() => {
    let isMounted = true;
    async function bootstrap() {
      try {
        if (token) {
          const me = await fetchMe();
          if (!me.ok && isMounted) {
            logout();
          }
        }
      } finally {
        if (isMounted) setIsBootstrapping(false);
      }
    }
    bootstrap();
    return () => {
      isMounted = false;
    };
  }, [token, fetchMe, logout]);

  const value = useMemo(() => ({
    token,
    user,
    isAuth: Boolean(token && user),
    isBootstrapping,
    isWorking,
    login,
    register,
    logout,
    refresh: fetchMe,
    setUser,
  }), [token, user, isBootstrapping, isWorking, login, register, logout, fetchMe]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
