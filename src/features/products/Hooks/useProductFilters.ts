import React, { useState } from "react";
import { FIRST_PAGE } from "../../../constants/pagination";

interface useProductFiltersProps {
    setPage: (pageNumber: number) => void;
}

interface ProductFiltersReturn {
    // 状態の値
    searchTerm: string;
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

export const useProductFilters = ({setPage}: useProductFiltersProps): ProductFiltersReturn => {
    // 検索・フィルタリング用のローカルステート
    const [searchTerm, setSearchTerm] = useState('');
    const [appliedFilters, setAppliedFilters] = useState({
        search: '',
        category: '',
        sortBy: '',
        sortOrder: 'asc' as 'asc' | 'desc',
    });

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setAppliedFilters(prev => ({
            ...prev,
            search: searchTerm,
        }));
        setPage(FIRST_PAGE);
    };
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }
    const handleClearSearch = () => {
        setSearchTerm('');
    }
    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setAppliedFilters(prev => ({
            ...prev,
            category: event.target.value,
        }));
        setPage(FIRST_PAGE);
    }
    const handleSortByChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setAppliedFilters(prev => ({
            ...prev,
            sortBy: event.target.value,
        }));
        setPage(FIRST_PAGE);
    }
    const handleSortOrderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setAppliedFilters(prev => ({
            ...prev,
            sortOrder: event.target.value as 'asc' | 'desc',
        }));
        setPage(FIRST_PAGE);
    };
    
    return {
        searchTerm,
        appliedFilters,
        handleSearchSubmit,
        handleSearchChange,
        handleClearSearch,
        handleCategoryChange,
        handleSortByChange,
        handleSortOrderChange,
    }
}
