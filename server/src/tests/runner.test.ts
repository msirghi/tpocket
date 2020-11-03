import { authResolverTest } from "./authResolver.test";
import { userResolverTest } from "./userResolver.test";
import { categoryResolverTest } from "./categoryResolver.test";
import { preferenceResolverTest } from "./preferenceResolver.test";
import { expenseResolverTest } from './expenseResolver.test';
import { statisticsResolverTest } from './statisticsResolver.test';
import { notificationResolverTest } from "./notificationResolver.test";
import { validatorsTest } from "./validators.test";
import { tokenServiceTest } from "./tokenService.test";

global.fetch = require("node-fetch");

describe('Test runner', () => {
  authResolverTest();
  userResolverTest();
  categoryResolverTest();
  preferenceResolverTest();
  expenseResolverTest();
  statisticsResolverTest();
  notificationResolverTest();
  validatorsTest();
  tokenServiceTest();
})
