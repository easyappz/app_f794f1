import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AppLayout() {
  const { isAuth, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    if (location.pathname !== '/login') navigate('/login');
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fb', color: '#1f2430' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 10, background: '#ffffff', borderBottom: '1px solid #e6e9ef' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: '#4f46e5' }} />
            <Link to="/" style={{ textDecoration: 'none', color: '#111827', fontWeight: 700 }}>Easyappz Social</Link>
          </div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {isAuth ? (
              <>
                <Link to="/" style={linkStyle}>Лента</Link>
                <Link to="/profile" style={linkStyle}>Профиль</Link>
                <div style={{ padding: '6px 10px', color: '#6b7280' }}>
                  {user?.displayName || 'Пользователь'}
                </div>
                <button onClick={handleLogout} style={btnQuiet}>Выйти</button>
              </>
            ) : (
              <>
                <Link to="/login" style={linkStyle}>Войти</Link>
                <Link to="/register" style={btnPrimary}>Регистрация</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 960, margin: '0 auto', padding: 16 }}>
        <Outlet />
      </main>

      <footer style={{ padding: 24, textAlign: 'center', color: '#6b7280' }}>
        © {new Date().getFullYear()} Easyappz
      </footer>
    </div>
  );
}

const linkStyle = {
  padding: '8px 10px',
  color: '#374151',
  textDecoration: 'none',
  borderRadius: 8,
};

const btnPrimary = {
  padding: '8px 12px',
  background: '#4f46e5',
  color: '#fff',
  textDecoration: 'none',
  borderRadius: 8,
};

const btnQuiet = {
  padding: '8px 12px',
  background: 'transparent',
  color: '#374151',
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  cursor: 'pointer',
};
