import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../app/store";
import { fetchProducts } from "./products/productSlice";
import type { Product } from "./products/productSlice";

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
                        <h3>{product.title}</h3>
                        <p>価格：${product.price}</p>
                        <img src={product.image} alt={product.title} style={{ width: '100px', height: '100px', objectFit: 'contain' }} />
                    </li>
                ))}
            </ul>
        </div>
    );
}