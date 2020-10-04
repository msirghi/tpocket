import { setTestCreds } from './utils/getClientWithTokenInterceptor';
import { GraphQLClient, request } from 'graphql-request';
import {
  BAD_EMAIL,
  BAD_PASSWORD,
  EMAIL_ALREADY_EXISTS,
  NOT_AUTHENTICATED,
  USER_NOT_FOUND,
  WEAK_PASSWORD
} from '../constants/error.constants';
import { getConnection } from 'typeorm';
import { User } from '../entity/User';

const getGraphqlEndpoint = require('./utils/getGraphqlEndpoint');
const Chance = require('chance');

const getRegisterMutation = (
  email: string,
  password: string,
  lastName: string,
  firstName: string
) => {
  return `
    mutation {
     register(email: "${email}", password: "${password}", lastName: "${lastName}", firstName: "${firstName}") {
       id
     }
   }
  `;
};

export const getLoginMutation = (email: string, password: string) => {
  return `
    mutation {
      login(email: "${email}", password: "${password}") {
        accessToken
      }
    }
  `;
};

const getRevokeRefreshTokenMutation = () => {
  return `
    mutation {
      revokeRefreshTokenForUser
    }
  `;
};

export const userResolverTest = () =>
  describe('User resolver', () => {
    let email = '';
    let password = 'passwordQw12';
    let firstName = '';
    let lastName = '';
    let token: string;

    beforeAll(async () => {
      const chance = new Chance();
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

    it('should register new user', async () => {
      const response = await request(
        getGraphqlEndpoint(),
        getRegisterMutation(email, password, firstName, lastName)
      );
      expect(response.register.id).toBeDefined();
      setTestCreds(email, password);
    });

    it('should throw an error when registering new user with the same email', async () => {
      try {
        await request(
          getGraphqlEndpoint(),
          getRegisterMutation(email, password, firstName, lastName)
        );
      } catch (e) {
        expect(String(e).includes(EMAIL_ALREADY_EXISTS)).toBeTruthy();
      }
    });

    it('should throw an error on register with empty email', async () => {
      try {
        await request(getGraphqlEndpoint(), getRegisterMutation('', password, firstName, lastName));
      } catch (e) {
        expect(String(e).includes(BAD_EMAIL)).toBeTruthy();
      }
    });

    it('should throw an error on register with empty password', async () => {
      try {
        await request(getGraphqlEndpoint(), getRegisterMutation(email, '', firstName, lastName));
      } catch (e) {
        expect(e).toBeTruthy();
      }
    });

    it('should throw an error if the password is weak', async () => {
      try {
        await request(
          getGraphqlEndpoint(),
          getRegisterMutation(email, 'weak', firstName, lastName)
        );
      } catch (e) {
        expect(String(e).includes(WEAK_PASSWORD)).toBeTruthy();
      }
    });

    it('should throw an error on bad email', async () => {
      try {
        await request(
          getGraphqlEndpoint(),
          getRegisterMutation('bad', password, firstName, lastName)
        );
      } catch (e) {
        expect(String(e).includes(BAD_EMAIL)).toBe(true);
      }
    });

    it('should return accessToken on user login', async () => {
      const response = await request(getGraphqlEndpoint(), getLoginMutation(email, password));
      expect(response.login.accessToken.length > 20).toBeTruthy();
      token = response.login.accessToken;
    });

    it('should throw an error if password is not correct', async () => {
      try {
        await request(getGraphqlEndpoint(), getLoginMutation(email, 'badPassword'));
      } catch (e) {
        expect(String(e).includes(BAD_PASSWORD)).toBeTruthy();
      }
    });

    it('should throw an error if email is not found', async () => {
      try {
        await request(getGraphqlEndpoint(), getLoginMutation('randomemail@email.com', password));
      } catch (e) {
        expect(String(e).includes(USER_NOT_FOUND)).toBeTruthy();
      }
    });

    it('should revoke refresh token', async () => {
      const client = new GraphQLClient(getGraphqlEndpoint(), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const response = await client.request(getRevokeRefreshTokenMutation());
      expect(response.revokeRefreshTokenForUser).toBeTruthy();
    });

    it('should throw an error on token revoke without token', async () => {
      try {
        await request(getGraphqlEndpoint(), getRevokeRefreshTokenMutation());
      } catch (e) {
        expect(String(e).includes(NOT_AUTHENTICATED)).toBeTruthy();
      }
    });
  });
