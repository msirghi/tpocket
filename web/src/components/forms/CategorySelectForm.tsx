import React from 'react';
import Chip from '@material-ui/core/Chip';
import { startCase } from 'lodash';

const categories = [
  {
    label: 'money',
  },
  {
    label: 'food',
  },
  {
    label: 'tech',
  },
  {
    label: 'presents',
  },
  {
    label: 'flowers',
  },
  {
    label: 'transport',
  }
];

export const CategorySelectForm: React.FC = () => {
  return (
    <div className='category-select-wrapper'>
      {categories.map((category, idx) => {
        return (
          <Chip color='default' onClick={() => {}} key={idx} label={startCase(category.label)} />
        );
      })}
    </div>
  );
};
