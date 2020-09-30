import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '90vw',
      height: '90vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
  })
);

export const FullScreenLoader = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress size={80} />
    </div>
  );
};
