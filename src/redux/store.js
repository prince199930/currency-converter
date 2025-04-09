import { configureStore, combineReducers } from "@reduxjs/toolkit";
import getAllCurrencySlice from './slice/currency/getAllCurrencySlice';
import getLatestSevenCurrencySlice from "./slice/currency/getLatestSevenCurrencySlice";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { persistReducer, persistStore } from "redux-persist";

// Combine your slices
const rootReducer = combineReducers({
  getAllCurrencyRates: getAllCurrencySlice,
  getLatestSevenCurrencyRate: getLatestSevenCurrencySlice,
});

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['getAllCurrencyRates', 'getLatestSevenCurrencyRate'], // only persist these slices
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist
    }),
});

// Export persistor for usage in app entry
export const persistor = persistStore(store);
