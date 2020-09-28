import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { TwoRowButtons } from '../components/button/TwoRowButtons';
import { findByTestAttr } from './utils/findByTestAttr';
import AcUnitIcon from '@material-ui/icons/AcUnit';
import toJson from 'enzyme-to-json';

describe('TwoRowButton Component', () => {
  let component: ShallowWrapper;
  const leftClickHandler = jest.fn();
  const rightClickHandler = jest.fn();

  beforeEach(() => {
    component = shallow(
      <TwoRowButtons
        buttonWidth={150}
        leftIcon={<AcUnitIcon data-test={'left-icon'} />}
        rightIcon={<AcUnitIcon data-test={'right-icon'} />}
        leftLabel={'Left label'}
        rightLabel={'Right label'}
        leftClickHandler={leftClickHandler}
        rightClickHandler={rightClickHandler}
      />
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should render properly', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should fire leftClickHandler on left button click', () => {
    const button = findByTestAttr(component, 'left-button');
    button.simulate('click');
    expect(leftClickHandler).toBeCalledTimes(1);
  });

  it('Should click right button and display message in console', () => {
    const button = findByTestAttr(component, 'right-button');
    button.simulate('click');
    expect(rightClickHandler).toBeCalledTimes(1);
  });

  it('Should render an icon for the buttons', () => {
    const left = findByTestAttr(component, 'left-icon');
    expect(typeof left).toBe('object');
    const right = findByTestAttr(component, 'right-icon');
    expect(typeof right).toBe('object');
  });
});
