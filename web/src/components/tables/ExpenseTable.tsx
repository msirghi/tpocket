import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useDeleteExpenseByIdMutation, useGetLastUserExpensesQuery } from '../../generated/graphql';
import dateFormat from 'dateformat';
import { ConfirmationDialog } from '../dialogs/ConfirmationDialog';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { NoHomeData } from '../alerts/NoHomeData';

const useStyles = makeStyles({
  table: {
    minWidth: '100%'
  }
});

function createData(
  id: number,
  amount: number,
  name: string,
  description: string,
  date: string,
  actualId: number
) {
  return { id, amount, name, description, date, actualId };
}

let selectedId: number;

export const ExpenseTable: React.FC = () => {
  const classes = useStyles();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [deleteExpenseMutation] = useDeleteExpenseByIdMutation();
  const getLastExpenses = useGetLastUserExpensesQuery();
  const [isLoading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  if (getLastExpenses.loading) {
    return <div> Loading... </div>;
  }

  if (getLastExpenses.data?.getLastUserExpenses.length === 0) {
    return <NoHomeData />;
  }

  if (!getLastExpenses.data) {
    return <div />;
  }

  const rows = getLastExpenses.data.getLastUserExpenses.map(({ expense, category }, idx) =>
    createData(idx + 1, expense.amount, category.name, 'Description', expense.createdAt, expense.id)
  );

  const onRowSelect = (id: number) => {
    setDialogOpen(true);
    selectedId = id;
  };

  const onSubmit = async () => {
    setLoading(true);

    try {
      const response = await deleteExpenseMutation({
        variables: { id: selectedId }
      });

      if (response && response.data?.deleteExpenseById) {
        enqueueSnackbar(t('messages.expenseDeleted'), { variant: 'success' });
        selectedId = 0;
        setLoading(false);
        setDialogOpen(false);
        getLastExpenses.refetch();
      }
    } catch (e) {
      setLoading(false);
      enqueueSnackbar(t('messages.serverError'), { variant: 'error' });
    }
  };

  return (
    <>
      <ConfirmationDialog
        open={isDialogOpen}
        title={t('messages.expenseDelete')}
        toggleDialog={() => setDialogOpen(false)}
        isLoading={isLoading}
        onSubmit={onSubmit}
      >
        <div>{t('messages.expenseDeleteDescription')}</div>
      </ConfirmationDialog>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>{t('expenseTable.id')}</TableCell>
              <TableCell align='right'>{t('expenseTable.amount')}</TableCell>
              <TableCell align='right'>{t('expenseTable.category')}</TableCell>
              <TableCell align='right'>{t('expenseTable.description')}</TableCell>
              <TableCell align='right'>{t('expenseTable.date')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow hover key={row.name} onClick={() => onRowSelect(row.actualId)}>
                <TableCell component='th' scope='row'>
                  {row.id}
                </TableCell>
                <TableCell align='right'>{row.amount}</TableCell>
                <TableCell align='right'>{row.name}</TableCell>
                <TableCell align='right'>{row.description}</TableCell>
                <TableCell align='right'>{dateFormat(row.date, 'mmmm dS, h:MM TT')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
