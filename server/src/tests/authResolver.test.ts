import {
  USER_NOT_FOUND,
  BAD_PASSWORD,
  ACCOUNT_NOT_CONFIRMED,
  ACCOUNT_ALREADY_CONFIRMED
} from './../constants/error.constants';
import { setTestCreds, setEmail } from './utils/getClientWithTokenInterceptor';
import { request } from 'graphql-request';
import { activeAccountMutation, loginMutation, registerMutation } from './utils/mutations';
import { sign } from 'jsonwebtoken';

const Chance = require('chance');
const getGraphqlEndpoint = require('./utils/getGraphqlEndpoint');

export const authResolverTest = () =>
  describe('Auth resolver', () => {
    const chance = new Chance();
    let email = '';
    let password = 'passwordQw12';
    let firstName = '';
    let lastName = '';
    let registeredUserId;
    let emailToken = '';

    beforeAll(() => {
      email = chance.email();
      firstName = chance.word({ length: 5 });
      lastName = chance.word({ length: 5 });
      setEmail(email);
    });

    it('should register new user', async () => {
      const response = await request(
        getGraphqlEndpoint(),
        registerMutation(email, password, firstName, lastName)
      );
      expect(response.register.id).toBeDefined();
      registeredUserId = response.register.id;
      setTestCreds(email, password);
    });

    it('should throw an error on login if account is not confirmed', async () => {
      let error;
      try {
        await request(getGraphqlEndpoint(), loginMutation(email, password));
      } catch (e) {
        error = e;
      }
      expect(String(error).includes(ACCOUNT_NOT_CONFIRMED)).toBeTruthy();
    });

    it('should activate an account for registered user', async () => {
      emailToken = sign(
        {
          user: registeredUserId
        },
        process.env.EMAIL_TOKEN_SECRET!,
        {
          expiresIn: '1d'
        }
      );
      const response = await request(getGraphqlEndpoint(), activeAccountMutation(emailToken));
      expect(response.activateAccount).toBeTruthy();
    });

    it('should throw an error on account confirmation if account is already confirmed', async () => {
      let err;
      try {
        await request(getGraphqlEndpoint(), activeAccountMutation(emailToken));
      } catch (e) {
        err = e;
      }
      expect(String(err).includes(ACCOUNT_ALREADY_CONFIRMED)).toBeTruthy();
    });

    it('should return accessToken on user login', async () => {
      const response = await request(getGraphqlEndpoint(), loginMutation(email, password));
      expect(response.login.accessToken.length > 20).toBeTruthy();
    });

    it('should throw an error if email is not found', async () => {
      let error;
      try {
        await request(getGraphqlEndpoint(), loginMutation('randomemail@email.com', password));
      } catch (e) {
        error = e;
      }
      expect(String(error).includes(USER_NOT_FOUND)).toBeTruthy();
    });

    it('should throw an error if password is not correct', async () => {
      let error;
      try {
        await request(getGraphqlEndpoint(), loginMutation(email, 'badPassword'));
      } catch (e) {
        error = e;
      }
      expect(String(error).includes(BAD_PASSWORD)).toBeTruthy();
    });
  });
