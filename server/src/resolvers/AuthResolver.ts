import { ACCOUNT_ALREADY_CONFIRMED } from './../constants/error.constants';
import { getConnection } from 'typeorm';
import { verify } from 'jsonwebtoken';
import { logger } from '../config/logger.config';
import { Arg, Mutation, Resolver, Field, ObjectType, Ctx } from 'type-graphql';
import { TOKEN_TIME_EXPIRED } from '../constants/error.constants';
import { User } from '../entity/User';
import { compare } from 'bcryptjs';
import { MyContext } from '../MyContext';
import TokenService from '../services/TokenService';
import { BAD_PASSWORD, USER_NOT_FOUND, ACCOUNT_NOT_CONFIRMED } from '../constants/error.constants';

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class AuthResolver {
  @Mutation(() => Boolean)
  async activateAccount(@Arg('token') token: string) {
    let id;
    try {
      const { user } = verify(token, process.env.EMAIL_TOKEN_SECRET!) as { user: number };
      id = user;
    } catch (e) {
      logger.error(e);
      throw new Error(TOKEN_TIME_EXPIRED);
    }
    const userInDb = await User.findOne({ where: { id } });
    if (userInDb?.confirmed) {
      throw new Error(ACCOUNT_ALREADY_CONFIRMED);
    }
    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ confirmed: true })
      .where('id = :id', { id })
      .execute();
    return true;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error(USER_NOT_FOUND);
    }

    if (!user.confirmed) {
      throw new Error(ACCOUNT_NOT_CONFIRMED);
    }

    const valid = await compare(password, user.password);

    if (!valid) {
      throw new Error(BAD_PASSWORD);
    }
    TokenService.sendRefreshToken(res, TokenService.createRefreshToken(user));
    return {
      accessToken: TokenService.createAccessToken(user)
    };
  }
}
