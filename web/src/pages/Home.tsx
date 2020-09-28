import React from 'react';
import { useUsersQuery } from '../generated/graphql';
import { HomeCardSection } from '../components/home/HomeCardSection';
import { CustomPieChart } from '../components/chart/CustomPieChart';
import { PageHeader } from '../components/layout/PageHeader';
import { TwoRowButtons } from '../components/button/TwoRowButtons';
import CategoryIcon from '@material-ui/icons/Category';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { CustomBarChart } from '../components/chart/CustomBarChart';
import { ExpenseTable } from '../components/tables/ExpenseTable';
import { StatisticCard } from '../components/card/StatisticCard';

export const Home: React.FC = () => {
  const { data } = useUsersQuery({ fetchPolicy: 'network-only' });

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <PageHeader
        primaryText={'Home'}
        secondaryText={'Find out statistics about your expenses.'}
      />
      <TwoRowButtons
        buttonWidth={150}
        leftIcon={<AttachMoneyIcon />}
        rightIcon={<CategoryIcon />}
        leftLabel={'Add expense'}
        rightLabel={'Add category'}
        leftClickHandler={() => {}}
        rightClickHandler={() => {}}
      />
      <div className={'content-wrapper'}>
        <div className={'row home-row-wrapper'}>
          <div className={'home-cards-wrapper'}>
            <HomeCardSection />
            <div className={'m-15'}>
              <CustomBarChart />
            </div>
          </div>

          <div className={'expense-chart m-15'}>
            <CustomPieChart />
            <div className={'row mt-5rem home-cards'}>
              <StatisticCard
                title={'Statistics 1 '}
                value={12}
                description={'Description 1'}
              />
              <StatisticCard
                title={'Statistics 2 '}
                value={199}
                description={'Description 2'}
              />
            </div>
          </div>
        </div>

        <div className={'expense-table'}>
          <ExpenseTable />
        </div>
      </div>
    </>
  );
};
