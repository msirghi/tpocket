import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

interface IProps {
  name: string;
  description?: string;
  imageUrl?: string;
  onEdit: Function;
  onRemove: Function;
}

const useStyles = makeStyles({
  root: {
    minWidth: 345,
  },
  media: {
    height: 140,
  },
});

export const CategoryCard: React.FC<IProps> = ({name, imageUrl, onEdit, onRemove}) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={imageUrl}
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2" data-test={'card-name'}>
            {name}
          </Typography>
          {/*<Typography variant="body2" color="textSecondary" component="p">*/}
          {/*  Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging*/}
          {/*  across all continents except Antarctica*/}
          {/*</Typography>*/}
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" data-test={'card-edit'} onClick={() => onEdit()}>
          Edit
        </Button>
        <Button size="small" color="primary" data-test={'card-remove'} onClick={() => onRemove()}>
          Remove
        </Button>
      </CardActions>
    </Card>
  );
}
