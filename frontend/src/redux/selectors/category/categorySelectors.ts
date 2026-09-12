import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export const selectCategoryState = (state: RootState) => state.category;

export const selectSelectedCategories = createSelector(
  [selectCategoryState],
  category => category.selectedCategories,
);

export const selectSelectedCategoryCount = createSelector(
  [selectSelectedCategories],
  selected => selected.length,
);

export const selectActiveCategory = createSelector(
  [selectCategoryState],
  category => category.activeCategory,
);

export const selectIsCategoryCompleted = createSelector(
  [selectCategoryState],
  category => category.isCompleted,
);
