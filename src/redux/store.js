import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userSlice from "./slices/userSlice";
import responseSlice from "./slices/responseSlice";
import pathSlice from "./slices/pathSlice";
import modalSlice from "./slices/modalSlice";
import imageSlice from "./slices/imageSlice";
import forgetPasswordSlice from "./slices/forgetPasswordSlice";
import categoryBrandSlice from "./slices/categoryBrandSlice";
import productSlice from "./slices/productSlice";

const persistConfig = {
  key: "data",
  storage,
};
const reducers = combineReducers({
  user: userSlice,
  path: pathSlice,
  image: imageSlice,
});
const persistSliceReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: {
    persistSliceReducer,
    response: responseSlice,
    modal: modalSlice,
    forgetPassword: forgetPasswordSlice,
    product: productSlice,
    categoryBrand: categoryBrandSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
persistStore(store);
export default store;
