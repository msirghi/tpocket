import TokenService from '../services/TokenService';
import { verify } from 'jsonwebtoken';
import { User } from '../entity/User';

export const tokenServiceTest = () =>
  describe('Token service', () => {
    const defaultUserId = 2;

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should generete valid jwt token with user id in it', () => {
      const token = TokenService.generateToken(defaultUserId);
      expect(token.length > 20).toBeTruthy();

      const payload: any = verify(token, process.env.EMAIL_TOKEN_SECRET!);
      expect(payload.user).toBe(defaultUserId);
    });

    it('should generate access token', () => {
      const user = new User();
      user.id = 2;
      const token = TokenService.createAccessToken(user);
      expect(token.length > 20).toBeTruthy();

      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      expect(payload.userId).toBe(2);
    });

    it('should create refresh token', () => {
      const user = new User();
      user.id = 3;
      const token = TokenService.createRefreshToken(user);
      expect(token.length > 20).toBeTruthy();

      const payload: any = verify(token, process.env.REFRESH_TOKEN_SECRET!);
      expect(payload.userId).toBe(3);
    });

    it('should send refreshToken in cookie', () => {
      const cookie = jest.fn();

      // @ts-ignore
      TokenService.sendRefreshToken({ cookie });
      expect(cookie).toBeCalled();
    });
  });
