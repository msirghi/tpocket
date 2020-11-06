import React from 'react';
import { useTranslation } from 'react-i18next';
import { TwoRowButtons } from '../components/buttons/TwoRowButtons';
import { PageHeader } from '../components/layout/PageHeader';
import { ExpenseTable } from '../components/tables/ExpenseTable';
import CategoryIcon from '@material-ui/icons/Category';
import { useHistory } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';

export const ExpenseHistory: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const getRowButtons = () => {
    return (
      <TwoRowButtons
        buttonWidth={150}
        leftIcon={<HomeIcon />}
        rightIcon={<CategoryIcon />}
        leftLabel={t('expenseTable.backHome')}
        rightLabel={t('home.addCategory')}
        leftClickHandler={() => history.push('/home')}
        rightClickHandler={() => history.push('/categories')}
      />
    );
  };

  return (
    <>
      <PageHeader
        primaryText={t('expenseTable.title')}
        secondaryText={t('expenseTable.pageDescription')}
      />
      {getRowButtons()}
      <ExpenseTable />
    </>
  );
};
