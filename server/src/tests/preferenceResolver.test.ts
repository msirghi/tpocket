import { GraphQLClient } from 'graphql-request';
import {
  changeUserCurrencyMutation,
  deletePrefsMutation,
  initPrefsMutation,
  updateMonthLimitMutation,
  updateUserPreferenceMutation
} from './utils/mutations';
import { getUserInfoQuery, getUserPreferencesQuery } from './utils/queries';
import { getClientWithTokenInterceptor, getEmail } from './utils/getClientWithTokenInterceptor';
import { INVALID_NAME, NEGATIVE_MONTH_LIMIT } from '../constants/error.constants';

const Chance = require('chance');

export const preferenceResolverTest = () =>
  describe('Preference resolver', () => {
    const chance = new Chance();
    let client: GraphQLClient;
    let currency: string;
    let monthLimit: number;

    beforeAll(async () => {
      currency = chance.word({ length: 5 });
      monthLimit = chance.integer({ min: 0, max: 1000 });
      client = await getClientWithTokenInterceptor();
    });

    it('should init user preferences', async () => {
      await client.request(deletePrefsMutation());
      const response = await client.request(initPrefsMutation(currency, monthLimit));

      expect(response.initializePreferences.currency).toBe(currency);
      expect(response.initializePreferences.monthLimit).toBe(monthLimit);
      expect(typeof response.initializePreferences.id).toBe('number');
    });

    it('should return initial user preferences', async () => {
      const response = await client.request(getUserPreferencesQuery());

      expect(typeof response.getUserPreferences.id).toBe('number');
      expect(response.getUserPreferences.currency).toBe(currency);
      expect(response.getUserPreferences.monthLimit).toBe(monthLimit);
    });

    it('should change user currency', async () => {
      currency = chance.word({ length: 5 });
      const response = await client.request(changeUserCurrencyMutation(currency));

      expect(response.changeUserCurrency).toBeTruthy();
    });

    it('should get user preferences after currency change', async () => {
      const response = await client.request(getUserPreferencesQuery());

      expect(typeof response.getUserPreferences.id).toBe('number');
      expect(response.getUserPreferences.currency).toBe(currency);
      expect(response.getUserPreferences.monthLimit).toBe(monthLimit);
    });

    it('should update monthLimit', async () => {
      const response = await client.request(updateMonthLimitMutation(100));

      expect(response.updateMonthLimit).toBeTruthy();
    });

    it('should return info about logged user', async () => {
      const response = await client.request(getUserInfoQuery());

      expect(response.getUserInfo.user.id).not.toBeNull();
      expect(response.getUserInfo.user.firstName).toBeDefined();
      expect(response.getUserInfo.user.lastName).toBeDefined();
      expect(response.getUserInfo.user.email).toBe(getEmail());
      expect(typeof response.getUserInfo.monthLimit).toBe('number');
      expect(typeof response.getUserInfo.currency).toBe('string');
    });

    it('should update user preference', async () => {
      const data = {
        currency: 'USD',
        monthLimit: 1000,
        firstName: 'John',
        lastName: 'Doe'
      };
      const response = await client.request(
        updateUserPreferenceMutation(data.currency, data.monthLimit, data.firstName, data.lastName)
      );

      expect(response.updateUserPreference).toBeTruthy();

      const userInfoResponse = await client.request(getUserInfoQuery());

      expect(userInfoResponse.getUserInfo.user.id).not.toBeNull();
      expect(userInfoResponse.getUserInfo.user.firstName).toBe(data.firstName);
      expect(userInfoResponse.getUserInfo.user.lastName).toBe(data.lastName);
      expect(userInfoResponse.getUserInfo.user.email).toBe(getEmail());
      expect(userInfoResponse.getUserInfo.monthLimit).toBe(data.monthLimit);
      expect(userInfoResponse.getUserInfo.currency).toBe(data.currency);
    });

    it('should not update user preference on negative month limit', async () => {
      const data = {
        currency: 'USD',
        monthLimit: -1000,
        firstName: 'John',
        lastName: 'Doe'
      };
      let err;
      try {
        await client.request(
          updateUserPreferenceMutation(
            data.currency,
            data.monthLimit,
            data.firstName,
            data.lastName
          )
        );
      } catch (e) {
        err = e;
      }
      expect(String(err)).toContain(NEGATIVE_MONTH_LIMIT);
    });

    it('should not update user preference on invalid first name', async () => {
      const data = {
        currency: 'USD',
        monthLimit: -1000,
        firstName: 'John 22',
        lastName: 'Doe'
      };
      let err;
      try {
        await client.request(
          updateUserPreferenceMutation(
            data.currency,
            data.monthLimit,
            data.firstName,
            data.lastName
          )
        );
      } catch (e) {
        err = e;
      }
      expect(String(err)).toContain(INVALID_NAME);
    });

    it('should not update user preference on invalid last name', async () => {
      const data = {
        currency: 'USD',
        monthLimit: -1000,
        firstName: 'John',
        lastName: 'Doe 22'
      };
      let err;
      try {
        await client.request(
          updateUserPreferenceMutation(
            data.currency,
            data.monthLimit,
            data.firstName,
            data.lastName
          )
        );
      } catch (e) {
        err = e;
      }
      expect(String(err)).toContain(INVALID_NAME);
    });
  });
