import { ApolloProvider } from '@apollo/react-hooks';
import { mount, ReactWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import { AddExpenseDialog } from '../components/dialogs/AddExpenseDialog';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-boost';
import Button from '@material-ui/core/Button';
import { findFirstByTestAttr } from './utils/findByTestAttr';
import { render, fireEvent } from '@testing-library/react';
import { Dialog, Select } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import { createMount } from '@material-ui/core/test-utils';
import { act } from 'react-test-renderer';

const defaultProps = {
  open: true,
  toggleDialog: jest.fn(),
  onSuccess: jest.fn(),
  categories: [
    {
      id: 1,
      name: 'Category name 1'
    }
  ]
};

const getClient = () => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([])
  });
};

describe('AddExpenseDialog component', () => {
  let component: ReactWrapper;

  beforeEach(() => {
    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: ApolloLink.from([])
    });
    component = mount(
      <ApolloProvider client={client}>
        <AddExpenseDialog {...defaultProps} />
      </ApolloProvider>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render dialog properly', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should fire prop method on cancel button click', () => {
    const buttons = component.find(Button);
    expect(buttons).toHaveLength(2);

    const cancelButton = findFirstByTestAttr(component, 'cancel-button');
    cancelButton.simulate('click');
    expect(defaultProps.toggleDialog).toBeCalledTimes(1);
  });

  it('should set an input value on change', () => {
    const { getAllByTestId } = render(
      <ApolloProvider client={getClient()}>
        <AddExpenseDialog {...defaultProps} />
      </ApolloProvider>
    );
    const nameInput = getAllByTestId('nameInput');
    const descriptionInput = getAllByTestId('description-input');
    fireEvent.change(nameInput[1], { target: { value: '1000' } });
    fireEvent.change(descriptionInput[1], { target: { value: 'Description' } });
    expect(nameInput[1]).toHaveValue(1000);
    expect(descriptionInput[1]).toHaveValue('Description');
  });

  it('should render select containing categories', () => {
    defaultProps.categories.push(
      {
        id: 2,
        name: 'Category name 2'
      },
      {
        id: 3,
        name: 'Category name 3'
      },
      {
        id: 4,
        name: 'Category name 4'
      },
      {
        id: 5,
        name: 'Category name 5 '
      },
      {
        id: 1,
        name: 'Category name 6'
      }
    );
    const wrapper = mount(
      <ApolloProvider client={getClient()}>
        <AddExpenseDialog {...defaultProps} />
      </ApolloProvider>
    );
    expect(wrapper.find(Select)).toHaveLength(1);
  });

  it('should render category chips', () => {
    const wrapper = mount(
      <ApolloProvider client={getClient()}>
        <AddExpenseDialog {...defaultProps} />
      </ApolloProvider>
    );
    const menuItems = wrapper.find(Chip);
    expect(menuItems).toHaveLength(5);
    menuItems.first().simulate('click');
    expect(menuItems.first().props().style!.background).toBe('#f5f5f5');
  });

  it('should render select on many categories', () => {
    let mount = createMount();
    const wrapper = mount(
      <ApolloProvider client={getClient()}>
        <AddExpenseDialog {...defaultProps} />
      </ApolloProvider>
    );
    const selector = wrapper.find(Select);
    act(() => {
      selector.prop('onChange')!({ target: { value: '10' } });
    });
    expect(selector).toHaveLength(1);
  });

  it('should close the dialog on backdrop', () => {
    const mount = createMount();
    const wrapper = mount(
      <ApolloProvider client={getClient()}>
        <AddExpenseDialog {...defaultProps} />
      </ApolloProvider>
    );
    const dialog = wrapper.find(Dialog);
    expect(dialog).toHaveLength(1);
    act(() => {
      dialog.simulate('keydown', { key: 'Escape', keyCode: 27, which: 27 });
      wrapper.update();
    });
    expect(defaultProps.toggleDialog).toBeCalled();
  });

  it('should submit the form', () => {
    const mount = createMount();
    const wrapper = mount(
      <ApolloProvider client={getClient()}>
        <AddExpenseDialog {...defaultProps} />
      </ApolloProvider>
    );
    const submitButton = findFirstByTestAttr(wrapper, 'submit-button');
    act(() => {
      submitButton.props().disabled = false;
      wrapper.update();
      submitButton.prop('onClick')!({ target: { value: '10' } });
      wrapper.update();
    });
    expect(submitButton).toHaveLength(1);
  });
});
