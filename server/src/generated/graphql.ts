import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  getCategoryByUser: Array<Category>;
  getCategoryById: Category;
  users: Array<User>;
  getExpenseById: Expense;
  getAllUserExpenses: Array<ExpenseResponse>;
  getUserPreferences: Preference;
};


export type QueryGetCategoryByIdArgs = {
  id: Scalars['Float'];
};


export type QueryGetExpenseByIdArgs = {
  id: Scalars['Float'];
};

export type Category = {
  __typename?: 'Category';
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Int'];
  email: Scalars['String'];
};

export type Expense = {
  __typename?: 'Expense';
  id: Scalars['Int'];
  amount: Scalars['Float'];
};

export type ExpenseResponse = {
  __typename?: 'ExpenseResponse';
  category: Category;
  expense: Expense;
};

export type Preference = {
  __typename?: 'Preference';
  id: Scalars['Int'];
  currency: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  updateCategoryName: Scalars['Boolean'];
  deleteCategory: Scalars['Boolean'];
  createCategory: Category;
  revokeRefreshTokenForUser: Scalars['Boolean'];
  register: Scalars['Boolean'];
  login: LoginResponse;
  deleteExpenseById: Scalars['Boolean'];
  updateExpenseById: Scalars['Boolean'];
  addExpense: ExpenseResponse;
  changeUserCurrency: Scalars['Boolean'];
  initializePreferences: Preference;
};


export type MutationUpdateCategoryNameArgs = {
  name: Scalars['String'];
  id: Scalars['Float'];
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['Float'];
};


export type MutationCreateCategoryArgs = {
  name: Scalars['String'];
};


export type MutationRegisterArgs = {
  password: Scalars['String'];
  email: Scalars['String'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  email: Scalars['String'];
};


export type MutationDeleteExpenseByIdArgs = {
  id: Scalars['Float'];
};


export type MutationUpdateExpenseByIdArgs = {
  id: Scalars['Float'];
  amount: Scalars['Float'];
};


export type MutationAddExpenseArgs = {
  categoryId: Scalars['Float'];
  amount: Scalars['Float'];
};


export type MutationChangeUserCurrencyArgs = {
  currency: Scalars['String'];
};


export type MutationInitializePreferencesArgs = {
  currency: Scalars['String'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  accessToken: Scalars['String'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Category: ResolverTypeWrapper<Category>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  User: ResolverTypeWrapper<User>;
  Expense: ResolverTypeWrapper<Expense>;
  ExpenseResponse: ResolverTypeWrapper<ExpenseResponse>;
  Preference: ResolverTypeWrapper<Preference>;
  Mutation: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  LoginResponse: ResolverTypeWrapper<LoginResponse>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {};
  Float: Scalars['Float'];
  Category: Category;
  Int: Scalars['Int'];
  String: Scalars['String'];
  User: User;
  Expense: Expense;
  ExpenseResponse: ExpenseResponse;
  Preference: Preference;
  Mutation: {};
  Boolean: Scalars['Boolean'];
  LoginResponse: LoginResponse;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getCategoryByUser?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType>;
  getCategoryById?: Resolver<ResolversTypes['Category'], ParentType, ContextType, RequireFields<QueryGetCategoryByIdArgs, 'id'>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  getExpenseById?: Resolver<ResolversTypes['Expense'], ParentType, ContextType, RequireFields<QueryGetExpenseByIdArgs, 'id'>>;
  getAllUserExpenses?: Resolver<Array<ResolversTypes['ExpenseResponse']>, ParentType, ContextType>;
  getUserPreferences?: Resolver<ResolversTypes['Preference'], ParentType, ContextType>;
};

export type CategoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Category'] = ResolversParentTypes['Category']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type ExpenseResolvers<ContextType = any, ParentType extends ResolversParentTypes['Expense'] = ResolversParentTypes['Expense']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type ExpenseResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ExpenseResponse'] = ResolversParentTypes['ExpenseResponse']> = {
  category?: Resolver<ResolversTypes['Category'], ParentType, ContextType>;
  expense?: Resolver<ResolversTypes['Expense'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type PreferenceResolvers<ContextType = any, ParentType extends ResolversParentTypes['Preference'] = ResolversParentTypes['Preference']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  currency?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  updateCategoryName?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUpdateCategoryNameArgs, 'name' | 'id'>>;
  deleteCategory?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteCategoryArgs, 'id'>>;
  createCategory?: Resolver<ResolversTypes['Category'], ParentType, ContextType, RequireFields<MutationCreateCategoryArgs, 'name'>>;
  revokeRefreshTokenForUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  register?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationRegisterArgs, 'password' | 'email'>>;
  login?: Resolver<ResolversTypes['LoginResponse'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'password' | 'email'>>;
  deleteExpenseById?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteExpenseByIdArgs, 'id'>>;
  updateExpenseById?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUpdateExpenseByIdArgs, 'id' | 'amount'>>;
  addExpense?: Resolver<ResolversTypes['ExpenseResponse'], ParentType, ContextType, RequireFields<MutationAddExpenseArgs, 'categoryId' | 'amount'>>;
  changeUserCurrency?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationChangeUserCurrencyArgs, 'currency'>>;
  initializePreferences?: Resolver<ResolversTypes['Preference'], ParentType, ContextType, RequireFields<MutationInitializePreferencesArgs, 'currency'>>;
};

export type LoginResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginResponse'] = ResolversParentTypes['LoginResponse']> = {
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type Resolvers<ContextType = any> = {
  Query?: QueryResolvers<ContextType>;
  Category?: CategoryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Expense?: ExpenseResolvers<ContextType>;
  ExpenseResponse?: ExpenseResponseResolvers<ContextType>;
  Preference?: PreferenceResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  LoginResponse?: LoginResponseResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
