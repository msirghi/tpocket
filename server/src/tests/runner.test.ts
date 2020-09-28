import { userResolverTest } from "./userResolver.test";
import { categoryResolverTest } from "./categoryResolver.test";
import { preferenceResolverTest } from "./preferenceResolver.test";
import { expenseResolverTest } from './expenseResolver.test';
import { statisticsResolverTest } from './statisticsResolver.test';

global.fetch = require("node-fetch");

describe('Test runner', () => {
  userResolverTest();
  categoryResolverTest();
  preferenceResolverTest();
  expenseResolverTest();
  statisticsResolverTest();
})
