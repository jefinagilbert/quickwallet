import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CategoryState {
  activeCategory: string | null;
  selectedCategories: string[];
  isCompleted: boolean;
}

const initialState: CategoryState = {
  activeCategory: 'wallet',
  selectedCategories: ['wallet'],
  isCompleted: false,
};

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setActiveCategory: (state, action: PayloadAction<string>) => {
      state.activeCategory = action.payload;
      state.selectedCategories = [action.payload];
      state.isCompleted = true;
    },
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
      state.activeCategory = 'wallet';
      state.selectedCategories = ['wallet'];
      state.isCompleted = false;
    },
  },
});

export const {
  setActiveCategory,
  toggleCategory,
  setCategories,
  selectAllCategories,
  clearCategories,
  completeCategorySelection,
  resetCategorySelection,
} = categorySlice.actions;

export default categorySlice.reducer;
