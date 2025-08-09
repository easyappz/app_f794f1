import React from 'react';

export default function PostItem({ post }) {
  const created = new Date(post.createdAt);
  return (
    <article style={card}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={avatarFallback}>{String(post.author.displayName || 'U').slice(0, 1).toUpperCase()}</div>
          <div>
            <div style={{ fontWeight: 600 }}>{post.author.displayName}</div>
            <div style={{ color: '#6b7280', fontSize: 12 }}>{created.toLocaleString()}</div>
          </div>
        </div>
      </header>
      <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>{post.text}</div>
      {post.imageBase64 ? (
        <div style={{ marginTop: 10 }}>
          <img src={post.imageBase64} alt="post" style={{ maxWidth: '100%', borderRadius: 12, border: '1px solid #eee' }} />
        </div>
      ) : null}
    </article>
  );
}

const card = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 };
const avatarFallback = { width: 36, height: 36, borderRadius: '50%', background: '#e0e7ff', color: '#3730a3', display: 'grid', placeItems: 'center', fontWeight: 700 };
