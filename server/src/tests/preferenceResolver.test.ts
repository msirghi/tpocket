import { GraphQLClient } from "graphql-request";
import { changeUserCurrencyMutation, deletePrefsMutation, initPrefsMutation } from "./utils/mutations";
import { getUserPreferencesQuery } from "./utils/queries";
import { getClientWithTokenInterceptor } from "./utils/getClientWithTokenInterceptor";

const Chance = require('chance');

export const preferenceResolverTest = () => describe('Preference resolver', () => {
  const chance = new Chance();
  let client: GraphQLClient;
  let currency: string;

  beforeAll(async () => {
    currency = chance.word({ length: 5 });
    client = await getClientWithTokenInterceptor();
  });

  it('should init user preferences', async () => {
    await client.request(deletePrefsMutation());
    const response = await client.request(initPrefsMutation(currency));

    expect(response.initializePreferences.currency).toBe(currency);
    expect(typeof response.initializePreferences.id).toBe('number');
  });

  it('should return initial user preferences', async () => {
    const response = await client.request(getUserPreferencesQuery());

    expect(typeof response.getUserPreferences.id).toBe('number');
    expect(response.getUserPreferences.currency).toBe(currency);
  })

  it('should change user currency', async () => {
    currency = chance.word({ length: 5 });
    const response = await client.request(changeUserCurrencyMutation(currency));

    expect(response.changeUserCurrency).toBeTruthy();
  })

  it('should get user preferences after currency change', async () => {
    const response = await client.request(getUserPreferencesQuery());

    expect(typeof response.getUserPreferences.id).toBe('number');
    expect(response.getUserPreferences.currency).toBe(currency);
  })
});
