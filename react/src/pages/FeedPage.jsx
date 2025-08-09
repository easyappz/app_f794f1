import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function FeedPage() {
  const { user } = useAuth();

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <section style={hero}>
        <div>
          <div style={{ fontSize: 14, color: '#6b7280' }}>Лента</div>
          <h1 style={{ margin: '6px 0 0 0' }}>Здравствуйте, {user?.displayName || 'друг'} 👋</h1>
          <p style={{ marginTop: 6, color: '#6b7280' }}>Здесь будет ваша персональная лента постов.</p>
        </div>
      </section>
      <section style={placeholderBox}>
        <div style={{ color: '#6b7280' }}>Постов пока нет. Начните с обновления профиля или создания поста в дальнейшем.</div>
      </section>
    </div>
  );
}

const hero = { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 };
const placeholderBox = { background: '#fff', border: '2px dashed #e5e7eb', borderRadius: 12, padding: 20, textAlign: 'center' };
