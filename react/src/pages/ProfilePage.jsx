import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateMe } from '../api/users';

export default function ProfilePage() {
  const { user, refresh, setUser } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDisplayName(user?.displayName || '');
    setBio(user?.bio || '');
  }, [user]);

  async function handleSave(e) {
    e.preventDefault();
    setMessage('');
    setSaving(true);
    try {
      const res = await updateMe({ displayName, bio });
      if (res && res.success && res.user) {
        setUser(res.user);
        setMessage('Профиль обновлён');
      } else {
        setMessage(res?.message || 'Не удалось обновить профиль');
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleRefresh() {
    const res = await refresh();
    if (!res.ok) setMessage(res.message || 'Ошибка обновления данных');
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <section style={card}>
        <h2 style={{ marginTop: 0 }}>Мой профиль</h2>
        <div style={{ color: '#6b7280', marginBottom: 8 }}>Почта: {user?.email}</div>
        <form onSubmit={handleSave} style={{ display: 'grid', gap: 12 }}>
          <div>
            <label style={label}>Имя</label>
            <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} style={input} placeholder="Ваше имя" />
          </div>
          <div>
            <label style={label}>О себе</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} style={textarea} placeholder="Коротко о себе" rows={4} />
          </div>
          {message ? <div style={infoBox}>{message}</div> : null}
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" disabled={saving} style={btnPrimary}>{saving ? 'Сохраняем…' : 'Сохранить'}</button>
            <button type="button" onClick={handleRefresh} style={btnQuiet}>Обновить</button>
          </div>
        </form>
      </section>
    </div>
  );
}

const card = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 };
const label = { display: 'block', marginBottom: 6, fontSize: 14, color: '#374151' };
const input = { width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8 };
const textarea = { width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8 };
const btnPrimary = { padding: '10px 12px', background: '#4f46e5', color: '#fff', border: 0, borderRadius: 8, cursor: 'pointer' };
const btnQuiet = { padding: '10px 12px', background: 'transparent', color: '#374151', border: '1px solid #e5e7eb', borderRadius: 8, cursor: 'pointer' };
const infoBox = { padding: '8px 10px', background: '#eef2ff', color: '#3730a3', borderRadius: 8, border: '1px solid #c7d2fe' };
