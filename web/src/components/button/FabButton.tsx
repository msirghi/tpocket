import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Fab } from "@material-ui/core";

interface IProps {
  color: "inherit" | "default" | "primary" | "secondary" | undefined;
  label: string;
  onClick: Function;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper,
      width: 500,
      position: 'relative',
      minHeight: 200,
    },
    fab: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  }),
);

export const FabButton: React.FC<IProps> = ({ color, label, children, onClick }) => {
  const classes = useStyles();

  return (
    <Fab data-test={'fab-button'} aria-label={ label } className={ classes.fab } color={ color } onClick={ () => onClick() }>
      { children! }
    </Fab>
  );
}
