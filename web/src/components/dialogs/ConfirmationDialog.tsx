import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';

interface IProps {
  open: boolean;
  toggleDialog: Function;
  onSubmit: () => void;
  isLoading: boolean;
  title: String;
}

export const ConfirmationDialog: React.FC<IProps> = (
  {
    open,
    toggleDialog,
    onSubmit,
    isLoading,
    title,
    children
  }) => {
  return (
    <div>
      <Dialog open={ open } onClose={ () => {
        toggleDialog(false);
      } } aria-labelledby="form-dialog-title">
        { isLoading && <LinearProgress/> }
        <DialogTitle id="form-dialog-title">
          { title }
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            { children }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={ () => {
              toggleDialog(false)
            } }
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={ onSubmit }
            color="primary"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
