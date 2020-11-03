import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Preference } from '../entity/Preference';
import { isAuthMiddleware } from '../isAuthMiddleware';
import { MyContext } from '../MyContext';
import { getConnection } from 'typeorm';
import { User } from '../entity/User';
import { INVALID_NAME, NEGATIVE_MONTH_LIMIT, SERVER_ERROR, USER_NOT_FOUND } from '../constants/error.constants';
import { logger } from '../config/logger.config';
import ValidatorService from '../utils/validators';
@Resolver()
export class PreferenceResolver {
  @Query(() => Preference)
  @UseMiddleware(isAuthMiddleware)
  async getUserPreferences(@Ctx() { payload }: MyContext) {
    return await Preference.findOne({ where: { user: payload?.userId } });
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthMiddleware)
  async changeUserCurrency(@Ctx() { payload }: MyContext, @Arg('currency') currency: string) {
    await getConnection()
      .createQueryBuilder()
      .update(Preference)
      .set({ currency })
      .where('user = :user', { user: payload?.userId })
      .execute();

    return true;
  }

  @Mutation(() => Preference)
  @UseMiddleware(isAuthMiddleware)
  async initializePreferences(
    @Ctx() { payload }: MyContext,
    @Arg('currency') currency: string,
    @Arg('monthLimit') monthLimit: number
  ) {
    const user = await User.findOne({ where: { id: payload?.userId } });

    if (!user) {
      throw new Error(USER_NOT_FOUND);
    }

    const result = await Preference.insert({ currency, monthLimit, user });
    return { currency, id: result.identifiers[0].id, monthLimit };
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthMiddleware)
  async deletePreferences(@Ctx() { payload }: MyContext) {
    const user = await User.findOne({ where: { id: payload?.userId } });

    if (!user) {
      throw new Error(USER_NOT_FOUND);
    }

    await Preference.delete({ user });
    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthMiddleware)
  async updateMonthLimit(@Ctx() { payload }: MyContext, @Arg('monthLimit') monthLimit: number) {
    await getConnection()
      .createQueryBuilder()
      .update(Preference)
      .set({ monthLimit })
      .where('id = :id', { id: payload?.userId })
      .execute();

    return true;
  }

  @Query(() => Preference)
  @UseMiddleware(isAuthMiddleware)
  async getUserInfo(@Ctx() { payload }: MyContext) {
    try {
      const userPrefs = await Preference.findOne({ where: { user: payload?.userId } });
      return { ...userPrefs };
    } catch (e) {
      logger.error(e);
      throw new Error(SERVER_ERROR);
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthMiddleware)
  async updateUserPreference(
    @Ctx() { payload }: MyContext,
    @Arg('firstName') firstName: string,
    @Arg('lastName') lastName: string,
    @Arg('monthLimit') monthLimit: number,
    @Arg('currency') currency: string
  ) {
    if (!ValidatorService.isNameValid(lastName) || !ValidatorService.isNameValid(firstName)) {
      throw new Error(INVALID_NAME);
    }

    if (monthLimit <= 0) {
      throw new Error(NEGATIVE_MONTH_LIMIT);
    }
    try {
      await getConnection()
        .createQueryBuilder()
        .update(User)
        .set({ firstName, lastName })
        .where('id = :id', { id: payload?.userId })
        .execute();

      await getConnection()
        .createQueryBuilder()
        .update(Preference)
        .set({ monthLimit, currency })
        .where('user = :id', { id: payload?.userId })
        .execute();
      return true;
    } catch (e) {
      logger.error(e);
      throw new Error('Error during update');
    }
  }
}
