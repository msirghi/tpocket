import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient, ApolloLink, InMemoryCache } from 'apollo-boost';
import { mount, ReactWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AccountEditForm } from '../components/forms/AccountEditForm';
import { UpdateUserDocument } from '../generated/graphql';
import { render, fireEvent, act } from '@testing-library/react';
import { createMockClient } from 'mock-apollo-client';
import { AccountContext } from '../context/AccountContext';
import { AccountContextData } from './utils/contextData';
import ValidationService from '../utils/ValidationService';

describe('AccountEditForm component', () => {
  let mutationHandler;
  let component: ReactWrapper;
  const dispatchMock = jest.fn();

  const defaultProps = {
    firstName: 'John',
    lastName: 'Doe',
    currency: 'USD',
    email: 'email@email.com',
    monthLimit: 1000
  };

  beforeAll(() => {
    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: ApolloLink.from([])
    });
    component = mount(
      <ApolloProvider client={client}>
        <SnackbarProvider>
          <AccountEditForm {...defaultProps} />
        </SnackbarProvider>
      </ApolloProvider>
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  const getRenderedComponent = (invalidVal = false) => {
    const mockClient = createMockClient();
    mutationHandler = jest.fn().mockResolvedValue({
      data: {
        updateUserPreference: true
      }
    });
    mockClient.setRequestHandler(UpdateUserDocument, mutationHandler);
    return render(
      <ApolloProvider client={mockClient}>
        <BrowserRouter>
          <AccountContext.Provider value={{ state: AccountContextData, dispatch: dispatchMock }}>
            <SnackbarProvider>
              <AccountEditForm {...defaultProps} />
            </SnackbarProvider>
          </AccountContext.Provider>
        </BrowserRouter>
      </ApolloProvider>
    );
  };

  it('should match snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should have proper initial values', () => {
    const { getByTestId } = getRenderedComponent();

    const submitButton = getByTestId('submit-button');
    expect(submitButton).toBeInTheDocument();

    const emailField = getByTestId('email-field');
    expect(emailField).toBeInTheDocument();

    const lastNameField = getByTestId('lastname-field');
    expect(lastNameField).toBeInTheDocument();

    const firstNameField = getByTestId('firstName-field');
    expect(firstNameField).toBeInTheDocument();

    const monthlimitField = getByTestId('monthlimit-field');
    expect(monthlimitField).toBeInTheDocument();

    const currencySelector = getByTestId('currency-selector');
    expect(currencySelector).toBeInTheDocument();

    expect(emailField).toHaveValue(defaultProps.email);
    expect(emailField).toBeDisabled();
    expect(lastNameField).toHaveValue(defaultProps.lastName);
    expect(firstNameField).toHaveValue(defaultProps.firstName);
    expect(monthlimitField).toHaveValue(defaultProps.monthLimit);
    expect(currencySelector).toHaveValue(defaultProps.currency);
  });

  it('should not submit the form if not all fields are valid', async () => {
    const { getByTestId } = getRenderedComponent();

    const submitButton = getByTestId('submit-button');
    const monthlimitField = getByTestId('monthlimit-field');
    expect(monthlimitField).toBeInTheDocument();
    await act(async () => {
      fireEvent.change(monthlimitField, { target: { value: -0 } });
    });
    expect(submitButton).toBeDisabled();
  });

  it('should submit the form if all fields are valid', async () => {
    const { getByTestId } = getRenderedComponent();

    const submitButton = getByTestId('submit-button');
    expect(submitButton).toBeEnabled();

    await act(async () => {
      fireEvent.click(submitButton);
    });
    expect(dispatchMock).toBeCalled();
  });

  it('shoud validate input value on firstName input', async () => {
    const { getByTestId } = getRenderedComponent();

    const submitButton = getByTestId('submit-button');
    expect(submitButton).toBeEnabled();

    const firstNameField = getByTestId('firstName-field');
    expect(firstNameField).toBeInTheDocument();
    jest.spyOn(ValidationService, 'validateName');

    await act(async () => {
      fireEvent.change(firstNameField, { target: { value: 'I' } });
    });
    expect(ValidationService.validateName).toBeCalled();
    expect(submitButton).toBeDisabled();
  });

  it('shoud validate input value on lastName input', async () => {
    const { getByTestId } = getRenderedComponent();

    const submitButton = getByTestId('submit-button');
    expect(submitButton).toBeEnabled();

    const lastNameField = getByTestId('lastname-field');
    expect(lastNameField).toBeInTheDocument();
    jest.spyOn(ValidationService, 'validateName');

    await act(async () => {
      fireEvent.change(lastNameField, { target: { value: 'I' } });
    });
    expect(ValidationService.validateName).toBeCalled();
    expect(submitButton).toBeDisabled();
  });

  it('should disable submitButton on click', async () => {
    const { getByTestId } = getRenderedComponent();

    const submitButton = getByTestId('submit-button');
    expect(submitButton).toBeEnabled();

    await act(async () => {
      fireEvent.click(submitButton);
    });
    expect(submitButton).toHaveTextContent('forms.account.submitButtonLabel');
  });
});
