import { mount, ReactWrapper } from 'enzyme';
import React from 'react';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { ApolloProvider } from '@apollo/react-hooks';
import toJson from 'enzyme-to-json';
import { BrowserRouter } from 'react-router-dom';
import { render, fireEvent, act } from '@testing-library/react';
import { RegisterDocument } from '../generated/graphql';
import { createMockClient } from 'mock-apollo-client';
import { AboutYouForm } from '../components/forms/AboutYouForm';

describe('AboutYouForm component', () => {
  let component: ReactWrapper;
  const props = {
    handleNext: jest.fn(),
    setEncryptedUserId: jest.fn(),
    handleRegister: jest.fn()
  };
  const originalError = console.error;
  const mockClient = createMockClient();
  const mutationHandler = jest.fn().mockResolvedValue({
    data: {
      register: {
        id: 1
      }
    }
  });
  mockClient.setRequestHandler(RegisterDocument, mutationHandler);

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([])
  });

  const getRenderedComponent = (additionalProps: object, invalidVal = false) => {
    const mockClient = createMockClient();
    let mutationHandler;

    if (invalidVal) {
      mutationHandler = jest.fn().mockRejectedValue({
        graphQLErrors: [{ message: 'Error' }]
      });
    } else {
      mutationHandler = jest.fn().mockResolvedValue({
        data: {
          register: {
            id: '1'
          }
        }
      });
    }
    mockClient.setRequestHandler(RegisterDocument, mutationHandler);
    const finalProps = { ...props, ...additionalProps };
    return render(
      <ApolloProvider client={mockClient}>
        <BrowserRouter>
          <AboutYouForm {...finalProps} />
        </BrowserRouter>
      </ApolloProvider>
    );
  };

  afterAll(() => {
    console.error = originalError;
  });
  
  beforeAll(() => {
    console.error = jest.fn();
    component = mount(
      <ApolloProvider client={client}>
        <BrowserRouter>
          <AboutYouForm {...props} />
        </BrowserRouter>
      </ApolloProvider>
    );
    
    jest.mock('crypto-js', () => ({
      AES: {
        encrypt: () => ({
          toString: jest.fn()
        })
      }
    }));
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('should match snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should corretly submit the form', async () => {
    const props = { handleRegister: jest.fn() };
    const { getByTestId } = getRenderedComponent(props);
    const submitButton = getByTestId('submit-button');
    expect(submitButton).toBeInTheDocument();

    const firstNameInput = getByTestId('firstname-field');
    expect(firstNameInput).toBeInTheDocument();

    const lastNameInput = getByTestId('lastname-field');

    const emailInput = getByTestId('email-field');
    expect(emailInput).toBeInTheDocument();
    const passwordInput = getByTestId('password-field');
    expect(passwordInput).toBeInTheDocument();

    const repeatPasswordInput = getByTestId('repeatPassword-field');
    expect(repeatPasswordInput).toBeInTheDocument();

    const termsInput = getByTestId('terms-field');
    expect(repeatPasswordInput).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'mail@mail.com' } });
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      fireEvent.change(passwordInput, { target: { value: 'SomePassword123' } });
      fireEvent.change(repeatPasswordInput, { target: { value: 'SomePassword123' } });
      fireEvent.click(termsInput);
    });
    fireEvent.click(submitButton);
    expect(lastNameInput).toBeInTheDocument();
    expect(lastNameInput).toHaveValue('Doe');
  });

  it('should validate email', async () => {
    const { getByTestId } = getRenderedComponent({});
    const emailInput = getByTestId('email-field');
    expect(emailInput).toBeInTheDocument();

    const submitButton = getByTestId('submit-button');
    expect(submitButton).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'invalid' } });
    });
    expect(submitButton).toBeDisabled();
  });

  it('should validate first name and password', async () => {
    const { getByTestId } = getRenderedComponent({});
    const firstNameInput = getByTestId('firstname-field');
    const passwordInput = getByTestId('password-field');
    expect(firstNameInput).toBeInTheDocument();

    const submitButton = getByTestId('submit-button');
    expect(submitButton).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(firstNameInput, { target: { value: 'a' } });
      fireEvent.change(passwordInput, { target: { value: 'a' } });
    });
    expect(submitButton).toBeDisabled();
  });

  it('should throw an error on submit', async () => {
    const { getByTestId } = getRenderedComponent({}, true);
    const submitButton = getByTestId('submit-button');
    const firstNameInput = getByTestId('firstname-field');
    const lastNameInput = getByTestId('lastname-field');
    const emailInput = getByTestId('email-field');
    const passwordInput = getByTestId('password-field');
    const repeatPasswordInput = getByTestId('repeatPassword-field');
    const termsInput = getByTestId('terms-field');
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'mail@mail.com' } });
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      fireEvent.change(passwordInput, { target: { value: 'SomePassword123' } });
      fireEvent.change(repeatPasswordInput, { target: { value: 'SomePassword123' } });
      fireEvent.click(termsInput);
    });
    fireEvent.click(submitButton);
    expect(lastNameInput).toBeInTheDocument();
    expect(lastNameInput).toHaveValue('Doe');
    expect(mutationHandler).toBeCalledTimes(0);
  });
});
