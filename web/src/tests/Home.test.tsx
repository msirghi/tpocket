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
import { Home } from '../pages/Home';
import { SnackbarProvider } from 'notistack';
import { mount } from 'enzyme';

describe('Home component', () => {
  const mockClient = createMockClient();

  const getComponent = () => {
    return (
      <ApolloProvider client={mockClient}>
        <SnackbarProvider>
          <BrowserRouter>
            <Home />
          </BrowserRouter>
        </SnackbarProvider>
      </ApolloProvider>
    );
  };

  it('should match snapshot', () => {
    const component = mount(getComponent());
    expect(toJson(component)).toMatchSnapshot();
  });
});
