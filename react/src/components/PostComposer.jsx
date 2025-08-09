import React, { useState } from 'react';

export default function PostComposer() {
  const [text, setText] = useState('');
  const [info, setInfo] = useState('');

  function canPost() {
    return String(text || '').trim().length > 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const content = String(text || '').trim();
    if (!content) return;
    // Here you could call API to create a post; for now we just emit an event to refresh feed
    setText('');
    setInfo('Публикация отправлена');
    setTimeout(() => setInfo(''), 1200);
    try {
      const evt = new Event('feed:refresh');
      window.dispatchEvent(evt);
    } catch (_) {
      // no-op
    }
  }

  return (
    <section style={card}>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8 }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Что у вас нового?"
          rows={3}
          style={textarea}
        />
        {info ? <div style={infoBox}>{info}</div> : null}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" disabled={!canPost()} style={btnPrimary}>
            Опубликовать
          </button>
        </div>
      </form>
    </section>
  );
}

const card = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 };
const textarea = { width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, outline: 'none', resize: 'vertical' };
const btnPrimary = { padding: '10px 12px', background: '#4f46e5', color: '#fff', border: 0, borderRadius: 8, cursor: 'pointer' };
const infoBox = { padding: '8px 10px', background: '#eef2ff', color: '#3730a3', borderRadius: 8, border: '1px solid #c7d2fe', width: 'fit-content' };
