import React, { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { updateMe } from '../api/users';
import { fileToDataUrl, estimateBase64Bytes, ONE_MB } from '../utils/base64';

export default function ProfilePage() {
  const { user, refresh, setUser } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarBase64, setAvatarBase64] = useState('');
  const [avatarChanged, setAvatarChanged] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setDisplayName(user?.displayName || '');
    setBio(user?.bio || '');
    setAvatarBase64(user?.avatarBase64 || '');
    setAvatarChanged(false);
    setMessage('');
    setError('');
  }, [user]);

  const mutation = useMutation({
    mutationFn: (payload) => updateMe(payload),
    onSuccess: (res) => {
      if (res && res.success && res.user) {
        setUser(res.user);
        setMessage('Профиль обновлён');
        setError('');
        setAvatarChanged(false);
      } else {
        setError(res?.message || 'Не удалось обновить профиль');
        setMessage('');
      }
    },
  });

  async function onAvatarChange(e) {
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
        setError('Аватар больше 1 МБ');
        return;
      }
      setAvatarBase64(dataUrl);
      setAvatarChanged(true);
    } catch (err) {
      setError('Не удалось загрузить аватар');
    }
  }

  function removeAvatar() {
    setAvatarBase64('');
    setAvatarChanged(true);
  }

  function validate() {
    const name = String(displayName || '').trim();
    const about = String(bio || '').trim();
    if (name.length < 2 || name.length > 50) {
      setError('Имя должно быть от 2 до 50 символов');
      return null;
    }
    if (about.length > 300) {
      setError('Поле "О себе" не должно превышать 300 символов');
      return null;
    }
    if (avatarBase64) {
      const bytes = estimateBase64Bytes(avatarBase64);
      if (bytes > ONE_MB) {
        setError('Аватар больше 1 МБ');
        return null;
      }
    }
    setError('');
    return { displayName: name, bio: about };
  }

  async function handleSave(e) {
    e.preventDefault();
    setMessage('');
    const base = validate();
    if (!base) return;
    const payload = { ...base };
    if (avatarChanged) payload.avatarBase64 = avatarBase64 || '';
    mutation.mutate(payload);
  }

  async function handleRefresh() {
    const res = await refresh();
    if (!res.ok) setError(res.message || 'Ошибка обновления данных');
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <section style={card}>
        <h2 style={{ marginTop: 0 }}>Мой профиль</h2>
        <div style={{ color: '#6b7280', marginBottom: 8 }}>Почта: {user?.email}</div>
        <form onSubmit={handleSave} style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div>
              {avatarBase64 ? (
                <img src={avatarBase64} alt="avatar" style={{ width: 88, height: 88, objectFit: 'cover', borderRadius: '50%', border: '1px solid #e5e7eb' }} />
              ) : (
                <div style={{ width: 88, height: 88, borderRadius: '50%', background: '#e0e7ff', display: 'grid', placeItems: 'center', color: '#3730a3', fontWeight: 700 }}>
                  {String(displayName || 'U').slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              <label style={btnQuiet}>
                Загрузить аватар
                <input type="file" accept="image/*" onChange={onAvatarChange} style={{ display: 'none' }} />
              </label>
              {avatarBase64 ? (
                <button type="button" onClick={removeAvatar} style={btnQuietSmall}>Удалить аватар</button>
              ) : null}
            </div>
          </div>
          <div>
            <label style={label}>Имя</label>
            <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} style={input} placeholder="Ваше имя" />
          </div>
          <div>
            <label style={label}>О себе</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} style={textarea} placeholder="Коротко о себе" rows={4} />
          </div>
          {error ? <div style={errorBox}>{error}</div> : null}
          {message ? <div style={infoBox}>{message}</div> : null}
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" disabled={mutation.isLoading} style={btnPrimary}>{mutation.isLoading ? 'Сохраняем…' : 'Сохранить'}</button>
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
const btnQuietSmall = { padding: '6px 10px', background: 'transparent', color: '#374151', border: '1px solid #e5e7eb', borderRadius: 8, cursor: 'pointer', width: 'fit-content' };
const infoBox = { padding: '8px 10px', background: '#eef2ff', color: '#3730a3', borderRadius: 8, border: '1px solid #c7d2fe' };
const errorBox = { padding: '8px 10px', background: '#fef2f2', color: '#991b1b', borderRadius: 8, border: '1px solid #fecaca' };
