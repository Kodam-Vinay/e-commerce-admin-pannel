import { createSlice } from "@reduxjs/toolkit";
import { FORGET_FORM_CONSTANTS } from "../../utils/constants";

const forgetPasswordSlice = createSlice({
  name: "forgetPassword",
  initialState: {
    passwordState: FORGET_FORM_CONSTANTS.initial,
  },
  reducers: {
    togglePasswordState: (state, action) => {
      state.passwordState = action.payload;
    },
  },
});

export const { togglePasswordState } = forgetPasswordSlice.actions;
export default forgetPasswordSlice.reducer;
