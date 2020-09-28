import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { CategoryCard } from '../components/category/CategoryCard';
import { findByTestAttr } from './utils/findByTestAttr';
import toJson from 'enzyme-to-json';

describe('CategoryCard Component', () => {
  let component: ShallowWrapper;
  const onEdit = jest.fn();
  const onRemove = jest.fn();

  beforeEach(() => {
    component = shallow(
      <CategoryCard
        name={'Category card'}
        imageUrl={'some-link'}
        description={'description'}
        onEdit={onEdit}
        onRemove={onRemove}
      />
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should render category card', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should fire prop on edit button click', () => {
    const editButton = findByTestAttr(component, 'card-edit');
    editButton.simulate('click');
    expect(onEdit).toBeCalled();
  });

  it('should fire prop method on remove button click', () => {
    const editButton = findByTestAttr(component, 'card-remove');
    editButton.simulate('click');
    expect(onRemove).toBeCalledTimes(1);
  });
});
