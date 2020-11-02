import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Category, useAddExpenseMutation } from '../../generated/graphql';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { startCase } from 'lodash';
import { useTheme } from '@material-ui/core/styles';
import { AlertMessage } from '../alerts/AlertMessage';
import { AlertType } from '../../commons/enums';

interface IProps {
  open: boolean;
  toggleDialog: Function;
  onSuccess: Function;
  categories: ({ __typename?: 'Category' | undefined } & Pick<Category, 'id' | 'name'>)[];
}

export const AddExpenseDialog: React.FC<IProps> = ({
  open,
  toggleDialog,
  categories,
  onSuccess
}) => {
  const theme = useTheme();
  const [addExpenseMutation] = useAddExpenseMutation();
  const [amount, setAmount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<number>(0);

  const onSubmit = async () => {
    if (amount && amount < 0) {
      setError('Amount cannot be negative.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const response = await addExpenseMutation({
        variables: { amount: amount!, categoryId: selectedCategory }
      });
      onSuccess(response);
      toggleDialog(false);
      setLoading(false);
    } catch (e) {
      setError(e);
      setLoading(false);
    }
  };

  const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedCategory(event.target.value as number);
  };

  return (
    <div>
      <Dialog open={open} onClose={() => toggleDialog(false)} aria-labelledby='form-dialog-title'>
        {isLoading && <LinearProgress />}
        <DialogTitle id='form-dialog-title'>Add new expense</DialogTitle>
        <DialogContent>
          {error && (
            <div data-test='error-alert' style={{ marginBottom: '1rem' }}>
              <AlertMessage message={'Error'} type={AlertType.ERROR} />
            </div>
          )}
          <TextField
            data-testid='nameInput'
            data-test='amount-input'
            label='Amount'
            inputProps={{
              'data-testid': 'nameInput'
            }}
            type='number'
            onChange={(e) => setAmount(+e.target.value)}
            fullWidth
          />
          <TextField
            data-test='description-input'
            inputProps={{
              'data-testid': 'description-input'
            }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rowsMax={4}
            margin='dense'
            label='Description'
            fullWidth
          />
          <div className={'mt-1'}>
            <DialogContentText>Category</DialogContentText>
            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
              {categories.map(
                (category, idx) =>
                  idx < 5 && (
                    <Chip
                      style={{
                        background:
                          selectedCategory === category.id ? theme.palette.primary.main : '#f5f5f5',
                        color: selectedCategory === category.id ? '#fff' : '#000'
                      }}
                      onClick={() => setSelectedCategory(category.id)}
                      label={startCase(category.name)}
                      key={category.id}
                    />
                  )
              )}
            </div>

            {categories.length > 5 && (
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                inputProps={{
                  'data-testid': 'category-select'
                }}
                fullWidth
                data-testid={'category-select'}
                className={'mt-1'}
                value={selectedCategory || ''}
                onChange={handleSelectChange}
              >
                {categories.map(
                  (category, idx) =>
                    idx > 4 && (
                      <MenuItem data-test='menu-item' key={category.id} value={category.id}>
                        {startCase(category.name)}
                      </MenuItem>
                    )
                )}
              </Select>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              toggleDialog(false);
            }}
            data-test='cancel-button'
            color='secondary'
          >
            Cancel
          </Button>
          <Button
            data-testid='submit'
            disabled={!amount || isLoading}
            onClick={onSubmit}
            color='primary'
            data-test='submit-button'
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
