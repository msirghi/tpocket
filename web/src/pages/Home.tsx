import React, { useState } from 'react';
import {
  PercentageByCategoryPayload,
  useGetCategoryExpenseStatisticsByUserQuery,
  MonthExpensesPayload,
} from '../generated/graphql';
import { HomeCardSection } from '../components/home/HomeCardSection';
import { CustomPieChart } from '../components/charts/CustomPieChart';
import { PageHeader } from '../components/layout/PageHeader';
import { TwoRowButtons } from '../components/buttons/TwoRowButtons';
import CategoryIcon from '@material-ui/icons/Category';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { CustomBarChart } from '../components/charts/CustomBarChart';
import { ExpenseTable } from '../components/tables/ExpenseTable';
import { StatisticCard } from '../components/cards/StatisticCard';
import { NoHomeData } from '../components/alerts/NoHomeData';
import { getMonthName } from '../utils/extensions';

export type MonthlyStatistics = {
  thisMonthExpenses?: MonthExpensesPayload;
  monthWithMaxExpenses?: MonthExpensesPayload;
  monthWithMinExpenses?: MonthExpensesPayload;
};

export const Home: React.FC = () => {
  const { data, loading } = useGetCategoryExpenseStatisticsByUserQuery();
  const [mostUsedCategory, setMostUsedCategory] = useState<PercentageByCategoryPayload | null>(
    null
  );
  const [monthlyStatistics, setMonthlyStatistics] = useState<MonthlyStatistics>();

  const mostUsedCategoryHandler = (category: PercentageByCategoryPayload) => {
    console.log('category :>> ', category);
    setMostUsedCategory(category);
  };

  const monthlyStatisticsHandler = (statistics: MonthlyStatistics) => {
    setMonthlyStatistics(statistics);
    console.log('statistics :>> ', statistics);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const getRowButtons = () => {
    return (
      <TwoRowButtons
        buttonWidth={150}
        leftIcon={<AttachMoneyIcon />}
        rightIcon={<CategoryIcon />}
        leftLabel={'Add expense'}
        rightLabel={'Add category'}
        leftClickHandler={() => {}}
        rightClickHandler={() => {}}
      />
    );
  };

  if (!data) {
    return (
      <>
        <NoHomeData />
        {getRowButtons()}
      </>
    );
  }

  return (
    <>
      <PageHeader primaryText={'Home'} secondaryText={'Find out statistics about your expenses.'} />
      {getRowButtons()}
      <div className={'content-wrapper'}>
        <div className={'row home-row-wrapper'}>
          <div className={'home-cards-wrapper'}>
            <HomeCardSection
              monthlyStatistics={monthlyStatistics}
              mostUsedCategory={mostUsedCategory!}
              data={data}
            />
            <div className={'m-15'}>
              <CustomBarChart monthlyStatisticsHandler={monthlyStatisticsHandler} />
            </div>
          </div>

          <div className={'expense-chart m-15'}>
            <CustomPieChart mostUsedCategoryHandler={mostUsedCategoryHandler} />
            <div className={'row mt-5rem home-cards'}>
              <StatisticCard
                title={
                  monthlyStatistics
                    ? getMonthName(+monthlyStatistics.monthWithMaxExpenses!.name)
                    : '0'
                }
                value={monthlyStatistics ? monthlyStatistics.monthWithMaxExpenses!.expenses : '0'}
                description={'Max month expenses'}
              />
              <StatisticCard
                title={
                  monthlyStatistics
                    ? getMonthName(+monthlyStatistics.monthWithMinExpenses!.name)
                    : '0'
                }
                value={monthlyStatistics ? monthlyStatistics.monthWithMinExpenses!.expenses : '0'}
                description={'Min month expenses'}
              />
            </div>
          </div>
        </div>

        <div className={'expense-table m-15'}>
          <ExpenseTable />
        </div>
      </div>
    </>
  );
};
