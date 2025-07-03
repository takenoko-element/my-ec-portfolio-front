import { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useAddToCart } from './useCart';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../../types';
import toast from 'react-hot-toast';

interface UseAddToCartHandlerReturn {
  isAdding: boolean;
  handleAddToCart: (product: Product) => Promise<void>;
}

export const useAddToCartHandler = (): UseAddToCartHandlerReturn => {
  const [isAdding, setIsAdding] = useState(false);
  const { user } = useAuth();
  const { mutateAsync } = useAddToCart();
  const navigate = useNavigate();

  const handleAddToCart = async (product: Product) => {
    if (!product || isAdding) {
      return;
    }
    // ログインチェック
    if (!user) {
      toast.error((t) => (
        <span>
          カートへ追加するには<b>ログイン</b>が必要です。
          <button
            onClick={() => {
              navigate('/login'); // ログインページへ遷移
              toast.dismiss(t.id); // Toastを閉じる
            }}
            className="ml-2 font-bold text-blue-600 underline"
          >
            ログインページへ
          </button>
        </span>
      ));
      return;
    }

    // ログイン済み処理
    setIsAdding(true);
    const promise = mutateAsync({ productId: product.id });
    try {
      await toast.promise(promise, {
        loading: 'カートに追加中...',
        success: <b>{`${product.title}をカートに追加しました！`}</b>,
        error: (err) => <b>{err || 'カートへの追加に失敗しました。'}</b>,
      });
    } catch (error) {
      console.error(
        '[useAddToCartToast] カート追加処理で予期しないエラー:',
        error,
      );
    } finally {
      setIsAdding(false);
    }
  };
  return { isAdding, handleAddToCart };
};
