import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: {},
  },
  reducers: {
    storeUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
  },
});
export const { storeUserInfo } = userSlice.actions;
export default userSlice.reducer;
