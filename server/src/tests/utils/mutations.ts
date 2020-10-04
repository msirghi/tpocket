export const initPrefsMutation = (currency: string) => `
  mutation {
    initializePreferences(currency: "${currency}") {
      id
      currency
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
