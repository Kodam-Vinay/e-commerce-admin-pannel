import { createSlice } from "@reduxjs/toolkit";

const pathSlice = createSlice({
  name: "path",
  initialState: {
    prevPath: "/",
    activePath: "/",
  },
  reducers: {
    storeActivePath: (state, action) => {
      const currPath = state.activePath;
      const newPath = action.payload;
      if (currPath !== newPath) {
        state.prevPath = currPath;
        state.activePath = newPath;
      }
    },
  },
});
export const { storeActivePath } = pathSlice.actions;
export default pathSlice.reducer;
