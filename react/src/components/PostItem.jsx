import React from 'react';

function formatDate(value) {
  try {
    const d = new Date(value);
    return d.toLocaleString();
  } catch (e) {
    return '';
  }
}

export default function PostItem({ post }) {
  const name = post?.author?.displayName || 'Пользователь';
  const initial = String(name || 'U').slice(0, 1).toUpperCase();
  const when = formatDate(post?.createdAt);

  return (
    <article style={card}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={avatar}>{initial}</div>
        <div style={{ display: 'grid' }}>
          <div style={{ fontWeight: 700 }}>{name}</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>{when}</div>
        </div>
      </header>
      <div style={{ marginTop: 10, whiteSpace: 'pre-wrap', lineHeight: 1.45 }}>{post?.text}</div>
      {post?.imageBase64 ? (
        <div style={{ marginTop: 10 }}>
          <img src={post.imageBase64} alt="post" style={{ width: '100%', maxHeight: 420, objectFit: 'cover', borderRadius: 12, border: '1px solid #e5e7eb' }} />
        </div>
      ) : null}
    </article>
  );
}

const card = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 };
const avatar = { width: 36, height: 36, borderRadius: '50%', background: '#e0e7ff', color: '#3730a3', display: 'grid', placeItems: 'center', fontWeight: 700 };
