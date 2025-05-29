import ProductList from './features/products/ProductList';
import CartPage from './features/cart/CartPage';
import { Routes, Route } from 'react-router-dom';
import styles from "./App.module.css";

import './App.css'
import Header from './components/Header';
import ProductDetailPage from './features/products/productDetailPage';

function App() {

  return (
    <>
      <Header />
      <main className={styles.someContainerClass}>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </main>
    </>
  )
}

export default App
