import React, { useContext } from 'react';
import { PercentageByCategoryPayload } from '../../generated/graphql';
import { StatisticCard } from './StatisticCard';
import { startCase } from 'lodash';
import { MonthlyStatistics } from '../../pages/Home';
import { useTranslation } from 'react-i18next';
import { AccountContext } from '../../context/AccountContext';

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
  const accountInfo = useContext(AccountContext);
  const { t } = useTranslation();

  return (
    <div>
      <div className={'home-cards'}>
        <StatisticCard
          title={t('home.totalExpenses')}
          value={data ? data.getCategoryExpenseStatisticsByUser.totalExpenses : 0}
          description={t('home.sumOfYourExpenses')}
          currency={accountInfo.state!.currency}
        />
        <StatisticCard
          title={t('home.mostUsedCategory')}
          value={mostUsedCategory ? startCase(mostUsedCategory.category.name) : 'Fetching...'}
          description={t('home.mostUsedCategoryDescription')}
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
