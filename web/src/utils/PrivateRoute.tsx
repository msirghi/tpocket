import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getAccessToken } from '../accessToken';

// @ts-ignore
export const PrivateRoute = ({ Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => (getAccessToken() ? <Component {...props} /> : <Redirect to='/login' />)}
  />
);
