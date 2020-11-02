import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import { NoHomeData } from '../components/alerts/NoHomeData';

describe('NoHomeData component', () => {
  it('should render properly', () => {
    const component = shallow(<NoHomeData />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
