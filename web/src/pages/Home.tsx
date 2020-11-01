import React, { useState } from 'react';
import {
  PercentageByCategoryPayload,
  useGetCategoryExpenseStatisticsByUserQuery,
  MonthExpensesPayload,
  useCategoryByUserQuery,
  AddExpenseMutationResult
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
import { useHistory } from 'react-router-dom';
import { AddExpenseDialog } from '../components/dialogs/AddExpenseDialog';
import { useSnackbar } from 'notistack';
import ExtensionService from '../utils/ExtensionService';

export type MonthlyStatistics = {
  thisMonthExpenses?: MonthExpensesPayload;
  monthWithMaxExpenses?: MonthExpensesPayload;
  monthWithMinExpenses?: MonthExpensesPayload;
};

export const Home: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const categoryQuery = useCategoryByUserQuery();
  const { data, loading, refetch } = useGetCategoryExpenseStatisticsByUserQuery();
  const [expenseDialogOpen, setExpenseDialogOpen] = useState<boolean>(false);
  const [mostUsedCategory, setMostUsedCategory] = useState<PercentageByCategoryPayload | null>(
    null
  );
  const [monthlyStatistics, setMonthlyStatistics] = useState<MonthlyStatistics>();
  const history = useHistory();

  const mostUsedCategoryHandler = (category: PercentageByCategoryPayload) => {
    setMostUsedCategory(category);
  };

  const monthlyStatisticsHandler = (statistics: MonthlyStatistics) => {
    console.log('statistics :>> ', statistics);
    if (statistics && statistics.thisMonthExpenses) {
      setMonthlyStatistics(statistics);
    }
  };

  const expenseAddHandler = (response: AddExpenseMutationResult) => {
    enqueueSnackbar('Expense added.');
    setExpenseDialogOpen(false);
    const stats = monthlyStatistics;
    if (stats) {
      refetch();
      stats.thisMonthExpenses!.expenses += response.data!.addExpense.expense.amount;
      setMonthlyStatistics(stats);
    }
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
        leftClickHandler={() => setExpenseDialogOpen(true)}
        rightClickHandler={() => history.push('/categories')}
      />
    );
  };

  const expenseDialog = () => {
    return (
      expenseDialogOpen && (
        <AddExpenseDialog
          open={expenseDialogOpen}
          toggleDialog={() => setExpenseDialogOpen(false)}
          onSuccess={expenseAddHandler}
          categories={categoryQuery.data ? categoryQuery.data.getCategoryByUser : []}
        />
      )
    );
  };

  if (!data || !data.getCategoryExpenseStatisticsByUser.totalExpenses || !categoryQuery.data) {
    return (
      <>
        {expenseDialog()}
        <NoHomeData />
        {getRowButtons()}
      </>
    );
  }

  return (
    <>
      {expenseDialogOpen && expenseDialog()}

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
                  monthlyStatistics && monthlyStatistics.monthWithMaxExpenses
                    ? ExtensionService.getMonthName(+monthlyStatistics.monthWithMaxExpenses!.name)
                    : '0'
                }
                value={monthlyStatistics ? monthlyStatistics.monthWithMaxExpenses!.expenses : '0'}
                description={'Max month expenses'}
              />
              <StatisticCard
                title={
                  monthlyStatistics
                    ? ExtensionService.getMonthName(+monthlyStatistics.monthWithMinExpenses!.name)
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
