import { getClientWithTokenInterceptor } from "./utils/getClientWithTokenInterceptor";
import { GraphQLClient } from "graphql-request";
import { addExpenseMutation, deleteExpenseById, updateExpenseByIdMutation } from "./utils/mutations";
import { getCategoryId, getCategoryName } from "./utils/categoryInfo";
import { CATEGORY_NOT_FOUND, NOT_FOUND } from "../constants/error.constants";
import { getAllUserExpensesQuery, getExpenseByIdQuery } from "./utils/queries";

const Chance = require('chance');

export const expenseResolverTest = () => describe('Expense resolver', () => {

  const chance = new Chance();
  let expenseId: number;
  let client: GraphQLClient;

  beforeAll(async () => {
    client = await getClientWithTokenInterceptor();
  });

  it('should add expense', async () => {
    const response = await client.request(addExpenseMutation(getCategoryId(), 100));

    expect(response.addExpense.category.id).toBe(getCategoryId());
    expect(response.addExpense.category.name).toBe(getCategoryName());
    expect(typeof response.addExpense.expense.id).toBe('number');
    expect(response.addExpense.expense.amount).toBe(100);
    expenseId = response.addExpense.expense.id;
  });

  it('should throw an error if amount is a random string', async () => {
    try {
      await client.request(addExpenseMutation(getCategoryId(), chance.word({ length: 5 })));
    } catch (e) {
      expect(String(e).includes('cannot represent non numeric value:')).toBeTruthy();
    }
  });

  it('should throw an error if category does not exist', async () => {
    try {
      await client.request(addExpenseMutation(99, 100));
    } catch (e) {
      expect(String(e).includes(CATEGORY_NOT_FOUND)).toBeTruthy();
    }
  });

  it('should return all user expenses', async () => {
    const response = await client.request(getAllUserExpensesQuery());
    expect(Array.isArray(response.getAllUserExpenses)).toBeTruthy();
    expect(response.getAllUserExpenses[response.getAllUserExpenses.length - 1].category.name).toBe(getCategoryName());
    expect(response.getAllUserExpenses[response.getAllUserExpenses.length - 1].expense.amount).toBe(100);
  });

  it('should return expense by id', async () => {
    const response = await client.request(getExpenseByIdQuery(expenseId));
    expect(response.getExpenseById.id).toBe(expenseId);
    expect(response.getExpenseById.amount).toBe(100);
  });

  it('should throw an error if expense is not found by id', async () => {
    try {
      await client.request(getExpenseByIdQuery(99));
    } catch (e) {
      expect(String(e).includes(NOT_FOUND)).toBeTruthy();
    }
  });

  it('should update expense by id', async () => {
    const response = await client.request(updateExpenseByIdMutation(expenseId, 150));
    expect(response.updateExpenseById).toBeTruthy();
  });

  it('should return expense by id after update', async () => {
    const response = await client.request(getExpenseByIdQuery(expenseId));
    expect(response.getExpenseById.id).toBe(expenseId);
    expect(response.getExpenseById.amount).toBe(150);
  });

  it('should throw an error on update if expense was not found', async () => {
    try {
      await client.request(updateExpenseByIdMutation(99, 100));
    } catch (e) {
      expect(String(e).includes(NOT_FOUND)).toBeTruthy();
    }
  });

  it('should throw an error on delete if expense was not found', async () => {
    try {
      await client.request(deleteExpenseById(99));
    } catch (e) {
      expect(String(e).includes(NOT_FOUND)).toBeTruthy();
    }
  });

  it('should delete expense by id', async () => {
    const response = await client.request(deleteExpenseById(expenseId));
    expect(response.deleteExpenseById).toBeTruthy();
  });

  it('should throw an error on getting expense after delete', async () => {
    try {
      await client.request(getExpenseByIdQuery(expenseId));
    } catch (e) {
      expect(String(e).includes(NOT_FOUND)).toBeTruthy();
    }
  });
});
