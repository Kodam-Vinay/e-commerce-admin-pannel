import { createSlice } from "@reduxjs/toolkit";

const responseSlice = createSlice({
  name: "response",
  initialState: {
    isSuccess: false,
    isError: false,
    errorMessage: "",
    successMessage: "",
  },
  reducers: {
    toggleErrorStatus: (state, action) => {
      state.isError = action.payload;
    },
    storeErrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    },
    toggleSuccessStatus: (state, action) => {
      state.isSuccess = action.payload;
    },
    storeSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
    },
  },
});
export const {
  toggleErrorStatus,
  toggleSuccessStatus,
  storeErrorMessage,
  storeSuccessMessage,
} = responseSlice.actions;
export default responseSlice.reducer;
