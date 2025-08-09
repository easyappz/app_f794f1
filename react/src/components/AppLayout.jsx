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

  function isActive(path) {
    return location.pathname === path;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fb', color: '#1f2430' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 10, background: '#ffffff', borderBottom: '1px solid #e6e9ef' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: '#4f46e5' }} />
            <Link to="/feed" style={{ textDecoration: 'none', color: '#111827', fontWeight: 700 }}>Easyappz Social</Link>
          </div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {isAuth ? (
              <>
                <Link to="/feed" style={linkStyle}>Лента</Link>
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
        {isAuth ? (
          <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 16 }}>
            <aside style={side}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Навигация</div>
              <Link to="/feed" style={isActive('/feed') ? sideLinkActive : sideLink}>Лента</Link>
              <Link to="/profile" style={isActive('/profile') ? sideLinkActive : sideLink}>Профиль</Link>
              <div style={sideLinkMuted}>Сообщения (скоро)</div>
              <div style={sideLinkMuted}>Друзья (скоро)</div>
              <div style={{ marginTop: 12, fontSize: 12, color: '#6b7280' }}>
                Вы вошли как <span style={{ color: '#111827' }}>{user?.displayName || 'Пользователь'}</span>
              </div>
            </aside>
            <section>
              <Outlet />
            </section>
          </div>
        ) : (
          <div style={{ maxWidth: 560, margin: '24px auto 0' }}>
            <Outlet />
          </div>
        )}
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

const side = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, height: 'fit-content', display: 'grid', gap: 4 };
const sideLink = { display: 'block', padding: '8px 10px', color: '#374151', borderRadius: 8, textDecoration: 'none' };
const sideLinkActive = { display: 'block', padding: '8px 10px', color: '#111827', borderRadius: 8, background: '#eef2ff', textDecoration: 'none' };
const sideLinkMuted = { padding: '8px 10px', color: '#9ca3af', borderRadius: 8 };
