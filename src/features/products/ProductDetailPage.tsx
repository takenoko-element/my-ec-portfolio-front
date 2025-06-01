import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import { fetchProducts } from "./productSlice";
import { addItemToCartAPI } from "../cart/cartSlice";
import styles from './ProductDtailPage.module.css'

export default function ProductDetailPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { productId } = useParams<{ productId: string }>();

    const productListFromStore = useSelector((state: RootState) => state.products.items);
    const product = productListFromStore.find((item)=> item.id === Number(productId));
    const productStatus = useSelector((state: RootState) => state.products.status);
    const error = useSelector((state: RootState) => state.products.error);
    
    useEffect(() => {
        const condition1 = !product && (productStatus === 'idle' || productStatus === 'failed');
        const condition2 = productStatus === 'idle' && productListFromStore.length === 0;

        if(condition1 || condition2) {
            console.log('ProductDetailPage: Dispatching fetchProducts because product not found or initial load');
            dispatch(fetchProducts());
        }
    },[productStatus, dispatch, product, productId, productListFromStore]);

    const handleAddToCart = () => {
        if (product) {
            dispatch(addItemToCartAPI({productId: product.id}));
            console.log(`${product.title}をカートに追加しました。`);
        }
    };
    if ( productStatus === 'loading') {
        return <div className={styles.loading}>ローディング中...</div>
    }
    if (productStatus === 'failed' && !product) {
        return (
            <div className={styles.errorContainer}>
                <p>エラー: {error || '商品情報の読み込みに失敗しました。'}</p>
                <Link to='/'>商品一覧へ戻る</Link>
            </div>
        );
    }
    if(!product) {
        return (
            <div className={styles.notFound}>
                <p>商品が見つかりませんでした。</p>
                <Link to='/'>商品一覧へ戻る</Link>
            </div>
        );
    }

    return (
        <div className={styles.ProductDetailContainer}>
            <Link to='/' className={styles.backLink}>← 商品一覧へ戻る</Link>
            <div className={styles.productContent}>
                <div className={styles.productImage}>
                    <img src={product.image} alt={product.title} className={styles.productImage} />
                </div>
                <div className={styles.infoContainer}>
                    <h1 className={styles.title}>{product.title}</h1>
                    <p className={styles.category}>カテゴリー: {product.category}</p>
                    <p className={styles.price}>価格: {product.price.toFixed(2)}</p>
                    <div className={styles.rating}>
                        評価: {product.rating.rate} ({product.rating.count}件のレビュー)
                    </div>
                    <p className={styles.descriptionTitle}>商品説明:</p>
                    <p className={styles.description}>{product.description}</p>
                    <button onClick={handleAddToCart} className={styles.addToCartButton}>
                        カートに追加
                    </button>
                </div>
            </div>
        </div>
    );
}