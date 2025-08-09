import React from 'react';

export default function PostItem({ post }) {
  const authorName = post?.author?.displayName || post?.authorName || 'Аноним';
  const avatar = post?.author?.avatarBase64 || '';
  const created = post?.createdAt ? new Date(post.createdAt).toLocaleString() : '';
  const content = post?.content || post?.text || '';
  const likes = typeof post?.likesCount === 'number' ? post.likesCount : undefined;

  return (
    <article style={card}>
      <div style={{ display: 'flex', gap: 12 }}>
        {avatar ? (
          <img src={avatar} alt="avatar" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '1px solid #e5e7eb' }} />
        ) : (
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#e0e7ff', display: 'grid', placeItems: 'center', color: '#3730a3', fontWeight: 700 }}>
            {String(authorName || 'U').slice(0, 1).toUpperCase()}
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontWeight: 600 }}>{authorName}</div>
            <div style={{ color: '#9ca3af', fontSize: 12 }}>{created}</div>
          </div>
          <div style={{ marginTop: 6, whiteSpace: 'pre-wrap' }}>{content}</div>
          {typeof likes !== 'undefined' ? (
            <div style={{ marginTop: 8, color: '#6b7280', fontSize: 13 }}>{likes} ❤</div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

const card = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 };
