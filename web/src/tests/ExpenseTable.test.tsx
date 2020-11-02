import React from 'react';
import { shallow } from 'enzyme';
import { ExpenseTable } from '../components/tables/ExpenseTable';
import toJson from 'enzyme-to-json';

describe('ExpenseTable component', () => {
  it('should render properly', () => {
    const component = shallow(<ExpenseTable />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
