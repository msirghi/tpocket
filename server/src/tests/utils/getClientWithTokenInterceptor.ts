import { GraphQLClient, request } from 'graphql-request';
import { getLoginMutation } from '../userResolver.test';

const getGraphqlEndpoint = require('./getGraphqlEndpoint');

let login = '';
let password = '';

export const setTestCreds = (email: string, pass: string) => {
  login = email;
  password = pass;
};

export const getClientWithTokenInterceptor = async () => {
  const loginResponse = await request(getGraphqlEndpoint(), getLoginMutation(login, password));
  let token = loginResponse.login.accessToken;

  return new GraphQLClient(getGraphqlEndpoint(), {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};
