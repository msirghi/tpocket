import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { ConfirmationDialog } from '../components/dialogs/ConfirmationDialog';
import toJson from 'enzyme-to-json';
import { findFirstByTestAttr } from './utils/findByTestAttr';
import { Dialog } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';

describe('ConfirmationDialog component', () => {
  let component: ShallowWrapper;
  let defaultProps = {
    open: true,
    toggleDialog: jest.fn(),
    onSubmit: jest.fn(),
    isLoading: false,
    title: 'Some title'
  };

  beforeEach(() => {
    component = shallow(<ConfirmationDialog {...defaultProps} />);
  });

  it('should render properly', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should call toggleDialog on dialog close', () => {
    const cancelButton = findFirstByTestAttr(component, 'cancel-button');
    cancelButton.simulate('click');
    expect(defaultProps.toggleDialog).toBeCalledTimes(1);
  });

  it('should call onSubmit on submit button click', () => {
    const submitButton = findFirstByTestAttr(component, 'submit-button');
    submitButton.simulate('click');
    expect(defaultProps.onSubmit).toBeCalledTimes(1);
  });

  it('should call toggleDialog on dialog onClose event', () => {
    const dialog = component.find(Dialog);
    dialog.prop('onClose')();
    expect(defaultProps.toggleDialog).toBeCalledTimes(2);
  });

  it('should show LinearProgress if isLoading props is true', () => {
    const props = { ...defaultProps, isLoading: true };
    const wrapper = shallow(<ConfirmationDialog {...props} />);
    const linearProgress = wrapper.find(LinearProgress);
    expect(linearProgress).toHaveLength(1);
  });
});
