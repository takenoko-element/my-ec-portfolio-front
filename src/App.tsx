import ProductList from './features/ProductList';
import styles from "./App.module.css";

import './App.css'

function App() {

  return (
    <>
      <div className={styles.someContainerClass}>
        <h1 className={styles.title}>ミニ商品カタログ</h1>
        <ProductList />
      </div>

    </>
  )
}

export default App
