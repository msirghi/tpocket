import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Category } from "../../generated/graphql";

interface IProps {
  open: boolean;
  toggleDialog: Function;
  onSubmit: Function;
  deselectCategory: Function;
  isLoading: boolean;
  selectedCategory: Category | null;
}

export const AddUpdateCategoryDialog: React.FC<IProps> = (
  {
    open,
    toggleDialog,
    onSubmit,
    isLoading,
    selectedCategory,
    deselectCategory
  }) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

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

  return (
    <div>
      <Dialog open={ open } onClose={ () => {
        deselectCategory();
        toggleDialog(false);
      } } aria-labelledby="form-dialog-title">
        { isLoading && <LinearProgress/> }
        <DialogTitle id="form-dialog-title">
          { selectedCategory ? 'Edit category' : 'Add new category' }
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            { selectedCategory ? 'Update your category.' : 'Enter some information about new category.' }
          </DialogContentText>
          <TextField
            value={ name }
            onChange={ e => setName(e.target.value) }
            margin="dense"
            id="name"
            label="Name"
            type="email"
            fullWidth
          />
          <TextField
            value={ description }
            onChange={ e => setDescription(e.target.value) }
            multiline
            rowsMax={ 4 }
            margin="dense"
            label="Description"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={ () => {
              deselectCategory();
              toggleDialog(false)
            } }
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            disabled={ name.length === 0 || isLoading }
            onClick={ () => {
              if (selectedCategory) {
                deselectCategory();
                return;
              }
              onSubmit({ name: name.trim(), description: description.trim() });
            } }
            color="primary"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
