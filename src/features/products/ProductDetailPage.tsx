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
        <div className="container mx-auto p4 md:p-8 sm:p-2">
            <div className="mb-6">
                <Link to='/' className="text-blue-500 hover:text-blue-700 hover:underline">
                    &larr; 商品一覧へ戻る
                </Link>
            </div>
            <div className="bg-white shadow-x1 rounded-lg overflow-hidden md:flex">
                {/* 画像エリア */}
                <div className="md:w-1/2 p-4 flex justify-center items-center bg-gray-50">
                    <img
                        src={product.image}
                        alt={product.title}
                        className="max-w-full max-h-96 object-contain"
                    />
                </div>
                {/* 情報エリア */}
                <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">{product.title}</h1>
                        <p className="text-sm text-gray-500 mb-4">カテゴリー: {product.category}</p>
                        <div className="flex items-center mb-4">
                            {/* 星評価の表示 (例: ★★★★☆) */}
                            <span className="text-yellow-500">
                                {'★'.repeat(Math.round(product.rating.rate))}
                                {'☆'.repeat(5 - Math.round(product.rating.rate))}
                            </span>
                            <span className="ml-2 text-sm text-gray-600">({product.rating.count} 件のレビュー)</span>
                        </div>
                        <p className="text-3xl font-semibold text-green-600 mb-6">価格: {product.price.toFixed(2)}</p>
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">商品説明</h2>
                        <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-150 ease-in-out text-lg"
                    >
                        カートに追加
                    </button>
                </div>
            </div>
        </div>
    );
}