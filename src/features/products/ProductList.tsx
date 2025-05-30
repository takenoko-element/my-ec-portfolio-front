import { useEffect, useState, type FormEvent } from "react";
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

    // 検索・フィルタリング用のローカルステート
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        // if (productStatus === "idle") {
        //     console.log('ProductList: Dispatching fetchProducts');
        //     dispatch(fetchProducts());
        // }
        console.log('useEffect');
        dispatch(fetchProducts({
            search: appliedSearchTerm || undefined,
            category: selectedCategory || undefined,
            sortBy: sortBy || undefined,
            order: sortOrder,
        }));
    },[dispatch, appliedSearchTerm, selectedCategory, sortBy, sortOrder]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('searchChange');
        setSearchTerm(event.target.value);
    }
    const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // フォームのデフォルトの送信動作（ページリロード）を防ぐ
        setAppliedSearchTerm(searchTerm); // 現在の入力値を適用して検索を実行
    };
    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        console.log('categoryChange');
        setSelectedCategory(event.target.value);
    }
    const handleSortByChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        console.log('sortChange');
        setSortBy(event.target.value);
    }
    const handleSortOrderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        console.log('orderChange');
        setSortOrder(event.target.value as 'asc' | 'desc');
    };

    const handleAddToCart = (product: Product) => {
        console.log('AddToCartChange');
        dispatch(addItemToCart(product));
        console.log(`${product.title}をカートに追加`)
    };

    if(productStatus === "loading"){
        return <div>ローディング中...</div>
    }
    if(productStatus === "failed") {
        return <div style={{color: 'red'}}>エラー: {error}</div>
    }

    return (
        <div>
            <h2>商品リスト</h2>
            <form  onSubmit={handleSearchSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                    type = 'text'
                    placeholder="商品名を検索..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <button type="submit">検索</button>
                <select value={selectedCategory} onChange={handleCategoryChange}>
                    <option value="">すべてのカテゴリ</option>
                    <option value="electronics">Electronics</option>
                    <option value="jewelery">Jewelery</option>
                    <option value="men's clothing">Men's Clothing</option>
                    <option value="women's clothing">Women's Clothing</option>
                </select>
                <select value={sortBy} onChange={handleSortByChange}>
                    <option value="">並び替えなし</option>
                    <option value="price">価格</option>
                    <option value="rating">評価</option>
                </select>
                <select value={sortOrder} onChange={handleSortOrderChange}>
                    <option value="asc">昇順</option>
                    <option value="desc">降順</option>
                </select>
            </ form>
            {/* {productStatus === 'failed' && <p style={{color: 'red'}}>エラー: {error}</p>} */}
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