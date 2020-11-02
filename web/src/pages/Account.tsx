import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AccountEditForm } from '../components/forms/AccountEditForm';
import { PageHeader } from '../components/layout/PageHeader';
import { FullScreenLoader } from '../components/loaders/FullScreenLoader';
import { AccountContext } from '../context/AccountContext';
import { useGetUserInfoQuery } from '../generated/graphql';

export const Account: React.FC = () => {
  const { t } = useTranslation();
  const accountInfo = useContext(AccountContext);

  return (
    <div>
      <PageHeader primaryText={t('account.title')} secondaryText={t('account.description')} />

      <div className='row row-center'>
        <img
          height={100}
          width={100}
          src='https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Circle-icons-settings.svg/1024px-Circle-icons-settings.svg.png'
        />
      </div>

      <AccountEditForm {...accountInfo.state!} />
    </div>
  );
};
