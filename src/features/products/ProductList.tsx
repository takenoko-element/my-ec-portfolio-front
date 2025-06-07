import { useState, useEffect, useMemo, useRef, type FormEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import { fetchProducts, type Product} from "./productSlice";
import { addItemToCartAPI } from "../cart/cartSlice";
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

    const [isSearchVisible, setIsSearchVisible] = useState(true);
    const lastScrollY = useRef(0);

    // ---- scroll event header ----
    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        // 閾値より下にいて、かつ、下にスクロールしている場合にのみ非表示にする
        if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
            setIsSearchVisible(false);
        } else {
            // それ以外の場合 (上にスクロールしている、または閾値より上にいる場合) は表示する
            setIsSearchVisible(true);
        }

        // 現在のスクロール位置を次回の比較のために保存
        lastScrollY.current = currentScrollY;
    };

    // ---- useEffect Hooks
    // スクロールイベントリスナーの登録と解除
    useEffect(() => {
        window.addEventListener('scroll', handleScroll, {passive: true});
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    },[]);

    useEffect(() => {
        // if (productStatus === "idle") {
        //     console.log('ProductList: Dispatching fetchProducts');
        //     dispatch(fetchProducts());
        // }
        console.log('useEffect');
        dispatch(fetchProducts({
            search: appliedSearchTerm || undefined,
            category: selectedCategory || undefined,
            // sortBy: sortBy || undefined,
            // order: sortOrder,
        }));
    },[dispatch, appliedSearchTerm, selectedCategory/*, sortBy, sortOrder*/]);

    const sortedProducts = useMemo(() => {
        let productsToSort = [...products];
        if (sortBy === 'price') {
            productsToSort.sort((a, b) => sortOrder === 'asc'? a.price - b.price : b.price - a.price);
        } else if (sortBy === 'rating') {
            productsToSort.sort((a, b) => sortOrder === 'asc'? a.rating.rate - b.rating.rate : b.rating.rate - a.rating.rate);
        }
        return productsToSort;
    },[products,sortBy, sortOrder])

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
        dispatch(addItemToCartAPI({productId: product.id}));
        console.log(`${product.title}をカートに追加`)
    };

    if(productStatus === "loading"){
        return <div className="text-center py-10 text-gray-500">ローディング中...</div>
    }
    if(productStatus === "failed") {
        return <div className="text-center py-10 text-red-500 bg-red-100 p-4 rounded-md">エラー: {error}</div>
    }
    if (products.length === 0 && productStatus === "succeeded") {
        return <div className="text-center py-10 text-gray-500">該当する商品がありません。</div>;
    }

    return (
        <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center sm:text-left">商品リスト</h2>
            <form
                onSubmit={handleSearchSubmit} 
                className={`sticky top-16 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-md mb-8 z-40
                    transition-transform duration-300 ease-in-out
                    ${isSearchVisible? 'translate-y-0' : '-translate-y-full'}`}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label htmlFor="search-term" className="block text-sm font-medium text-gray-700 mb-1">検索</label>
                        <input
                            id="search-term"
                            type = 'text'
                            placeholder="商品名を検索..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="mt-1 block w-full rounded-md border border-gray-400 shadow-sm focus:outline-none focus:border-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
                        <select id="category-select" value={selectedCategory} onChange={handleCategoryChange} className="mt-1 block w-full rounded-md border border-gray-400 shadow-sm focus:border-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2">
                            <option value="">すべてのカテゴリ</option>
                            <option value="electronics">Electronics</option>
                            <option value="jewelery">Jewelery</option>
                            <option value="men's clothing">Men's Clothing</option>
                            <option value="women's clothing">Women's Clothing</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">並び替え</label>
                        <select id="sort-by" value={sortBy} onChange={handleSortByChange} className="mt-1 block w-full rounded-md border border-gray-400 shadow-sm focus:border-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2">
                            <option value="">並び替えなし</option>
                            <option value="price">価格</option>
                            <option value="rating">評価</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="sort-order" className="block text-sm font-medium text-gray-700 mb-1">順序</label>
                        <div className="flex space-x-2">
                            <select id="sort-order" value={sortOrder} onChange={handleSortOrderChange} className="mt-1 block w-full rounded-md border border-gray-400 shadow-sm focus:border-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2">
                                <option value="asc">昇順</option>
                                <option value="desc">降順</option>
                            </select>
                            <button type="submit" className="mt-1 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                検索
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            {/* {productStatus === 'failed' && <p style={{color: 'red'}}>エラー: {error}</p>} */}
            {products.length === 0 && productStatus === "succeeded" && <p>商品がありません。</p>}
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sortedProducts.map((product: Product) => (
                    <li key = {product.id} className="bg-white rounded-lg overflow-hidden flex flex-col">
                        <Link to={`/product/${product.id}`} className="block group">
                            <div className="w-full h-48 sm:h-56 overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 ease-in-out"
                                />
                            </div>
                        </Link>
                        <div className="p-4 flex flex-col flex-grow">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate group-hover:text-blue-600">
                                <Link to={`/product/${product.id}`}>{product.title}</Link>
                            </h3>
                            <p className="text-gray-600 text-sm mb-1">カテゴリ: {product.category}</p>
                            <p className="text-xl font-bold text-gray-900 mt-auto mb-3">価格: ${product.price.toFixed(2)}</p>
                            <button 
                                onClick={() => handleAddToCart(product)}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-150 ease-in-out"
                            >
                                カートに追加
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}