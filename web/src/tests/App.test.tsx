import { mount } from 'enzyme';
import { App } from '../App';
import React from 'react';
import { FullScreenLoader } from '../components/loaders/FullScreenLoader';
import toJson from 'enzyme-to-json';
import { AccountContext, AccountProvider } from '../context/AccountContext';
import { ApolloClient, ApolloLink, InMemoryCache } from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { AccountContextData } from './utils/contextData';

describe('App component', () => {
  let component: any;
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([])
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    component = mount(
      <AccountContext.Provider value={{ state: AccountContextData, dispatch: jest.fn() }}>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </AccountContext.Provider>
    );
  });

  it('should make a snaphost of a loader on initial rendering', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should show FullScreenLoader component on loading', () => {
    const loader = component.find(FullScreenLoader);
    expect(loader).toHaveLength(1);
  });

  it('should perform a request on page load', async () => {
    fetch.mockResponseOnce(JSON.stringify({ accessToken: 'accessToken' }));
    mount(
      <AccountContext.Provider value={{ state: AccountContextData, dispatch: jest.fn() }}>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </AccountContext.Provider>
    );
    expect(fetch).toBeCalled();
    expect(fetch).toHaveBeenCalledWith('http://localhost:4000/refresh_token', {
      credentials: 'include',
      method: 'POST'
    });
  });

  it('should fire window.location.replace on page render and access token null', () => {
    window.location.href = 'page';
    fetch.mockResponseOnce(JSON.stringify({ accessToken: null }));
    jest.spyOn(window.location, 'replace');

    mount(
      <AccountProvider>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </AccountProvider>
    );
    spyOn(window.location, 'replace');
    expect(fetch).toHaveBeenCalled();
    expect(jest.isMockFunction(window.location.replace)).toBe(true);
  });
});
