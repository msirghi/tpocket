import React from 'react';
import Chip from '@material-ui/core/Chip';
import { startCase } from 'lodash';
import { useTheme } from '@material-ui/core/styles';

const categories = [
  {
    label: 'money'
  },
  {
    label: 'food'
  },
  {
    label: 'technology'
  },
  {
    label: 'presents'
  },
  {
    label: 'subscriptions'
  },
  {
    label: 'transport'
  }
];

type Props = {
  onCategorySelect: (category: string) => void;
  selectedCategories: string[];
};

export const CategorySelectForm: React.FC<Props> = ({ onCategorySelect, selectedCategories }) => {
  const theme = useTheme();

  return (
    <div className='category-select-wrapper'>
      {categories.map((category, idx) => {
        const selected = selectedCategories.includes(category.label);
        return (
          <Chip
            data-testid='chip-option'
            style={{
              backgroundColor: selected ? theme.palette.primary.main : '#f3f3f3',
              color: selected ? '#fff' : 'initial'
            }}
            onClick={() => onCategorySelect(category.label)}
            key={idx}
            label={startCase(category.label)}
          />
        );
      })}
    </div>
  );
};
