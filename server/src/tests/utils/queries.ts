export const getUserPreferencesQuery = () => `
  query {
    getUserPreferences {
      id
      currency
      monthLimit
    }
  }
`;

export const getCategoryById = (id: number | string) => {
  return `
    query {
      getCategoryById(id: ${ id }) {
        id
        name
      }
    }
  `;
}

export const getAllCategoriesByUser = () => {
  return `
  {
    getCategoryByUser {
      id
      name
    }
  }
  `;
}

export const getAllUserExpensesQuery = () => `
  {
    getAllUserExpenses {
      category {
        name
      }
      expense {
        id
        amount
      }
    }
  }
`;

export const getExpenseByIdQuery = (id: number) => `
  {
    getExpenseById(id: ${ id }) {
      id
      amount
    }
  }
`;

export const getCategoryExpenseStatisticsByUserQuery = () => `
  {
    getCategoryExpenseStatisticsByUser {
      totalCategories
      totalExpenses
    }
  }
`;

export const getExpensesStatisticsQuery = (year: number) => `
  {
    getExpensesStatistics(year: ${year}) {
      name
      expenses
    }
  }
`;

export const getExpensePercentageByCategoryQuery = () => `
  {
    getExpensePercentageByCategory {
      category {
        id
        name
      }
      percentage
    }
  }
`;
