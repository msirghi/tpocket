import { Category } from './../entity/Category';
import { Preference } from './../entity/Preference';
import { INVALID_NAME } from './../constants/error.constants';
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
import { hash } from 'bcryptjs';
import { MyContext } from '../MyContext';
import { getConnection } from 'typeorm';
import Validators from '../utils/validators';
import { BAD_EMAIL, EMAIL_ALREADY_EXISTS, WEAK_PASSWORD } from '../constants/error.constants';
import { isAuthMiddleware } from '../isAuthMiddleware';
import { AES, enc } from 'crypto-js';
import passwordStrength from 'check-password-strength';
import EmailService from '../services/EmailService';
import { EmailType } from '../types';
import TokenService from '../services/TokenService';

@ObjectType()
class RegisterResponse {
  @Field()
  id: string;
}

@Resolver()
export class UserResolver {
  isNameValid(name: string) {
    return Validators.isNameValid(name);
  }

  validateNames(firstName: string, lastName: string) {
    if (!this.isNameValid(firstName) || !this.isNameValid(lastName)) {
      throw new Error(INVALID_NAME);
    }
  }

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
    if (!Validators.isEmailValid(email)) {
      throw new Error(BAD_EMAIL);
    }

    this.validateNames(firstName, lastName);

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

      const token = TokenService.generateToken(newUser.identifiers[0].id);
      EmailService.sendEmail(email, EmailType.REGISTRATION, { token });
    } catch (err) {
      return false;
    }
    return {
      id: newUser.identifiers[0].id
    };
  }

  @Mutation(() => Boolean)
  async initAdditionalRegInfo(
    @Arg('userId') userId: string,
    @Arg('currency') currency: string,
    @Arg('monthLimit') monthLimit: number,
    @Arg('categories') categories: string
  ) {
    const decrypted = AES.decrypt(userId, process.env.TEMP_ID_KEY!);
    const userIdDecrypted = decrypted.toString(enc.Utf8);

    if (userIdDecrypted) {
      const user = await User.findOne({ where: { id: userIdDecrypted } });
      await Preference.insert({ monthLimit, currency, user });
      const newCategories: Category[] = categories.split(',').map((category) => {
        const newCategory = new Category();
        newCategory.name = category;
        newCategory.user = user!;
        return newCategory;
      });

      await Category.save(newCategories);
      return true;
    }
    throw new Error('Invalid data.');
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthMiddleware)
  async updateFirstName(@Ctx() { payload }: MyContext, @Arg('firstName') firstName: string) {
    if (!this.isNameValid(firstName)) {
      throw new Error(INVALID_NAME);
    }
    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ firstName })
      .where('id = :id', { id: payload?.userId })
      .execute();

    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthMiddleware)
  async updateLastName(@Ctx() { payload }: MyContext, @Arg('lastName') lastName: string) {
    if (!this.isNameValid(lastName)) {
      throw new Error(INVALID_NAME);
    }
    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ lastName })
      .where('id = :id', { id: payload?.userId })
      .execute();

    return true;
  }
}
