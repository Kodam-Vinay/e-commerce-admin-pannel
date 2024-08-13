import { createSlice } from "@reduxjs/toolkit";

const categoryBrandSlice = createSlice({
  name: "categoryBrand",
  initialState: {
    info: {},
    categoriesList: [],
    brandsList: [],
    subCategoriesList: [],
  },
  reducers: {
    storeCategoryBrandInfo: (state, action) => {
      state.info = action.payload;
    },
    storeCategoriesList: (state, action) => {
      state.categoriesList = action.payload;
    },
    storeBrandsList: (state, action) => {
      state.brandsList = action.payload;
    },
    storeSubCategoriesList: (state, action) => {
      state.subCategoriesList = action.payload;
    },
  },
});

export const {
  storeCategoryBrandInfo,
  storeCategoriesList,
  storeBrandsList,
  storeSubCategoriesList,
} = categoryBrandSlice.actions;
export default categoryBrandSlice.reducer;
