export const loggingPlugin = {
  requestDidStart(requestContext: any) {
    requestContext.request.query &&
      console.log(
        new Date().toUTCString(),
        '\x1b[32mQuery: ',
        requestContext.request.query.replace(/(\r\n|\n|\r)/gm, ' ')
      );
    requestContext.request.variables &&
      console.log('Query variables: ', requestContext.request.variables);
    console.log('\n');
    return {
      didEncounterErrors(requestContext: any) {
        console.error(
          '\x1b[31mError happened in response to query ' + requestContext.request.query
        );
        console.error(requestContext.errors);
      }
    };
  },

  willSendResponse(requestContext: any) {
    console.log('response sent', requestContext.response);
  }
};
