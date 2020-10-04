import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { User } from '../entity/User';
import { compare, hash } from 'bcryptjs';
import { MyContext } from '../MyContext';
import { createAccessToken, createRefreshToken } from '../auth';
import { sendRefreshToken } from '../sendRefreshToken';
import { getConnection } from 'typeorm';
import { validateEmail } from '../utils/emailValidator';
import {
  BAD_EMAIL,
  BAD_PASSWORD,
  EMAIL_ALREADY_EXISTS,
  USER_NOT_FOUND,
  WEAK_PASSWORD
} from '../constants/error.constants';
import { isAuthMiddleware } from '../isAuthMiddleware';

const passwordStrength = require('check-password-strength');

@ObjectType()
class LoginResponse {
  
  @Field()
  accessToken: string;
}

@ObjectType()
class RegisterResponse {
  
  @Field()
  id: string;
}

@Resolver()
export class UserResolver {
  @Query(() => [User])
  users() {
    return User.find();
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthMiddleware)
  async revokeRefreshTokenForUser(@Ctx() { payload }: MyContext) {
    await getConnection()
      .getRepository(User)
      .increment({ id: +payload!.userId }, 'tokenVersion', 1);
    return true;
  }

  @Mutation(() => RegisterResponse)
  async register(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Arg('firstName') firstName: string,
    @Arg('lastName') lastName: string
  ) {
    if (!validateEmail(email)) {
      throw new Error(BAD_EMAIL);
    }

    if (passwordStrength(password).value === 'Weak') {
      throw new Error(WEAK_PASSWORD);
    }

    const user = await User.findOne({ where: { email } });

    if (user) {
      throw new Error(EMAIL_ALREADY_EXISTS);
    }

    const hashedPassword = await hash(password, 12);
    let newUser;
    try {
      newUser = await User.insert({
        email,
        password: hashedPassword,
        firstName,
        lastName
      });
    } catch (err) {
      return false;
    }
    return {
      id: newUser.identifiers[0].id
    };
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

    const valid = await compare(password, user.password);

    if (!valid) {
      throw new Error(BAD_PASSWORD);
    }

    sendRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user)
    };
  }
}
