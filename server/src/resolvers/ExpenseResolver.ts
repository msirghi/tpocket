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
import { Expense } from '../entity/Expense';
import { isAuthMiddleware } from '../isAuthMiddleware';
import { Category } from '../entity/Category';
import { CATEGORY_NOT_FOUND, NOT_FOUND, SERVER_ERROR } from '../constants/error.constants';
import { MyContext } from '../MyContext';
import { getConnection, In } from 'typeorm';

@ObjectType()
class ExpenseResponse {
  @Field()
  category: Category;

  @Field()
  expense: Expense;
}

@Resolver()
export class ExpenseResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuthMiddleware)
  async deleteExpenseById(@Arg('id') id: number) {
    await this.getExpenseById(id);

    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Expense)
      .where('id = :id', { id })
      .execute();
    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthMiddleware)
  async updateExpenseById(@Arg('amount') amount: number, @Arg('id') id: number) {
    await this.getExpenseById(id);

    await getConnection()
      .createQueryBuilder()
      .update(Expense)
      .set({ amount })
      .where('id = :id', { id })
      .execute();
    return true;
  }

  @Query(() => Expense)
  @UseMiddleware(isAuthMiddleware)
  async getExpenseById(@Arg('id') id: number) {
    const expense = await Expense.findOne({ where: { id } });

    if (!expense) {
      throw new Error(NOT_FOUND);
    }
    return expense;
  }

  @Query(() => [ExpenseResponse])
  @UseMiddleware(isAuthMiddleware)
  async getAllUserExpenses(@Ctx() { payload }: MyContext) {
    const allCategories = await Category.find({ where: { user: payload?.userId } });
    const ids: Array<number> = [];

    allCategories.forEach((category) => ids.push(+category.id));

    const allExpenses = await Expense.find({
      where: { category: In(ids) }
    });

    const result: Array<ExpenseResponse> = [];

    allExpenses.forEach((value) => {
      result.push({
        expense: value,
        category: allCategories.find((category) => category.id === value.category.id)!
      });
    });
    return result;
  }

  @Mutation(() => ExpenseResponse)
  @UseMiddleware(isAuthMiddleware)
  async addExpense(
    @Arg('amount') amount: number,
    @Arg('categoryId') categoryId: number,
    @Ctx() { payload }: MyContext
  ) {
    const category = await Category.findOne({ where: { id: categoryId, user: payload?.userId } });

    if (!category) {
      throw new Error(CATEGORY_NOT_FOUND);
    }

    const result = await Expense.insert({ amount, category });
    return {
      expense: { id: result.identifiers[0].id, amount },
      category
    };
  }

  @Query(() => [ExpenseResponse])
  @UseMiddleware(isAuthMiddleware)
  async getLastUserExpenses(@Ctx() { payload }: MyContext) {
    let allCategories;
    try {
      allCategories = await Category.find({ where: { user: payload?.userId } });
    } catch (e) {
      throw new Error(SERVER_ERROR);
    }
    const ids: Array<number> = [];

    allCategories.forEach((category) => ids.push(+category.id));

    const allExpenses = await Expense.find({
      where: { category: In(ids) }
    });

    const result: Array<ExpenseResponse> = [];

    allExpenses.forEach((value) => {
      if (result.length <= 5) {
        result.push({
          expense: value,
          category: allCategories.find((category) => category.id === value.category.id)!
        });
      }
    });
    return result;
  }
}
