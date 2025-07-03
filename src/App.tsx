import ProductList from './features/products/ProductList';
import CartPage from './features/cart/CartPage';
import ProductDetailPage from './features/products/ProductDetailPage';
import { Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Login from './features/auth/Login';
import SignUp from './features/auth/SignUp';
import OrderHistoryPage from './features/orders/OrderHistoryPage';
import CheckoutPage from './features/checkout/CheckoutPage';
import OrderConfirmationPage from './features/checkout/OrderConfirmationPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ProductList />} />
        <Route path="/product/:productId" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/order-history" element={<OrderHistoryPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route
            path="/order-confirmation"
            element={<OrderConfirmationPage />}
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
