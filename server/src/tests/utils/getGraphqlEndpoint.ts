import 'dotenv/config';

const getGraphqlEndpoint = () => `${ process.env.SERVER_IP }:${ process.env.SERVER_PORT }${ process.env.GRAPHQL_ENDPOINT }`

module.exports = getGraphqlEndpoint;
