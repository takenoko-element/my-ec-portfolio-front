import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../lib/axios";
import type { Product } from "../../../types";

interface ProductFilters {
    search?: string;
    category?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

const fetchProducts = async ({queryKey}: {queryKey: (string | ProductFilters)[]}): Promise<Product[]> => {
    const [_key, filters] = queryKey;

    const params = new URLSearchParams();
    if(filters && typeof filters === 'object') {
        if(filters.search) params.append('search', filters.search);
        if(filters.category) params.append('category', filters.category);
        if(filters.sortBy) params.append('sortBy', filters.sortBy);
        if(filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    }
    
    const {data} = await apiClient.get(`/products?${params.toString()}`)
    return data;
}

export const useProducts = (filters: ProductFilters) => {
    return useQuery({
        queryKey: ['products', filters],
        queryFn: fetchProducts,
    });
};