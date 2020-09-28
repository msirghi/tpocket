let category: number | string;
let categoryName: string;

export const setCategoryId = (categoryId: number | string) => {
  category = categoryId;
}

export const getCategoryId = () => category;

export const setCategoryName = (name: string) => {
  categoryName = name;
}

export const getCategoryName = () => categoryName;
