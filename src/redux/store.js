import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userSlice from "./slices/userSlice";
import responseSlice from "./slices/responseSlice";
import pathSlice from "./slices/pathSlice";
import modalSlice from "./slices/modalSlice";

const persistConfig = {
  key: "data",
  storage,
};
const reducers = combineReducers({
  user: userSlice,
  path: pathSlice,
});
const persistSliceReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: {
    persistSliceReducer,
    response: responseSlice,
    modal: modalSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
persistStore(store);
export default store;
