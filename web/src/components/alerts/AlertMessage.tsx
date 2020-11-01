import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import { AlertType } from '../../commons/enums';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(2)
      }
    }
  })
);

type Props = {
  type: AlertType;
  message: string;
};

export const AlertMessage: React.FC<Props> = ({ message, type }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Alert  severity={type} color={type}>
        {message}
      </Alert>
    </div>
  );
};
