import { INVALID_NAME } from './../constants/error.constants';
import {
  getClientWithTokenInterceptor,
  getAccessToken,
  getEmail
} from './utils/getClientWithTokenInterceptor';
import { GraphQLClient, request } from 'graphql-request';
import {
  BAD_EMAIL,
  EMAIL_ALREADY_EXISTS,
  NOT_AUTHENTICATED,
  WEAK_PASSWORD
} from '../constants/error.constants';
import { getConnection } from 'typeorm';
import { User } from '../entity/User';
import {
  updateLastNameMutation,
  updateFirstNameMutation,
  initAdditionalRegInfoMutation
} from './utils/mutations';
import { getAllCategoriesByUser, getUserPreferencesQuery } from './utils/queries';
import { registerMutation, revokeRefreshTokenMutation } from './utils/mutations';
import { verify } from 'jsonwebtoken';
import { AES } from 'crypto-js';

const getGraphqlEndpoint = require('./utils/getGraphqlEndpoint');
const Chance = require('chance');

export const userResolverTest = () =>
  describe('User resolver', () => {
    let email = '';
    let password = 'passwordQw12';
    let firstName = '';
    let lastName = '';
    let client;
    const categories = 'Category 1, Category 2';
    const monthlyLimit = 500;
    const currency = 'EUR';
    const chance = new Chance();

    beforeAll(async () => {
      client = await getClientWithTokenInterceptor();
      email = chance.email();
      firstName = chance.word({ length: 5 });
      lastName = chance.word({ length: 5 });
    });

    afterAll(async () => {
      await getConnection()
        .getRepository(User)
        .createQueryBuilder()
        .delete()
        .where(
          (qb) =>
            `id IN (${qb
              .createQueryBuilder()
              .select('id')
              .from(User, 'ev')
              .orderBy('created_at', 'DESC')
              .limit(1)
              .getQuery()})`
        )
        .execute();
    });

    it('should throw an error when registering new user with invalid first name', async () => {
      let error;
      try {
        await request(getGraphqlEndpoint(), registerMutation(email, password, 'name12', lastName));
      } catch (e) {
        error = e;
      }
      expect(String(error).includes(INVALID_NAME)).toBeTruthy();
    });

    it('should throw an error when updating the user with invalid last name', async () => {
      let error;
      try {
        await client.request(updateLastNameMutation('name12'));
      } catch (e) {
        error = e;
      }
      expect(String(error).includes(INVALID_NAME)).toBeTruthy();
    });

    it('should update last name on valid string', async () => {
      const response = await client.request(updateLastNameMutation(chance.word({ length: 5 })));
      expect(response.updateLastName).toBeTruthy();
    });

    it('should throw an error when updating the user with invalid first name', async () => {
      let error;
      try {
        await client.request(updateFirstNameMutation('name12'));
      } catch (e) {
        error = e;
      }
      expect(String(error).includes(INVALID_NAME)).toBeTruthy();
    });

    it('should update first name on valid string', async () => {
      const response = await client.request(updateFirstNameMutation(chance.word({ length: 5 })));
      expect(response.updateFirstName).toBeTruthy();
    });

    it('should throw an error when registering new user with invalid last name', async () => {
      let error;
      try {
        await request(getGraphqlEndpoint(), registerMutation(email, password, firstName, 'name12'));
      } catch (e) {
        error = e;
      }
      expect(String(error).includes(INVALID_NAME)).toBeTruthy();
    });

    it('should throw an error when registering new user with the same email', async () => {
      let error;
      try {
        await request(
          getGraphqlEndpoint(),
          registerMutation(getEmail(), password, firstName, lastName)
        );
      } catch (e) {
        error = e;
      }
      expect(String(error).includes(EMAIL_ALREADY_EXISTS)).toBeTruthy();
    });

    it('should throw an error on register with empty email', async () => {
      let error;
      try {
        await request(getGraphqlEndpoint(), registerMutation('', password, firstName, lastName));
      } catch (e) {
        error = e;
      }
      expect(String(error).includes(BAD_EMAIL)).toBeTruthy();
    });

    it('should throw an error on register with empty password', async () => {
      let error;
      try {
        await request(getGraphqlEndpoint(), registerMutation(email, '', firstName, lastName));
      } catch (e) {
        error = e;
      }
      expect(error).toBeTruthy();
    });

    it('should throw an error if the password is weak', async () => {
      let error;
      try {
        await request(getGraphqlEndpoint(), registerMutation(email, 'weak', firstName, lastName));
      } catch (e) {
        error = e;
      }
      expect(String(error).includes(WEAK_PASSWORD)).toBeTruthy();
    });

    it('should throw an error on bad email', async () => {
      let error;
      try {
        await request(getGraphqlEndpoint(), registerMutation('bad', password, firstName, lastName));
      } catch (e) {
        error = e;
      }
      expect(String(error).includes(BAD_EMAIL)).toBe(true);
    });

    it('should revoke refresh token', async () => {
      const client = new GraphQLClient(getGraphqlEndpoint(), {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      });
      const response = await client.request(revokeRefreshTokenMutation());
      expect(response.revokeRefreshTokenForUser).toBeTruthy();
    });

    it('should throw an error on token revoke without token', async () => {
      let error;
      try {
        await request(getGraphqlEndpoint(), revokeRefreshTokenMutation());
      } catch (e) {
        error = e;
      }
      expect(String(error).includes(NOT_AUTHENTICATED)).toBeTruthy();
    });

    it('should init additional info on registration', async () => {
      const tokenPayload: any = verify(getAccessToken(), process.env.ACCESS_TOKEN_SECRET!);
      const encryptedUserId = AES.encrypt(tokenPayload.userId.toString(), process.env.TEMP_ID_KEY!);
      const initInfoResponse = await request(
        getGraphqlEndpoint(),
        initAdditionalRegInfoMutation(
          categories,
          encryptedUserId.toString(),
          currency,
          monthlyLimit
        )
      );

      expect(initInfoResponse.initAdditionalRegInfo).toBeTruthy();
    });

    it('should get user preferences after init additional info on reg', async () => {
      const client = new GraphQLClient(getGraphqlEndpoint(), {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      });
      const preferencesResponse = await client.request(getUserPreferencesQuery());
      expect(preferencesResponse.getUserPreferences.currency).toBe(currency);
      expect(preferencesResponse.getUserPreferences.monthLimit).toBe(monthlyLimit);
    });

    it('should get user categories after init additional info on reg', async () => {
      const client = new GraphQLClient(getGraphqlEndpoint(), {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      });

      const categoryArray = categories.split(',');
      const response = await client.request(getAllCategoriesByUser());
      expect(response.getCategoryByUser[0].id).toBeDefined();
      expect(response.getCategoryByUser[0].name).toBe(categoryArray[0]);
      expect(response.getCategoryByUser[1].id).toBeDefined();
      expect(response.getCategoryByUser[1].name).toBe(categoryArray[1]);
    });
  });
