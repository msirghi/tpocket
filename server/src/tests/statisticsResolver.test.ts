import { getCategoryId } from './utils/categoryInfo';
import { addExpenseMutation } from './utils/mutations';
import { GraphQLClient } from 'graphql-request';
import { getClientWithTokenInterceptor } from './utils/getClientWithTokenInterceptor';
import {
  getCategoryExpenseStatisticsByUserQuery,
  getExpensePercentageByCategoryQuery,
  getExpensesStatisticsQuery
} from './utils/queries';

export const statisticsResolverTest = () =>
  describe('Statistics Resolver', () => {
    let client: GraphQLClient;

    beforeAll(async () => {
      client = await getClientWithTokenInterceptor();
      await client.request(addExpenseMutation(getCategoryId(), 100));
    });

    it('should return total categories and expenses of user', async () => {
      const response = await client.request(getCategoryExpenseStatisticsByUserQuery());

      expect(typeof response.getCategoryExpenseStatisticsByUser.totalCategories).toBe('number');
      expect(typeof response.getCategoryExpenseStatisticsByUser.totalExpenses).toBe('number');
    });

    it('should return expenses of each month by current year', async () => {
      const response = await client.request(getExpensesStatisticsQuery(new Date().getFullYear()));

      expect(response.getExpensesStatistics.length > 0).toBeTruthy();
      expect(typeof response.getExpensesStatistics[0].name).toBe('string');
      expect(response.getExpensesStatistics[0].expenses).toBeDefined();
    });

    it('should return no expenses for next year', async () => {
      const response = await client.request(
        getExpensesStatisticsQuery(new Date().getFullYear() + 1)
      );

      expect(response.getExpensesStatistics.length).toBe(0);
    });

    it('should return expense percentages of each user category', async () => {
      const response = await client.request(getExpensePercentageByCategoryQuery());

      expect(response.getExpensePercentageByCategory.length > 0).toBeTruthy();
      expect(response.getExpensePercentageByCategory[0].category.id).toBeDefined();
      expect(response.getExpensePercentageByCategory[0].category.name).toBeDefined();
      expect(response.getExpensePercentageByCategory[0].percentage).toBeDefined();
    });

    // it('should contain category "others" if other category in sum have > 60%', async () => {
    //   const response = await client.request(getExpensePercentageByCategoryQuery());
    //   const others = response.getExpensePercentageByCategory.find((val: { category: { name: string; }; }) => val.category.name === 'Others');

    //   expect(others).toBeDefined();
    //   expect(others.category.id).toBe(0);
    //   expect(others.percentage <= 40).toBeTruthy();
    // });
  });
