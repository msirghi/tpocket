import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getAccessToken } from '../accessToken';

// @ts-ignore
export const NoAuthRoute = ({ Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => (getAccessToken() ? <Redirect to='/home' /> : <Component {...props} />)}
  />
);
