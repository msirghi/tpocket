import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Preference } from '../entity/Preference';
import { isAuthMiddleware } from '../isAuthMiddleware';
import { MyContext } from '../MyContext';
import { getConnection } from 'typeorm';
import { User } from '../entity/User';
import { USER_NOT_FOUND } from '../constants/error.constants';

// @ObjectType()
// @InputType('data')
// class InitPayload {
//
//   @Field()
//   currency: string;
// }

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
  async initializePreferences(@Ctx() { payload }: MyContext, @Arg('currency') currency: string) {
    const user = await User.findOne({ where: { id: payload?.userId } });

    if (!user) {
      throw new Error(USER_NOT_FOUND);
    }

    const result = await Preference.insert({ currency, user });
    return { currency, id: result.identifiers[0].id };
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
}
