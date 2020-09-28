import React from 'react';
import { Grid, TextField } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

interface IProps {
  onClose: Function;
  onChange: Function;
  resultCount: number;
  resultCountShown: boolean;
}

export const CategorySearch: React.FC<IProps> = ({ onClose, onChange, resultCount, resultCountShown }) => {
  return (
    <>
      <Grid container spacing={ 1 } alignItems="flex-end" justify={ 'center' } className={ 'pb-15' }>
        <Grid item>
          <TextField
            data-test={'category-name-field'}
            // autoFocus
            onChange={ (e) => onChange(e) }
            style={ { width: 300 } }
            label="Category name"
          />
        </Grid>
        <Grid item>
          <CloseIcon data-test={'close-icon'} onClick={ () => onClose() }/>
        </Grid>
      </Grid>
      { resultCountShown && resultCount >= 0 && <div className={ 'text-center' }>
        <Typography variant="subtitle1" gutterBottom data-test={'result-counter'}>
          { resultCount } results found.
        </Typography>
      </div> }
    </>
  );
}
