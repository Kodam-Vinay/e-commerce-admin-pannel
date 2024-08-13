import { createSlice } from "@reduxjs/toolkit";

const cloudinarySlice = createSlice({
  name: "image",
  initialState: {
    imageDetails: {},
  },
  reducers: {
    storeImageId: (state, action) => {
      state.imageDetails = action.payload;
    },
  },
});

export const { storeImageId } = cloudinarySlice.actions;
export default cloudinarySlice.reducer;
