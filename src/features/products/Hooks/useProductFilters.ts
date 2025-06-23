import React, { useCallback, useState } from "react";

interface ProductFiltersReturn {
    // 状態の値
    searchTerm: string;
    selectedCategory: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    appliedFilters: {
        search: string,
        category: string,
        sortBy: string,
        sortOrder: 'asc' | 'desc',
    };
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
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [appliedFilters, setAppliedFilters] = useState({
        search: '',
        category: '',
        sortBy: '',
        sortOrder: 'asc' as 'asc' | 'desc',
    });

    const handleSearchSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setAppliedFilters({
            search: searchTerm,
            category: selectedCategory,
            sortBy,
            sortOrder,
        });
    },[searchTerm, selectedCategory, sortBy, sortOrder]);
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }
    const handleClearSearch = () => {
        setSearchTerm('');
    }
    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(event.target.value);
    }
    const handleSortByChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(event.target.value);
    }
    const handleSortOrderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOrder(event.target.value as 'asc' | 'desc');
    };

    return {
        searchTerm,
        selectedCategory,
        sortBy,
        sortOrder,
        appliedFilters,
        handleSearchSubmit,
        handleSearchChange,
        handleClearSearch,
        handleCategoryChange,
        handleSortByChange,
        handleSortOrderChange,
    }
}
