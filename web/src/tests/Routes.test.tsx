import React from 'react';
import { mount } from 'enzyme';
import { Routes } from '../Routes';
import { MemoryRouter } from 'react-router';
import { Login } from '../pages/Login';
import { ApolloProvider } from '@apollo/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient, ApolloLink } from 'apollo-boost';
import { Register } from '../pages/Register';
import { Home } from '../pages/Home';
import { CategoryPage } from '../pages/CategoryPage';

const rrd = require('react-router-dom');
rrd.BrowserRouter = ({ children }: any) => <div>{children}</div>;

describe('Routes', () => {
  const getRoutes = (link: string) => {
    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: ApolloLink.from([])
    });
    return mount(
      <MemoryRouter initialEntries={[link]}>
        <ApolloProvider client={client}>
          <Routes />
        </ApolloProvider>
      </MemoryRouter>
    );
  };

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should render Login component', () => {
    expect(getRoutes('/login').find(Login)).toHaveLength(1);
  });

  it('should render Register component', () => {
    expect(getRoutes('/register').find(Register)).toHaveLength(1);
  });

  it('should render Home component', () => {
    expect(getRoutes('/home').find(Home)).toHaveLength(1);
  });

  it('should render CategoryPage component', () => {
    expect(getRoutes('/categories').find(CategoryPage)).toHaveLength(1);
  });
});
