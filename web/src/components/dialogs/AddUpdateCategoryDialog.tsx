import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Category, useUpdateCategoryNameMutation } from '../../generated/graphql';
import { useSnackbar } from 'notistack';

interface IProps {
  open: boolean;
  toggleDialog: Function;
  onSubmit: Function;
  deselectCategory: Function;
  isLoading: boolean;
  selectedCategory: Category | null;
}

export const AddUpdateCategoryDialog: React.FC<IProps> = ({
  open,
  toggleDialog,
  onSubmit,
  isLoading,
  selectedCategory,
  deselectCategory
}) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [updateCategoryName] = useUpdateCategoryNameMutation();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!open) {
      setName('');
      setDescription('');
    }
  }, [open]);

  useEffect(() => {
    if (selectedCategory) {
      setName(selectedCategory.name);
    }
  }, [selectedCategory]);

  const onUpdateCategoryName = async () => {
    try {
      const response = await updateCategoryName({ variables: { id: selectedCategory!.id, name } });
      if (response && response.data?.updateCategoryName) {
        enqueueSnackbar('Category updated', { variant: 'success' });
      }
    } catch (e) {
      enqueueSnackbar(e.graphQLErrors[0].message, { variant: 'error' });
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => {
          deselectCategory();
          toggleDialog(false);
        }}
        aria-labelledby='form-dialog-title'
      >
        {isLoading && <LinearProgress />}
        <DialogTitle id='form-dialog-title'>
          {selectedCategory ? 'Edit category' : 'Add new category'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedCategory
              ? 'Update your category.'
              : 'Enter some information about new category.'}
          </DialogContentText>
          <TextField
            data-test='name-input'
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin='dense'
            id='name'
            label='Name'
            type='email'
            fullWidth
          />
          <TextField
            data-test='description-input'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rowsMax={4}
            margin='dense'
            label='Description'
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            data-test='cancel-button'
            onClick={() => {
              deselectCategory();
              toggleDialog(false);
            }}
            color='secondary'
          >
            Cancel
          </Button>
          <Button
            data-test='submit-button'
            disabled={name.length === 0 || isLoading}
            onClick={async () => {
              if (selectedCategory) {
                toggleDialog();
                deselectCategory();
                await onUpdateCategoryName();
                return;
              }
              onSubmit({ name: name.trim(), description: description.trim() });
            }}
            color='primary'
          >
            {selectedCategory ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
