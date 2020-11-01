// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Cell, Legend, Pie, PieChart } from 'recharts';
import { ChartCard } from '../cards/ChartCard';
import { useWindowSize } from '../../utils/useWindowSize';
import { useGetExpensePercentageByCategoryQuery } from '../../generated/graphql';
import { startCase } from 'lodash';
import { useTranslation } from 'react-i18next';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  // @ts-ignore
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill='white' textAnchor={x > cx ? 'start' : 'end'} dominantBaseline='central'>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

interface Props {
  mostUsedCategoryHandler: (category: Category) => void;
}

export const CustomPieChart: React.FC<Props> = ({ mostUsedCategoryHandler }) => {
  const [width] = useWindowSize();
  const { data, error } = useGetExpensePercentageByCategoryQuery();
  const [isLoading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    if (data) {
      const mostUsedCategory = data.getExpensePercentageByCategory
        .sort((a, b) => a.percentage - b.percentage)
        .filter((expenses) => expenses.category.name !== 'Others');
      mostUsedCategoryHandler(mostUsedCategory.slice(-1).pop());
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  let chartData = [];

  if (data) {
    chartData = data.getExpensePercentageByCategory.map((expense) => ({
      name: startCase(expense.category.name),
      value: expense.percentage
    }));
  }

  return (
    <ChartCard title={t('charts.expenseChart')}>
      {error ? (
        <div className={'text-center'}>{t('helpers.noDataFound')}</div>
      ) : (
        <PieChart width={400} height={400}>
          <Pie
            data={chartData}
            cx={200}
            cy={200}
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={width > 900 ? 150 : 125}
            fill='#8884d8'
            dataKey='value'
          >
            {chartData.map((entry, index) => {
              return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
            })}
          </Pie>
          <Legend />
        </PieChart>
      )}
    </ChartCard>
  );
};
