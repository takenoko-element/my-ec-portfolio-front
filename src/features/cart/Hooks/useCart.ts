import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../lib/axios";
import type { CartItem } from "../../../types";

const fetchCart = async (): Promise<CartItem[]> => {
    const response = await apiClient.get<CartItem[]>('/cart');
    return response.data;
}

export const useCart = () => {
    return useQuery({queryKey: ['cart'], queryFn: fetchCart});
};

const addToCart = async ({productId, quantity}: {productId: number, quantity: number}): Promise<CartItem[]> => {
    const response = await apiClient.post('/cart', {productId, quantity});
    return response.data;
}

export const useAddToCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addToCart,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['cart']});
        }
    })
}