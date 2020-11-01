import React, { useEffect, useState, Suspense } from 'react';
import { Routes } from './Routes';
import { setAccessToken } from './accessToken';
import { FullScreenLoader } from './components/loaders/FullScreenLoader';
import './commons/i18n';

export const App: React.FC<{}> = () => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch(`http://localhost:4000/refresh_token`, { method: 'POST', credentials: 'include' }).then(
      async (res) => {
        const { accessToken } = await res.json();
        console.log('accessToken :>> ', accessToken);
        if (
          !accessToken &&
          !window.location.href.includes('login') &&
          !window.location.href.includes('register')
        ) {
          window.location.replace('http://localhost:3000/login');
        }
        setAccessToken(accessToken);
        setLoading(false);
      }
    );
  }, []);

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <Suspense fallback='loading'>
      <Routes />
    </Suspense>
  );
};
