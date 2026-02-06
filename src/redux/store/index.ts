import { authApi } from "@redux/api/authApi";
import { noteApi } from "@redux/api/noteApi";
import { reminderApi } from "@redux/api/reminderApi";
import authSlice from "@redux/slice/authSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};
const rootReducer = combineReducers({
  auth: authSlice,
  [authApi.reducerPath]: authApi.reducer,
  [noteApi.reducerPath]: noteApi.reducer,
  [reminderApi.reducerPath]: reminderApi.reducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(authApi.middleware, noteApi.middleware, reminderApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

export const persistor = persistStore(store);
