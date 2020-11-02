import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

interface IProps {
  title: string;
  value: string | number;
  description: string;
  currency?: string;
}

const useStyles = makeStyles({
  title: {
    fontSize: 15,
  },
  pos: {
    marginBottom: 12,
  },
  value: {
    marginTop: 10
  }
});

export const StatisticCard: React.FC<IProps> = ({ title, value, description, currency }) => {
  const classes = useStyles();

  return (
    <div className={ 'full-width m-15 text-center mt-0' }>
      <Card>
        <CardContent>
          <Typography variant="subtitle1" component="h2">
            { title }
          </Typography>
          <Typography variant='subtitle2' color="textSecondary">
            { description }
          </Typography>
          <Typography variant="h4" component="h2" className={classes.value}>
            { value } { currency }
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
