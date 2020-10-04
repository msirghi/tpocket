import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { PageHeader } from "../components/layout/PageHeader";
import { findByTestAttr } from "./utils/findByTestAttr";
import toJson from 'enzyme-to-json';

describe('PageHeader Component', () => {
  let component: ShallowWrapper;

  beforeEach(() => {
    component = shallow(<PageHeader primaryText={ 'Primary text' } secondaryText={ 'Secondary Text' }/>);
  });

  it('should render component properly', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('Wrapper has text-center class', () => {
    const wrapper = findByTestAttr(component, 'header-wrapper');
    expect(wrapper.hasClass('text-center')).toBeTruthy();
  });
});
