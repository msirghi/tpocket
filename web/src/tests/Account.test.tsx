import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient, ApolloLink, InMemoryCache } from 'apollo-boost';
import { mount, ReactWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import { AccountContext } from '../context/AccountContext';
import { Account } from '../pages/Account';
import { AccountContextData } from './utils/contextData';

describe('Account component', () => {
  let component: ReactWrapper;

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([])
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    component = mount(
      <ApolloProvider client={client}>
        <SnackbarProvider>
          <AccountContext.Provider value={{ state: AccountContextData, dispatch: jest.fn() }}>
            <Account />
          </AccountContext.Provider>
        </SnackbarProvider>
      </ApolloProvider>
    );
  });

  it('should match snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });
});
