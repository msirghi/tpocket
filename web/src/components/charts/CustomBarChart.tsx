import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartCard } from '../cards/ChartCard';
import { useWindowSize } from '../../utils/useWindowSize';
import { useGetExpensesStatisticsQuery } from '../../generated/graphql';
import { MonthlyStatistics } from '../../pages/Home';
import { useTranslation } from 'react-i18next';

type Props = {
  monthlyStatisticsHandler: (statistics: MonthlyStatistics) => void;
};

export const CustomBarChart: React.FC<Props> = ({ monthlyStatisticsHandler }) => {
  const [width] = useWindowSize();
  const { data, error } = useGetExpensesStatisticsQuery({
    variables: { year: new Date().getFullYear() }
  });
  const [isLoading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    if (data) {
      const sortedByExpenses = data.getExpensesStatistics.sort((a, b) => a.expenses - b.expenses);
      let statistics: MonthlyStatistics = {
        monthWithMaxExpenses: sortedByExpenses.slice(-1).pop(),
        monthWithMinExpenses: sortedByExpenses[0],
        thisMonthExpenses: sortedByExpenses.find(
          (stats) => +stats.name === new Date().getMonth() + 1
        )
      };
      monthlyStatisticsHandler(statistics);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  let chartData: Array<{ name: string; uv: string | number }> = [];

  if (data) {
    chartData = data.getExpensesStatistics.map((expense) => ({
      name: expense.name,
      uv: expense.expenses
    }));
  }

  return (
    <ChartCard title={t('charts.monthlyChart')}>
      {error ? (
        <div className={'text-center'}>{t('helpers.noDataFound')}</div>
      ) : (
        <BarChart
          width={width > 600 ? 600 : 300}
          height={300}
          data={chartData.reverse()}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Bar dataKey='pv' stackId='a' fill='#8884d8' />
          <Bar dataKey='uv' stackId='a' fill='#82ca9d' />
        </BarChart>
      )}
    </ChartCard>
  );
};
