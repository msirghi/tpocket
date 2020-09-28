import React from 'react';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartCard } from '../card/ChartCard';
import { useWindowSize } from '../../utils/useWindowSize';
import { useGetExpensesStatisticsQuery } from '../../generated/graphql';

export const CustomBarChart = () => {
  const [width] = useWindowSize();
  const { data, loading, error } = useGetExpensesStatisticsQuery({
    variables: { year: new Date().getFullYear() },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  let chartData: Array<{ name: string; uv: string | number }> = [];

  if (data) {
    chartData = data.getExpensesStatistics.map((expense) => ({
      name: expense.name,
      uv: expense.expenses,
    }));
  }

  return (
    <ChartCard title={'Monthly chart'}>
      {error ? (
        <div className={'text-center'}>No data found.</div>
      ) : (
        <BarChart
          width={width > 600 ? 600 : 300}
          height={300}
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
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
