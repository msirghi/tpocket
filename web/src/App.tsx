import React, { useEffect, useState, Suspense, useContext } from 'react';
import { Routes } from './Routes';
import { setAccessToken } from './accessToken';
import { FullScreenLoader } from './components/loaders/FullScreenLoader';
import './commons/i18n';
import { AccountContext, AccountProvider } from './context/AccountContext';
import { useGetUserInfoQuery } from './generated/graphql';

export const App: React.FC<{}> = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { refetch } = useGetUserInfoQuery();
  const accountInfo = useContext(AccountContext);

  useEffect(() => {
    fetch(`http://localhost:4000/refresh_token`, { method: 'POST', credentials: 'include' }).then(
      async (res) => {
        const { accessToken } = await res.json();
        if (
          !accessToken &&
          !window.location.href.includes('login') &&
          !window.location.href.includes('register')
        ) {
          window.location.replace('http://localhost:3000/login');
        }
        setAccessToken(accessToken);
        setTimeout(async () => {
          const res = await refetch();
          if (res.data.getUserInfo) {
            const {
              currency,
              monthLimit,
              user: { email, firstName, lastName }
            } = res.data.getUserInfo;
            console.log('accountInfo from App:', accountInfo);
            accountInfo.dispatch({ email, firstName, lastName, currency, monthLimit });
          }
          setLoading(false);
        }, 1000);
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
