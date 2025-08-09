import React, { useEffect } from 'react';
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

  useEffect(() => {
    function onRefresh() {
      query.refetch();
    }
    window.addEventListener('feed:refresh', onRefresh);
    return () => window.removeEventListener('feed:refresh', onRefresh);
  }, [query]);

  const pages = query.data?.pages || [];
  const firstPage = pages[0];
  const hasApiError = Boolean(firstPage && firstPage.success !== true);
  const errorMessage = hasApiError ? (firstPage?.message || 'Не удалось загрузить ленту') : '';
  const posts = pages.flatMap((p) => (p && p.success ? (p.posts || []) : []));

  return (
    <div style={{ display: 'grid', gap: 16 }}>
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
      ) : hasApiError ? (
        <div style={errorBox}>{errorMessage}</div>
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
    </div>
  );
}

const hero = { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 };
const placeholderBox = { background: '#fff', border: '2px dashed #e5e7eb', borderRadius: 12, padding: 20, textAlign: 'center' };
const errorBox = { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: 16, color: '#991b1b', textAlign: 'center' };
const btnQuiet = { padding: '10px 12px', background: 'transparent', color: '#374151', border: '1px solid #e5e7eb', borderRadius: 8, cursor: 'pointer' };
