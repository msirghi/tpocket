import React from 'react';
import { PercentageByCategoryPayload } from '../../generated/graphql';
import { StatisticCard } from '../cards/StatisticCard';
import { startCase } from 'lodash';
import { MonthlyStatistics } from '../../pages/Home';
import { useTranslation } from 'react-i18next';

interface IProps {
  data: any;
  mostUsedCategory?: PercentageByCategoryPayload;
  monthlyStatistics?: MonthlyStatistics;
}

export const HomeCardSection: React.FC<IProps> = ({
  data,
  mostUsedCategory,
  monthlyStatistics
}) => {
  const { t } = useTranslation();
  return (
    <div>
      <div className={'home-cards'}>
        <StatisticCard
          title={t('home.totalExpenses')}
          value={data ? data.getCategoryExpenseStatisticsByUser.totalExpenses : 0}
          description={t('home.sumOfYourExpenses')}
          currency={'MDL'}
        />
        <StatisticCard
          title={t('home.mostUsedCategory')}
          value={mostUsedCategory ? startCase(mostUsedCategory.category.name) : 'Fetching...'}
          description={'Where you spend the most'}
        />
      </div>

      <div className={'home-cards'}>
        <StatisticCard
          title={t('home.totalCategories')}
          value={data ? data.getCategoryExpenseStatisticsByUser.totalCategories : 0}
          description={t('home.yourCategories')}
        />
        <StatisticCard
          title={'Spent this month'}
          value={
            monthlyStatistics && monthlyStatistics.thisMonthExpenses
              ? monthlyStatistics.thisMonthExpenses.expenses
              : 0
          }
          description={t('home.monthExpensesSum')}
          currency={'MDL'}
        />
      </div>
    </div>
  );
};
