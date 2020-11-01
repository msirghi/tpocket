import { mount, shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { ApolloProvider } from '@apollo/react-hooks';
import toJson from 'enzyme-to-json';
import { BrowserRouter } from 'react-router-dom';
import { Register } from '../pages/Register';
import { AboutYouForm } from '../components/forms/AboutYouForm';
import { AdditionalInfoForm } from '../components/forms/AdditionalInfoForm';
require('jest-localstorage-mock');

describe('Register component', () => {
  let component: ShallowWrapper;
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([])
  });

  beforeAll(() => {});

  beforeEach(() => {
    component = shallow(<Register />);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should match the snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should decrypt on mount', () => {
    jest.mock('crypto-js', () => ({
      AES: {
        decrypt: jest.fn()
      }
    }));
    localStorage.setItem('tempId', 'someTempId');
    mount(
      <ApolloProvider client={client}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </ApolloProvider>
    );
    expect(localStorage.setItem).toHaveBeenLastCalledWith('tempId', 'someTempId');
    expect(localStorage.__STORE__['tempId']).toBe('someTempId');
  });

  it('should return component on valid current step', () => {
    localStorage.removeItem('tempId');
    const wrapper = shallow(
      <ApolloProvider client={client}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </ApolloProvider>
    );
    expect(localStorage.__STORE__['tempId']).toBe(undefined);
    expect(wrapper.find(AboutYouForm)).toHaveLength(0);
    expect(wrapper.find(AdditionalInfoForm)).toHaveLength(0);
  });
});
