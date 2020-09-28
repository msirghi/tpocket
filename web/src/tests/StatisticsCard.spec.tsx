import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import { StatisticCard } from '../components/card/StatisticCard';

describe('StatisticsCard component', () => {
  let component: ShallowWrapper;

  beforeEach(() => {
    component = shallow(
      <StatisticCard description={'description'} value={12} title={'title'}>
        <div>Children</div>
      </StatisticCard>
    );
  });

  it('should render properly', () => {
    expect(toJson(component)).toMatchSnapshot();
  });
});
