import React from 'react';
import Typography from '@material-ui/core/Typography';

export const NoHomeData: React.FC = () => {
  return (
    <div className='no-data-wrapper'>
      <img
        height={200}
        src='https://www.pinclipart.com/picdir/big/220-2203662_man-with-smartphone-illustration-smartphone-person-dribbble-clipart.png'
        alt='No data'
      />
      <div className='mt-5rem text-center'>
        <Typography gutterBottom variant='h6' component='h5'>
          Look like you don't have any data.
        </Typography>
        <Typography gutterBottom variant='body1' component='h5'>
          Try adding categories & expenses to see the statistics.
        </Typography>
      </div>
    </div>
  );
};
