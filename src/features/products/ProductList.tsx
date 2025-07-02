import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';

import ProductCardSkeleton from "../../components/ProductCardSkeleton";
import ErrorDisplay from "../../components/ErrorDisplay";
import ProductFilterForm from "./ProductFilterForm";
import AddToCartButton from "../cart/AddToCartButton";
import { useProductFilters } from "./Hooks/useProductFilters";
import { useProducts } from "./Hooks/useProducts";
import { useBreakpoint } from "../../Hooks/useBreakpoint";
import Pagination from "../../components/Pagination";
import { FIRST_PAGE } from "../../constants/pagination";


const ProductList = () => {
    const [page, setPage] = useState(FIRST_PAGE);
    const breakpoint = useBreakpoint();

    const {
        searchTerm,
        appliedFilters,
        handleSearchSubmit,
        handleSearchChange,
        handleClearSearch,
        handleCategoryChange,
        handleSortByChange,
        handleSortOrderChange,
    } = useProductFilters({setPage});

    const pageSize = useMemo(() => {
        switch (breakpoint) {
            case 'xl': return 20;
            case 'lg': return 16;
            case 'md': return 12;
            case 'sm': return 8;
            default:   return 4;
        }
    },[breakpoint]);

    const { data: apiResponse, isLoading, isError, error, refetch } = useProducts({...appliedFilters, page, pageSize});

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

    // スクロールイベントリスナーの登録と解除
    useEffect(() => {
        window.addEventListener('scroll', handleScroll, {passive: true});
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    },[]);

    // フィルター実行時・ブレイクポイント変更時にはページ番号を1に戻す
    useEffect(() => {
        setPage(FIRST_PAGE);
    },[breakpoint]);

    const handleRetry = () => {
        refetch();
    }

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, x: -50 }} // 初期状態 (透明で左に50px)
                animate={{ opacity: 1, x: 0 }}   // アニメーション後の最終状態 (不透明で元の位置)
                transition={{ duration: 0.5, ease: "easeOut" }} // アニメーションの詳細 (0.5秒かけて実行)
            >
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center sm:text-left">商品リスト</h2>
            </motion.div>
            {/* ----- 検索フォーム ----- */}
            <ProductFilterForm
                searchTerm={searchTerm}
                selectedCategory={appliedFilters.category}
                sortBy={appliedFilters.sortBy}
                sortOrder={appliedFilters.sortOrder}
                isSearchVisible={isSearchVisible}
                isLoading={isLoading}
                onSearchSubmit={handleSearchSubmit}
                onSearchChange={handleSearchChange}
                onClearSearch={handleClearSearch}
                onCategoryChange={handleCategoryChange}
                onSortByChange={handleSortByChange}
                onSortOrderChange={handleSortOrderChange}
            />

            {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8">
                    {/* 固定数のスケルトンを表示 */}
                    {Array.from({length: pageSize}).map((_, index) => (
                        <ProductCardSkeleton key={index} />
                    ))}
                </div>
            )}

            {isError && (
                <ErrorDisplay message={error instanceof Error? error.message : '不明なエラーです'} onRetry={handleRetry} />
            )}
            
            {!isLoading && !isError && apiResponse?.products.length === 0 && (
                <div className="text-center py-10 text-gray-500">該当する商品がありません。</div>
            )}

            {/* ----- 商品リストの表示 ----- */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {apiResponse?.products?.map((product, index) => (
                    <motion.li key = {product.id} className="bg-white rounded-lg overflow-hidden flex flex-col"
                        initial={{ opacity: 0, y: 20 }} // 初期状態 (透明で下に20px)
                        animate={{ opacity: 1, y: 0 }}   // 最終状態 (不透明で元の位置)
                        transition={{ duration: 0.3, delay: index * 0.05 }} // アニメーションの詳細 (0.3秒かけて実行)
                    >
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
                            <AddToCartButton product={product} />
                        </div>
                    </motion.li>
                ))}
            </ul>
            {/* ----- ページネーションの表示 ----- */}
            {apiResponse && apiResponse.totalPages > 1 && (
                <Pagination
                    currentPage={page}
                    totalPages={apiResponse.totalPages}
                    onPageChange={setPage}
                />
            )}
        </div>
    );
}

export default ProductList;