import React from 'react';
import { mount, ReactWrapper, ShallowWrapper } from 'enzyme';
import { Header } from '../components/layout/Header';
import toJson from 'enzyme-to-json';
import { Menu } from '@material-ui/core';
import { findFirstByTestAttr } from './utils/findByTestAttr';

describe('Header component', () => {
  let component: ReactWrapper;

  beforeEach(() => {
    component = mount(<Header />);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should match snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should fire Menu onClose method', () => {
    const menu = findFirstByTestAttr(component, 'main-menu');
    expect(menu).toHaveLength(1);

    menu.prop('onClose')();
    expect(menu.props().anchorEl).toBeNull();
  });

  it('should fire onClick on profile menu', () => {
    const menu = findFirstByTestAttr(component, 'profile-menu');
    menu.prop('onClick')({ currentTarget: {} });

    const mainMenu = findFirstByTestAttr(component, 'main-menu');
    jest.useFakeTimers();
    setTimeout(() => {
      expect(mainMenu.props().anchorEl).not.toBeNull();
    }, 400);
    jest.clearAllTimers();
  });

  it('should handle menu close of the right menu', () => {
    const menu = findFirstByTestAttr(component, 'right-menu');
    menu.prop('onClose')({ currentTarget: {} });

    const mainMenu = findFirstByTestAttr(component, 'main-menu');
    expect(mainMenu.props().anchorEl).toBeNull();
  });

  it('should handle mobile menu open', () => {
    const menu = findFirstByTestAttr(component, 'show-more');
    menu.prop('onClick')({ currentTarget: {} });

    const mainMenu = findFirstByTestAttr(component, 'main-menu');
    expect(mainMenu.props().anchorEl).toBeNull();
  });
});
