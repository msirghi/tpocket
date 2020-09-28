import { GraphQLClient } from 'graphql-request';
import { CATEGORY_ALREADY_EXISTS, NOT_FOUND } from "../constants/error.constants";
import { getClientWithTokenInterceptor } from "./utils/getClientWithTokenInterceptor";
import { deleteCategoryById, getCreateCategoryMutation, updateCategoryName } from "./utils/mutations";
import { getAllCategoriesByUser, getCategoryById } from "./utils/queries";
import { setCategoryId, setCategoryName } from "./utils/categoryInfo";

const Chance = require('chance');

export const categoryResolverTest = () => describe("Category resolver", () => {
  const chance = new Chance();
  let categoryName: string;
  let client: GraphQLClient;
  let categoryId: string | number;
  let newName: string;

  beforeAll(async () => {
    client = await getClientWithTokenInterceptor();
    categoryName = chance.word({ length: 5 });
  });

  it('should create new category', async () => {
    const response = await client.request(getCreateCategoryMutation(categoryName));
    expect(response.createCategory).toBeTruthy();
    categoryId = response.createCategory.id;
    setCategoryId(categoryId);
  });

  it('should throw an error if user already has given category', async () => {
    try {
      await client.request(getCreateCategoryMutation(categoryName))
    } catch (e) {
      expect(String(e).includes(CATEGORY_ALREADY_EXISTS)).toBeTruthy();
    }
  });

  it('should update category name', async () => {
    newName = chance.word({ length: 6 });
    await client.request(updateCategoryName(categoryId, newName));
    const response = await client.request(getCategoryById(categoryId));

    expect(response.getCategoryById.name).toEqual(newName);
  });

  it('should throw an error on update if user already has this category', async () => {
    try {
      await client.request(updateCategoryName(categoryId, newName));
    } catch (e) {
      expect(String(e).includes(CATEGORY_ALREADY_EXISTS)).toBeTruthy();
    }
  });

  it('should return category by id', async () => {
    const response = await client.request(getCategoryById(categoryId));
    expect(response.getCategoryById).toEqual({ id: categoryId, name: newName });
  });

  it('should throw an error if category doesn\'t exist', async () => {
    try {
      await client.request(getCategoryById(categoryId));
    } catch (e) {
      expect(String(e).includes(NOT_FOUND)).toBeTruthy();
    }
  });

  it('should return all categories by user', async () => {
    const response = await client.request(getAllCategoriesByUser());
    expect(Array.isArray(response.getCategoryByUser)).toBeTruthy();
  });

  it('should delete category by id', async () => {
    const response = await client.request(deleteCategoryById(categoryId));
    expect(response.deleteCategory).toBeTruthy();

    try {
      await client.request(getCategoryById(categoryId));
    } catch (e) {
      expect(String(e).includes(NOT_FOUND)).toBeTruthy();
    }
  });

  it('should create another category', async () => {
    const response = await client.request(getCreateCategoryMutation(categoryName));
    expect(response.createCategory).toBeTruthy();
    categoryId = response.createCategory.id;
    setCategoryId(categoryId);
    setCategoryName(categoryName);
  });
});
