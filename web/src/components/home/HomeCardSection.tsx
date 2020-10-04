import React from 'react';
import { PercentageByCategoryPayload } from '../../generated/graphql';
import { StatisticCard } from '../cards/StatisticCard';
import { startCase } from 'lodash';
import { MonthlyStatistics } from '../../pages/Home';

interface IProps {
  data: any;
  mostUsedCategory?: PercentageByCategoryPayload;
  monthlyStatistics?: MonthlyStatistics;
}

export const HomeCardSection: React.FC<IProps> = ({
  data,
  mostUsedCategory,
  monthlyStatistics,
}) => {
  console.log('monthlyStatistics :>> ', monthlyStatistics);
  return (
    <div>
      <div className={'home-cards'}>
        <StatisticCard
          title={'Total expenses'}
          value={data ? data.getCategoryExpenseStatisticsByUser.totalExpenses : 0}
          description={'Sum of your expenses'}
          currency={'MDL'}
        />
        <StatisticCard
          title={'Most used category'}
          value={mostUsedCategory ? startCase(mostUsedCategory.category.name) : 'Fetching...'}
          description={'Where you spend the most'}
        />
      </div>

      <div className={'home-cards'}>
        <StatisticCard
          title={'Total categories'}
          value={data ? data.getCategoryExpenseStatisticsByUser.totalCategories : 0}
          description={'Your categories'}
        />
        <StatisticCard
          title={'Spent this month'}
          value={
            monthlyStatistics && monthlyStatistics.thisMonthExpenses
              ? monthlyStatistics.thisMonthExpenses.expenses
              : 0
          }
          description={'Sum of your expenses by this month'}
          currency={'MDL'}
        />
      </div>
    </div>
  );
};
