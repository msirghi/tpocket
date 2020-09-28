import { getConnection } from 'typeorm';
import { User } from '../entity/User';
import { MyContext } from '../MyContext';
import { isAuthMiddleware } from '../isAuthMiddleware';
import { Category } from '../entity/Category';
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware, } from 'type-graphql';
import { CATEGORY_ALREADY_EXISTS, NO_CATEGORY, NOT_FOUND, USER_NOT_FOUND } from "../constants/error.constants";

@Resolver()
export class CategoryResolver {
  async checkCategoryExistenceById(id: number) {
    const category = await Category.findOne({ where: { id } });

    if (!category) {
      throw new Error(NO_CATEGORY);
    }

    return category;
  }

  async checkCategoryByName(name: string, userId: string) {
    const category = await Category.findOne({ where: { name, user: userId } });

    if (category) {
      throw new Error(CATEGORY_ALREADY_EXISTS);
    }
  }

  @Query(() => [Category])
  @UseMiddleware(isAuthMiddleware)
  getCategoryByUser(
    @Ctx() { payload }: MyContext
  ) {
    return Category.find({ where: { user: payload?.userId } });
  }

  @Query(() => Category)
  @UseMiddleware(isAuthMiddleware)
  async getCategoryById(
    @Arg('id') id: number
  ) {
    const result = await Category.findOne({ where: { id } });

    if (!result) {
      throw new Error(NOT_FOUND);
    }

    return result;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthMiddleware)
  async updateCategoryName(
    @Arg('id') id: number,
    @Arg('name') name: string,
    @Ctx() { payload }: MyContext
  ) {
    await this.checkCategoryExistenceById(id);
    await this.checkCategoryByName(name, payload!.userId);

    await getConnection()
      .createQueryBuilder()
      .update(Category)
      .set({ name })
      .where('id = :id', { id })
      .andWhere('user = :user', { user: payload?.userId })
      .execute();

    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthMiddleware)
  async deleteCategory(
    @Arg('id') id: number,
    @Ctx() { payload }: MyContext) {
    const category = await Category.findOne({ where: { id } });

    if (!category) {
      throw new Error(NOT_FOUND);
    }

    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Category)
      .where('id = :id', { id })
      .andWhere('user = :user', { user: payload?.userId })
      .execute();

    return true;
  }

  @Mutation(() => Category)
  @UseMiddleware(isAuthMiddleware)
  async createCategory(
    @Arg('name') name: string,
    @Ctx() { payload }: MyContext
  ) {
    const user = await User.findOne({ where: { id: payload?.userId } });

    if (!user) {
      throw new Error(USER_NOT_FOUND);
    }

    await this.checkCategoryByName(name, payload!.userId);
    const result = await Category.insert({ name, user, });

    return { name, id: result.identifiers[0].id };
  }
}
