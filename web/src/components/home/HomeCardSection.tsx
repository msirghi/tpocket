import React from 'react';
import { useGetCategoryExpenseStatisticsByUserQuery } from '../../generated/graphql';
import { StatisticCard } from '../card/StatisticCard';

interface IProps {}

export const HomeCardSection: React.FC<IProps> = () => {
  const { data, loading } = useGetCategoryExpenseStatisticsByUserQuery();

  if (loading) {
    return <div>Loading...</div>;
  }

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
          title={'Total categories'}
          value={12}
          description={'Your categories'}
        />
      </div>

      <div className={'home-cards'}>
        <StatisticCard
          title={'Total categories'}
          value={data ? data.getCategoryExpenseStatisticsByUser.totalCategories : 0}
          description={'Your categories'}
        />
        <StatisticCard
          title={'Total expenses'}
          value={500}
          description={'Sum of your expenses'}
          currency={'MDL'}
        />
      </div>
    </div>
  );
};
