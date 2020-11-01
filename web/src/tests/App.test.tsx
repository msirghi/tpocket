import { shallow, ShallowWrapper, mount } from 'enzyme';
import { App } from '../App';
import React from 'react';
import { FullScreenLoader } from '../components/loaders/FullScreenLoader';
import toJson from 'enzyme-to-json';

describe('App component', () => {
  let component: ShallowWrapper;

  afterAll(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    component = shallow(<App />);
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
    mount(<App />);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://localhost:4000/refresh_token', {
      credentials: 'include',
      method: 'POST'
    });
  });

  it('should fire window.location.replace on page render and access token null', () => {
    window.location.href = 'page';
    fetch.mockResponseOnce(JSON.stringify({ accessToken: null }));
    jest.spyOn(window.location, 'replace');

    mount(<App />);
    spyOn(window.location, 'replace');
    expect(fetch).toHaveBeenCalled();
    expect(jest.isMockFunction(window.location.replace)).toBe(true);
  });
});
