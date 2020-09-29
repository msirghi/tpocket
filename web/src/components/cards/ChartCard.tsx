import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

interface IProps {
  title: string;
}

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'center',
    width: '-webkit-fill-available',
    flex: '1 1 100%',
    alignSelf: 'flex-start'
  },
});

export const ChartCard: React.FC<IProps> = ({ children, title }) => {
  const classes = useStyles();

  return (
    <Card className={ classes.root }>
      <CardContent>
        <Typography className={'card-title'} align={'center'} variant="h5" component="h2">
          { title }
        </Typography>
        { children }
      </CardContent>
    </Card>
  );
}
