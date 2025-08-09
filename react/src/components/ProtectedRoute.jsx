import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuth, isBootstrapping } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '60vh', color: '#223' }}>
        <div>
          <div style={{ fontSize: 18, marginBottom: 8 }}>Проверка доступа…</div>
          <div style={{ opacity: 0.7 }}>Пожалуйста, подождите</div>
        </div>
      </div>
    );
  }

  if (!isAuth) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
