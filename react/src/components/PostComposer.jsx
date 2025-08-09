import React, { useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from '../api/posts';
import { fileToDataUrl, estimateBase64Bytes, ONE_MB } from '../utils/base64';

export default function PostComposer() {
  const [text, setText] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload) => createPost(payload),
    onSuccess: () => {
      setText('');
      setImageBase64('');
      setError('');
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  async function handleFileChange(e) {
    setError('');
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type || !file.type.startsWith('image/')) {
      setError('Пожалуйста, выберите файл изображения');
      e.target.value = '';
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      const bytes = estimateBase64Bytes(dataUrl);
      if (bytes > ONE_MB) {
        setError('Картинка больше 1 МБ');
        e.target.value = '';
        return;
      }
      setImageBase64(dataUrl);
    } catch (err) {
      setError('Не удалось загрузить изображение');
    }
  }

  function removeImage() {
    setImageBase64('');
    if (inputRef.current) inputRef.current.value = '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const t = String(text || '').trim();
    if (t.length < 1) {
      setError('Введите текст поста');
      return;
    }
    if (t.length > 500) {
      setError('Текст не должен превышать 500 символов');
      return;
    }
    if (imageBase64) {
      const bytes = estimateBase64Bytes(imageBase64);
      if (bytes > ONE_MB) {
        setError('Картинка больше 1 МБ');
        return;
      }
    }

    mutation.mutate({ text: t, imageBase64: imageBase64 || undefined });
  }

  return (
    <div style={card}>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 10 }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Что у вас нового?"
          rows={3}
          style={textarea}
        />
        {imageBase64 ? (
          <div style={imageWrap}>
            <img src={imageBase64} alt="preview" style={{ maxWidth: '100%', borderRadius: 8 }} />
            <button type="button" onClick={removeImage} style={btnQuietSmall}>Удалить изображение</button>
          </div>
        ) : null}
        {error ? <div style={errorBox}>{error}</div> : null}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <label style={btnQuiet}>
            Добавить фото
            <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
          </label>
          <div style={{ flex: 1 }} />
          <button type="submit" disabled={mutation.isLoading} style={btnPrimary}>
            {mutation.isLoading ? 'Публикуем…' : 'Опубликовать'}
          </button>
        </div>
      </form>
    </div>
  );
}

const card = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 };
const textarea = { width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, resize: 'vertical' };
const btnPrimary = { padding: '10px 12px', background: '#4f46e5', color: '#fff', border: 0, borderRadius: 8, cursor: 'pointer' };
const btnQuiet = { padding: '10px 12px', background: 'transparent', color: '#374151', border: '1px solid #e5e7eb', borderRadius: 8, cursor: 'pointer' };
const btnQuietSmall = { padding: '6px 10px', background: 'transparent', color: '#374151', border: '1px solid #e5e7eb', borderRadius: 8, cursor: 'pointer', marginTop: 8 };
const errorBox = { padding: '8px 10px', background: '#fef2f2', color: '#991b1b', borderRadius: 8, border: '1px solid #fecaca' };
const imageWrap = { background: '#fafafa', border: '1px dashed #e5e7eb', borderRadius: 12, padding: 10 };
