export const initPrefsMutation = (currency: string, monthLimit: number) => `
  mutation {
    initializePreferences(currency: "${currency}", monthLimit: ${monthLimit}) {
      id
      currency
      monthLimit
    }
  }
`;

export const deletePrefsMutation = () => `
  mutation {
    deletePreferences
  }
`;

export const changeUserCurrencyMutation = (currency: string) => `
  mutation {
    changeUserCurrency(currency: "${currency}" )
  }
`;

export const getCreateCategoryMutation = (name: string) => {
  return `
    mutation {
      createCategory(name: "${name}") {
        id
      }
    }
  `;
};

export const updateCategoryName = (id: number | string, categoryName: string) => {
  return `
    mutation {
      updateCategoryName(id: ${id}, name: "${categoryName}")
    }
  `;
};

export const deleteCategoryById = (id: number | string) => {
  return `
    mutation {
      deleteCategory(id: ${id})
    }
  `;
};

export const addExpenseMutation = (categoryId: number | string, amount: number | string) => `
  mutation {
    addExpense(categoryId: ${categoryId}, amount: ${amount}) {
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

export const updateExpenseByIdMutation = (id: number, amount: number) => `
  mutation {
    updateExpenseById(id: ${id}, amount: ${amount})
  }
`;

export const deleteExpenseById = (id: number) => `
  mutation {
    deleteExpenseById(id: ${id})
  }
`;

export const updateMonthLimitMutation = (limit: number) => `
  mutation {
    updateMonthLimit(monthLimit: ${limit})
  }
`;

export const updateFirstNameMutation = (name: string) => `
  mutation {
    updateFirstName(firstName: "${name}")
  }
`;

export const updateLastNameMutation = (name: string) => `
  mutation {
    updateLastName(lastName: "${name}")
  }
`;

export const initAdditionalRegInfoMutation = (
  categories: string,
  userId: string,
  currency: string,
  monthLimit: number
) => `
  mutation {
    initAdditionalRegInfo(
      monthLimit: ${monthLimit}
      currency: "${currency}"
      userId: "${userId}"
      categories: "${categories}"
    )
  }
`;

export const registerMutation = (
  email: string,
  password: string,
  lastName: string,
  firstName: string
) => `
    mutation {
     register(email: "${email}", password: "${password}", lastName: "${lastName}", firstName: "${firstName}") {
       id
     }
   }
  `;

export const loginMutation = (email: string, password: string) => `
    mutation {
      login(email: "${email}", password: "${password}") {
        accessToken
      }
    }
  `;

export const revokeRefreshTokenMutation = () => `
    mutation {
      revokeRefreshTokenForUser
    }
  `;

export const activeAccountMutation = (token: string) => `
  mutation {
    activateAccount(token: "${token}")
  }
`;
