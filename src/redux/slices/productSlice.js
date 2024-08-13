import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    imagesList: [],
    cloudinaryImagesList: [],
    dbImages: [],
    isSaveClicked: false,
    info: {},
  },

  reducers: {
    storeImageToList: (state, action) => {
      state.imagesList = [...state.imagesList, action.payload];
    },
    resetImagesList: (state) => {
      state.imagesList = [];
    },
    storeImageToCloudinaryList: (state, action) => {
      state.cloudinaryImagesList = [
        ...state.cloudinaryImagesList,
        ...action.payload,
      ];
    },
    resetCloudinaryImagesList: (state) => {
      state.cloudinaryImagesList = [];
    },
    removeImageFromList: (state, action) => {
      state.imagesList = state.imagesList?.filter(
        (image) => image.id !== action.payload
      );
    },
    toggleSaveImagesClicked: (state, action) => {
      state.isSaveClicked = action.payload;
    },
    storeProductInfo: (state, action) => {
      state.info = action.payload;
    },
    storeProductImagesDb: (state, action) => {
      state.dbImages = action.payload;
    },
    resetImagesDb: (state) => {
      state.dbImages = [];
    },
  },
});

export const {
  storeImageToList,
  removeImageFromList,
  resetCloudinaryImagesList,
  toggleSaveImagesClicked,
  storeImageToCloudinaryList,
  resetImagesList,
  storeProductInfo,
  storeProductImagesDb,
  resetImagesDb,
} = productSlice.actions;
export default productSlice.reducer;
