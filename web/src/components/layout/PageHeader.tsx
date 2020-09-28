import React from 'react';
import Typography from '@material-ui/core/Typography';

interface IProps {
  primaryText: string;
  secondaryText?: string;
}

export const PageHeader: React.FC<IProps> = ({ primaryText, secondaryText }) => {

  return (
    <div className={'text-center'} data-test={'header-wrapper'}>
      <Typography data-test={'primary-text'} variant="h5" component="h5" gutterBottom>
        { primaryText }
      </Typography>

      <Typography data-test={'secondary-text'} variant="subtitle1" gutterBottom>
        {secondaryText}
      </Typography>
    </div>
  );
}
