import React, { useEffect, useState } from 'react';
import {
  Category,
  useCategoryByUserQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} from '../generated/graphql';
import { CategoryCard } from '../components/category/CategoryCard';
import { Grid } from '@material-ui/core';
import { PageHeader } from '../components/layout/PageHeader';
import {
  CATEGORY_CREATED,
  CATEGORY_DELETE_WARN,
  CATEGORY_DELETED,
  CATEGORY_HEADER_SECONDARY,
} from '../constants';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import { TwoRowButtons } from '../components/button/TwoRowButtons';
import { CategorySearch } from '../components/category/CategorySearch';
import { AddUpdateCategoryDialog } from '../components/dialog/AddUpdateCategoryDialog';
import { useSnackbar } from 'notistack';
import { ConfirmationDialog } from '../components/dialog/ConfirmationDialog';

type ICategory =
  | Array<{ __typename?: 'Category' } & Pick<Category, 'id' | 'name'>>
  | undefined;

let initialData: ICategory = [];

export const CategoryPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { data, loading } = useCategoryByUserQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [isLoading, setLoading] = useState<boolean>(false);
  const [searchMode, setSearchMode] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const [categoryData, setCategoryData] = useState<ICategory>([]);
  const [creationDialog, setCreationDialog] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [confirmationDialog, setConfirmationDialog] = useState<boolean>(false);

  useEffect(() => {
    if (searchValue || typeof searchValue === 'string') {
      setCategoryData(
        data?.getCategoryByUser.filter((category) =>
          category.name.includes(searchValue)
        )
      );
    }
  }, [searchValue, data]);

  useEffect(() => {
    setCategoryData(initialData);
    setSearchValue(null);
  }, [searchMode]);

  useEffect(() => {
    initialData = data?.getCategoryByUser;
    setCategoryData(data?.getCategoryByUser);
  }, [data]);

  const initData = (newData: Array<Category> | ICategory) => {
    initialData = newData;
    setCategoryData(newData);
  };

  const createCategoryHandler = async (val: Category) => {
    setLoading(true);
    try {
      const response = await createCategory({ variables: { ...val } });
      if (response && response.data) {
        enqueueSnackbar(CATEGORY_CREATED, { variant: 'success' });
        setCreationDialog(false);
        setLoading(false);
        const newData = [
          ...data?.getCategoryByUser,
          { id: response.data.createCategory.id, name: val.name },
        ];
        initData(newData);
        data?.getCategoryByUser.push({
          id: response.data.createCategory.id,
          name: val.name,
        });
      }
    } catch (e) {
      setLoading(false);
      enqueueSnackbar(e.graphQLErrors[0].message, { variant: 'error' });
    }
  };

  const removeCategory = (category: Category) => {
    data?.getCategoryByUser.splice(
      data?.getCategoryByUser.indexOf(category),
      1
    );
  };

  const deleteCategoryHandler = async (id: number) => {
    setLoading(true);
    try {
      const response = await deleteCategory({ variables: { id } });

      if (response && response.data) {
        enqueueSnackbar(CATEGORY_DELETED, { variant: 'success' });
        setSelectedCategory(null);
        const newData: ICategory = data?.getCategoryByUser.filter(
          (val) => val.id !== id
        );
        initData(newData);
        setConfirmationDialog(false);
        setLoading(false);
        removeCategory(
          data?.getCategoryByUser.find((val) => val.id === id) as Category
        );
      }
    } catch (e) {
      setLoading(false);
      enqueueSnackbar(e.graphQLErrors[0].message, { variant: 'error' });
    }
  };

  if (loading || !categoryData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <AddUpdateCategoryDialog
        isLoading={isLoading}
        onSubmit={createCategoryHandler}
        open={creationDialog}
        toggleDialog={(val: boolean) => setCreationDialog(val)}
        selectedCategory={selectedCategory}
        deselectCategory={() => setSelectedCategory(null)}
      />

      <ConfirmationDialog
        open={confirmationDialog}
        toggleDialog={setConfirmationDialog}
        onSubmit={() => deleteCategoryHandler(selectedCategory?.id!)}
        isLoading={isLoading}
        title={'Category delete'}
      >
        {CATEGORY_DELETE_WARN}
      </ConfirmationDialog>

      <PageHeader
        primaryText={'Categories'}
        secondaryText={CATEGORY_HEADER_SECONDARY}
      />

      {searchMode ? (
        <CategorySearch
          resultCountShown={searchValue !== null && searchValue.length > 0}
          resultCount={categoryData.length}
          onChange={(e: React.FormEvent<HTMLInputElement>) =>
            setSearchValue(e.currentTarget.value)
          }
          onClose={() => setSearchMode(false)}
        />
      ) : (
        <TwoRowButtons
          buttonWidth={150}
          leftIcon={<SearchIcon />}
          rightIcon={<AddIcon />}
          leftLabel={'Search '}
          rightLabel={'Add'}
          leftClickHandler={() => setSearchMode(true)}
          rightClickHandler={() => setCreationDialog(true)}
        />
      )}

      <Grid container spacing={2} justify={'center'}>
        {categoryData.length ? (
          categoryData.map((value) => (
            <Grid item>
              <CategoryCard
                imageUrl={'https://source.unsplash.com/random/345x140'}
                key={value.id}
                name={value.name}
                onEdit={() => {
                  setSelectedCategory(value);
                  setCreationDialog(true);
                }}
                onRemove={() => {
                  setConfirmationDialog(true);
                  setSelectedCategory(value);
                }}
              />
            </Grid>
          ))
        ) : (
          <div>No category found.</div>
        )}
      </Grid>
    </>
  );
};
