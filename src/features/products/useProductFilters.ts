import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../app/store";
import { fetchProducts } from "./productSlice";

interface ProductFiltersReturn {
    // 状態の値
    searchTerm: string;
    selectedCategory: string;
    appliedSearchTerm: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    // 状態を更新するためのイベントハンドラ
    handleSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleClearSearch: () => void;
    handleCategoryChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    handleSortByChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    handleSortOrderChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const useProductFilters = (): ProductFiltersReturn => {
    // 検索・フィルタリング用のローカルステート
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const dispatch = useDispatch<AppDispatch>();

    const triggerFetch = useCallback(() => {
        dispatch(fetchProducts({
            search: appliedSearchTerm || undefined,
            category: selectedCategory || undefined,
            // sortBy: sortBy || undefined,
            // order: sortOrder,
        }));
    },[dispatch, appliedSearchTerm, selectedCategory/*, sortBy, sortOrder*/]);

    useEffect (() => {
        triggerFetch();
    },[triggerFetch])

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // フォームのデフォルトの送信動作（ページリロード）を防ぐ
        setAppliedSearchTerm(searchTerm); // 現在の入力値を適用して検索を実行
    };
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('searchChange');
        setSearchTerm(event.target.value);
    }
    const handleClearSearch = () => {
        setSearchTerm('');
    }
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

    return {
        searchTerm,
        selectedCategory,
        appliedSearchTerm,
        sortBy,
        sortOrder,
        handleSearchSubmit,
        handleSearchChange,
        handleClearSearch,
        handleCategoryChange,
        handleSortByChange,
        handleSortOrderChange,
    }
}
