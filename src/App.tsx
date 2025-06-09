import ProductList from './features/products/ProductList';
import CartPage from './features/cart/CartPage';
import ProductDetailPage from './features/products/ProductDetailPage';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

import { AuthProvider, useAuth } from './authentication/AuthContext';
import Home from './authentication/Home';
import SignUp from './authentication/SignUp';
import Login from './authentication/Login';

// ログイン状態に応じて表示を切り替えるコンポーネント
const AuthGate: React.FC = () => {
  const { currentUser } = useAuth();

  return currentUser ? (
    <Home />
  ) : (
    <div className="grid md:grid-cols-2 gap-8">
      <SignUp />
      <Login />
    </div>
  );
}

function App() {
  return (
    // <AuthProvider>
    //   <div className="bg-gray-100 min-h-screen font-sans">
    //     <div className="container mx-auto p-4 md:p-10">
    //       <AuthGate />
    //     </div>
    //   </div>
    // </AuthProvider>
    <Routes>
      <Route path="/" element={<Layout />} >
        <Route index element={<ProductList />} />
        <Route path="/product/:productId" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Route>
    </Routes>
  );
};

export default App
