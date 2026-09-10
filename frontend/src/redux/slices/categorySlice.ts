import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CategoryState {
  selectedCategories: string[];
  isCompleted: boolean;
}

const initialState: CategoryState = {
  selectedCategories: ['wallet', 'food'], // Default sensible selections
  isCompleted: false,
};

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    toggleCategory: (state, action: PayloadAction<string>) => {
      const categoryId = action.payload;
      const index = state.selectedCategories.indexOf(categoryId);
      if (index >= 0) {
        state.selectedCategories.splice(index, 1);
      } else {
        state.selectedCategories.push(categoryId);
      }
    },
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.selectedCategories = action.payload;
    },
    selectAllCategories: (state, action: PayloadAction<string[]>) => {
      state.selectedCategories = action.payload;
    },
    clearCategories: state => {
      state.selectedCategories = [];
    },
    completeCategorySelection: state => {
      state.isCompleted = true;
    },
    resetCategorySelection: state => {
      state.selectedCategories = ['wallet', 'food'];
      state.isCompleted = false;
    },
  },
});

export const {
  toggleCategory,
  setCategories,
  selectAllCategories,
  clearCategories,
  completeCategorySelection,
  resetCategorySelection,
} = categorySlice.actions;

export default categorySlice.reducer;
