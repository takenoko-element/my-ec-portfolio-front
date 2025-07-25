import { useMemo } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useCart } from './useCart';

interface UseCartTotalPriceReturn {
  totalPrice: string | null;
  isPriceLoading: boolean;
  isPriceError: boolean;
}

export const UseCartTotalPrice = (): UseCartTotalPriceReturn => {
  const { user } = useAuth();
  const { data: cartItems, isLoading, isError } = useCart(user);

  const totalPrice = useMemo(() => {
    if (!cartItems || isLoading || isError) {
      return null;
    }
    const sum = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
    return sum.toFixed(2);
  }, [cartItems, isLoading, isError]);

  return {
    totalPrice,
    isPriceLoading: isLoading,
    isPriceError: isError,
  };
};
