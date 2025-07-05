import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../lib/axios';
import type { Product } from '../../../types';
import { AxiosError } from 'axios';
import type { ApiErrorData } from '../../../types/apiErrorData';

interface ProductsApiResponse {
  products: Product[];
  totalPages: number;
  currentPage: number;
  totalProducts: number;
}

interface ProductFilters {
  search?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

const fetchProducts = async ({
  queryKey,
}: {
  queryKey: [string, ProductFilters];
}): Promise<ProductsApiResponse> => {
  const [_key, filters] = queryKey;

  const params = new URLSearchParams();
  if (filters && typeof filters === 'object') {
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.pageSize)
      params.append('pageSize', filters.pageSize.toString());
  }

  const { data } = await apiClient.get(`/products?${params.toString()}`);
  return data;
};

export const useProducts = (filters: ProductFilters) => {
  return useQuery<
    ProductsApiResponse,
    AxiosError<ApiErrorData>,
    ProductsApiResponse,
    [string, ProductFilters]
  >({
    queryKey: ['products', filters],
    queryFn: fetchProducts,
  });
};

const fetchProductById = async (productId: string): Promise<Product> => {
  const { data } = await apiClient.get(`/products/${productId}`);
  return data;
};

export const useProduct = (productId: string | undefined) => {
  return useQuery<Product, AxiosError<ApiErrorData>>({
    queryKey: ['product', productId],
    queryFn: () => fetchProductById(productId!),
    enabled: !!productId,
  });
};
