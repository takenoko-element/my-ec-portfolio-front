import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { User } from 'firebase/auth';
import apiClient from '../../../lib/axios';
import type { CartItem } from '../../../types';
import { AxiosError } from 'axios';
import type { ApiErrorData } from '../../../types/apiErrorData';

// GET /cart- カート情報の取得
const fetchCart = async (): Promise<CartItem[]> => {
  const response = await apiClient.get<CartItem[]>('/cart');
  return response.data;
};

export const useCart = (user: User | null) => {
  return useQuery<CartItem[], AxiosError<ApiErrorData>>({
    queryKey: ['cart'],
    queryFn: fetchCart,
    enabled: !!user,
  });
};

// POST /cart - カートに商品を追加
const addToCart = async ({
  productId,
  quantity = 1,
}: {
  productId: number;
  quantity?: number;
}): Promise<CartItem> => {
  const response = await apiClient.post('/cart', { productId, quantity });
  return response.data;
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation<
    CartItem,
    AxiosError<ApiErrorData>,
    { productId: number; quantity?: number }
  >({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

// PUT /cart/:itemId - 特定のカートアイテムの数量を変更
const updateItemQuantity = async ({
  cartItemId,
  quantity,
}: {
  cartItemId: number;
  quantity: number;
}): Promise<CartItem> => {
  const response = await apiClient.put(`/cart/${cartItemId}`, { quantity });
  return response.data;
};

export const useUpdateItemQuantity = () => {
  const queryClient = useQueryClient();
  return useMutation<
    CartItem,
    AxiosError<ApiErrorData>,
    { cartItemId: number; quantity: number }
  >({
    mutationFn: updateItemQuantity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

// DELETE /cart/:itemId - 特定のカートアイテムの削除
const removeItemFromCart = async (cartItemId: number) => {
  await apiClient.delete(`/cart/${cartItemId}`);
};

export const useRemoveItemFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError<ApiErrorData>, number>({
    mutationFn: removeItemFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

// DELETE /cart - カート内のアイテムを全て削除
const clearCart = async () => {
  await apiClient.delete('/cart');
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError<ApiErrorData>, void>({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};
