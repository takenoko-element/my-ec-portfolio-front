import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import { fetchProducts, type Product} from "./productSlice";
import { addItemToCart } from "../cart/cartSlice";
import { Link } from "react-router-dom";

export default function ProductList() {
    const dispatch = useDispatch<AppDispatch>();

    const products = useSelector((state: RootState) => state.products.items);
    const productStatus = useSelector((state: RootState) => state.products.status);
    const error = useSelector((state: RootState) => state.products.error);

    useEffect(() => {
        if (productStatus === "idle") {
            console.log('ProductList: Dispatching fetchProducts');
            dispatch(fetchProducts());
        }
    },[productStatus, dispatch]);

    const handleAddToCart = (product: Product) => {
        dispatch(addItemToCart(product));
        console.log(`${product.title}をカートに追加`)
    };

    if(productStatus === "loading"){
        return <div>ローディング中...</div>
    }
    if(productStatus === "failed") {
        return <div>エラー: {error}</div>
    }

    return (
        <div>
            <h2>商品リスト</h2>
            {products.length === 0 && productStatus === "succeeded" && <p>商品がありません。</p>}
            <ul>
                {products.map((product: Product) => (
                    <li key = {product.id}>
                        <h3>
                            <Link to={`/product/${product.id}`}>{product.title}</Link>
                        </h3>
                        <p>価格：${product.price}</p>
                        <Link to={`/product/${product.id}`}>
                            <img src={product.image} alt={product.title} style={{ width: '100px', height: '100px', objectFit: 'contain' }} />
                        </Link>
                        <button onClick={() => handleAddToCart(product)}>
                            カートに追加
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}