import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    contentType: "",
    content: null,
    isModalOpen: false,
    isConfirmed: false,
  },
  reducers: {
    toggleModalState: (state, action) => {
      state.isModalOpen = action.payload;
    },
    storeModalContentType: (state, action) => {
      state.contentType = action.payload;
    },
    storeModalContent: (state, action) => {
      state.content = action.payload;
    },
    toggleModalConfirmState: (state, action) => {
      state.isConfirmed = action.payload;
    },
  },
});
export const {
  toggleModalState,
  storeModalContentType,
  storeModalContent,
  toggleModalConfirmState,
} = modalSlice.actions;
export default modalSlice.reducer;
