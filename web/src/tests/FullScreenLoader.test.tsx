import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { FullScreenLoader } from '../components/loaders/FullScreenLoader';
import { CircularProgress } from '@material-ui/core';

describe('FullScreenLoader component', () => {
  let component: ShallowWrapper;

  beforeEach(() => {
    component = shallow(<FullScreenLoader />);
  });

  it('should render CircularProgress', () => {
    expect(component.find(CircularProgress)).toHaveLength(1);
  });

  it('should have a size of 80', () => {
    expect(component.find(CircularProgress).props().size).toBe(80);
  });
});
