import { shallow, ShallowWrapper } from 'enzyme';
import { ChartCard } from '../components/card/ChartCard';
import React from 'react';
import toJson from 'enzyme-to-json';

describe('ChartCard Component', () => {
  let component: ShallowWrapper;

  beforeEach(() => {
    component = shallow(
      <ChartCard title={'title'} >
        <div>Children</div>{' '}
      </ChartCard>
    );
  });

  it('should render chart card properly', () => {
    expect(toJson(component)).toMatchSnapshot();
  });
});
