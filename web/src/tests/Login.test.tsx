import { mount, ReactWrapper } from 'enzyme';
import React from 'react';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { ApolloProvider } from '@apollo/react-hooks';
import { Login } from '../pages/Login';
import toJson from 'enzyme-to-json';
import { BrowserRouter } from 'react-router-dom';
import { findFirstByTestAttr } from './utils/findByTestAttr';
import { render, fireEvent, cleanup, wait } from '@testing-library/react';
import { LoginDocument } from '../generated/graphql';
import { createMockClient } from 'mock-apollo-client';
import { getAccessToken } from '../accessToken';

describe('Login component', () => {
  let component: ReactWrapper;

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([])
  });

  beforeEach(() => {
    component = mount(
      <ApolloProvider client={client}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </ApolloProvider>
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('should match snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should fire onChange on password field', () => {
    const input = findFirstByTestAttr(component, 'password-field');
    input.prop('onChange')({ target: { value: 'val' } });
    expect(input).toHaveLength(1);
  });

  it('should fire onChange on email field', () => {
    const input = findFirstByTestAttr(component, 'email-field');
    input.prop('onChange')({ target: { value: 'val' } });
    expect(input).toHaveLength(1);
  });

  it('should submit the form', () => {
    const emailField = findFirstByTestAttr(component, 'email-field');
    expect(emailField).toHaveLength(1);
    emailField.prop('onChange')({ target: { value: 'email@email.com' } });

    const passwordField = findFirstByTestAttr(component, 'password-field');
    expect(passwordField).toHaveLength(1);
    passwordField.prop('onChange')({ target: { value: 'Password123' } });

    const submitButton = findFirstByTestAttr(component, 'submit-button');
    expect(submitButton).toHaveLength(1);
    submitButton.simulate('click');
  });

  it('should submit the form and receive accessToken', async () => {
    const mockClient = createMockClient();
    const mutationHandler = jest.fn().mockResolvedValue({
      data: {
        login: {
          accessToken: ''
        }
      }
    });
    mockClient.setRequestHandler(LoginDocument, mutationHandler);
    const historyMock = { push: jest.fn() };
    const { getByTestId } = render(
      <ApolloProvider client={mockClient}>
        <BrowserRouter>
          <Login history={historyMock} />
        </BrowserRouter>
      </ApolloProvider>
    );

    const submitButton = getByTestId('submit-button');
    expect(submitButton).toBeInTheDocument();

    const emailInput = getByTestId('email-field');
    const passwordInput = getByTestId('password-field');

    fireEvent.change(emailInput, { target: { value: 'testemail@testemail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'SomePassword123' } });
    fireEvent.click(submitButton);
    await wait();
    expect(mutationHandler).toBeCalled();
    expect(historyMock.push).toBeCalled();
  });

  it('should not submit the form and if no accessToken exists', async () => {
    const mockClient = createMockClient();
    const mutationHandler = jest.fn().mockResolvedValue({});
    mockClient.setRequestHandler(LoginDocument, mutationHandler);
    const historyMock = { push: jest.fn() };
    const { getByTestId } = render(
      <ApolloProvider client={mockClient}>
        <BrowserRouter>
          <Login history={historyMock} />
        </BrowserRouter>
      </ApolloProvider>
    );

    const submitButton = getByTestId('submit-button');
    expect(submitButton).toBeInTheDocument();

    const emailInput = getByTestId('email-field');
    const passwordInput = getByTestId('password-field');

    fireEvent.change(emailInput, { target: { value: 'testemail@testemail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'SomePassword123' } });
    fireEvent.click(submitButton);
    await wait();
    expect(mutationHandler).toBeCalled();
  });

  it('should not set accessToken on submit error', async () => {
    const { getByTestId } = render(
      <ApolloProvider client={client}>
        <BrowserRouter>
          <Login history={{ push: jest.fn() }} />
        </BrowserRouter>
      </ApolloProvider>
    );

    const submitButton = getByTestId('submit-button');
    expect(submitButton).toBeInTheDocument();

    const emailInput = getByTestId('email-field');
    const passwordInput = getByTestId('password-field');

    fireEvent.change(emailInput, { target: { value: 'testemail@testemail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'SomePassword123' } });
    fireEvent.click(submitButton);
    await wait();
    expect(getAccessToken()).toBe('');
  });

  it('should not set accessToken on invalid email', async () => {
    const { getByTestId } = render(
      <ApolloProvider client={client}>
        <BrowserRouter>
          <Login history={{ push: jest.fn() }} />
        </BrowserRouter>
      </ApolloProvider>
    );

    const submitButton = getByTestId('submit-button');
    expect(submitButton).toBeInTheDocument();

    const emailInput = getByTestId('email-field');
    const passwordInput = getByTestId('password-field');

    fireEvent.change(emailInput, { target: { value: 'invalid' } });
    fireEvent.change(passwordInput, { target: { value: 'SomePassword123' } });
    fireEvent.click(submitButton);
    await wait();
    expect(getAccessToken()).toBe('');
  });

  it('should throw an error on submit', async () => {
    const mockClient = createMockClient();
    const mutationHandler = jest.fn().mockRejectedValueOnce({
      graphQLErrors: ['Error']
    });
    mockClient.setRequestHandler(LoginDocument, mutationHandler);

    const { getByTestId } = render(
      <ApolloProvider client={mockClient}>
        <BrowserRouter>
          <Login history={{ push: jest.fn() }} />
        </BrowserRouter>
      </ApolloProvider>
    );

    const submitButton = getByTestId('submit-button');
    expect(submitButton).toBeInTheDocument();

    const emailInput = getByTestId('email-field');
    const passwordInput = getByTestId('password-field');

    fireEvent.change(emailInput, { target: { value: 'testemail@testemail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'SomePassword123' } });
    fireEvent.click(submitButton);
    await wait();
    expect(mutationHandler).toBeCalled();
  });
});
