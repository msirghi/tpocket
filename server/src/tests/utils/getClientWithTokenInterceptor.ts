import { GraphQLClient, request } from 'graphql-request';
import { loginMutation } from './mutations';

const getGraphqlEndpoint = require('./getGraphqlEndpoint');

let login = '';
let password = '';
let token = '';
let email = '';

export const setTestCreds = (email: string, pass: string) => {
  login = email;
  password = pass;
};

export const getClientWithTokenInterceptor = async () => {
  const loginResponse = await request(getGraphqlEndpoint(), loginMutation(login, password));
  token = loginResponse.login.accessToken;

  return new GraphQLClient(getGraphqlEndpoint(), {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const getAccessToken = () => {
  return token;
};

export const setEmail = (e: string) => {
  email = e;
};

export const getEmail = () => {
  return email;
};
