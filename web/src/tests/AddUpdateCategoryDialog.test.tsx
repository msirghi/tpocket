import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { AddUpdateCategoryDialog } from '../components/dialogs/AddUpdateCategoryDialog';
import toJson from 'enzyme-to-json';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { ApolloProvider } from '@apollo/react-hooks';
import { SnackbarProvider } from 'notistack';
import { findFirstByTestAttr } from './utils/findByTestAttr';
import { Category } from '../generated/graphql';
import { Dialog, DialogContentText, DialogTitle, LinearProgress } from '@material-ui/core';

type Props = {
  open: boolean;
  toggleDialog: Function;
  onSubmit: Function;
  deselectCategory: Function;
  isLoading: boolean;
  selectedCategory: Category | null;
};

describe('AddUpdateCategoryDialog component', () => {
  let component: ReactWrapper;

  const defaultProps: Props = {
    open: true,
    toggleDialog: jest.fn(),
    onSubmit: jest.fn(),
    deselectCategory: jest.fn(),
    isLoading: false,
    selectedCategory: null
  };

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([])
  });

  const getComponentWithProps = (props: Props) => {
    return mount(
      <ApolloProvider client={client}>
        <SnackbarProvider>
          <AddUpdateCategoryDialog {...props} />
        </SnackbarProvider>
      </ApolloProvider>
    );
  };

  beforeEach(() => {
    component = mount(
      <ApolloProvider client={client}>
        <SnackbarProvider>
          <AddUpdateCategoryDialog {...defaultProps} />
        </SnackbarProvider>
      </ApolloProvider>
    );
  });
  
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should match snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should fire a method on submit button click', () => {
    const submitButton = findFirstByTestAttr(component, 'submit-button');
    submitButton.prop('onClick')();
    expect(defaultProps.onSubmit).toBeCalledTimes(1);
  });

  it('should fire a method on cancel button click', () => {
    const cancelButton = findFirstByTestAttr(component, 'cancel-button');
    cancelButton.prop('onClick')();
    expect(defaultProps.toggleDialog).toBeCalledTimes(1);
  });

  it('should fire deselect category on cancel button click', () => {
    const props = { ...defaultProps };
    props.selectedCategory = { id: 1, name: 'Selected' } as Category;
    const wrapper = getComponentWithProps(props);
    const cancelButton = findFirstByTestAttr(wrapper, 'cancel-button');
    cancelButton.prop('onClick')();
    expect(props.deselectCategory).toBeCalled();
  });

  it('should fire deselect category on submit button click', () => {
    const props = { ...defaultProps };
    props.selectedCategory = { id: 1, name: 'Selected' } as Category;
    props.deselectCategory = jest.fn();
    const wrapper = getComponentWithProps(props);

    const submitButton = findFirstByTestAttr(wrapper, 'submit-button');
    submitButton.props().disabled = false;
    submitButton.prop('onClick')();
    expect(props.deselectCategory).toBeCalled();
  });

  it('should fire Dialog onClose method', () => {
    const dialog = component.find(Dialog);
    expect(dialog).toHaveLength(1);

    dialog.prop('onClose')();
    expect(defaultProps.deselectCategory).toBeCalled();
    expect(defaultProps.toggleDialog).toBeCalledWith(false);
  });

  it('should show loader if loading', () => {
    const props = { ...defaultProps };
    props.isLoading = true;
    const wrapper = getComponentWithProps(props);
    const loader = wrapper.find(LinearProgress);
    expect(loader).toHaveLength(1);
  });

  it('should have specific title if category is not selected', () => {
    const dialogTitle = component.find(DialogTitle);
    expect(dialogTitle).toHaveLength(1);
    expect(dialogTitle.text()).toContain('Add new category');
  });

  it('should have specific title if category is selected', () => {
    const props = { ...defaultProps };
    props.selectedCategory = { id: 1, name: 'Selected' } as Category;
    const wrapper = getComponentWithProps(props);
    const dialogTitle = wrapper.find(DialogTitle);
    expect(dialogTitle).toHaveLength(1);
    expect(dialogTitle.text()).toContain('Edit category');
  });

  it('should have specific DialogContentText if category is not selected', () => {
    const dialogContentText = component.find(DialogContentText);
    expect(dialogContentText).toHaveLength(1);
    expect(dialogContentText.text()).toContain('Enter some information about new category.');
  });

  it('should have specific DialogContentText if category is selected', () => {
    const props = { ...defaultProps };
    props.selectedCategory = { id: 1, name: 'Selected' } as Category;
    const wrapper = getComponentWithProps(props);
    const dialogContentText = wrapper.find(DialogContentText);
    expect(dialogContentText).toHaveLength(1);
    expect(dialogContentText.text()).toContain('Update your category.');
  });

  it('should fire onChange on name input change', () => {
    const input = findFirstByTestAttr(component, 'name-input');
    input.prop('onChange')({ target: { value: 'name' } });
    expect(input).toHaveLength(1);
  });

  it('should fore onChange on description input change', () => {
    const input = findFirstByTestAttr(component, 'description-input');
    input.prop('onChange')({ target: { value: 'name' } });
    expect(input).toHaveLength(1);
  });
});
