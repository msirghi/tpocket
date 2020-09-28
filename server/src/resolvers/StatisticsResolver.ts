import {
  Arg,
  Ctx,
  Field,
  InputType,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { isAuthMiddleware } from '../isAuthMiddleware';
import { MyContext } from '../MyContext';
import { Category } from '../entity/Category';
import { In } from 'typeorm';
import { Expense } from '../entity/Expense';
import _ from 'lodash';

@ObjectType()
class StatisticsPayload {
  @Field()
  totalCategories: number;

  @Field()
  totalExpenses: number;
}

@ObjectType()
@InputType('data')
class MonthExpensesPayload {
  @Field()
  name: string;

  @Field()
  expenses: number;
}

@ObjectType()
class PercentageByCategoryPayload {
  @Field()
  category: Category;

  @Field()
  percentage: number;
}

@Resolver()
export class StatisticsResolver {
  async getTotalExpenseEntities(totalCategories: Category[]) {
    return await Expense.find({
      where: { category: { id: In(totalCategories.map((value) => value.id)) } },
    });
  }

  @Query(() => StatisticsPayload)
  @UseMiddleware(isAuthMiddleware)
  async getCategoryExpenseStatisticsByUser(
    @Ctx() { payload }: MyContext
  ): Promise<StatisticsPayload> {
    const totalCategories = await Category.find({
      where: { user: payload?.userId },
    });
    let totalExpenses = 0;

    const totalExpensesEntities = await this.getTotalExpenseEntities(
      totalCategories
    );

    if (totalExpensesEntities) {
      totalExpenses = totalExpensesEntities
        .map((value) => value.amount)
        .reduce((val1, val2) => val1 + val2, 0);
    }

    return {
      totalCategories: totalCategories.length,
      totalExpenses,
    };
  }

  @Query(() => [MonthExpensesPayload])
  @UseMiddleware(isAuthMiddleware)
  async getExpensesStatistics(
    @Ctx() { payload }: MyContext,
    @Arg('year') year: number
  ): Promise<Array<MonthExpensesPayload>> {
    const totalCategories = await Category.find({
      where: { user: payload?.userId },
    });

    const totalExpensesEntities = await this.getTotalExpenseEntities(
      totalCategories
    );
    const sortedByYear = await totalExpensesEntities.filter(
      (expense) => expense.createdAt.getFullYear() === year
    );
    const expensesByDate = _.groupBy(
      sortedByYear,
      (element) => element.createdAt.getMonth() + 1
    );
    const result: Array<MonthExpensesPayload> = [];

    for (let month of Object.keys(expensesByDate)) {
      const expenses = expensesByDate[month].reduce((a, b) => a + b.amount, 0);
      result.push({ name: month, expenses });
    }
    return result;
  }

  @Query(() => [PercentageByCategoryPayload])
  @UseMiddleware(isAuthMiddleware)
  async getExpensePercentageByCategory(@Ctx() { payload }: MyContext) {
    const totalCategories = await Category.find({
      where: { user: payload?.userId },
    });
    let totalExpensesEntities;
    try {
      totalExpensesEntities = await this.getTotalExpenseEntities(
        totalCategories
      );
    } catch (e) {
      throw Error('No data found.');
    }

    const tempResult: Array<PercentageByCategoryPayload> = [];
    const totalExpenses = totalExpensesEntities.reduce(
      (a, b) => a + b.amount,
      0
    );
    const groupedByCategory = _.groupBy(
      totalExpensesEntities,
      (element) => element.category.name
    );

    for (let category of Object.keys(groupedByCategory)) {
      const sumOfCategoryExpense = groupedByCategory[category].reduce(
        (a, b) => a + b.amount,
        0
      );
      const percentage = (sumOfCategoryExpense / totalExpenses) * 100;

      tempResult.push({
        category: totalExpensesEntities.find(
          (value) => value.category.name === category
        )!.category,
        percentage,
      });
    }
    const sortedByExpenses = tempResult.sort(
      (a, b) => a.percentage - b.percentage
    );
    return this.filterByPercentage(sortedByExpenses);
  }

  filterByPercentage = (arr: Array<PercentageByCategoryPayload>) => {
    const result: Array<PercentageByCategoryPayload> = [];
    let totalPercentage = 0;
    let totalCategories = 0;

    for (let val of arr) {
      if (totalCategories > 4 || totalPercentage > 60) {
        result.push(getOtherCategory(totalCategories));
        break;
      }
      totalCategories += 1;
      totalPercentage += val.percentage;
      result.push(val);
    }
    return result;
  };
}

const getOtherCategory = (totalPercentage: number) => {
  const others = new Category();
  others.name = 'Others';
  others.id = 0;
  return { percentage: 100 - totalPercentage, category: others };
};
