import { GraphQLClient, request } from "graphql-request";
import { getLoginMutation } from "../userResolver.test";

const getGraphqlEndpoint = require('./getGraphqlEndpoint');

export const getClientWithTokenInterceptor = async () => {
  const loginResponse = await request(getGraphqlEndpoint(), getLoginMutation('bob', 'bob'));
  let token = loginResponse.login.accessToken;

  return new GraphQLClient(getGraphqlEndpoint(), {
    headers: {
      Authorization: `Bearer ${ token }`
    }
  });
}
