import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
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
  getUserInfo: Preference;
  getCategoryExpenseStatisticsByUser: StatisticsPayload;
  getExpensesStatistics: Array<MonthExpensesPayload>;
  getExpensePercentageByCategory: Array<PercentageByCategoryPayload>;
};


export type QueryGetCategoryByIdArgs = {
  id: Scalars['Float'];
};


export type QueryGetExpenseByIdArgs = {
  id: Scalars['Float'];
};


export type QueryGetExpensesStatisticsArgs = {
  year: Scalars['Float'];
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
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  confirmed: Scalars['Boolean'];
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
  monthLimit: Scalars['Float'];
  user: User;
};

export type StatisticsPayload = {
  __typename?: 'StatisticsPayload';
  totalCategories: Scalars['Float'];
  totalExpenses: Scalars['Float'];
};

export type MonthExpensesPayload = {
  __typename?: 'MonthExpensesPayload';
  name: Scalars['String'];
  expenses: Scalars['Float'];
};

export type PercentageByCategoryPayload = {
  __typename?: 'PercentageByCategoryPayload';
  category: Category;
  percentage: Scalars['Float'];
};

export type Mutation = {
  __typename?: 'Mutation';
  updateCategoryName: Scalars['Boolean'];
  deleteCategory: Scalars['Boolean'];
  createCategory: Category;
  revokeRefreshTokenForUser: Scalars['Boolean'];
  register: RegisterResponse;
  initAdditionalRegInfo: Scalars['Boolean'];
  updateFirstName: Scalars['Boolean'];
  updateLastName: Scalars['Boolean'];
  deleteExpenseById: Scalars['Boolean'];
  updateExpenseById: Scalars['Boolean'];
  addExpense: ExpenseResponse;
  changeUserCurrency: Scalars['Boolean'];
  initializePreferences: Preference;
  deletePreferences: Scalars['Boolean'];
  updateMonthLimit: Scalars['Boolean'];
  updateUserPreference: Scalars['Boolean'];
  activateAccount: Scalars['Boolean'];
  login: LoginResponse;
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
  lastName: Scalars['String'];
  firstName: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
};


export type MutationInitAdditionalRegInfoArgs = {
  categories: Scalars['String'];
  monthLimit: Scalars['Float'];
  currency: Scalars['String'];
  userId: Scalars['String'];
};


export type MutationUpdateFirstNameArgs = {
  firstName: Scalars['String'];
};


export type MutationUpdateLastNameArgs = {
  lastName: Scalars['String'];
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
  monthLimit: Scalars['Float'];
  currency: Scalars['String'];
};


export type MutationUpdateMonthLimitArgs = {
  monthLimit: Scalars['Float'];
};


export type MutationUpdateUserPreferenceArgs = {
  currency: Scalars['String'];
  monthLimit: Scalars['Float'];
  lastName: Scalars['String'];
  firstName: Scalars['String'];
};


export type MutationActivateAccountArgs = {
  token: Scalars['String'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  email: Scalars['String'];
};

export type RegisterResponse = {
  __typename?: 'RegisterResponse';
  id: Scalars['String'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  accessToken: Scalars['String'];
};

export type AddExpenseMutationVariables = Exact<{
  categoryId: Scalars['Float'];
  amount: Scalars['Float'];
}>;


export type AddExpenseMutation = (
  { __typename?: 'Mutation' }
  & { addExpense: (
    { __typename?: 'ExpenseResponse' }
    & { category: (
      { __typename?: 'Category' }
      & Pick<Category, 'id' | 'name'>
    ), expense: (
      { __typename?: 'Expense' }
      & Pick<Expense, 'id' | 'amount'>
    ) }
  ) }
);

export type CreateCategoryMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateCategoryMutation = (
  { __typename?: 'Mutation' }
  & { createCategory: (
    { __typename?: 'Category' }
    & Pick<Category, 'id' | 'name'>
  ) }
);

export type DeleteCategoryMutationVariables = Exact<{
  id: Scalars['Float'];
}>;


export type DeleteCategoryMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteCategory'>
);

export type GetCategoryExpenseStatisticsByUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCategoryExpenseStatisticsByUserQuery = (
  { __typename?: 'Query' }
  & { getCategoryExpenseStatisticsByUser: (
    { __typename?: 'StatisticsPayload' }
    & Pick<StatisticsPayload, 'totalCategories' | 'totalExpenses'>
  ) }
);

export type CategoryByUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CategoryByUserQuery = (
  { __typename?: 'Query' }
  & { getCategoryByUser: Array<(
    { __typename?: 'Category' }
    & Pick<Category, 'id' | 'name'>
  )> }
);

export type GetExpensePercentageByCategoryQueryVariables = Exact<{ [key: string]: never; }>;


export type GetExpensePercentageByCategoryQuery = (
  { __typename?: 'Query' }
  & { getExpensePercentageByCategory: Array<(
    { __typename?: 'PercentageByCategoryPayload' }
    & Pick<PercentageByCategoryPayload, 'percentage'>
    & { category: (
      { __typename?: 'Category' }
      & Pick<Category, 'id' | 'name'>
    ) }
  )> }
);

export type GetExpensesStatisticsQueryVariables = Exact<{
  year: Scalars['Float'];
}>;


export type GetExpensesStatisticsQuery = (
  { __typename?: 'Query' }
  & { getExpensesStatistics: Array<(
    { __typename?: 'MonthExpensesPayload' }
    & Pick<MonthExpensesPayload, 'name' | 'expenses'>
  )> }
);

export type GetUserInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserInfoQuery = (
  { __typename?: 'Query' }
  & { getUserInfo: (
    { __typename?: 'Preference' }
    & Pick<Preference, 'currency' | 'monthLimit'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'email' | 'firstName' | 'lastName'>
    ) }
  ) }
);

export type InitAdditionalRegInfoMutationVariables = Exact<{
  categories: Scalars['String'];
  monthLimit: Scalars['Float'];
  currency: Scalars['String'];
  userId: Scalars['String'];
}>;


export type InitAdditionalRegInfoMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'initAdditionalRegInfo'>
);

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'LoginResponse' }
    & Pick<LoginResponse, 'accessToken'>
  ) }
);

export type RegisterMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'RegisterResponse' }
    & Pick<RegisterResponse, 'id'>
  ) }
);

export type UpdateCategoryNameMutationVariables = Exact<{
  name: Scalars['String'];
  id: Scalars['Float'];
}>;


export type UpdateCategoryNameMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'updateCategoryName'>
);

export type UpdateUserMutationVariables = Exact<{
  currency: Scalars['String'];
  monthLimit: Scalars['Float'];
  lastName: Scalars['String'];
  firstName: Scalars['String'];
}>;


export type UpdateUserMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'updateUserPreference'>
);

export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = (
  { __typename?: 'Query' }
  & { users: Array<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email'>
  )> }
);


export const AddExpenseDocument = gql`
    mutation AddExpense($categoryId: Float!, $amount: Float!) {
  addExpense(categoryId: $categoryId, amount: $amount) {
    category {
      id
      name
    }
    expense {
      id
      amount
    }
  }
}
    `;
export type AddExpenseMutationFn = ApolloReactCommon.MutationFunction<AddExpenseMutation, AddExpenseMutationVariables>;

/**
 * __useAddExpenseMutation__
 *
 * To run a mutation, you first call `useAddExpenseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddExpenseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addExpenseMutation, { data, loading, error }] = useAddExpenseMutation({
 *   variables: {
 *      categoryId: // value for 'categoryId'
 *      amount: // value for 'amount'
 *   },
 * });
 */
export function useAddExpenseMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AddExpenseMutation, AddExpenseMutationVariables>) {
        return ApolloReactHooks.useMutation<AddExpenseMutation, AddExpenseMutationVariables>(AddExpenseDocument, baseOptions);
      }
export type AddExpenseMutationHookResult = ReturnType<typeof useAddExpenseMutation>;
export type AddExpenseMutationResult = ApolloReactCommon.MutationResult<AddExpenseMutation>;
export type AddExpenseMutationOptions = ApolloReactCommon.BaseMutationOptions<AddExpenseMutation, AddExpenseMutationVariables>;
export const CreateCategoryDocument = gql`
    mutation CreateCategory($name: String!) {
  createCategory(name: $name) {
    id
    name
  }
}
    `;
export type CreateCategoryMutationFn = ApolloReactCommon.MutationFunction<CreateCategoryMutation, CreateCategoryMutationVariables>;

/**
 * __useCreateCategoryMutation__
 *
 * To run a mutation, you first call `useCreateCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCategoryMutation, { data, loading, error }] = useCreateCategoryMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateCategoryMutation, CreateCategoryMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateCategoryMutation, CreateCategoryMutationVariables>(CreateCategoryDocument, baseOptions);
      }
export type CreateCategoryMutationHookResult = ReturnType<typeof useCreateCategoryMutation>;
export type CreateCategoryMutationResult = ApolloReactCommon.MutationResult<CreateCategoryMutation>;
export type CreateCategoryMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateCategoryMutation, CreateCategoryMutationVariables>;
export const DeleteCategoryDocument = gql`
    mutation DeleteCategory($id: Float!) {
  deleteCategory(id: $id)
}
    `;
export type DeleteCategoryMutationFn = ApolloReactCommon.MutationFunction<DeleteCategoryMutation, DeleteCategoryMutationVariables>;

/**
 * __useDeleteCategoryMutation__
 *
 * To run a mutation, you first call `useDeleteCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCategoryMutation, { data, loading, error }] = useDeleteCategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteCategoryMutation, DeleteCategoryMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteCategoryMutation, DeleteCategoryMutationVariables>(DeleteCategoryDocument, baseOptions);
      }
export type DeleteCategoryMutationHookResult = ReturnType<typeof useDeleteCategoryMutation>;
export type DeleteCategoryMutationResult = ApolloReactCommon.MutationResult<DeleteCategoryMutation>;
export type DeleteCategoryMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteCategoryMutation, DeleteCategoryMutationVariables>;
export const GetCategoryExpenseStatisticsByUserDocument = gql`
    query GetCategoryExpenseStatisticsByUser {
  getCategoryExpenseStatisticsByUser {
    totalCategories
    totalExpenses
  }
}
    `;

/**
 * __useGetCategoryExpenseStatisticsByUserQuery__
 *
 * To run a query within a React component, call `useGetCategoryExpenseStatisticsByUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCategoryExpenseStatisticsByUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCategoryExpenseStatisticsByUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCategoryExpenseStatisticsByUserQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetCategoryExpenseStatisticsByUserQuery, GetCategoryExpenseStatisticsByUserQueryVariables>) {
        return ApolloReactHooks.useQuery<GetCategoryExpenseStatisticsByUserQuery, GetCategoryExpenseStatisticsByUserQueryVariables>(GetCategoryExpenseStatisticsByUserDocument, baseOptions);
      }
export function useGetCategoryExpenseStatisticsByUserLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetCategoryExpenseStatisticsByUserQuery, GetCategoryExpenseStatisticsByUserQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetCategoryExpenseStatisticsByUserQuery, GetCategoryExpenseStatisticsByUserQueryVariables>(GetCategoryExpenseStatisticsByUserDocument, baseOptions);
        }
export type GetCategoryExpenseStatisticsByUserQueryHookResult = ReturnType<typeof useGetCategoryExpenseStatisticsByUserQuery>;
export type GetCategoryExpenseStatisticsByUserLazyQueryHookResult = ReturnType<typeof useGetCategoryExpenseStatisticsByUserLazyQuery>;
export type GetCategoryExpenseStatisticsByUserQueryResult = ApolloReactCommon.QueryResult<GetCategoryExpenseStatisticsByUserQuery, GetCategoryExpenseStatisticsByUserQueryVariables>;
export const CategoryByUserDocument = gql`
    query CategoryByUser {
  getCategoryByUser {
    id
    name
  }
}
    `;

/**
 * __useCategoryByUserQuery__
 *
 * To run a query within a React component, call `useCategoryByUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useCategoryByUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCategoryByUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useCategoryByUserQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<CategoryByUserQuery, CategoryByUserQueryVariables>) {
        return ApolloReactHooks.useQuery<CategoryByUserQuery, CategoryByUserQueryVariables>(CategoryByUserDocument, baseOptions);
      }
export function useCategoryByUserLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<CategoryByUserQuery, CategoryByUserQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<CategoryByUserQuery, CategoryByUserQueryVariables>(CategoryByUserDocument, baseOptions);
        }
export type CategoryByUserQueryHookResult = ReturnType<typeof useCategoryByUserQuery>;
export type CategoryByUserLazyQueryHookResult = ReturnType<typeof useCategoryByUserLazyQuery>;
export type CategoryByUserQueryResult = ApolloReactCommon.QueryResult<CategoryByUserQuery, CategoryByUserQueryVariables>;
export const GetExpensePercentageByCategoryDocument = gql`
    query GetExpensePercentageByCategory {
  getExpensePercentageByCategory {
    category {
      id
      name
    }
    percentage
  }
}
    `;

/**
 * __useGetExpensePercentageByCategoryQuery__
 *
 * To run a query within a React component, call `useGetExpensePercentageByCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetExpensePercentageByCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetExpensePercentageByCategoryQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetExpensePercentageByCategoryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetExpensePercentageByCategoryQuery, GetExpensePercentageByCategoryQueryVariables>) {
        return ApolloReactHooks.useQuery<GetExpensePercentageByCategoryQuery, GetExpensePercentageByCategoryQueryVariables>(GetExpensePercentageByCategoryDocument, baseOptions);
      }
export function useGetExpensePercentageByCategoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetExpensePercentageByCategoryQuery, GetExpensePercentageByCategoryQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetExpensePercentageByCategoryQuery, GetExpensePercentageByCategoryQueryVariables>(GetExpensePercentageByCategoryDocument, baseOptions);
        }
export type GetExpensePercentageByCategoryQueryHookResult = ReturnType<typeof useGetExpensePercentageByCategoryQuery>;
export type GetExpensePercentageByCategoryLazyQueryHookResult = ReturnType<typeof useGetExpensePercentageByCategoryLazyQuery>;
export type GetExpensePercentageByCategoryQueryResult = ApolloReactCommon.QueryResult<GetExpensePercentageByCategoryQuery, GetExpensePercentageByCategoryQueryVariables>;
export const GetExpensesStatisticsDocument = gql`
    query GetExpensesStatistics($year: Float!) {
  getExpensesStatistics(year: $year) {
    name
    expenses
  }
}
    `;

/**
 * __useGetExpensesStatisticsQuery__
 *
 * To run a query within a React component, call `useGetExpensesStatisticsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetExpensesStatisticsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetExpensesStatisticsQuery({
 *   variables: {
 *      year: // value for 'year'
 *   },
 * });
 */
export function useGetExpensesStatisticsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetExpensesStatisticsQuery, GetExpensesStatisticsQueryVariables>) {
        return ApolloReactHooks.useQuery<GetExpensesStatisticsQuery, GetExpensesStatisticsQueryVariables>(GetExpensesStatisticsDocument, baseOptions);
      }
export function useGetExpensesStatisticsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetExpensesStatisticsQuery, GetExpensesStatisticsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetExpensesStatisticsQuery, GetExpensesStatisticsQueryVariables>(GetExpensesStatisticsDocument, baseOptions);
        }
export type GetExpensesStatisticsQueryHookResult = ReturnType<typeof useGetExpensesStatisticsQuery>;
export type GetExpensesStatisticsLazyQueryHookResult = ReturnType<typeof useGetExpensesStatisticsLazyQuery>;
export type GetExpensesStatisticsQueryResult = ApolloReactCommon.QueryResult<GetExpensesStatisticsQuery, GetExpensesStatisticsQueryVariables>;
export const GetUserInfoDocument = gql`
    query getUserInfo {
  getUserInfo {
    currency
    monthLimit
    user {
      email
      firstName
      lastName
    }
  }
}
    `;

/**
 * __useGetUserInfoQuery__
 *
 * To run a query within a React component, call `useGetUserInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserInfoQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserInfoQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetUserInfoQuery, GetUserInfoQueryVariables>) {
        return ApolloReactHooks.useQuery<GetUserInfoQuery, GetUserInfoQueryVariables>(GetUserInfoDocument, baseOptions);
      }
export function useGetUserInfoLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetUserInfoQuery, GetUserInfoQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetUserInfoQuery, GetUserInfoQueryVariables>(GetUserInfoDocument, baseOptions);
        }
export type GetUserInfoQueryHookResult = ReturnType<typeof useGetUserInfoQuery>;
export type GetUserInfoLazyQueryHookResult = ReturnType<typeof useGetUserInfoLazyQuery>;
export type GetUserInfoQueryResult = ApolloReactCommon.QueryResult<GetUserInfoQuery, GetUserInfoQueryVariables>;
export const InitAdditionalRegInfoDocument = gql`
    mutation initAdditionalRegInfo($categories: String!, $monthLimit: Float!, $currency: String!, $userId: String!) {
  initAdditionalRegInfo(monthLimit: $monthLimit, currency: $currency, userId: $userId, categories: $categories)
}
    `;
export type InitAdditionalRegInfoMutationFn = ApolloReactCommon.MutationFunction<InitAdditionalRegInfoMutation, InitAdditionalRegInfoMutationVariables>;

/**
 * __useInitAdditionalRegInfoMutation__
 *
 * To run a mutation, you first call `useInitAdditionalRegInfoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInitAdditionalRegInfoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [initAdditionalRegInfoMutation, { data, loading, error }] = useInitAdditionalRegInfoMutation({
 *   variables: {
 *      categories: // value for 'categories'
 *      monthLimit: // value for 'monthLimit'
 *      currency: // value for 'currency'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useInitAdditionalRegInfoMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<InitAdditionalRegInfoMutation, InitAdditionalRegInfoMutationVariables>) {
        return ApolloReactHooks.useMutation<InitAdditionalRegInfoMutation, InitAdditionalRegInfoMutationVariables>(InitAdditionalRegInfoDocument, baseOptions);
      }
export type InitAdditionalRegInfoMutationHookResult = ReturnType<typeof useInitAdditionalRegInfoMutation>;
export type InitAdditionalRegInfoMutationResult = ApolloReactCommon.MutationResult<InitAdditionalRegInfoMutation>;
export type InitAdditionalRegInfoMutationOptions = ApolloReactCommon.BaseMutationOptions<InitAdditionalRegInfoMutation, InitAdditionalRegInfoMutationVariables>;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    accessToken
  }
}
    `;
export type LoginMutationFn = ApolloReactCommon.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        return ApolloReactHooks.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, baseOptions);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = ApolloReactCommon.MutationResult<LoginMutation>;
export type LoginMutationOptions = ApolloReactCommon.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($email: String!, $password: String!, $firstName: String!, $lastName: String!) {
  register(email: $email, password: $password, firstName: $firstName, lastName: $lastName) {
    id
  }
}
    `;
export type RegisterMutationFn = ApolloReactCommon.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *      firstName: // value for 'firstName'
 *      lastName: // value for 'lastName'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        return ApolloReactHooks.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, baseOptions);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = ApolloReactCommon.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = ApolloReactCommon.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const UpdateCategoryNameDocument = gql`
    mutation updateCategoryName($name: String!, $id: Float!) {
  updateCategoryName(name: $name, id: $id)
}
    `;
export type UpdateCategoryNameMutationFn = ApolloReactCommon.MutationFunction<UpdateCategoryNameMutation, UpdateCategoryNameMutationVariables>;

/**
 * __useUpdateCategoryNameMutation__
 *
 * To run a mutation, you first call `useUpdateCategoryNameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCategoryNameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCategoryNameMutation, { data, loading, error }] = useUpdateCategoryNameMutation({
 *   variables: {
 *      name: // value for 'name'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUpdateCategoryNameMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateCategoryNameMutation, UpdateCategoryNameMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateCategoryNameMutation, UpdateCategoryNameMutationVariables>(UpdateCategoryNameDocument, baseOptions);
      }
export type UpdateCategoryNameMutationHookResult = ReturnType<typeof useUpdateCategoryNameMutation>;
export type UpdateCategoryNameMutationResult = ApolloReactCommon.MutationResult<UpdateCategoryNameMutation>;
export type UpdateCategoryNameMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateCategoryNameMutation, UpdateCategoryNameMutationVariables>;
export const UpdateUserDocument = gql`
    mutation updateUser($currency: String!, $monthLimit: Float!, $lastName: String!, $firstName: String!) {
  updateUserPreference(currency: $currency, monthLimit: $monthLimit, lastName: $lastName, firstName: $firstName)
}
    `;
export type UpdateUserMutationFn = ApolloReactCommon.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      currency: // value for 'currency'
 *      monthLimit: // value for 'monthLimit'
 *      lastName: // value for 'lastName'
 *      firstName: // value for 'firstName'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, baseOptions);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = ApolloReactCommon.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const UsersDocument = gql`
    query Users {
  users {
    id
    email
  }
}
    `;

/**
 * __useUsersQuery__
 *
 * To run a query within a React component, call `useUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useUsersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UsersQuery, UsersQueryVariables>) {
        return ApolloReactHooks.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, baseOptions);
      }
export function useUsersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, baseOptions);
        }
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersQueryResult = ApolloReactCommon.QueryResult<UsersQuery, UsersQueryVariables>;