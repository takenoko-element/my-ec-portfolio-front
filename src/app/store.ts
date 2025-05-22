import { configureStore, combineReducers } from '@reduxjs/toolkit';
import productsReducer from "../features/products/productSlice";


const rootReducer = combineReducers({
    products: productsReducer,
    // cart: cartReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  // middleware や devTools の設定もここで行えますが、最初はデフォルトでOKです。
});

// アプリケーション全体で型安全性を保つために、RootStateとAppDispatchの型をエクスポートします。
// これらはストア自体から型を推論しています。
export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;