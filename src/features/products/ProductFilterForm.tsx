import React from "react";
import { XCircleIcon } from '@heroicons/react/24/solid';

interface ProductFilterProps {
    // 状態の値
    searchTerm: string;
    selectedCategory: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    isSearchVisible: boolean;
    isLoading: boolean;
    // 状態を更新するためのイベントハンドラ
    onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClearSearch: () => void;
    onCategoryChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    onSortByChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    onSortOrderChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const ProductFilterForm: React.FC<ProductFilterProps> = ({
    searchTerm,
    selectedCategory,
    sortBy,
    sortOrder,
    isSearchVisible,
    isLoading,
    onSearchSubmit,
    onSearchChange,
    onClearSearch,
    onCategoryChange,
    onSortByChange,
    onSortOrderChange,
}) => {
    return (
        <form
            onSubmit={onSearchSubmit} 
            className={`sticky top-16 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-md mb-8 z-40
                transition-transform duration-300 ease-in-out
                ${isSearchVisible? 'translate-y-0' : '-translate-y-full'}
                ${isLoading? 'opacity-75 pointer-events-none' : ''}
            `}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
                <div>
                    <label htmlFor="search-term" className="block text-sm font-medium text-gray-700 mb-1">検索</label>
                    <div className="relative mt-1">
                        <input
                            id="search-term"
                            type = 'text'
                            placeholder="商品名を検索..."
                            value={searchTerm}
                            onChange={onSearchChange}
                            disabled={isLoading}
                            className="mt-1 block w-full rounded-md border border-gray-400 shadow-sm focus:outline-none focus:border-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 pr-10"
                        />
                        { searchTerm && (
                            <button
                                type="button"
                                onClick={onClearSearch}
                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                                aria-label="検索語をクリア"
                            >
                                <XCircleIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            </button>
                        )}
                    </div>
                </div>
                <div>
                    <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
                    <select id="category-select" value={selectedCategory} onChange={onCategoryChange} disabled={isLoading} className="mt-1 block w-full rounded-md border border-gray-400 shadow-sm focus:border-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2">
                        <option value="">すべてのカテゴリ</option>
                        <option value="electronics">Electronics</option>
                        <option value="jewelery">Jewelery</option>
                        <option value="men's clothing">Men's Clothing</option>
                        <option value="women's clothing">Women's Clothing</option>
                        <option value="game">Game</option>
                        <option value="book">Book</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">並び替え</label>
                    <select id="sort-by" value={sortBy} onChange={onSortByChange} disabled={isLoading} className="mt-1 block w-full rounded-md border border-gray-400 shadow-sm focus:border-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2">
                        <option value="">並び替えなし</option>
                        <option value="price">価格</option>
                        <option value="rating">評価</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="sort-order" className="block text-sm font-medium text-gray-700 mb-1">順序</label>
                    <div className="flex space-x-2">
                        <select id="sort-order" value={sortOrder} onChange={onSortOrderChange} disabled={isLoading} className="mt-1 block w-full rounded-md border border-gray-400 shadow-sm focus:border-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2">
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
    )
}

export default ProductFilterForm;