import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { listFeed } from '../api/posts';
import { useAuth } from '../context/AuthContext';
import PostComposer from '../components/PostComposer';
import PostItem from '../components/PostItem';

export default function FeedPage() {
  const { user } = useAuth();

  const query = useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam }) => listFeed(pageParam ? { cursor: pageParam, limit: 10 } : { limit: 10 }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.success) return undefined;
      return lastPage.nextCursor || undefined;
    },
  });

  const posts = (query.data?.pages || []).flatMap((p) => (p && p.success ? (p.posts || []) : []));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 16 }}>
      <aside style={side}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Навигация</div>
        <div style={sideLinkActive}>Лента</div>
        <div style={sideLink}>Сообщения (скоро)</div>
        <div style={sideLink}>Друзья (скоро)</div>
        <div style={{ marginTop: 12, fontSize: 12, color: '#6b7280' }}>
          Вы вошли как <span style={{ color: '#111827' }}>{user?.displayName}</span>
        </div>
      </aside>
      <section style={{ display: 'grid', gap: 16 }}>
        <section style={hero}>
          <div>
            <div style={{ fontSize: 14, color: '#6b7280' }}>Лента</div>
            <h1 style={{ margin: '6px 0 0 0' }}>Здравствуйте, {user?.displayName || 'друг'} 👋</h1>
            <p style={{ marginTop: 6, color: '#6b7280' }}>Поделитесь мыслями и посмотрите, что нового у других.</p>
          </div>
        </section>

        <PostComposer />

        {query.isLoading ? (
          <div style={placeholderBox}>Загружаем ленту…</div>
        ) : posts.length === 0 ? (
          <div style={placeholderBox}>Постов пока нет. Будьте первым!</div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {posts.map((p) => (
              <PostItem key={p.id} post={p} />
            ))}
            {query.hasNextPage ? (
              <button onClick={() => query.fetchNextPage()} disabled={query.isFetchingNextPage} style={btnQuiet}>
                {query.isFetchingNextPage ? 'Загружаем…' : 'Показать ещё'}
              </button>
            ) : null}
          </div>
        )}
      </section>
    </div>
  );
}

const side = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, height: 'fit-content' };
const sideLink = { padding: '8px 10px', color: '#6b7280', borderRadius: 8 };
const sideLinkActive = { padding: '8px 10px', color: '#111827', borderRadius: 8, background: '#eef2ff' };
const hero = { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 };
const placeholderBox = { background: '#fff', border: '2px dashed #e5e7eb', borderRadius: 12, padding: 20, textAlign: 'center' };
const btnQuiet = { padding: '10px 12px', background: 'transparent', color: '#374151', border: '1px solid #e5e7eb', borderRadius: 8, cursor: 'pointer' };
