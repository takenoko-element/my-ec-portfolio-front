import ProductList from './features/products/ProductList';
import CartPage from './features/cart/CartPage';
import ProductDetailPage from './features/products/ProductDetailPage';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useDispatch } from 'react-redux';
import type { AppDispatch } from './app/store';
import { useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from './lib/firebase';
import { setUser } from './features/auth/authSlice';
import Login from './features/auth/Login';
import SignUp from './features/auth/SignUp';
import { fetchCart, clearCartLocally } from './features/cart/cartSlice';
import PrivateRoute from './components/PrivateRoute';
import OrderHistoryPage from './features/orders/OrderHistoryPage';
import CheckoutPage from './features/checkout/CheckoutPage';
import OrderConfirmationPage from './features/checkout/OrderConfirmationPage';

const queryClient = new QueryClient();

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // onAuthStateChanged は認証状態の変更を監視するリスナー
    // 返り値としてリスナーを解除する関数 (unsubscribe) を返す
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if(user) {
        // ユーザーがログインしている場合
        dispatch(setUser({
          uid: user.uid,
          email: user.email,
        }));
        dispatch(fetchCart());
      } else {
        // ユーザーがログアウトしている場合
        dispatch(setUser(null));
        dispatch(clearCartLocally());
      }
    });
    // コンポーネントがアンマウントされる時にリスナーを解除
    return () => unsubscribe();
  },[dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index element={<ProductList />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route path="/order-history" element={<OrderHistoryPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          </Route>
        </Route>
      </Routes>
    </QueryClientProvider>
  );
};

export default App
