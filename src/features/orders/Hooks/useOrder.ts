import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import apiClient from '../../../lib/axios';
import type { Order } from '../../../types';

const fetchOrder = async (): Promise<Order[]> => {
  const response = await apiClient.get('/orders');
  return response.data;
};

export const useOrders = () => {
  return useQuery({ queryKey: ['orders'], queryFn: fetchOrder });
};

const createOrder = async (): Promise<Order> => {
  const response = await apiClient.post('/orders');
  return response.data;
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};
