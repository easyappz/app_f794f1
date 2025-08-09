import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createPost } from '../api/posts';
import { fileToDataUrl, estimateBase64Bytes, ONE_MB } from '../utils/base64';

export default function PostComposer() {
  const [text, setText] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: (payload) => createPost(payload),
    onSuccess: (res) => {
      if (res && res.success) {
        toast.success('Пост опубликован');
        setText('');
        setImageBase64('');
        setError('');
        window.dispatchEvent(new Event('feed:refresh'));
      } else {
        const msg = res?.message || 'Не удалось опубликовать пост';
        setError(msg);
        toast.error(msg);
      }
    },
    onError: () => {
      setError('Сетевая ошибка');
      toast.error('Сетевая ошибка');
    },
  });

  async function onImageChange(e) {
    setError('');
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (!f.type || !f.type.startsWith('image/')) {
      setError('Пожалуйста, выберите файл изображения');
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(f);
      const bytes = estimateBase64Bytes(dataUrl);
      if (bytes > ONE_MB) {
        setError('Изображение больше 1 МБ');
        return;
      }
      setImageBase64(dataUrl);
    } catch (err) {
      setError('Не удалось загрузить изображение');
    }
  }

  function removeImage() {
    setImageBase64('');
  }

  function validate() {
    const t = String(text || '').trim();
    if (t.length < 1) {
      setError('Введите текст поста');
      return null;
    }
    if (t.length > 500) {
      setError('Текст не должен превышать 500 символов');
      return null;
    }
    if (imageBase64) {
      const bytes = estimateBase64Bytes(imageBase64);
      if (bytes > ONE_MB) {
        setError('Изображение больше 1 МБ');
        return null;
      }
    }
    setError('');
    return { text: t };
  }

  function handleSubmit(e) {
    e.preventDefault();
    const base = validate();
    if (!base) return;
    const payload = imageBase64 ? { ...base, imageBase64 } : base;
    mutation.mutate(payload);
  }

  return (
    <section style={card}>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Что у вас нового?"
            rows={3}
            style={textarea}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, color: '#6b7280', fontSize: 12 }}>
            <span>Поделитесь своими мыслями</span>
            <span>{String(text).length}/500</span>
          </div>
        </div>
        {imageBase64 ? (
          <div style={{ position: 'relative' }}>
            <img src={imageBase64} alt="attachment" style={{ maxWidth: '100%', borderRadius: 12, border: '1px solid #e5e7eb' }} />
            <button type="button" onClick={removeImage} style={btnQuietSmall}>Удалить изображение</button>
          </div>
        ) : null}
        {error ? <div style={errorBox}>{error}</div> : null}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <label style={btnQuiet}>
            Добавить изображение
            <input type="file" accept="image/*" onChange={onImageChange} style={{ display: 'none' }} />
          </label>
          <button type="submit" disabled={mutation.isLoading} style={btnPrimary}>
            {mutation.isLoading ? 'Публикуем…' : 'Опубликовать'}
          </button>
        </div>
      </form>
    </section>
  );
}

const card = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 };
const textarea = { width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, outline: 'none', resize: 'vertical' };
const btnPrimary = { padding: '10px 12px', background: '#4f46e5', color: '#fff', border: 0, borderRadius: 8, cursor: 'pointer' };
const btnQuiet = { padding: '10px 12px', background: 'transparent', color: '#374151', border: '1px solid #e5e7eb', borderRadius: 8, cursor: 'pointer' };
const btnQuietSmall = { marginTop: 8, padding: '6px 10px', background: 'transparent', color: '#374151', border: '1px solid #e5e7eb', borderRadius: 8, cursor: 'pointer' };
const errorBox = { padding: '8px 10px', background: '#fef2f2', color: '#991b1b', borderRadius: 8, border: '1px solid #fecaca' };
