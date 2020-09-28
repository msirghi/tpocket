import React from 'react';
import {shallow, ShallowWrapper} from 'enzyme';
import { FabButton } from "../components/button/FabButton";
import { findByTestAttr } from "./utils/findByTestAttr";
import toJson from 'enzyme-to-json';

describe('FabButton component', () => {
  let component: ShallowWrapper;
  const onClick = jest.fn();

  beforeEach(() => {
    component = shallow(<FabButton color={'primary'} label={'Fab button'} onClick={onClick} />);
  });

  it('should render fab button', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should fire prop method on click', () => {
    const button = findByTestAttr(component, 'fab-button');
    button.simulate('click');
    expect(onClick).toBeCalledTimes(1);
  });
});
