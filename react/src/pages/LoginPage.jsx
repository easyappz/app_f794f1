import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, isWorking } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.ok) {
      const to = location.state?.from?.pathname || '/';
      navigate(to, { replace: true });
    } else {
      setError(res.message || 'Не удалось войти');
    }
  }

  return (
    <div style={wrap}>
      <div style={card}>
        <h1 style={{ margin: 0, fontSize: 24 }}>Вход</h1>
        <p style={{ marginTop: 8, color: '#6b7280' }}>Введите почту и пароль</p>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, marginTop: 16 }}>
          <div>
            <label style={label}>Почта</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" style={input} required />
          </div>
          <div>
            <label style={label}>Пароль</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••" style={input} required />
          </div>
          {error ? <div style={errorBox}>{error}</div> : null}
          <button type="submit" disabled={isWorking} style={btnPrimary}>
            {isWorking ? 'Входим…' : 'Войти'}
          </button>
        </form>
        <div style={{ marginTop: 12, fontSize: 14 }}>
          Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link>
        </div>
      </div>
    </div>
  );
}

const wrap = { display: 'grid', placeItems: 'center', minHeight: '70vh' };
const card = { width: '100%', maxWidth: 420, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, boxShadow: '0 8px 20px rgba(17,24,39,0.06)' };
const label = { display: 'block', marginBottom: 6, fontSize: 14, color: '#374151' };
const input = { width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, outline: 'none' };
const btnPrimary = { padding: '10px 12px', background: '#4f46e5', color: '#fff', border: 0, borderRadius: 8, cursor: 'pointer' };
const errorBox = { padding: '8px 10px', background: '#fef2f2', color: '#991b1b', borderRadius: 8, border: '1px solid #fecaca' };
